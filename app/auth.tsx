import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router"; // Importa el enrutador de Expo para la navegación
import * as LocalAuthentication from "expo-local-authentication"; // Importa la autenticación biométrica
import { Ionicons } from "@expo/vector-icons"; // Importa los iconos de Ionicons
import { LinearGradient } from "expo-linear-gradient"; // Importa el gradiente de Expo

const { width } = Dimensions.get("window"); // Obtiene el ancho de la pantalla del dispositivo

export default function AuthScreen() {
  const [hasBiometrics, setHasBiometrics] = useState(false); // Estado para saber si el dispositivo soporta biometría
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Estado para saber si se está autenticando
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores de autenticación
  const router = useRouter(); // Hook para la navegación

  // Se ejecuta una vez cuando el componente se monta
  useEffect(() => {
    checkBiometrics();
  }, []);

  // Función para verificar si el dispositivo tiene hardware biométrico y si el usuario está registrado
  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setHasBiometrics(hasHardware && isEnrolled);
  };

  // Función para autenticar al usuario
  const authenticate = async () => {
    try {
      setIsAuthenticating(true); // Se inicia el estado de autenticación
      setError(null); // Se limpia cualquier error previo

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync;

      // Inicia la autenticación biométrica o con PIN
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: hasHardware && hasBiometrics ? "Usa FaceId/TouchID" : "Ingresa tu PIN para acceder",
        fallbackLabel: "Usar PIN",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
      });

      if (auth.success) {
        router.replace("/"); // Si la autenticación es exitosa, redirige a la pantalla principal
      } else {
        setError("Error en la Autenticación: Por favor, intenta de nuevo"); // Si falla, muestra un error
      }
    } catch (error) {
      setError("Ocurrió un error inesperado");
    } finally {
      setIsAuthenticating(false); // Finaliza el estado de autenticación
    }
  };

  return (
    // Fondo con gradiente
    <LinearGradient colors={["#53c89b", "#11263d"]} style={styles.container}>
      <View style={styles.content}>
        {/* Icono principal */}
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={80} color="white" />
        </View>
        <Text style={styles.title}>MedRemind</Text>
        <Text style={styles.subtitle}>Your personal medical reminder</Text>

        {/* Tarjeta de autenticación */}
        <View style={styles.card}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.instructionText}>
            {hasBiometrics ? "Usa FaceId/TouchID" : "Ingresa tu PIN para acceder"}
          </Text>

          {/* Botón de autenticación */}
          <TouchableOpacity
            style={[styles.button, isAuthenticating && styles.buttonDisabled]}
            onPress={authenticate}
            disabled={isAuthenticating}
          >
            <Ionicons
              name={hasBiometrics ? "finger-print-outline" : "keypad-outline"}
              size={24}
              color={"#fff"}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {isAuthenticating ? "Verificando..." : hasBiometrics ? "Authenticate" : "Ingresa tu PIN"}
            </Text>
          </TouchableOpacity>

          {/* Mensaje de error */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={"#f44336"} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.9)",
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: width - 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#11263d",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 20
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginLeft: 8,
  },
});
