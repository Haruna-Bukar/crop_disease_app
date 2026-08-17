import React, { useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import Colors from "../utils/colors";
import { saveScan } from "../services/ScanStorage";

// Maps the backend's severity field to a color, same spirit as the
// original hardcoded "#ffb703" amber you had for risk level.
function riskColor(severity) {
  switch ((severity || "").toLowerCase()) {
    case "none":
      return Colors.success;
    case "medium":
      return "#ffb703";
    case "high":
      return "#fb8500";
    case "very high":
      return Colors.danger;
    default:
      return Colors.textLight;
  }
}

export default function ResultScreen({
  navigation,
  route,
}) {

  const { image, result } = route?.params || {};

  // REAL prediction from the Flask API (falls back gracefully if
  // something navigated here without a result, so the screen never
  // crashes on missing data).
  const info = result?.treatment_info;

  const disease = info?.disease || result?.predicted_class || "Unknown";

  const confidence = result?.confidence_percent || "N/A";

  const risk = info?.severity || "Unknown";

  const recommendation =
    info?.treatment ||
    "No treatment information on file yet for this class.";

  // Remember this scan locally — feeds the weather risk bridge, the
  // History screen, and Home's stats row, all from one saved record.
  useEffect(() => {
    if (result?.predicted_class) {
      saveScan({
        predictedClass: result.predicted_class,
        confidence: result.confidence,
        treatmentInfo: info,
      });
    }
  }, [result?.predicted_class]);

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

        <Text style={[styles.risk, { color: riskColor(risk) }]}>
          {risk}
        </Text>

      </View>

      {/* RECOMMENDATION CARD */}
      <TouchableOpacity
      style={styles.recommendationCard}
       onPress={() => {
         if (info) {
           navigation.navigate("Treatment", {
             info,
             diseaseName: disease,
           });
         }
       }}
       >

        <Text style={styles.recommendationTitle}>
          Recommendation
        </Text>

        <Text style={styles.recommendationText}>
          {recommendation}
        </Text>

        {info && (
          <Text style={styles.tapHint}>
            Tap for full treatment details →
          </Text>
        )}

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

  tapHint: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 10,
    fontWeight: "600",
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