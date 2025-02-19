import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const [hasBiometrics, setHasBiometrics] = useState(false);

export default function AuthScreen() {
  return (
    <LinearGradient colors={["#53c89b", "#11263d"]}>
      <View>
        <View>
          <Ionicons name="medical" size={80} color="white" />
        </View>
        <Text>MedRemind</Text>
        <Text>Your personal medical reminder</Text>

        <View>
          <Text>Welcome Back</Text>
          <Text>
            {hasBiometrics
              ? "Usa FaceId/TouchID o tu PIN de acceso"
              : "Ingresa tu PIN para acceder"}
          </Text>
          <TouchableOpacity>
            <Ionicons
              name={hasBiometrics ? "finger-print-outline" : "keypad-outline"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
