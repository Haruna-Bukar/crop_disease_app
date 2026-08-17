import React, { useEffect, useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Just a timed splash screen now — no model to load at startup.
    // Prediction happens per-photo via the Flask API call in CameraScreen.js.
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <AppNavigator />;
}