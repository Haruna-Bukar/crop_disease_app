# Crop Disease Model Training

This folder contains the local training pipeline for a tomato and maize PlantVillage classifier.

## Dataset

The downloader uses the PlantVillage GitHub dataset and keeps only tomato and maize/corn color-image classes.

Expected classes:

- Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot
- Corn_(maize)___Common_rust_
- Corn_(maize)___Northern_Leaf_Blight
- Corn_(maize)___healthy
- Tomato___Bacterial_spot
- Tomato___Early_blight
- Tomato___Late_blight
- Tomato___Leaf_Mold
- Tomato___Septoria_leaf_spot
- Tomato___Spider_mites Two-spotted_spider_mite
- Tomato___Target_Spot
- Tomato___Tomato_Yellow_Leaf_Curl_Virus
- Tomato___Tomato_mosaic_virus
- Tomato___healthy

## Pipeline

1. Download selected PlantVillage folders:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\ml\download_plantvillage.ps1
   ```

2. Create/install a Python 3.10 environment and install:

   ```powershell
   pip install -r .\ml\requirements.txt
   ```

3. Train and export:

   ```powershell
   python .\ml\train.py
   ```

Outputs:

- `ml/models/checkpoints/best_model.keras`
- `ml/models/crop_disease_mobilenetv2.keras`
- `assets/models/crop_disease.tflite`
- `assets/models/labels.json`

Training is resumable through `ml/models/checkpoints/last_checkpoint.keras`.
