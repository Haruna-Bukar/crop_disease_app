import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import Colors from "../utils/colors";

export default function TreatmentScreen({ route }) {

  const { info, diseaseName } = route?.params || {};

  // Defensive fallback — only reachable if something links here without
  // passing treatment info (e.g. a class not yet in disease_database.json).
  if (!info) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          AI Treatment Advice
        </Text>
        <View style={styles.card}>
          <Text style={styles.text}>
            No treatment information is on file yet for{" "}
            {diseaseName || "this class"}. Add an entry to
            disease_database.json to cover it.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (

    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>
        AI Treatment Advice
      </Text>

      {/* Disease */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Detected Disease
        </Text>

        <Text style={styles.disease}>
          {diseaseName || info.disease}
        </Text>

        <Text style={styles.metaText}>
          Crop: {info.crop}   •   Severity: {info.severity}
        </Text>

      </View>

      {/* Cause + Symptoms */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Cause
        </Text>

        <Text style={styles.text}>
          {info.cause}
        </Text>

        <Text style={[styles.heading, { marginTop: 15 }]}>
          Symptoms
        </Text>

        <Text style={styles.text}>
          {info.symptoms}
        </Text>

      </View>

      {/* Treatment */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Recommended Treatment
        </Text>

        <Text style={styles.text}>
          {info.treatment}
        </Text>

      </View>

      {/* Chemicals + Dosage */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Recommended Chemical
        </Text>

        <Text style={styles.text}>
          {info.recommendedChemical}
        </Text>

        <Text style={[styles.heading, { marginTop: 15 }]}>
          Alternative Chemical
        </Text>

        <Text style={styles.text}>
          {info.alternativeChemical}
        </Text>

        <Text style={[styles.heading, { marginTop: 15 }]}>
          Dosage
        </Text>

        <Text style={styles.text}>
          {info.dosage}
        </Text>

      </View>

      {/* Prevention */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Prevention Tips
        </Text>

        <Text style={styles.text}>
          {info.prevention}
        </Text>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 20,
    backgroundColor: Colors.background,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 60,
    marginBottom: 25,
    textAlign: "center",
  },

  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },

  disease: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.danger,
  },

  metaText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
  },

  text: {
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 25,
  },

});