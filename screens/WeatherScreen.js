import React, {
  useState,
  useEffect,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  getWeatherHistory,
} from "../services/WeatherStorage";

import Colors from "../utils/colors";

export default function WeatherScreen({ route }) {

  const {
    temperature,
    humidity,
    windSpeed,
    location,
  } = route.params;

  const [averageHumidity, setAverageHumidity] =
  useState(0);

const [averageTemperature, setAverageTemperature] =
  useState(0);

const [averageWindSpeed, setAverageWindSpeed] =
  useState(0);

const [daysRecorded, setDaysRecorded] =
  useState(0);

const [weatherHistory, setWeatherHistory] =
  useState([]);

  useEffect(() => {
  loadHistory();
}, []);

const loadHistory = async () => {

  const history =
    await getWeatherHistory();
    setWeatherHistory(history);

  setDaysRecorded(history.length);

  if (history.length === 0) {
    return;
  }

  const totalHumidity =
    history.reduce(
      (sum, item) =>
        sum + item.humidity,
      0
    );

  const totalTemperature =
    history.reduce(
      (sum, item) =>
        sum + item.temperature,
      0
    );

  const totalWind =
    history.reduce(
      (sum, item) =>
        sum + item.windSpeed,
      0
    );

  setAverageHumidity(
    totalHumidity / history.length
  );

  setAverageTemperature(
    totalTemperature / history.length
  );

  setAverageWindSpeed(
    totalWind / history.length
  );
};

 // HUMIDITY SCORE
let averageHumidityScore = 0;

if (averageHumidity>= 85) {
  averageHumidityScore = 40;
} else if (averageHumidity >= 70) {
  averageHumidityScore = 25;
} else if (averageHumidity >= 60) {
  averageHumidityScore = 15;
}

// TEMPERATURE SCORE
let averageTemperatureScore = 0;

if (
  averageTemperature >= 20 &&
  averageTemperature <= 30
) {
  averageTemperatureScore = 30;
} else if (
  averageTemperature >= 15 &&
  averageTemperature <= 35
) {
  averageTemperatureScore = 15;
}

// WIND SCORE
let averageWindScore = 0;

if (averageWindSpeed >= 5) {
  averageWindScore = 15;
} else if (averageWindSpeed >= 2) {
  averageWindScore = 10;
}

// TOTAL SCORE
const totalRisk =
  averageHumidityScore +
  averageTemperatureScore +
  averageWindScore;

// OUTBREAK PROBABILITY
const dayFactor =
  Math.min(daysRecorded / 5, 1);

const probability =
  Math.round(
    ((totalRisk / 85) * 100) *
    dayFactor
  );

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
    "Sustained favorable weather conditions have been detected over several days. Disease outbreak probability is high and preventive action is recommended.";
}
else if (risk === "Medium") {
  recommendation =
    "Moderate disease risk detected from accumulated weather conditions over multiple days. Continue monitoring crops and watch for early disease symptoms.";
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
  Based on {daysRecorded} day(s)
</Text>

<Text style={styles.riskDescription}>
  Avg Humidity:
  {averageHumidity.toFixed(1)}%
</Text>

<Text style={styles.riskDescription}>
  Avg Temperature:
  {averageTemperature.toFixed(1)}°C
</Text>

<Text style={styles.riskDescription}>
  Avg Wind:
  {averageWindSpeed.toFixed(1)} m/s
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

      <View style={styles.historyCard}>

  <Text style={styles.historyTitle}>
    Last 5 Days Weather History
  </Text>

  {
    weatherHistory.map((item, index) => (

      <View
        key={index}
        style={styles.historyItem}
      >

        <Text style={styles.historyDate}>
          {item.date}
        </Text>

        <Text style={styles.historyText}>
          🌡 {item.temperature}°C
        </Text>

        <Text style={styles.historyText}>
          💧 {item.humidity}%
        </Text>

        <Text style={styles.historyText}>
          🌬 {item.windSpeed} m/s
        </Text>

      </View>

    ))
  }

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

  historyCard: {
  backgroundColor: Colors.white,
  padding: 20,
  borderRadius: 20,
  marginTop: 20,
  elevation: 4,
},

historyTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: Colors.primary,
  marginBottom: 15,
},

historyItem: {
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
  paddingVertical: 10,
},

historyDate: {
  fontWeight: "bold",
  color: Colors.primary,
  marginBottom: 5,
},

historyText: {
  color: Colors.textDark,
},

});