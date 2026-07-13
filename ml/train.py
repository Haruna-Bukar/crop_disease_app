import tensorflow as tf

from config import (
    SEED,
    HEAD_EPOCHS,
    FINE_TUNE_EPOCHS,
    FINE_TUNE_AT,
    MODEL_DIR,
    CHECKPOINT_DIR,
)

from dataset import (
    get_datasets,
)

from model import (
    build_model,
    compile_model,
)

from callbacks import get_callbacks

from evaluation import evaluate_model

from export import (
    export_tflite,
    save_labels,
)

def main():

    tf.keras.utils.set_random_seed(SEED)
    MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

    CHECKPOINT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

    train_ds, val_ds, test_ds, class_names = get_datasets()

    save_labels(class_names)
    
    
    model, base_model = build_model(
        len(class_names)
    )

    compile_model(
        model,
        learning_rate=1e-3,
    )
    callbacks = get_callbacks()
    print("\nTraining classifier head...\n")

    model.fit(

        train_ds,

        validation_data=val_ds,

        epochs=HEAD_EPOCHS,

        callbacks=callbacks,

    )
    print("\nFine-tuning...\n")

    base_model.trainable = True

    for layer in base_model.layers[:FINE_TUNE_AT]:

        layer.trainable = False

    compile_model(

        model,

        learning_rate=1e-5,

    )

    model.fit(

        train_ds,

        validation_data=val_ds,

        epochs=HEAD_EPOCHS + FINE_TUNE_EPOCHS,

        initial_epoch=HEAD_EPOCHS,

        callbacks=callbacks,

    )
    best_model_path = CHECKPOINT_DIR / "best_model.keras"

    if best_model_path.exists():
     best_model = tf.keras.models.load_model(best_model_path)
    else:
     best_model = model

    best_model.save(

        MODEL_DIR /

        "crop_disease_mobilenetv2.keras"

    )
    evaluate_model(

        best_model,

        test_ds,

        class_names,

    )
    export_tflite(

        best_model

    )
    print("\nTraining completed successfully!")
    
if __name__ == "__main__":

    main()