// Shared disease outbreak risk logic. Both HomeScreen (preview card) and
// WeatherScreen (full detail) import from here so they can never drift
// out of sync with each other again.

// Disease-specific scoring: respects each pathogen's actual biology.
// Fungal/bacterial/oomycete diseases are favored by HIGH humidity, while
// mites and whitefly-vectored viruses are favored by LOW humidity (hot,
// dry weather) — humidityDirection controls which one applies.
export function computeDiseaseRisk(weatherRisk, avgTemp, avgHumidity, avgWind, daysRecorded) {
  let tempScore = 0;
  if (avgTemp >= weatherRisk.idealTempMin && avgTemp <= weatherRisk.idealTempMax) {
    tempScore = 40;
  } else {
    const distance =
      avgTemp < weatherRisk.idealTempMin
        ? weatherRisk.idealTempMin - avgTemp
        : avgTemp - weatherRisk.idealTempMax;
    tempScore = Math.max(0, 40 - distance * 4);
  }

  let humidityScore = 0;
  if (weatherRisk.humidityDirection === "above") {
    humidityScore =
      avgHumidity >= weatherRisk.humidityThreshold
        ? 45
        : Math.max(0, 45 - (weatherRisk.humidityThreshold - avgHumidity) * 1.5);
  } else if (weatherRisk.humidityDirection === "below") {
    humidityScore =
      avgHumidity <= weatherRisk.humidityThreshold
        ? 45
        : Math.max(0, 45 - (avgHumidity - weatherRisk.humidityThreshold) * 1.5);
  }

  let windScore = 0;
  if (avgWind >= 5) windScore = 15;
  else if (avgWind >= 2) windScore = 10;

  const rawScore = tempScore + humidityScore + windScore;
  // Same accumulation principle as before: one favorable day barely
  // registers, confidence ramps up as conditions persist, capping out
  // once 5 days of history have been recorded.
  const dayFactor = Math.min(daysRecorded / 5, 1);
  const probability = Math.round(rawScore * dayFactor);

  let level = "Low";
  if (probability >= 70) level = "Very High";
  else if (probability >= 50) level = "High";
  else if (probability >= 30) level = "Medium";

  return { probability, level };
}

// Fallback formula for when nothing's been scanned yet, or the last scan
// was a healthy leaf.
export function computeGenericRisk(avgTemp, avgHumidity, avgWind, daysRecorded) {
  let humidityScore = 0;
  if (avgHumidity >= 85) humidityScore = 40;
  else if (avgHumidity >= 70) humidityScore = 25;
  else if (avgHumidity >= 60) humidityScore = 15;

  let temperatureScore = 0;
  if (avgTemp >= 20 && avgTemp <= 30) temperatureScore = 30;
  else if (avgTemp >= 15 && avgTemp <= 35) temperatureScore = 15;

  let windScore = 0;
  if (avgWind >= 5) windScore = 15;
  else if (avgWind >= 2) windScore = 10;

  const totalRisk = humidityScore + temperatureScore + windScore;
  const dayFactor = Math.min(daysRecorded / 5, 1);
  const probability = Math.round((totalRisk / 85) * 100 * dayFactor);

  let level = "Low";
  if (totalRisk >= 70) level = "Very High";
  else if (totalRisk >= 50) level = "High";
  else if (totalRisk >= 30) level = "Medium";

  return { probability, level };
}

export function buildRecommendation(diseaseName, level, notes) {
  const base = {
    "Very High": `Conditions are highly favorable for a ${diseaseName} outbreak right now. Inspect your crop and consider preventive treatment immediately.`,
    High: `Sustained favorable conditions for ${diseaseName} have built up over the recorded days. Preventive action is recommended.`,
    Medium: `Some risk of ${diseaseName} is building from recent conditions. Continue monitoring for early symptoms.`,
    Low: `Current conditions aren't especially favorable for ${diseaseName} right now.`,
  }[level];
  return notes ? `${base} ${notes}` : base;
}

// One entry point both screens call: figures out whether to use the
// disease-specific formula or the generic fallback, given a lastScan
// record (or null) from ScanStorage.
export function getRiskForScreen(lastScan, avgTemp, avgHumidity, avgWind, daysRecorded) {
  const weatherRisk = lastScan?.weatherRisk;
  const hasDiseaseProfile = weatherRisk && weatherRisk.type !== "none";
  const isMechanical = weatherRisk?.type === "mechanical";
  const diseaseName = lastScan?.diseaseName;

  if (isMechanical) {
    return {
      mode: "mechanical",
      diseaseName,
      notes: weatherRisk.notes,
    };
  }

  if (hasDiseaseProfile) {
    const { probability, level } = computeDiseaseRisk(weatherRisk, avgTemp, avgHumidity, avgWind, daysRecorded);
    return {
      mode: "disease",
      diseaseName,
      probability,
      level,
      recommendation: buildRecommendation(diseaseName, level, weatherRisk.notes),
    };
  }

  const { probability, level } = computeGenericRisk(avgTemp, avgHumidity, avgWind, daysRecorded);
  return {
    mode: "generic",
    probability,
    level,
    recommendation:
      level === "Very High"
        ? "Weather conditions are highly favorable for disease outbreaks. Immediate field inspection and preventive treatment are recommended."
        : level === "High"
        ? "Sustained favorable weather conditions have been detected over several days. Disease outbreak probability is high and preventive action is recommended."
        : level === "Medium"
        ? "Moderate disease risk detected from accumulated weather conditions over multiple days. Continue monitoring crops and watch for early disease symptoms."
        : "Current weather conditions are not highly favorable for disease development. Scan a leaf to get a disease-specific prediction here.",
  };
}
