import random
import shutil

import tensorflow as tf

from config import (
    DATA_DIR,
    SPLIT_DIR,
    IMAGE_SIZE,
    BATCH_SIZE,
    SEED,
)

def normalized_label(folder_name):
    return (
        folder_name.replace("Corn_(maize)___", "Corn ")
        .replace("Tomato___", "Tomato ")
        .replace("_", " ")
        .replace("  ", " ")
        .strip()
    )

def prepare_split():
    """
    Creates 70% Train
            15% Validation
            15% Test
    """

    if SPLIT_DIR.exists() and any((SPLIT_DIR / "train").glob("*")):
        print("Dataset already split.")
        return

    if not DATA_DIR.exists():
        raise FileNotFoundError(
            f"Dataset not found:\n{DATA_DIR}"
        )

    random.seed(SEED)

    for class_dir in sorted(DATA_DIR.iterdir()):

        if not class_dir.is_dir():
            continue

        images = [
            image
            for image in class_dir.iterdir()
            if image.suffix.lower()
            in [".jpg", ".jpeg", ".png"]
        ]

        random.shuffle(images)

        train_end = int(len(images) * 0.70)
        val_end = int(len(images) * 0.85)

        splits = {
            "train": images[:train_end],
            "val": images[train_end:val_end],
            "test": images[val_end:]
        }

        for split_name, split_images in splits.items():

            destination = (
                SPLIT_DIR /
                split_name /
                class_dir.name
            )

            destination.mkdir(
                parents=True,
                exist_ok=True
            )

            for image in split_images:

                shutil.copy2(
                    image,
                    destination / image.name
                )

    print("Dataset split completed.")


def load_dataset(split_name, shuffle=True):

    dataset = tf.keras.utils.image_dataset_from_directory(
        SPLIT_DIR / split_name,
        labels="inferred",
        label_mode="categorical",
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=shuffle,
        seed=SEED,
    )

    return dataset


def get_datasets():

    prepare_split()

    train_ds = load_dataset(
        "train",
        shuffle=True
    )

    class_names = [
    normalized_label(name)
    for name in train_ds.class_names
    ]

    val_ds = load_dataset(
        "val",
        shuffle=False
    )

    test_ds = load_dataset(
        "test",
        shuffle=False
    )

    AUTOTUNE = tf.data.AUTOTUNE

    train_ds = train_ds.cache().prefetch(AUTOTUNE)
    val_ds = val_ds.cache().prefetch(AUTOTUNE)
    test_ds = test_ds.cache().prefetch(AUTOTUNE)

    return (
        
        train_ds,
        val_ds,
        test_ds,
        class_names,
)
    