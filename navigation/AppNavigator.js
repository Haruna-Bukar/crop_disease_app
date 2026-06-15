import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator }
from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ResultScreen from "../screens/ResultScreen";
import TreatmentScreen from "../screens/TreatmentScreen";
import WeatherScreen from "../screens/WeatherScreen";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function BottomTabs() {

  return (

    <Tab.Navigator

      screenOptions={({ route }) => ({

        headerShown: false,

        tabBarActiveTintColor: "#2d6a4f",

        tabBarInactiveTintColor: "gray",

        tabBarIcon: ({ color, size }) => {

          let iconName;

          if (route.name === "Home") {

            iconName = "home";

          } else if (route.name === "Scan") {

            iconName = "camera";

          } else if (route.name === "History") {

            iconName = "time";

          }

          return (

            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />

          );
        },
      })}
    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Scan"
        component={CameraScreen}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
      />

    </Tab.Navigator>
  );
}

export default function AppNavigator() {

  return (

    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        <Stack.Screen
          name="Main"
          component={BottomTabs}
        />

        <Stack.Screen
          name="Result"
          component={ResultScreen}
        />

        <Stack.Screen
          name="Treatment"
          component={TreatmentScreen}
        />

        <Stack.Screen
  name="Weather"
  component={WeatherScreen}
/>

      </Stack.Navigator>

    </NavigationContainer>
  );
}