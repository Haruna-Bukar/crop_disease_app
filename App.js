import React, { useEffect, useState } from "react";

import SplashScreen from "./screens/SplashScreen";

import AppNavigator from "./navigation/AppNavigator";

export default function App() {

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {

    setTimeout(() => {

      setShowSplash(false);

    }, 3000);

  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <AppNavigator />;
}