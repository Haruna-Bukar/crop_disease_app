import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Colors from "../utils/colors";

// Use your deployed Render server URL
const API_URL = "https://crop-disease-app-sbb7.onrender.com/predict";

export default function CameraScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // OPEN GALLERY
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // OPEN CAMERA
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ANALYZE LEAF — sends the photo to the Flask API
  const analyzeLeaf = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "leaf.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        Alert.alert(
          "Prediction Failed",
          data.error || "The server rejected the request."
        );
        return;
      }

      navigation.navigate("Result", {
        image: image,
        result: data,
      });
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Connection Error",
        "Could not reach the server. Make sure your device is connected to the internet.\n\n" +
          error.message
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>Scan Crop Leaf</Text>

      {/* IMAGE PREVIEW */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>No Image Selected</Text>
        )}
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>
        {/* CAMERA BUTTON */}
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        {/* GALLERY BUTTON */}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>
            {image ? "Choose Another Image" : "Upload Leaf Image"}
          </Text>
        </TouchableOpacity>

        {/* REMOVE BUTTON */}
        {image && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => setImage(null)}
          >
            <Text style={styles.buttonText}>Remove Image</Text>
          </TouchableOpacity>
        )}

        {/* ANALYZE BUTTON */}
        {image && (
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeLeaf}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Analyze Leaf</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 60,
    marginBottom: 30,
  },
  imageContainer: {
    width: "100%",
    height: 350,
    backgroundColor: Colors.white,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  removeButton: {
    backgroundColor: Colors.danger,
    width: "100%",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  analyzeButton: {
    backgroundColor: Colors.secondary,
    width: "100%",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});