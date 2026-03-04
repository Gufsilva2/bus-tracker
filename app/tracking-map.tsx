import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { TripService } from "@/lib/trip-service";
import { Trip, TrackingData } from "@/lib/types";
import * as Haptics from "expo-haptics";

/**
 * Tracking Map Screen - MVP Evoluído
 * Rastreamento em tempo real com mapa simulado
 */
export default function TrackingMapScreen() {
  const router = useRouter();
  const colors = useColors();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrackingData();
    // Simular atualização de localização a cada 5 segundos
    const interval = setInterval(updateLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTrackingData = async () => {
    try {
      // Obter primeira viagem ativa para demonstração
      const activeTrips = await TripService.getActiveTrips();
      if (activeTrips.length > 0) {
        setTrip(activeTrips[0]);
        const trackingData = await TripService.getLatestTrackingData(activeTrips[0].id);
        if (trackingData) {
          setTracking(trackingData);
        } else {
          // Criar dados de rastreamento simulados
          const simulated: TrackingData = {
            tripId: activeTrips[0].id,
            latitude: -25.5951,
            longitude: -54.5775,
            speed: 85,
            heading: 45,
            accuracy: 10,
            timestamp: new Date().toISOString(),
            distanceRemaining: 1050,
            estimatedArrivalTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            currentStatus: "on_schedule",
          };
          setTracking(simulated);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    if (tracking) {
      // Simular movimento do ônibus
      const newTracking: TrackingData = {
        ...tracking,
        latitude: tracking.latitude + (Math.random() - 0.5) * 0.01,
        longitude: tracking.longitude + (Math.random() - 0.5) * 0.01,
        speed: 80 + Math.random() * 20,
        distanceRemaining: Math.max(0, tracking.distanceRemaining - 5),
        timestamp: new Date().toISOString(),
      };
      setTracking(newTracking);
      if (trip) {
        await TripService.saveTrackingData(newTracking);
      }
    }
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (trip) {
      Alert.alert("Compartilhar", "Funcionalidade de compartilhamento em desenvolvimento");
    }
  };

  const handleAlert = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Alertas", "Você receberá notificações sobre atrasos e chegada");
  };

  if (loading || !trip || !tracking) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <Text className="text-foreground">Carregando rastreamento...</Text>
      </ScreenContainer>
    );
  }

  const etaMinutes = Math.round(
    (new Date(tracking.estimatedArrivalTime).getTime() - Date.now()) / 60000
  );
  const etaFormatted = TripService.formatTime(etaMinutes);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-4">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Text className="text-lg text-primary">← Voltar</Text>
          </Pressable>
          <Text className="text-xl font-bold text-foreground">Rastreamento</Text>
          <View className="w-8" />
        </View>

        {/* Map Simulation */}
        <View className="mb-6 rounded-lg border-2 border-border bg-surface p-6">
          <View className="items-center justify-center">
            <Text className="text-6xl mb-2">🗺️</Text>
            <Text className="text-sm text-muted text-center mb-4">
              Mapa em tempo real (integração com Google Maps)
            </Text>
            <View className="w-full h-40 rounded-lg bg-background border border-border items-center justify-center">
              <Text className="text-muted">Localização: {tracking.latitude.toFixed(4)}, {tracking.longitude.toFixed(4)}</Text>
            </View>
          </View>
        </View>

        {/* Trip Info */}
        <View className="mb-6 rounded-lg bg-surface p-4">
          <Text className="mb-3 text-lg font-bold text-foreground">Informações da Viagem</Text>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-muted">Origem</Text>
            <Text className="font-semibold text-foreground">{trip.origin}</Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-muted">Destino</Text>
            <Text className="font-semibold text-foreground">{trip.destination}</Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-muted">Empresa</Text>
            <Text className="font-semibold text-foreground">{trip.busCompany}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted">Viagem</Text>
            <Text className="font-semibold text-foreground">{trip.tripNumber}</Text>
          </View>
        </View>

        {/* Tracking Stats */}
        <View className="mb-6 gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-lg bg-primary/10 p-4">
              <Text className="text-xs text-muted mb-1">Velocidade</Text>
              <Text className="text-2xl font-bold text-primary">{Math.round(tracking.speed)} km/h</Text>
            </View>

            <View className="flex-1 rounded-lg bg-success/10 p-4">
              <Text className="text-xs text-muted mb-1">ETA</Text>
              <Text className="text-2xl font-bold text-success">{etaFormatted}</Text>
            </View>
          </View>

          <View className="rounded-lg bg-warning/10 p-4">
            <Text className="text-xs text-muted mb-1">Distância Restante</Text>
            <Text className="text-2xl font-bold text-warning">
              {TripService.formatDistance(tracking.distanceRemaining)}
            </Text>
          </View>
        </View>

        {/* Status Bar */}
        <View className="mb-6 rounded-lg bg-surface p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-semibold text-foreground">Status</Text>
            <View
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor:
                  tracking.currentStatus === "on_schedule"
                    ? colors.success
                    : tracking.currentStatus === "delayed"
                      ? colors.warning
                      : colors.error,
              }}
            >
              <Text className="text-xs font-semibold text-white">
                {tracking.currentStatus === "on_schedule"
                  ? "NO HORÁRIO"
                  : tracking.currentStatus === "delayed"
                    ? "ATRASADO"
                    : "ADIANTADO"}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="h-2 rounded-full bg-border overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{
                width: `${Math.min(100, ((1050 - tracking.distanceRemaining) / 1050) * 100)}%`,
              }}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={handleShare}
            className="flex-1 rounded-lg border border-border p-4 active:opacity-80"
          >
            <Text className="text-center font-semibold text-foreground">📤 Compartilhar</Text>
          </Pressable>

          <Pressable
            onPress={handleAlert}
            className="flex-1 rounded-lg border border-border p-4 active:opacity-80"
          >
            <Text className="text-center font-semibold text-foreground">🔔 Alertas</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
