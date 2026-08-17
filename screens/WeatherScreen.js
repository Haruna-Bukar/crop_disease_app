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

import { getLastScan } from "../services/ScanStorage";
import { getRiskForScreen } from "../utils/diseaseRisk";

import Colors from "../utils/colors";

function timeAgo(isoString) {
  if (!isoString) return "";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

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

const [lastScan, setLastScan] =
  useState(null);

  useEffect(() => {
  loadHistory();
  loadLastScan();
}, []);

const loadLastScan = async () => {
  const scan = await getLastScan();
  setLastScan(scan);
};

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

  // Single shared function decides disease-specific vs. generic vs.
  // mechanical (mosaic virus) — same logic HomeScreen's preview card uses.
  const riskResult = getRiskForScreen(
    lastScan,
    averageTemperature,
    averageHumidity,
    averageWindSpeed,
    daysRecorded
  );

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
    {riskResult.mode !== "generic"
      ? `${riskResult.diseaseName} Outbreak Risk`
      : "Disease Risk Prediction"}
  </Text>

  {lastScan && (
    <Text style={styles.scanBadge}>
      Based on your last scan: {lastScan.diseaseName} ({timeAgo(lastScan.scannedAt)})
    </Text>
  )}

  {riskResult.mode === "mechanical" ? (
    <Text style={styles.riskDescription}>
      {riskResult.notes}
    </Text>
  ) : (
    <>
      <Text style={styles.riskValue}>
        {riskResult.probability}%
      </Text>

      <Text style={styles.riskDescription}>
        {riskResult.level} Risk
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
    </>
  )}

</View>

{/* AI ADVICE */}
      <View style={styles.adviceCard}>

        <Text style={styles.adviceTitle}>
          AI Weather Advice
        </Text>

        <Text style={styles.adviceText}>
          {riskResult.mode === "mechanical" ? riskResult.notes : riskResult.recommendation}
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

  scanBadge: {
    color: Colors.white,
    fontSize: 13,
    opacity: 0.85,
    marginBottom: 12,
    fontStyle: "italic",
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