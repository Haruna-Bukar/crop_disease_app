import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import Colors from "../utils/colors";

export default function ResultScreen({
  navigation,
  route,
}) {

  const image = route?.params?.image;

  // FAKE AI RESULT FOR NOW
  const disease = "Tomato Early Blight";

  const confidence = "97%";

  const risk = "Medium";

  const recommendation =
    "Apply copper-based fungicide and remove infected leaves.";

  return (

    <View style={styles.container}>

      {/* TITLE */}
      <Text style={styles.title}>
        Scan Result
      </Text>

      {/* LEAF IMAGE */}
      <Image
  source={
    image
      ? { uri: image }
      : require("../assets/logo.png")
  }
  style={styles.image}
/>

      {/* RESULT CARD */}
      <View style={styles.resultCard}>

        <Text style={styles.label}>
          Disease Detected
        </Text>

        <Text style={styles.disease}>
          {disease}
        </Text>

        <Text style={styles.label}>
          Confidence Level
        </Text>

        <Text style={styles.confidence}>
          {confidence}
        </Text>

        <Text style={styles.label}>
          Risk Level
        </Text>

        <Text style={styles.risk}>
          {risk}
        </Text>

      </View>

      {/* RECOMMENDATION CARD */}
      <TouchableOpacity
      style={styles.recommendationCard}
       onPress={() => navigation.navigate("Treatment")}
       >

        <Text style={styles.recommendationTitle}>
          Recommendation
        </Text>

        <Text style={styles.recommendationText}>
          {recommendation}
        </Text>

      </TouchableOpacity>

      {/* BUTTON */}
      <TouchableOpacity
  style={styles.button}
  onPress={() =>
    navigation.navigate("Main", {
      screen: "Scan",
    })
  }
>
  <Text style={styles.buttonText}>
    Scan Again
  </Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 60,
    marginBottom: 20,
  },

  image: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 25,
  },

  resultCard: {
    width: "100%",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    color: Colors.textLight,
    marginTop: 10,
  },

  disease: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.danger,
    marginTop: 5,
  },

  confidence: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.success,
    marginTop: 5,
  },

  risk: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffb703",
    marginTop: 5,
  },

  recommendationCard: {
    width: "100%",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    marginBottom: 25,
  },

  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },

  recommendationText: {
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 24,
  },

  button: {
    backgroundColor: Colors.primary,
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