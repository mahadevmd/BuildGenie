from flask import Flask, request, jsonify
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

    # Convert single JSON object into a one-row DataFrame
    df = pd.DataFrame([payload])

    try:
        # Try history first if requested
        if use_history:
            hist = get_historical_prediction(payload)
            if hist:
                logger.info("Using historical prediction from ai_predictions")
                return jsonify(hist), 200

        # If no history or not requested, require model
        if pipeline is None:
            logger.error("Model not loaded and no historical prediction available")
            return jsonify({"error": "Model not loaded and no historical prediction"}), 500

        preds = pipeline.predict(df)
        fps = float(preds[0])
        save_prediction(payload, fps)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {e}"}), 500

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