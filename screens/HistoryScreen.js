import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import Colors from "../utils/colors";
import { getScanHistory } from "../services/ScanStorage";

function severityColor(severity) {
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

function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getScanHistory();
    setHistory(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Scan History</Text>

      {history.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No scans yet. Scan a leaf to see your history here.
          </Text>
        </View>
      ) : (
        history.map((item) => (
          <View key={item.scannedAt} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.diseaseName}>{item.diseaseName}</Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: severityColor(item.severity) },
                ]}
              >
                <Text style={styles.badgeText}>{item.severity}</Text>
              </View>
            </View>

            {item.crop && (
              <Text style={styles.metaText}>Crop: {item.crop}</Text>
            )}

            {item.confidence != null && (
              <Text style={styles.metaText}>
                Confidence: {Math.round(item.confidence * 100)}%
              </Text>
            )}

            <Text style={styles.dateText}>
              {formatDate(item.scannedAt)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 50,
    marginBottom: 20,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 4,
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    flexShrink: 1,
    paddingRight: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  metaText: {
    fontSize: 15,
    color: Colors.textDark,
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 8,
  },
});