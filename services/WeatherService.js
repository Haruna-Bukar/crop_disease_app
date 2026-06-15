const API_KEY = "52dbd507ef0430a84b6176b790708621";

export const getWeatherData = async (
  latitude,
  longitude
) => {

  try {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    return data;

  } catch (error) {

    console.log(error);

    return null;
  }
};