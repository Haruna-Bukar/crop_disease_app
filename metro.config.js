const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add .tflite as a supported asset
config.resolver.assetExts.push("tflite");

module.exports = config;