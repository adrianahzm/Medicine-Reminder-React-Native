import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Button,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Sahha, {
  SahhaEnvironment,
  SahhaSensor,
  SahhaSensorStatus,
} from "sahha-react-native";

const appId = "KgOg34tdxlAWwyISnav9Wh6Rf8gDa00u"; // 🔥 Agrega tu appId de Sahha aquí
const appSecret =
  "ZgWHXo1tyQm8bbB0t1DbitwcJG17g9XE44II5iAAMNwmZGAPP6rvqWo72cHJL3Rt"; // 🔥 Agrega tu appSecret de Sahha aquí
const externalId = "T3571N63X71D"; // 🔥 Agrega tu externalId aquí

const requestPermissions = async () => {
  const permission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.MOTION
      : PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION;

  const result = await request(permission);
  if (result !== RESULTS.GRANTED) {
    console.log("Permiso de sensores denegado");
  }
};

export default function App(): JSX.Element {
  const [authentication, setAuthentication] = useState({
    loading: false,
    authenticated: false,
  });
  const [sensorStatus, setSensorStatus] = useState({
    loading: true,
    status: SahhaSensorStatus.pending,
  });

  const [demographic, setDemopgraphic] = useState<Object | null>(null);
  /* const [stepSamples, setStepSamples] = useState([]); */
  const [dailyStatsSteps, setDailyStatsSteps] = useState([]);
  const [dailyStatsHeartRate, setDailyStatsHeartRate] = useState([]);

  useEffect(() => {
    requestPermissions(); // ✅ Pedir permisos al iniciar
    getSahhaSensorStatus();
  }, []);

  const authenticateSahha = () => {
    setAuthentication({ ...authentication, loading: true });

    Sahha.authenticate(appId, appSecret, externalId, (error, success) => {
      console.log(`Sahha authentication success: ${success}`);
      setAuthentication({ loading: false, authenticated: success });

      if (error) {
        console.log(`Sahha authentication error: ${error}`);
      }
    });
  };

  const deauthenticateSahha = () => {
    setAuthentication({ ...authentication, loading: true });

    Sahha.deauthenticate((error, success) => {
      console.log(`Sahha deauthentication success: ${success}`);
      setAuthentication({ loading: false, authenticated: !success });

      if (error) {
        console.log(`Sahha deauthentication error: ${error}`);
      }
    });
  };

  const postSahhaDemographic = () => {
    const demographic = {
      age: 35,
      gender: "Female",
      country: "NZ",
      birthCountry: "UK",
      birthDate: "1990-05-20",
    };

    Sahha.postDemographic(demographic, (error, success) => {
      console.log(` Sahha post demographic success: ${success} `);

      if (error) {
        console.log(`Sahha post demographic error: ${error}`);
      }
    });
  };

  const getSahhaDemographic = () => {
    Sahha.getDemographic((error, value) => {
      console.log(`Sahha get demographic success: ${!error}`);

      if (error) {
        console.log(`Sahha get demographic error: ${error}`);
      }

      if (value) {
        setDemopgraphic(JSON.parse(value.toString()));
      } else {
        console.error("❌ Error: value es undefined en getSahhaDemographic");
      }
    });
  };

  const getSahhaSensorStatus = () => {
    setSensorStatus({ ...sensorStatus, loading: true });

    Sahha.getSensorStatus(
      [SahhaSensor.steps, SahhaSensor.heart_rate],
      (error, status) => {
        console.log(`Sahha get sensor status success: ${!error}`);
        setSensorStatus({ loading: false, status });

        if (error) {
          console.log(`Sahha get sensor status error: ${error}`);
        }
      }
    );
  };

  const enableSahhaSensors = () => {
    setSensorStatus({ ...sensorStatus, loading: true });

    Sahha.enableSensors(
      [SahhaSensor.steps, SahhaSensor.heart_rate],
      (error, status) => {
        console.log(`Sahha enable sensor status success: ${!error}`);
        setSensorStatus({ loading: false, status });

        if (error) {
          console.log(`Sahha get sensor status error: ${error}`);
        }
      }
    );
  };

  const sensorStatusToString = (
    status: SahhaSensorStatus | "pending" | null
  ) => {
    if (!status) return "Unknown"; // ✅ Manejo de `null`
    switch (status) {
      case "pending":
        return "Pending";
      case SahhaSensorStatus.disabled:
        return "Disabled";
      case SahhaSensorStatus.enabled:
        return "Enabled";
      case SahhaSensorStatus.unavailable:
        return "Unavailable";
      default:
        return "Unknown";
    }
  };

  /* const getStepSamples = () => {
    let endDate = new Date();
    let startDate = new Date();
    startDate.setDate(endDate.getDate() - 1);

    Sahha.getSamples(
      SahhaSensor.steps,
      startDate.getTime(),
      endDate.getTime(),
      (error, value) => {
        if (error) {
          console.error(`Error al obtener muestras: ${error}`);
        } else if (value) {
          const samples = JSON.parse(value);
          console.log("Muestras de pasos:", samples);
        }
      }
    );
  }; */

  /* const getDailyStats = () => {
    const today = new Date();
    Sahha.getStats(
      SahhaSensor.steps,
      today.getTime(),
      today.getTime(),
      (error, value) => {
        if (error) {
          console.error(`Error al obtener estadísticas: ${error}`);
        } else if (value) {
          const stats = JSON.parse(value);
          setDailyStats(stats);
          console.log("Estadísticas diarias:", stats);
        }
      }
    );
  }; */

  const getDailyStatsSteps = () => {
    const today = new Date();
    Sahha.getStats(
      SahhaSensor.steps,
      today.getTime(),
      today.getTime(),
      (error, value) => {
        if (error) {
          console.error(`❌ Error al obtener estadísticas: ${error}`);
        } else if (value) {
          const statsSteps = JSON.parse(value);
          setDailyStatsSteps(statsSteps);
          console.log("📊 Estadísticas diarias:", statsSteps);
        }
      }
    );
  };
  const getDailyStatsHeartRate = () => {
    const today = new Date();
    Sahha.getStats(
      SahhaSensor.heart_rate,
      today.getTime(),
      today.getTime(),
      (error, value) => {
        if (error) {
          console.error(`❌ Error al obtener estadísticas: ${error}`);
        } else if (value) {
          const statsHeartRate = JSON.parse(value);
          setDailyStatsHeartRate(statsHeartRate);
          console.log("📊 Estadísticas diarias:", statsHeartRate);
        }
      }
    );
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.subContainer}>
          {authentication.loading ? (
            <Text>⏳ Autenticando...</Text>
          ) : (
            <Button
              title="Autenticar en Sahha"
              onPress={authenticateSahha}
              disabled={authentication.loading}
            />
          )}
        </View>

        <View>
          <Text>Demographic</Text>
          <Button
            title="Post demographic"
            onPress={postSahhaDemographic}
            disabled={!authentication.authenticated}
          />
          <Button
            title="Get demographic"
            onPress={getSahhaDemographic}
            disabled={!authentication.authenticated}
          />
          {demographic && <Text>{JSON.stringify(demographic, null, 2)}</Text>}
        </View>

        <View>
          <Text>
            {sensorStatus.loading
              ? "Getting sensor status..."
              : `Sensor status: ${sensorStatusToString(sensorStatus.status)}`}
          </Text>
          {sensorStatus.status === SahhaSensorStatus.unavailable && (
            <Text>Sensors are unavailable in this device</Text>
          )}
          <Button
            title="Enable sensors"
            onPress={enableSahhaSensors}
            disabled={
              sensorStatus.loading ||
              sensorStatus.status !== SahhaSensorStatus.pending
            }
          />
          {sensorStatus.status === SahhaSensorStatus.disabled && (
            <Button
              title="Open app settings"
              onPress={() => Sahha.openAppSettings()}
            />
          )}
        </View>

        <View style={styles.subContainer}>
          <Button
            title="Obtener estadisticas de pasos"
            onPress={getDailyStatsSteps}
          />
          {dailyStatsSteps.length > 0 && (
            <>
              <Text>Muestras de pasos:</Text>
              {dailyStatsSteps.map((sample, index) => (
                <Text key={index}>{JSON.stringify(sample)}</Text>
              ))}
            </>
          )}
        </View>

        <View style={styles.subContainer}>
          <Button
            title="Obtener estadisticas de frecuencia cardiaca"
            onPress={getDailyStatsHeartRate}
          />
          {dailyStatsHeartRate.length > 0 && (
            <>
              <Text>Muestras de pasos:</Text>
              {dailyStatsHeartRate.map((sample, index) => (
                <Text key={index}>{JSON.stringify(sample)}</Text>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 12,
  },
  subContainer: {
    gap: 12,
  },
});
