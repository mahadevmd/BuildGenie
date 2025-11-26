from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

MODEL_PATH = os.environ.get("BUILDGENIE_MODEL_PATH", "buildgenie_pipeline.joblib")
PORT = int(os.environ.get("PORT", "5001"))
HOST = os.environ.get("HOST", "0.0.0.0")

app = Flask(__name__)
AI_CORS_ALLOWED_ORIGINS = os.environ.get("AI_CORS_ALLOWED_ORIGINS",
    "capacitor://localhost,ionic://localhost,http://localhost,http://127.0.0.1:3000,http://localhost:3000,http://localhost:3001,http://10.0.2.2:3000"
)
# Enable CORS for Android/Web origins with credentials support
CORS(app, origins=[o.strip() for o in AI_CORS_ALLOWED_ORIGINS.split(',') if o.strip()], supports_credentials=True)
app.debug = True

print(f"Attempting to load model from: {MODEL_PATH}")
print(f"Current working directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")

# Initialize pipeline as None globally
pipeline = None

try:
    pipeline = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")
    print(f"Pipeline loaded: {pipeline is not None}")
except Exception as e:
    pipeline = None
    print(f"Failed to load pipeline from {MODEL_PATH}: {e}")
    import traceback
    traceback.print_exc()


from database import save_prediction, get_historical_prediction

@app.route("/health", methods=["GET"])
def health():
    logger.info("HEALTH ENDPOINT CALLED")
    return jsonify({"status": "healthy", "model_loaded": pipeline is not None})

@app.route("/predict", methods=["POST"])
def predict():
    global pipeline  # Explicitly declare pipeline as global
    logger.info("PREDICT ENDPOINT CALLED")
    logger.debug(f"Received predict request")
    logger.debug(f"Pipeline in predict: {pipeline}")
    logger.debug(f"Pipeline type: {type(pipeline)}")
    logger.debug(f"Pipeline is None: {pipeline is None}")
    
    payload = request.get_json(force=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Invalid JSON payload"}), 400

    use_history = str(request.args.get("use_history", "false")).lower() in {"true", "1", "yes"}
    
    # Ensure required features exist by applying sensible defaults
    required_cat = ["cpu_model", "gpu_model", "storage_type"]
    required_num = ["cpu_boost_clock_ghz", "gpu_vram_gb", "ram_size_gb", "ram_speed_mhz"]
    defaults = {
        "cpu_boost_clock_ghz": 4.2,
        "gpu_vram_gb": 8,
        "ram_size_gb": 16,
        "ram_speed_mhz": 3200,
    }
    # Fill missing categorical values
    for col in required_cat:
        if payload.get(col) is None:
            logger.debug(f"Missing categorical feature '{col}', defaulting to 'Unknown'")
            payload[col] = "Unknown"
    # Fill missing numeric values
    for col in required_num:
        if payload.get(col) is None:
            logger.debug(f"Missing numeric feature '{col}', defaulting to {defaults.get(col)}")
            payload[col] = defaults.get(col)

    # Convert single JSON object into a one-row DataFrame
    df = pd.DataFrame([payload])

    # Try history first if requested, but do not fail if DB is unavailable
    if use_history:
        try:
            hist = get_historical_prediction(payload)
        except Exception as e:
            logger.warning(f"History lookup failed, continuing with model: {e}")
            hist = None
        if hist:
            logger.info("Using historical prediction from ai_predictions")
            return jsonify(hist), 200

    # If no history or not requested, require model
    if pipeline is None:
        logger.error("Model not loaded and no historical prediction available")
        return jsonify({"error": "Model not loaded and no historical prediction"}), 500

    try:
        preds = pipeline.predict(df)
        fps = float(preds[0])
    except Exception as e:
        logger.error(f"Model prediction failed: {e}")
        return jsonify({"error": f"Prediction failed: {e}"}), 500

    # Best-effort save to DB, but do not fail the request if save fails
    try:
        save_prediction(payload, fps)
    except Exception as e:
        logger.warning(f"Failed to save prediction to DB, returning model result anyway: {e}")

    benchmark_score = round(fps * 120, 2)
    performance_rating = f"{fps / 20:.1f}"

    return jsonify(
        {
            "predicted_fps": fps,
            "benchmark_score": benchmark_score,
            "performance_rating": performance_rating,
        }
    )


if __name__ == "__main__":
    # Bind to configured host/port for Railway and Docker
    app.run(host=HOST, port=PORT)