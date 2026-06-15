import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>

      {/* Logo */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />

      {/* App Name */}
      <Text style={styles.title}>CropGuard AI</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Smart Crop Disease Detection
      </Text>

      {/* Loader */}
      <ActivityIndicator
        size="large"
        color="#ffffff"
        style={styles.loader}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#2d6a4f",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 170,
    height: 170,
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
  },

  subtitle: {
    fontSize: 16,
    color: "#d8f3dc",
    marginTop: 10,
  },

  loader: {
    marginTop: 40,
  },

});