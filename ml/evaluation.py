import json

import numpy as np
import tensorflow as tf

from pathlib import Path

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
)

import matplotlib.pyplot as plt

from config import MODEL_DIR


def evaluate_model(
    model,
    test_dataset,
    class_names,
):

    y_true = []
    y_pred = []

    print("\nEvaluating model...\n")

    for images, labels in test_dataset:

        predictions = model.predict(
            images,
            verbose=0,
        )

        y_true.extend(
            np.argmax(labels.numpy(), axis=1)
        )

        y_pred.extend(
            np.argmax(predictions, axis=1)
        )

    report = classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        digits=4,
    )

    print(report)

    matrix = confusion_matrix(
        y_true,
        y_pred,
    )

    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # Save report
    (
        MODEL_DIR /
        "classification_report.txt"
    ).write_text(
        report,
        encoding="utf-8",
    )

    # Save matrix as JSON
    (
        MODEL_DIR /
        "confusion_matrix.json"
    ).write_text(
        json.dumps(
            matrix.tolist(),
            indent=4,
        ),
        encoding="utf-8",
    )

    # Save confusion matrix image

    plt.figure(figsize=(12,12))

    display = ConfusionMatrixDisplay(
        confusion_matrix=matrix,
        display_labels=class_names,
    )

    display.plot(
        cmap="Blues",
        xticks_rotation=90,
        colorbar=False,
    )

    plt.tight_layout()

    plt.savefig(
        MODEL_DIR /
        "confusion_matrix.png",
        dpi=300,
    )

    plt.close()

    print(
        "\nEvaluation completed.\n"
    )