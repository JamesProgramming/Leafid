import math

import tensorflow as tf
import pandas as pd

# import sklearn as sk
# import matplotlib.pyplot as plt
from matplotlib.image import imread
import shutil
import random
import os
import json

# Directory containing dataset
data_directory = os.path.join(
    "C:\\", "Users", "James", "Documents", "PlantVillage-Dataset", "raw", "color"
)


# Make folders to hold dataset
split_dataset_dir = "split_dataset"
os.mkdir(split_dataset_dir)
os.mkdir(split_dataset_dir + "\\train")
os.mkdir(split_dataset_dir + "\\validation")
os.mkdir(split_dataset_dir + "\\test")


def split_train_validation_test(
    from_directory: str,
    destination_directory: str,
    test_percent: int = 1,
    validation_percent: int = 20,
) -> None:
    """
    Copy image files from folder into the destination folder split into three
    folders: train, validation, test.
    :param from_directory: Directory containing images.
    :param destination_directory: Destination directory.
    :param test_percent: Percent of total images by type to go into this folder.
    :param validation_percent: Percent of total images by type to go into this folder.
    :return: None.
    """
    dataset_dirs = ["test", "validation", "train"]
    split_percent = (test_percent, validation_percent, 100)
    images_copied = set()
    folders = os.listdir(from_directory)
    for index, split_dir in enumerate(dataset_dirs):
        print("\n")
        for folder in folders:
            folder_path = os.path.join(from_directory, folder)

            # Get list of images and filter out already copied images
            images = os.listdir(folder_path)
            images = list(set(images) - images_copied)

            # Number of images to copy
            num_of_images = math.ceil(len(images) * (split_percent[index] / 100))
            os.mkdir(os.path.join(destination_directory, split_dir, folder))
            print("Copying .. ", end="")
            for _ in range(num_of_images):
                # Copy a random image from the folder
                image = images.pop(random.randint(0, len(images) - 1))
                images_copied.add(image)
                shutil.copy(
                    os.path.join(folder_path, image),
                    os.path.join(destination_directory, split_dir, folder),
                )


# Load images into folder split into train, validation, and test folders.
split_train_validation_test(data_directory, split_dataset_dir)


base_model = tf.keras.applications.MobileNet(
    input_shape=(256, 256, 3), weights="imagenet", include_top=False
)

base_model.trainable = False


train_ds = tf.keras.utils.image_dataset_from_directory(
    os.path.join(split_dataset_dir, "train"),
    labels="inferred",
    label_mode="int",
    seed=123,
    color_mode="rgb",
    batch_size=64,
    image_size=(256, 256),
    shuffle=True,
)

validation_ds = tf.keras.utils.image_dataset_from_directory(
    os.path.join(split_dataset_dir, "validation"),
    labels="inferred",
    label_mode="int",
    seed=123,
    color_mode="rgb",
    batch_size=64,
    image_size=(256, 256),
    shuffle=False,
)

class_names = train_ds.class_names

augmentation = tf.keras.Sequential(
    [
        tf.keras.layers.RandomFlip(),
        tf.keras.layers.RandomRotation(factor=0.2),
        tf.keras.layers.RandomZoom(height_factor=(-0.2, 0.2), width_factor=(-0.2, 0.2)),
        tf.keras.layers.RandomBrightness((-0.2, 0.2)),
    ]
)

image_size_and_scale = tf.keras.Sequential(
    [tf.keras.layers.Resizing(256, 256), tf.keras.layers.Rescaling(1.0 / 255)]
)

model = tf.keras.Sequential(
    [
        augmentation,
        image_size_and_scale,
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(1028, activation="relu"),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(len(class_names), activation="softmax"),
    ]
)

model.compile(
    optimizer="adam",
    loss=tf.keras.losses.sparse_categorical_crossentropy,
    metrics=["accuracy"],
)

stop_early = tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=3)

results = model.fit(
    train_ds, validation_data=validation_ds, epochs=20, callbacks=[stop_early]
)

results = pd.DataFrame(results.history)

with open("history.json", "w") as history_file:
    results.to_json(history_file)

# Test data
test_ds = tf.keras.utils.image_dataset_from_directory(
    os.path.join(split_dataset_dir, "test"),
    labels="inferred",
    label_mode="int",
    seed=123,
    color_mode="rgb",
    batch_size=64,
    image_size=(256, 256),
    shuffle=False,
)

results = model.evaluate(test_ds)

# Test results
with open("test_results.json", "w") as test_results:
    json.dump({"results": {"loss": results[0], "accuracy": results[1]}}, test_results)

model.save("image_model", overwrite=True)
