// All scan persistence lives here, purely on-device via AsyncStorage —
// no backend, no external account. Stores the full scan history as one
// growing list; "last scan" is just the front of that same list, so
// there's only one source of truth instead of two things that could
// drift out of sync.
//
// If your project doesn't have this dependency yet:
//   npx expo install @react-native-async-storage/async-storage

import AsyncStorage from "@react-native-async-storage/async-storage";

const SCAN_HISTORY_KEY = "scanHistory";
const MAX_HISTORY = 100; // keeps the stored list from growing forever

// Call this right after a prediction comes back from the API. Adds it to
// the front of the list (most recent first).
export async function saveScan({ predictedClass, confidence, treatmentInfo }) {
  try {
    const record = {
      id: Date.now().toString(),
      predictedClass,
      diseaseName: treatmentInfo?.disease || predictedClass,
      crop: treatmentInfo?.crop || null,
      severity: treatmentInfo?.severity || "None",
      confidence: confidence ?? null,
      weatherRisk: treatmentInfo?.weatherRisk || null,
      scannedAt: new Date().toISOString(),
    };

    const existing = await getScanHistory();
    const updated = [record, ...existing].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
    return record;
  } catch (error) {
    console.warn("Could not save scan:", error);
    return null;
  }
}

// Full history, most recent first — for HistoryScreen.
export async function getScanHistory() {
  try {
    const raw = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn("Could not load scan history:", error);
    return [];
  }
}

// Just the most recent scan, or null if nothing's been scanned yet. Used
// by WeatherScreen (disease-specific outbreak prediction) and HomeScreen
// (Last Scan card) — same data, two different uses.
export async function getLastScan() {
  const history = await getScanHistory();
  return history.length > 0 ? history[0] : null;
}

// "Low risk" bucket = None/Medium severity, "High risk" = High/Very High.
// Adjust this if you'd rather split the buckets differently.
function isHighRisk(severity) {
  return severity === "High" || severity === "Very High";
}

// Counts for HomeScreen's stats row: total, low-risk, high-risk.
export async function getScanStats() {
  const history = await getScanHistory();
  let lowRisk = 0;
  let highRisk = 0;
  history.forEach((item) => {
    if (isHighRisk(item.severity)) {
      highRisk += 1;
    } else {
      lowRisk += 1;
    }
  });
  return { total: history.length, lowRisk, highRisk };
}