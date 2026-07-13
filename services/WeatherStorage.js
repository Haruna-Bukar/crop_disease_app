import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "weather_history";

export const saveWeatherRecord = async (record) => {
  try {

    const existingData =
      await AsyncStorage.getItem(STORAGE_KEY);

    let history =
      existingData ? JSON.parse(existingData) : [];

    const today =
      new Date().toLocaleDateString();

    const existingIndex =
      history.findIndex(
        item => item.date === today
      );

    if (existingIndex !== -1) {

      // Update today's record
      history[existingIndex] = record;

    } else {

      // Add new day
      history.push(record);

    }

    // Keep only last 5 days
    if (history.length > 5) {
      history = history.slice(-5);
    }

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history)
    );

  } catch (error) {
    console.log(error);
  }
};

export const getWeatherHistory = async () => {
  try {

    const data =
      await AsyncStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];

  } catch (error) {

    console.log(error);

    return [];
  }
};