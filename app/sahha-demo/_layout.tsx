import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform, View, Text } from "react-native";
import Sahha, { SahhaEnvironment } from "sahha-react-native";

const sahhaSettings = {
  environment: SahhaEnvironment.sandbox, // Modo prueba
  ...(Platform.OS === "android" && {
    notificationSettings: {
      icon: "ic_test",
      title: "Test Title",
      shortDescription: "Test description.",
    },
  }),
};

export default function RootLayout() {
  const [sahhaConfigured, setSahhaConfigured] = useState(false);

  useEffect(() => {
    Sahha.configure(
      sahhaSettings,
      (error: any, success: boolean | ((prevState: boolean) => boolean)) => {
        if (error) {
          console.log(`Sahha configuration error: ${error}`);
        } else {
          console.log(`Sahha configuration success: ${success}`);
          setSahhaConfigured(success);
        }
      }
    );
  }, []);

  if (!sahhaConfigured) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Cargando configuración de Sahha...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
          animation: "slide_from_right",
          navigationBarHidden: true,
        }}
      >
        {/* Pantalla de Splash */}
        <Stack.Screen
          name="movil/splashScreen"
          options={{ headerShown: false }}
        />
        {/* Pantalla principal */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="medications/add"
          options={{ headerShown: false, headerBackTitle: "", title: "" }}
        />
        {/* Pantalla de autenticación */}
        <Stack.Screen name="auth" />
      </Stack>
    </>
  );
}
