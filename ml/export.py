import json

import tensorflow as tf

from config import (
    ASSET_MODEL_DIR,
)

from dataset import load_dataset


def representative_dataset():

    calibration_dataset = (
        load_dataset(
            "train",
            shuffle=True,
        )
        .take(100)
    )

    for images, _ in calibration_dataset:
        yield [
            tf.cast(
                images,
                tf.float32,
            )
        ]


def export_tflite(model):

    ASSET_MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    converter = tf.lite.TFLiteConverter.from_keras_model(
        model
    )

    converter.optimizations = [
        tf.lite.Optimize.DEFAULT
    ]

    converter.representative_dataset = representative_dataset

    converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS
    ]

    converter.inference_input_type = tf.float32
    converter.inference_output_type = tf.float32

    tflite_model = converter.convert()

    output_path = (
        ASSET_MODEL_DIR /
        "crop_disease.tflite"
    )

    output_path.write_bytes(
        tflite_model
    )

    print(
        f"\nTFLite model exported to:\n{output_path}"
    )


def save_labels(labels):

    ASSET_MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    labels_path = (
        ASSET_MODEL_DIR /
        "labels.json"
    )

    labels_path.write_text(
        json.dumps(
            labels,
            indent=4,
        ),
        encoding="utf-8",
    )

    print(
        f"Labels saved to:\n{labels_path}"
    )