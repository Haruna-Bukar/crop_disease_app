from pathlib import Path

import tensorflow as tf

from config import (
    CHECKPOINT_DIR,
    ML_DIR,
)


def get_callbacks():

    CHECKPOINT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    log_dir = ML_DIR / "logs"
    log_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    callbacks = [

        # Save best model
        tf.keras.callbacks.ModelCheckpoint(
            filepath=CHECKPOINT_DIR / "best_model.keras",
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1,
        ),

        # Save latest checkpoint
        tf.keras.callbacks.ModelCheckpoint(
            filepath=CHECKPOINT_DIR / "last_checkpoint.keras",
            save_best_only=False,
            verbose=1,
        ),

        # Save training history
        tf.keras.callbacks.CSVLogger(
            log_dir / "training.csv",
            append=True,
        ),

        # Stop training if no improvement
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            restore_best_weights=True,
            verbose=1,
        ),

        # Reduce learning rate automatically
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.2,
            patience=2,
            min_lr=1e-7,
            verbose=1,
        ),

    ]

    return callbacks