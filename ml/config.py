from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

ML_DIR = ROOT / "ml"

DATA_DIR = ML_DIR / "data" / "tomato_maize"

SPLIT_DIR = ML_DIR / "data" / "splits"

MODEL_DIR = ML_DIR / "models"

CHECKPOINT_DIR = MODEL_DIR / "checkpoints"

LOG_DIR = ML_DIR / "logs"

ASSET_MODEL_DIR = ROOT / "assets" / "models"

IMAGE_SIZE = (224, 224)

BATCH_SIZE = 32

SEED = 42

HEAD_EPOCHS = 10

FINE_TUNE_EPOCHS = 20

FINE_TUNE_AT = 100

LEARNING_RATE = 1e-3

FINE_TUNE_LR = 1e-5