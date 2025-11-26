import os
import pandas as pd
from sqlalchemy import create_engine, text
from decimal import Decimal


DB_URL = os.environ.get("DATABASE_URL", "postgresql://buildgenie_user:password123@localhost/buildgenie_db")

def get_db_engine():
    return create_engine(DB_URL)

def ensure_ai_predictions_table(connection):
    """Create ai_predictions table if it does not exist."""
    connection.execute(text(
        """
        CREATE TABLE IF NOT EXISTS ai_predictions (
            id SERIAL PRIMARY KEY,
            cpu_model TEXT,
            gpu_model TEXT,
            ram_size_gb INTEGER,
            ram_speed_mhz INTEGER,
            storage_type TEXT,
            predicted_fps NUMERIC,
            benchmark_score NUMERIC,
            performance_rating TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        """
    ))
    # Optional composite index to speed up history lookups
    connection.execute(text(
        """
        CREATE INDEX IF NOT EXISTS idx_ai_predictions_components
        ON ai_predictions (cpu_model, gpu_model, ram_size_gb, ram_speed_mhz, storage_type);
        """
    ))

def get_historical_prediction(data):
    """Fetch the most recent matching prediction from ai_predictions by component inputs."""
    engine = get_db_engine()
    with engine.begin() as connection:
        ensure_ai_predictions_table(connection)
        query = text(
            """
            SELECT predicted_fps, benchmark_score, performance_rating
            FROM ai_predictions
            WHERE cpu_model = :cpu_model
              AND gpu_model = :gpu_model
              AND ram_size_gb = :ram_size_gb
              AND ram_speed_mhz = :ram_speed_mhz
              AND storage_type = :storage_type
            ORDER BY created_at DESC
            LIMIT 1
            """
        )
        params = {
            "cpu_model": data.get("cpu_model"),
            "gpu_model": data.get("gpu_model"),
            "ram_size_gb": int(data.get("ram_size_gb")) if data.get("ram_size_gb") is not None else None,
            "ram_speed_mhz": int(data.get("ram_speed_mhz")) if data.get("ram_speed_mhz") is not None else None,
            "storage_type": data.get("storage_type"),
        }
        result = connection.execute(query, params).fetchone()
        if result:
            return {
                "predicted_fps": float(result[0]) if result[0] is not None else None,
                "benchmark_score": float(result[1]) if result[1] is not None else None,
                "performance_rating": result[2],
            }
        return None

def fetch_training_data():
    """Fetches training data from the database by joining builds and components."""
    engine = get_db_engine()
    with engine.connect() as connection:
        query = text("""
            SELECT
                cpu.model AS cpu_model,
                cpu.speed AS cpu_boost_clock_ghz,
                gpu.model AS gpu_model,
                CAST(gpu_vram.detail_value AS INTEGER) AS gpu_vram_gb,
                ram.speed AS ram_speed_mhz,
                CAST(ram_size.detail_value AS INTEGER) AS ram_size_gb,
                storage.model AS storage_type
            FROM
                pc_builds b
            JOIN pc_build_components cpu_build ON b.id = cpu_build.build_id AND cpu_build.component_type = 'cpu'
            JOIN components cpu ON cpu_build.component_id = cpu.id

            JOIN pc_build_components gpu_build ON b.id = gpu_build.build_id AND gpu_build.component_type = 'gpu'
            JOIN components gpu ON gpu_build.component_id = gpu.id
            LEFT JOIN component_details gpu_vram ON gpu.id = gpu_vram.component_id AND gpu_vram.detail_key = 'vram'

            JOIN pc_build_components ram_build ON b.id = ram_build.build_id AND ram_build.component_type = 'ram'
            JOIN components ram ON ram_build.component_id = ram.id
            LEFT JOIN component_details ram_size ON ram.id = ram_size.component_id AND ram_size.detail_key = 'size'

            JOIN pc_build_components storage_build ON b.id = storage_build.build_id AND storage_build.component_type = 'storage'
            JOIN components storage ON storage_build.component_id = storage.id
        """)
        return pd.read_sql(query, connection)

