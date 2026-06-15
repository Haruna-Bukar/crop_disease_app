import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import Colors from "../utils/colors";

export default function WeatherScreen({ route }) {

  const {
    temperature,
    humidity,
    windSpeed,
    location,
  } = route.params;

 // HUMIDITY SCORE
let humidityScore = 0;

if (humidity >= 85) {
  humidityScore = 40;
} else if (humidity >= 70) {
  humidityScore = 25;
} else if (humidity >= 60) {
  humidityScore = 15;
}

// TEMPERATURE SCORE
let temperatureScore = 0;

if (
  temperature >= 20 &&
  temperature <= 30
) {
  temperatureScore = 30;
} else if (
  temperature >= 15 &&
  temperature <= 35
) {
  temperatureScore = 15;
}

// WIND SCORE
let windScore = 0;

if (windSpeed >= 5) {
  windScore = 15;
} else if (windSpeed >= 2) {
  windScore = 10;
}

// TOTAL SCORE
const totalRisk =
  humidityScore +
  temperatureScore +
  windScore;

// OUTBREAK PROBABILITY
const probability =
  Math.round((totalRisk / 85) * 100);

// RISK LEVEL
let risk = "";

if (totalRisk >= 70) {
  risk = "Very High";
} else if (totalRisk >= 50) {
  risk = "High";
} else if (totalRisk >= 30) {
  risk = "Medium";
} else {
  risk = "Low";
}

// AI RECOMMENDATION
let recommendation = "";

if (risk === "Very High") {
  recommendation =
    "Weather conditions are highly favorable for disease outbreaks. Immediate field inspection and preventive treatment are recommended.";
}
else if (risk === "High") {
  recommendation =
    "High disease risk detected. Monitor crops closely and prepare preventive control measures.";
}
else if (risk === "Medium") {
  recommendation =
    "Moderate disease risk detected. Continue regular crop monitoring and maintain good field sanitation.";
}
else {
  recommendation =
    "Current weather conditions are not highly favorable for disease development.";
}
  return (

    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        Weather Analysis
      </Text>

      {/* LOCATION */}
      <View style={styles.locationCard}>
        <Text style={styles.locationText}>
          📍 {location}
        </Text>
      </View>

      {/* TEMPERATURE */}
      <View style={styles.weatherInfoCard}>
        <Text style={styles.weatherIcon}>
          🌡
        </Text>

        <Text style={styles.weatherValue}>
          {temperature}°C
        </Text>

        <Text style={styles.weatherLabel}>
          Temperature
        </Text>
      </View>

      {/* HUMIDITY */}
      <View style={styles.weatherInfoCard}>
        <Text style={styles.weatherIcon}>
          💧
        </Text>

        <Text style={styles.weatherValue}>
          {humidity}%
        </Text>

        <Text style={styles.weatherLabel}>
          Humidity
        </Text>
      </View>

      {/* WIND */}
      <View style={styles.weatherInfoCard}>
        <Text style={styles.weatherIcon}>
          🌬
        </Text>

        <Text style={styles.weatherValue}>
          {windSpeed} m/s
        </Text>

        <Text style={styles.weatherLabel}>
          Wind Speed
        </Text>
      </View>

      {/* RISK CARD */}
      <View style={styles.riskCard}>

  <Text style={styles.riskTitle}>
    Disease Risk Prediction
  </Text>

  <Text style={styles.riskValue}>
    {probability}%
  </Text>

  <Text style={styles.riskDescription}>
    {risk} Risk
  </Text>

  <Text style={styles.riskDescription}>
    Humidity Score: {humidityScore}
  </Text>

  <Text style={styles.riskDescription}>
    Temperature Score: {temperatureScore}
  </Text>

  <Text style={styles.riskDescription}>
    Wind Score: {windScore}
  </Text>

</View>

{/* AI ADVICE */}
      <View style={styles.adviceCard}>

        <Text style={styles.adviceTitle}>
          AI Weather Advice
        </Text>

        <Text style={styles.adviceText}>
          {recommendation}
        </Text>

      </View>

    </ScrollView>

  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: Colors.background,
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 50,
    marginBottom: 20,
  },

  locationCard: {
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
  },

  locationText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },

  weatherInfoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
  },

  weatherIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  weatherValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.primary,
  },

  weatherLabel: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 5,
  },

  riskCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    elevation: 4,
  },

  riskTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  riskValue: {
    color: "#ffd166",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },

  riskDescription: {
    color: Colors.white,
    fontSize: 16,
  },

  adviceCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    elevation: 4,
  },

  adviceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },

  adviceText: {
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 24,
  },

});