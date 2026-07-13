$ErrorActionPreference = "Stop"

$repoUrl = "https://github.com/spMohanty/PlantVillage-Dataset.git"
$root = Split-Path -Parent $PSScriptRoot
$dataRoot = Join-Path $PSScriptRoot "data"
$repoDir = Join-Path $dataRoot "PlantVillage-Dataset"
$sourceRoot = Join-Path $repoDir "raw\color"
$targetRoot = Join-Path $dataRoot "tomato_maize"

$classes = @(
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
  "Corn_(maize)___Common_rust_",
  "Corn_(maize)___Northern_Leaf_Blight",
  "Corn_(maize)___healthy",
  "Tomato___Bacterial_spot",
  "Tomato___Early_blight",
  "Tomato___Late_blight",
  "Tomato___Leaf_Mold",
  "Tomato___Septoria_leaf_spot",
  "Tomato___Spider_mites Two-spotted_spider_mite",
  "Tomato___Target_Spot",
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
  "Tomato___Tomato_mosaic_virus",
  "Tomato___healthy"
)

New-Item -ItemType Directory -Force -Path $dataRoot | Out-Null
New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

if (!(Test-Path $repoDir)) {
  git clone --filter=blob:none --sparse $repoUrl $repoDir
}

Push-Location $repoDir
try {
  git sparse-checkout set "raw/color"
  git pull --ff-only
}
finally {
  Pop-Location
}

foreach ($className in $classes) {
  $source = Join-Path $sourceRoot $className
  $target = Join-Path $targetRoot $className

  if (!(Test-Path $source)) {
    throw "Missing PlantVillage class folder: $source"
  }

  New-Item -ItemType Directory -Force -Path $target | Out-Null
  Copy-Item -Path (Join-Path $source "*") -Destination $target -Recurse -Force
}

Write-Host "Dataset ready at $targetRoot"
