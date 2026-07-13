import tensorflow as tf

from config import IMAGE_SIZE


def build_model(num_classes):

    # -----------------------------
    # Data Augmentation
    # -----------------------------
    augmentation = tf.keras.Sequential(
        [
            tf.keras.layers.RandomFlip("horizontal"),
            tf.keras.layers.RandomRotation(0.08),
            tf.keras.layers.RandomZoom(0.15),
            tf.keras.layers.RandomContrast(0.15),
        ],
        name="augmentation",
    )

    # -----------------------------
    # MobileNetV2 Base
    # -----------------------------
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=IMAGE_SIZE + (3,),
        include_top=False,
        weights="imagenet",
    )

    base_model.trainable = False

    # -----------------------------
    # Input Layer
    # -----------------------------
    inputs = tf.keras.Input(
        shape=IMAGE_SIZE + (3,),
        name="image",
    )

    x = augmentation(inputs)

    x = tf.keras.applications.mobilenet_v2.preprocess_input(
        x
    )

    x = base_model(
        x,
        training=False,
    )

    # -----------------------------
    # Classification Head
    # -----------------------------
    x = tf.keras.layers.GlobalAveragePooling2D()(x)

    x = tf.keras.layers.BatchNormalization()(x)

    x = tf.keras.layers.Dropout(0.30)(x)

    outputs = tf.keras.layers.Dense(
        num_classes,
        activation="softmax",
        kernel_regularizer=tf.keras.regularizers.l2(0.001),
    )(x)

    model = tf.keras.Model(
        inputs,
        outputs,
        name="CropDiseaseModel",
    )

    return model, base_model


def compile_model(model, learning_rate):

    model.compile(

        optimizer=tf.keras.optimizers.Adam(
            learning_rate=learning_rate
        ),

        loss="categorical_crossentropy",

        metrics=[
            "accuracy",
            tf.keras.metrics.Precision(
                name="precision"
            ),
            tf.keras.metrics.Recall(
                name="recall"
            ),
        ],
    )

    return model