import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import Colors from "../utils/colors";
import { getWeatherData }
from "../services/WeatherService";
import {
  saveWeatherRecord,
  getWeatherHistory,
} from "../services/WeatherStorage";
import { getLastScan, getScanStats } from "../services/ScanStorage";
import { timeAgo } from "../utils/timeAgo";
import { getRiskForScreen } from "../utils/diseaseRisk";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
   ScrollView,
} from "react-native";

export default function HomeScreen({ navigation }) {

  const [location, setLocation] =
    useState("Getting location...");

  const [temperature, setTemperature] =
    useState("--");

  const [humidity, setHumidity] =
    useState("--");

  const [windSpeed, setWindSpeed] =
    useState("--");

    const [averageHumidity, setAverageHumidity] =
  useState(0);

const [averageTemperature, setAverageTemperature] =
  useState(0);

const [averageWindSpeed, setAverageWindSpeed] =
  useState(0);

const [daysRecorded, setDaysRecorded] =
  useState(0);

const [lastScan, setLastScan] =
  useState(null);

// `lastScan` feeds both the weather risk calculation AND the "Last Scan"
// card below — it's the same local record, no need for two copies.
const [scanStats, setScanStats] =
  useState({ total: 0, lowRisk: 0, highRisk: 0 });
  
useEffect(() => {
  getLocation();
  loadHistory();
  loadLastScan();
  loadScanStats();
}, []);

const loadScanStats = async () => {
  const stats = await getScanStats();
  setScanStats(stats);
};

const loadLastScan = async () => {
  const scan = await getLastScan();
  setLastScan(scan);
};

  const loadHistory = async () => {

  const history =
    await getWeatherHistory();

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

  const getLocation = async () => {

    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {

      setLocation("Location denied");

      return;
    }

    const currentLocation =
      await Location.getCurrentPositionAsync({});

    // GET WEATHER DATA
    const weather =
      await getWeatherData(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

    if (weather) {

      setTemperature(
        weather.main.temp
      );

      setHumidity(
        weather.main.humidity
      );

      setWindSpeed(
        weather.wind.speed
      );

     await saveWeatherRecord({
  date: new Date().toLocaleDateString(),
  temperature: weather.main.temp,
  humidity: weather.main.humidity,
  windSpeed: weather.wind.speed,
});
    }

    // GET LOCATION NAME
    const address =
      await Location.reverseGeocodeAsync({
        latitude:
          currentLocation.coords.latitude,

        longitude:
          currentLocation.coords.longitude,
      });

    if (address.length > 0) {

      const place = address[0];

      setLocation(
        `${place.city || "Unknown"}, ${place.region || ""}`
      );
    }
  };

  // Same shared function WeatherScreen uses — disease-specific if
  // something's been scanned, generic fallback otherwise. This is the
  // fix for the two screens showing different numbers: there's now only
  // one place this logic lives.
  const riskResult = getRiskForScreen(
    lastScan,
    averageTemperature,
    averageHumidity,
    averageWindSpeed,
    daysRecorded
  );

  const riskLabel =
    riskResult.mode === "mechanical"
      ? "N/A"
      : riskResult.level;

  const riskCardTitle =
    riskResult.mode !== "generic"
      ? `🌦 ${riskResult.diseaseName} Risk`
      : "🌦 Weather Risk Analysis";

  return (
  <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
  >

    {/* HEADER */}
    <View style={styles.header}>
      <Text style={styles.greeting}>
        Good Day
      </Text>
<Text style={styles.location}>
  {location}
</Text>
    </View>

    {/* STATISTICS CARDS */}
    <View style={styles.statsContainer}>

      <View style={styles.card}>
        <Text style={styles.cardNumber}>{scanStats.total}</Text>
        <Text style={styles.cardLabel}>Total Scans</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardNumber}>{scanStats.lowRisk}</Text>
        <Text style={styles.cardLabel}>Low Risk</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardNumber}>{scanStats.highRisk}</Text>
        <Text style={styles.cardLabel}>High Risk</Text>
      </View>

    </View>

    {/* WEATHER CARD */}
   <TouchableOpacity
  style={styles.weatherCard}
  onPress={() =>
  navigation.navigate("Weather", {
    temperature,
    humidity,
    windSpeed,
    location,
  })
}
>

  <Text style={styles.weatherTitle}>
    {riskCardTitle}
  </Text>

  <View style={styles.weatherRow}>
    <Text style={styles.weatherLabel}>
      🌡 Temperature
    </Text>

    <Text style={styles.weatherValue}>
      {temperature}°C
    </Text>
  </View>

  <View style={styles.weatherRow}>
    <Text style={styles.weatherLabel}>
      💧 Humidity
    </Text>

    <Text style={styles.weatherValue}>
      {humidity}%
    </Text>
  </View>

  <View style={styles.weatherRow}>
    <Text style={styles.weatherLabel}>
      🌬 Wind Speed
    </Text>

    <Text style={styles.weatherValue}>
      {windSpeed} m/s
    </Text>
  </View>

  <View style={styles.riskContainer}>
    <Text style={styles.riskText}>
  🟡 Disease Risk: {riskLabel}
</Text>

{riskResult.mode !== "mechanical" && (
  <Text
    style={{
      color: "#fff",
      marginTop: 5,
    }}
  >
    Outbreak Probability:
    {riskResult.probability}%
  </Text>
)}

<Text
  style={{
    color: "#fff",
    marginTop: 5,
  }}
>
  Based on {daysRecorded}
  day(s) of weather data
</Text>
  </View>

</TouchableOpacity>
    {/* SCAN BUTTON */}
<TouchableOpacity
  style={styles.scanButton}
  onPress={() => navigation.navigate("Scan")}
>
      <Text style={styles.scanButtonText}>
        Scan A Leaf Now
      </Text>
    </TouchableOpacity>

    {/* LAST SCAN */}
    <View style={styles.lastScanCard}>
      <Text style={styles.lastScanTitle}>
        Last Scan
      </Text>

      {lastScan ? (
        <>
          <Text style={styles.lastScanText}>
            {lastScan.diseaseName} Detected
          </Text>

          <Text style={styles.lastScanTime}>
            {timeAgo(lastScan.scannedAt)}
          </Text>
        </>
      ) : (
        <Text style={styles.lastScanText}>
          No scans yet — tap "Scan A Leaf Now" to get started.
        </Text>
      )}
    </View>

  </ScrollView>
) };

