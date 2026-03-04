import { ScrollView, Text, View, TouchableOpacity, Share, Alert } from "react-native";
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

export default function TripDetailsScreen() {
  const router = useRouter();
  const { travelId } = useLocalSearchParams();
  const [travel, setTravel] = useState<Travel | null>(null);

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
        }
      }
    } catch (error) {
      console.error("Error loading travel:", error);
    }
  };

  const handleShare = async () => {
    if (!travel) return;
    try {
      await Share.share({
        message: `Viagem: ${travel.origin} → ${travel.destination}\nData: ${travel.date}\nSaída: ${travel.departureTime}\nChegada: ${travel.estimatedArrival}\nEmpresa: ${travel.company}`,
        title: "Detalhes da Viagem",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleCopyPassage = () => {
    if (!travel) return;
    // In a real app, you would use react-native-clipboard
    Alert.alert("Sucesso", `Número da passagem copiado: ${travel.passageNumber}`);
  };

  if (!travel) {
    return (
      <ScreenContainer className="p-6 bg-background items-center justify-center">
        <Text className="text-foreground">Carregando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary text-base font-semibold">← Voltar</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground mt-4">Detalhes da Viagem</Text>
          </View>

          {/* Main Info Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-muted text-sm">De</Text>
                  <Text className="text-foreground font-semibold text-lg">{travel.origin}</Text>
                </View>
                <Text className="text-2xl">→</Text>
                <View className="items-end">
                  <Text className="text-muted text-sm">Para</Text>
                  <Text className="text-foreground font-semibold text-lg">{travel.destination}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Schedule Info */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <Text className="text-foreground font-semibold">Horários</Text>
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Data da Viagem</Text>
                <Text className="text-foreground font-semibold">{travel.date}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Horário de Saída</Text>
                <Text className="text-foreground font-semibold">{travel.departureTime}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Chegada Estimada</Text>
                <Text className="text-foreground font-semibold">{travel.estimatedArrival}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Duração Estimada</Text>
                <Text className="text-foreground font-semibold">~16h 20min</Text>
              </View>
            </View>
          </View>

          {/* Booking Info */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <Text className="text-foreground font-semibold">Informações da Passagem</Text>
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Empresa</Text>
                <Text className="text-foreground font-semibold">{travel.company}</Text>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between items-center">
                <Text className="text-muted text-sm">Número da Passagem</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-foreground font-semibold text-xs">{travel.passageNumber}</Text>
                  <TouchableOpacity onPress={handleCopyPassage}>
                    <Text className="text-primary text-sm font-semibold">Copiar</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between">
                <Text className="text-muted text-sm">Status</Text>
                <View
                  className={`px-3 py-1 rounded-full ${
                    travel.status === "active" ? "bg-primary/20" : "bg-muted/20"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      travel.status === "active" ? "text-primary" : "text-muted"
                    }`}
                  >
                    {travel.status === "active" ? "Ativa" : "Concluída"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleShare}
              className="bg-primary rounded-full px-6 py-4 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">Compartilhar Detalhes</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface rounded-full px-6 py-4 items-center border border-border active:opacity-80">
              <Text className="text-foreground font-semibold">Exportar em PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary/30 gap-2">
            <Text className="text-primary font-semibold text-sm">ℹ️ Dica</Text>
            <Text className="text-primary/80 text-xs">
              Guarde o número da sua passagem. Você pode precisar dele para embarque ou em caso de dúvidas com a empresa.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