def save_prediction(data, prediction):
    """
    Saves a new build configuration and its predicted FPS to the database.
    
    Note: This is a simplified implementation. It tries to find component IDs
    based on model names from the prediction input. This is not robust and
    might fail if the model names are not exact matches or if multiple
    components share a model name. A real-world application would need a
    more sophisticated way to handle this, probably in the backend service.
    """
    engine = get_db_engine()
    with engine.begin() as connection:  # Use a transaction
        try:
            # Ensure history table exists
            ensure_ai_predictions_table(connection)
            # Helper to get component ID
            def get_component_id(comp_type, model_name):
                if not model_name:
                    return None
                query = text("SELECT id FROM components WHERE type = :type AND model = :model LIMIT 1")
                result = connection.execute(query, {"type": comp_type, "model": model_name}).fetchone()
                return result[0] if result else None

            cpu_id = get_component_id('CPU', data.get('cpu_model'))
            gpu_id = get_component_id('GPU', data.get('gpu_model'))
            
            # For RAM and Storage, the prediction input doesn't have a model name.
            # We'll have to make assumptions. This is a major simplification.
            # Find a RAM that matches size and speed.
            ram_query = text("SELECT c.id FROM components c JOIN component_details cd ON c.id = cd.component_id WHERE c.type = 'RAM' AND c.speed = :speed AND cd.detail_key = 'size' AND cd.detail_value = :size LIMIT 1")
            ram_result = connection.execute(ram_query, {"speed": str(data.get('ram_speed_mhz')), "size": str(data.get('ram_size_gb'))}).fetchone()
            ram_id = ram_result[0] if ram_result else None

            # Find a storage that matches the type (model in our db)
            storage_id = get_component_id('STORAGE', data.get('storage_type'))

            if not all([cpu_id, gpu_id, ram_id, storage_id]):
                print(f"Could not find all component IDs. CPU: {cpu_id}, GPU: {gpu_id}, RAM: {ram_id}, Storage: {storage_id}. Skipping save.")
                return

            # Compute total price (sum of component prices)
            def get_component_price(component_id):
                price_query = text("SELECT price FROM components WHERE id = :id")
                result = connection.execute(price_query, {"id": component_id}).fetchone()
                return result[0] if result and result[0] is not None else Decimal(0)

            total_price = (
                get_component_price(cpu_id)
                + get_component_price(gpu_id)
                + get_component_price(ram_id)
                + get_component_price(storage_id)
            )

            # Insert into pc_builds using valid columns; embed FPS in description
            build_insert_query = text(
                "INSERT INTO pc_builds (name, category, description, total_price, is_pre_built) VALUES (:name, :category, :description, :total_price, :is_pre_built) RETURNING id"
            )
            build_result = connection.execute(build_insert_query, {
                "name": "AI Predicted Build",
                "category": "gaming",
                "description": f"Predicted build by AI. Estimated FPS: {int(prediction)}",
                "total_price": total_price,
                "is_pre_built": False
            })
            build_id = build_result.fetchone()[0]

            # Insert into pc_build_components
            component_insert_query = text(
                "INSERT INTO pc_build_components (build_id, component_type, component_id) VALUES (:build_id, :component_type, :component_id)"
            )
            components_to_insert = [
                {"build_id": build_id, "component_type": "cpu", "component_id": cpu_id},
                {"build_id": build_id, "component_type": "gpu", "component_id": gpu_id},
                {"build_id": build_id, "component_type": "ram", "component_id": ram_id},
                {"build_id": build_id, "component_type": "storage", "component_id": storage_id},
            ]
            connection.execute(component_insert_query, components_to_insert)
            print(f"Successfully saved predicted build with ID: {build_id}")

            # Also record into ai_predictions for future reuse
            benchmark_score = round(float(prediction) * 120, 2)
            performance_rating = f"{float(prediction) / 20:.1f}"
            history_insert = text(
                """
                INSERT INTO ai_predictions (
                    cpu_model, gpu_model, ram_size_gb, ram_speed_mhz, storage_type,
                    predicted_fps, benchmark_score, performance_rating
                ) VALUES (
                    :cpu_model, :gpu_model, :ram_size_gb, :ram_speed_mhz, :storage_type,
                    :predicted_fps, :benchmark_score, :performance_rating
                )
                """
            )
            connection.execute(history_insert, {
                "cpu_model": data.get("cpu_model"),
                "gpu_model": data.get("gpu_model"),
                "ram_size_gb": int(data.get("ram_size_gb")) if data.get("ram_size_gb") is not None else None,
                "ram_speed_mhz": int(data.get("ram_speed_mhz")) if data.get("ram_speed_mhz") is not None else None,
                "storage_type": data.get("storage_type"),
                "predicted_fps": float(prediction),
                "benchmark_score": benchmark_score,
                "performance_rating": performance_rating,
            })
            print("Saved prediction to ai_predictions history table.")

        except Exception as e:
            print(f"Error saving prediction: {e}")