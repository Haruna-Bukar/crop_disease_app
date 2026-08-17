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

// 👇 Flip this to true when testing on the Android Studio emulator on your
// PC, and back to false when testing on your physical phone via Expo Go.
const USE_ANDROID_EMULATOR = false;

const PORT = 5000;

// Your PC's LAN IP, for the physical phone via Expo Go — update this
// whenever you switch networks (home Wi-Fi, MiFi, etc.)
const LAN_IP = "192.168.0.4";

const API_URL = USE_ANDROID_EMULATOR
  ? `http://10.0.2.2:${PORT}/predict`     // Android Studio emulator -> your PC's own localhost
  : `http://${LAN_IP}:${PORT}/predict`;   // physical phone -> your PC's LAN IP

export default function CameraScreen({ navigation }) {

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // OPEN GALLERY
  const pickImage = async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {

      Alert.alert(
        "Permission Required",
        "Please allow gallery access."
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({

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

    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {

      Alert.alert(
        "Permission Required",
        "Please allow camera access."
      );

      return;
    }

    const result =
      await ImagePicker.launchCameraAsync({

        allowsEditing: true,

        aspect: [4, 4],

        quality: 1,
      });

    if (!result.canceled) {

      setImage(result.assets[0].uri);

    }
  };

  // ANALYZE LEAF — sends the photo to the Flask API and waits for the
  // real prediction + treatment info (this replaces the old fake timer).
  const analyzeLeaf = async () => {

    setLoading(true);

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "leaf.jpg",
      type: "image/jpeg",
    });

    try {
      // No manual Content-Type header — fetch needs to generate its own
      // multipart boundary, and overriding it breaks the upload.
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
        "Could not reach the server. Make sure app.py is running, your " +
        "phone and PC share the same Wi-Fi, and API_URL is correct.\n\n" +
        error.message
      );
    }
  };

  return (

    <ScrollView
      contentContainerStyle={styles.container}
    >

      {/* TITLE */}
      <Text style={styles.title}>
        Scan Crop Leaf
      </Text>

      {/* IMAGE PREVIEW */}
      <View style={styles.imageContainer}>

        {image ? (

          <Image
            source={{ uri: image }}
            style={styles.image}
          />

        ) : (

          <Text style={styles.placeholderText}>
            No Image Selected
          </Text>

        )}

      </View>

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>

        {/* CAMERA BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={takePhoto}
        >
          <Text style={styles.buttonText}>
            Take Photo
          </Text>
        </TouchableOpacity>

        {/* GALLERY BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={pickImage}
        >
          <Text style={styles.buttonText}>

            {image
              ? "Choose Another Image"
              : "Upload Leaf Image"}

          </Text>
        </TouchableOpacity>

        {/* REMOVE BUTTON */}
        {image && (

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => setImage(null)}
          >
            <Text style={styles.buttonText}>
              Remove Image
            </Text>
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

              <ActivityIndicator
                size="small"
                color="#ffffff"
              />

            ) : (

              <Text style={styles.buttonText}>
                Analyze Leaf
              </Text>

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