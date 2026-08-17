"""
Plant Disease Detection API
----------------------------
Loads mobilenetv2_plantvillage.tflite + label.json and serves predictions
over HTTP so a React Native app can call it as an API.

Run:
    pip install -r requirements.txt
    python app.py

Endpoints:
    GET  /health            -> quick check that the server + model are up
    POST /predict           -> multipart/form-data upload, field name "image"
    POST /predict/base64    -> JSON body: {"image": "<base64 string>"}

Both /predict routes return only the single highest-confidence prediction:
    {
      "predicted_class": "Tomato___Late_blight",
      "confidence": 0.9732,
      "confidence_percent": "97%",
      "treatment_info": {
          "crop": "Tomato", "disease": "Late Blight", "cause": "...",
          "symptoms": "...", "recommendedChemical": "...", "alternativeChemical": "...",
          "dosage": "...", "treatment": "...", "prevention": "...", "severity": "Very High"
      }  // null if this class isn't in disease_database.json
    }

disease_database.json only needs to be keyed loosely by crop + disease name
(e.g. "Tomato Late blight") - punctuation, underscores, parentheses, and
spacing differences from the model's label names are handled automatically.
"""

import base64
import io
import os
import re

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image

# ai-edge-litert is the actively maintained successor to tflite-runtime.
# Falls back to full tensorflow if that's what's installed instead.
try:
    from ai_edge_litert.interpreter import Interpreter
except ImportError:
    try:
        from tflite_runtime.interpreter import Interpreter
    except ImportError:
        from tensorflow.lite import Interpreter

import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "mobilenetv2_plantvillage.tflite")
LABELS_PATH = os.path.join(BASE_DIR, "label.json")
DISEASE_DB_PATH = os.path.join(BASE_DIR, "disease_database.json")
INPUT_SIZE = 224  # model expects 224x224x3

app = Flask(__name__)
CORS(app)  # allow the React Native app to call this from any origin


def canonicalize(name: str) -> str:
    """Normalize a class/disease name so it can be matched regardless of
    underscores, hyphens, parenthetical notes, spacing, or casing.
    e.g. "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot" and
    "Corn Cercospora leaf spot Gray leaf spot" both canonicalize to the same
    string."""
    name = re.sub(r"\(.*?\)", "", name)       # drop parenthetical notes, e.g. "(maize)"
    name = re.sub(r"[_\-]+", " ", name)        # underscores/hyphens -> spaces
    name = re.sub(r"\s+", "", name).lower()    # strip all whitespace, lowercase
    return name


# ---------------------------------------------------------------------------
# Load model + labels + treatment database once at startup
# ---------------------------------------------------------------------------
with open(LABELS_PATH) as f:
    LABELS = json.load(f)  # {"0": "Apple___Apple_scab", ...}

if os.path.exists(DISEASE_DB_PATH):
    with open(DISEASE_DB_PATH) as f:
        _raw_disease_db = json.load(f)
else:
    _raw_disease_db = {}

# lookup keyed by canonicalized name -> treatment info dict
TREATMENT_DB = {canonicalize(k): v for k, v in _raw_disease_db.items()}

interpreter = Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
INPUT_DETAILS = interpreter.get_input_details()
OUTPUT_DETAILS = interpreter.get_output_details()

print(f"Loaded model: {MODEL_PATH}")
print(f"Input shape: {INPUT_DETAILS[0]['shape']}, dtype: {INPUT_DETAILS[0]['dtype']}")
print(f"Classes: {len(LABELS)}")

_matched = sum(1 for name in LABELS.values() if canonicalize(name) in TREATMENT_DB)
print(f"Treatment info loaded: {len(TREATMENT_DB)} entries, matching {_matched}/{len(LABELS)} model classes")


def get_treatment_info(class_name: str):
    """Return the treatment_info dict for a model class name, or None if
    disease_database.json has no matching entry (e.g. class not covered yet)."""
    return TREATMENT_DB.get(canonicalize(class_name))


def preprocess_image(image: Image.Image) -> np.ndarray:
    """Resize/normalize a PIL image into the (1,224,224,3) float32 tensor the model expects."""
    image = image.convert("RGB").resize((INPUT_SIZE, INPUT_SIZE))
    arr = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


def run_inference(image: Image.Image) -> dict:
    """Run the model and return only the single highest-confidence
    prediction, plus its matching treatment info (None if that class isn't
    in disease_database.json yet)."""
    input_tensor = preprocess_image(image)
    interpreter.set_tensor(INPUT_DETAILS[0]["index"], input_tensor)
    interpreter.invoke()
    output = interpreter.get_tensor(OUTPUT_DETAILS[0]["index"])[0]  # shape (38,)

    best_index = int(np.argmax(output))
    predicted_class = LABELS[str(best_index)]
    confidence = float(output[best_index])

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "confidence_percent": f"{round(confidence * 100)}%",
        "treatment_info": get_treatment_info(predicted_class),
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "num_classes": len(LABELS),
        "treatment_entries": len(TREATMENT_DB),
        "classes_with_treatment_info": _matched,
    })


@app.route("/predict", methods=["POST"])
def predict():
    """Accepts multipart/form-data with an 'image' file field."""
    if "image" not in request.files:
        return jsonify({"error": "No 'image' file field found in request"}), 400

    file = request.files["image"]
    try:
        image = Image.open(file.stream)
    except Exception as e:
        return jsonify({"error": f"Could not read image: {e}"}), 400

    try:
        result = run_inference(image)
    except Exception as e:
        return jsonify({"error": f"Inference failed: {e}"}), 500

    return jsonify(result)


@app.route("/predict/base64", methods=["POST"])
def predict_base64():
    """Accepts JSON body: {"image": "<base64-encoded image, with or without data URI prefix>"}"""
    data = request.get_json(silent=True)
    if not data or "image" not in data:
        return jsonify({"error": "JSON body must contain an 'image' field with base64 data"}), 400

    b64_str = data["image"]
    if "," in b64_str and b64_str.strip().startswith("data:"):
        # strip a data URI prefix like "data:image/jpeg;base64,"
        b64_str = b64_str.split(",", 1)[1]

    try:
        image_bytes = base64.b64decode(b64_str)
        image = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        return jsonify({"error": f"Could not decode/read image: {e}"}), 400

    try:
        result = run_inference(image)
    except Exception as e:
        return jsonify({"error": f"Inference failed: {e}"}), 500

    return jsonify(result)


if __name__ == "__main__":
    # host="0.0.0.0" so a physical device / emulator on the same network can reach it
    app.run(host="0.0.0.0", port=5000, debug=False)