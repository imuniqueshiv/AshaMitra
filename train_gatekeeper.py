import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import os

# 1. Define Paths (Using the exact paths from your terminal)
base_dir = r"C:\WebDevelopment\AshaMitra\gatekeeper\gatekeeper_dataset"
train_dir = os.path.join(base_dir, "train")
val_dir = os.path.join(base_dir, "val")

BATCH_SIZE = 32
IMG_SIZE = (224, 224)

print("Loading datasets...")
# 2. Load Datasets using modern tf.keras.utils
train_dataset = tf.keras.utils.image_dataset_from_directory(
    train_dir,
    shuffle=True,
    batch_size=BATCH_SIZE,
    image_size=IMG_SIZE,
    label_mode='binary' # 0 = chest_xray, 1 = invalid_image
)

val_dataset = tf.keras.utils.image_dataset_from_directory(
    val_dir,
    shuffle=True,
    batch_size=BATCH_SIZE,
    image_size=IMG_SIZE,
    label_mode='binary'
)

# Optimize performance for fast loading
AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
val_dataset = val_dataset.prefetch(buffer_size=AUTOTUNE)

# 3. Build the Gatekeeper Model (MobileNetV2)
# Add minor augmentations so it generalizes well
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip('horizontal'),
    tf.keras.layers.RandomRotation(0.1),
])

# MobileNetV2 requires specific input preprocessing
preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input

# Load pre-trained base model
base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False # Freeze base layers initially

# Construct the full pipeline
inputs = tf.keras.Input(shape=(224, 224, 3))
x = data_augmentation(inputs)
x = preprocess_input(x)
x = base_model(x, training=False)
x = GlobalAveragePooling2D()(x)
x = Dropout(0.2)(x) # Prevent overfitting
outputs = Dense(1, activation='sigmoid')(x)

model = Model(inputs, outputs)

# 4. Compile the Model
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
              loss='binary_crossentropy',
              metrics=['accuracy'])

# 5. Set up Callbacks (Save the best model automatically)
checkpoint_path = r"C:\WebDevelopment\AshaMitra\gatekeeper_model.keras"
checkpoint = ModelCheckpoint(checkpoint_path, save_best_only=True, monitor='val_accuracy', mode='max', verbose=1)
early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True, verbose=1)

# 6. Train the Model
print("Starting Training...")
history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=10, # 10 epochs is usually plenty for transfer learning
    callbacks=[checkpoint, early_stop]
)

print(f"Training Complete! Your model is saved at: {checkpoint_path}")