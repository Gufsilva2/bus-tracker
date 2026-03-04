import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";

interface Travel {
  id: string;
  passageNumber: string;
  company: string;
  origin: string;
  destination: string;
  departureTime: string;
  estimatedArrival: string;
  date: string;
  status: "active" | "completed" | "cancelled";
}

export default function TrackingScreen() {
  const router = useRouter();
  const { travelId } = useLocalSearchParams();
  const [travel, setTravel] = useState<Travel | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    loadTravel();
  }, [travelId]);

  const loadTravel = async () => {
    try {
      const stored = await AsyncStorage.getItem("travels");
      if (stored) {
        const travels = JSON.parse(stored) as Travel[];
        const found = travels.find((t) => t.id === travelId);
        if (found) {
          setTravel(found);
          setProgress(Math.floor(Math.random() * 30) + 50);
        }
      }
    } catch (error) {
      console.error("Error loading travel:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTravel();
    setRefreshing(false);
  };

  if (!travel) {
    return (
      <ScreenContainer className="p-6 bg-background items-center justify-center">
        <Text className="text-foreground">Carregando...</Text>
      </ScreenContainer>
    );
  }

  const timeRemaining = "2h 45min";
  const currentKm = 520;
  const totalKm = 800;

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary text-base font-semibold">← Voltar</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground mt-4">Rastreamento em Tempo Real</Text>
          </View>

          {/* ETA Card */}
          <View className="bg-primary rounded-2xl p-6 gap-4">
            <Text className="text-white/80 text-sm">Chegada Estimada</Text>
            <Text className="text-4xl font-bold text-white">{travel.estimatedArrival}</Text>
            <View className="bg-white/20 rounded-lg px-4 py-2">
              <Text className="text-white text-sm text-center">Tempo restante: {timeRemaining}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-foreground font-semibold">Progresso da Viagem</Text>
              <Text className="text-muted text-sm">{progress}%</Text>
            </View>
            <View className="bg-surface rounded-full h-3 overflow-hidden border border-border">
              <View
                className="bg-primary h-full"
                style={{ width: `${progress}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted text-xs">{currentKm} km</Text>
              <Text className="text-muted text-xs">{totalKm} km</Text>
            </View>
          </View>

          {/* Travel Info */}
          <View className="bg-surface rounded-2xl p-6 gap-4 border border-border">
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Origem</Text>
                <Text className="text-foreground font-semibold">{travel.origin}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Destino</Text>
                <Text className="text-foreground font-semibold">{travel.destination}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Empresa</Text>
                <Text className="text-foreground font-semibold">{travel.company}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Passagem</Text>
                <Text className="text-foreground font-semibold text-xs">{travel.passageNumber}</Text>
              </View>
            </View>
          </View>

          {/* Traffic Alert */}
          <View className="bg-warning/10 rounded-lg p-4 border border-warning/30 gap-2">
            <Text className="text-warning font-semibold text-sm">⚠️ Alerta de Tráfego</Text>
            <Text className="text-warning/80 text-xs">
              Lentidão na BR-116 (Régis Bittencourt) km 400-420. Tempo adicional: ~15 min
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity className="bg-primary rounded-full px-6 py-4 items-center active:opacity-80">
              <Text className="text-white font-semibold">Ver Mapa de Tráfego</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface rounded-full px-6 py-4 items-center border border-border active:opacity-80">
              <Text className="text-foreground font-semibold">Detalhes da Viagem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
