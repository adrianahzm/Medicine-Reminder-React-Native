import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      {/* Barra de estado con íconos blancos */}
      <StatusBar style="light" />

      <Stack screenOptions={{
        headerShown: false, // Oculta el encabezado en todas las pantallas
        contentStyle: { backgroundColor: 'white' }, // Fondo blanco para las pantallas
        animation: 'slide_from_right', // Animación al navegar entre pantallas
        header: () => null, // Asegura que el header no se renderice
        navigationBarHidden: true // Oculta la barra de navegación en Android
      }}>
        {/* Pantalla principal (index) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="medications/add" options={{ headerShown: false, headerBackTitle: "", title: "" }} />

        {/* Pantalla de autenticación (auth) */}
        <Stack.Screen name="auth" />
      </Stack>
    </>
  )
}
