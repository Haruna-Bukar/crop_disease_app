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

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

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

  // ANALYZE LEAF
  const analyzeLeaf = () => {

    setLoading(true);

    setTimeout(() => {

      setLoading(false);

     navigation.navigate("Result", {
  image: image,
});

    }, 3000);
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