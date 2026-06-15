import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import Colors from "../utils/colors";

export default function TreatmentScreen() {

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
          Tomato Early Blight
        </Text>

      </View>

      {/* Treatment */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Recommended Treatment
        </Text>

        <Text style={styles.text}>
          Apply copper-based fungicide every 7 days.
          Remove infected leaves immediately to stop spread.
        </Text>

      </View>

      {/* Prevention */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Prevention Tips
        </Text>

        <Text style={styles.text}>
          Avoid overhead watering.
          Maintain proper plant spacing.
          Rotate crops regularly.
        </Text>

      </View>

      {/* AI Advice */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          AI Farming Advice
        </Text>

        <Text style={styles.text}>
          Based on environmental conditions,
          humidity appears favorable for fungal spread.
          Monitor nearby plants carefully over the next 5 days.
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

  text: {
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 25,
  },

});