const styles = StyleSheet.create({

  container: {
  backgroundColor: Colors.background,
  padding: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 50,
  },

  scanButton: {
    backgroundColor: Colors.primary,
    width: "100%",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },

  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  historyButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    width: "100%",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },

  historyButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },

  header: {
  width: "100%",
  marginTop: 60,
  marginBottom: 30,
},

greeting: {
  fontSize: 28,
  fontWeight: "bold",
  color: Colors.primary,
},

location: {
  fontSize: 18,
  color: Colors.primary,
  marginTop: 5,
  fontWeight: "500",
},

statsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 25,
},

card: {
  backgroundColor: Colors.white,
  width: "30%",
  padding: 15,
  borderRadius: 15,
  alignItems: "center",
  elevation: 4,
},

cardNumber: {
  fontSize: 22,
  fontWeight: "bold",
  color: Colors.primary,
},

cardLabel: {
  fontSize: 13,
  color: Colors.textLight,
  marginTop: 5,
},

weatherText: {
  color: Colors.white,
  marginBottom: 8,
},

lastScanCard: {
  width: "100%",
  backgroundColor: Colors.white,
  padding: 20,
  borderRadius: 20,
  elevation: 4,
  marginTop: 20,
},

lastScanTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: Colors.primary,
  marginBottom: 10,
},

lastScanText: {
  color: Colors.textDark,
  marginBottom: 5,
},

lastScanTime: {
  color: Colors.textLight,
},

weatherCard: {
  width: "100%",
  backgroundColor: Colors.primary,
  borderRadius: 20,
  padding: 20,
  marginBottom: 25,
  elevation: 5,
},

weatherTitle: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 20,
},

weatherRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 12,
},

weatherLabel: {
  color: "#fff",
  fontSize: 16,
},

weatherValue: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},

riskContainer: {
  marginTop: 15,
  borderTopWidth: 1,
  borderTopColor: "rgba(255,255,255,0.3)",
  paddingTop: 15,
},

riskText: {
  color: "#ffd166",
  fontSize: 18,
  fontWeight: "bold",
},

});