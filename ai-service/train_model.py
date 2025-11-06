import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor


from database import fetch_training_data

def train_and_save_pipeline(output_path: str = "buildgenie_pipeline.joblib"):
    df = fetch_training_data()
    print(f"Fetched data shape: {df.shape}")
    print(f"Fetched data columns: {df.columns.tolist()}")
    print(df.head())

    if df.empty:
        print("No data fetched from the database. Creating a minimal synthetic dataset for testing.")
        # Create a minimal synthetic dataset for testing
        data = {
            'cpu_model': ['Intel i5-12400F', 'AMD Ryzen 5 5600X'],
            'cpu_boost_clock_ghz': [4.4, 4.6],
            'gpu_model': ['NVIDIA RTX 3060', 'AMD RX 6600'],
            'gpu_vram_gb': [12, 8],
            'ram_speed_mhz': [3200, 3600],
            'ram_size_gb': [16, 16],
            'storage_type': ['NVMe SSD', 'SATA SSD'],
            'fps': [120, 110]
        }
        df = pd.DataFrame(data)
        print("Synthetic data created.")

    # Check if 'fps' column exists, if not, create synthetic data for testing
    if "fps" not in df.columns:
        print("Warning: 'fps' column not found in data. Generating synthetic FPS data for testing.")
        # Generate synthetic FPS based on a simple formula for testing
        # This is a placeholder and should be replaced with actual data
        df["fps"] = (
            df.get("gpu_vram_gb", 8) * 10 +
            df.get("cpu_boost_clock_ghz", 3.5) * 20 +
            df.get("ram_size_gb", 16) * 5 +
            (df.get("ram_speed_mhz", 3000) / 1000) * 10
        ).astype(int) + 30  # Add a base FPS
        print("Synthetic FPS data generated.")

    # Separate features and target
    X = df.drop(columns=["fps"])  # features
    y = df["fps"]  # target variable

    categorical_features = ["cpu_model", "gpu_model", "storage_type"]
    numeric_features = [
        "cpu_boost_clock_ghz",
        "gpu_vram_gb",
        "ram_size_gb",
        "ram_speed_mhz",
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", StandardScaler(), numeric_features),
        ]
    )

    model = XGBRegressor(
        n_estimators=150,
        max_depth=4,
        learning_rate=0.1,
        subsample=0.9,
        colsample_bytree=0.9,
        objective="reg:squarederror",
        random_state=42,
        verbosity=0,
    )

    pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])

    pipeline.fit(X, y)

    joblib.dump(pipeline, output_path)
    print(f"Pipeline saved to {output_path}")


if __name__ == "__main__":
    train_and_save_pipeline()