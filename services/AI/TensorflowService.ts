import { loadTensorflowModel } from "react-native-fast-tflite";

let model: any = null;

export async function loadModel() {
  if (model) {
    return model;
  }

  try {
    model = await loadTensorflowModel(
      require("../../assets/models/crop_disease.tflite"),
      []
    );

    console.log("✅ TensorFlow model loaded successfully");

    return model;
  } catch (error) {
    console.error("❌ Failed to load TensorFlow model:", error);
    throw error;
  }
}