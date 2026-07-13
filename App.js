import React, { useEffect, useState } from "react";

import SplashScreen from "./screens/SplashScreen";

import AppNavigator from "./navigation/AppNavigator";

import { loadModel } from "./services/AI/TensorflowService";

export default function App() {

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
  async function initializeApp() {
    try {
      console.log("Loading TensorFlow model...");

      await loadModel();

      console.log("✅ TensorFlow model is ready.");
    } catch (error) {
      console.error("❌ TensorFlow initialization failed:", error);
    }

    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }

  initializeApp();
}, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <AppNavigator />;
}