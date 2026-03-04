import { ScrollView, Text, View, Pressable, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Trip } from "@/lib/types";
import { TripService } from "@/lib/trip-service";
import * as Haptics from "expo-haptics";

/**
 * Home Screen - MVP Evoluído
 * Exibe viagens ativas e recentes
 */
export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const active = await TripService.getActiveTrips();
      const recent = await TripService.getRecentTrips(5);
      setActiveTrips(active);
      setRecentTrips(recent.filter((t) => t.status !== "in_progress"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/add-travel");
  };

  const handleTripPress = (tripId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/tracking");
  };

  const TripCard = ({ trip, isActive }: { trip: Trip; isActive: boolean }) => (
    <Pressable
      onPress={() => handleTripPress(trip.id)}
      className="mb-3 rounded-lg border border-border bg-surface p-4 active:opacity-80"
    >
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">{trip.origin}</Text>
          <Text className="text-sm text-muted">→ {trip.destination}</Text>
        </View>
        <View
          className="rounded-full px-3 py-1"
          style={{
            backgroundColor: isActive ? colors.success : colors.warning,
          }}
        >
          <Text className="text-xs font-semibold text-white">
            {isActive ? "EM ANDAMENTO" : trip.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="mb-2 gap-1">
        <Text className="text-xs text-muted">🚌 {trip.busCompany}</Text>
        <Text className="text-xs text-muted">🎫 {trip.tripNumber}</Text>
        <Text className="text-xs text-muted">
          ⏰ {new Date(trip.departureTime).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-primary">Ver rastreamento →</Text>
        {isActive && <Text className="text-xs text-success">● Ao vivo</Text>}
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTrips} />}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-4xl font-bold text-foreground">BusTracker</Text>
          <Text className="mt-1 text-sm text-muted">Rastreie suas viagens em tempo real</Text>
        </View>

        {/* Add Trip Button */}
        <Pressable
          onPress={handleAddTrip}
          className="mb-6 flex-row items-center justify-center rounded-lg bg-primary p-4 active:opacity-80"
        >
          <Text className="text-lg font-semibold text-white">+ Adicionar Viagem</Text>
        </Pressable>

        {/* Active Trips */}
        {activeTrips.length > 0 && (
          <View className="mb-6">
            <Text className="mb-3 text-lg font-bold text-foreground">Viagens Ativas</Text>
            {activeTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} isActive={true} />
            ))}
          </View>
        )}

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <View className="mb-6">
            <Text className="mb-3 text-lg font-bold text-foreground">Viagens Recentes</Text>
            {recentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} isActive={false} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {activeTrips.length === 0 && recentTrips.length === 0 && (
          <View className="flex-1 items-center justify-center rounded-lg bg-surface p-6">
            <Text className="text-center text-lg font-semibold text-foreground mb-2">
              Nenhuma viagem ainda
            </Text>
            <Text className="text-center text-sm text-muted mb-4">
              Clique em "Adicionar Viagem" para começar a rastrear
            </Text>
            <Pressable
              onPress={handleAddTrip}
              className="rounded-lg bg-primary px-6 py-3 active:opacity-80"
            >
              <Text className="font-semibold text-white">Adicionar Viagem</Text>
            </Pressable>
          </View>
        )}

        {/* Info Card */}
        <View className="mt-6 rounded-lg bg-primary/10 p-4">
          <Text className="font-semibold text-primary mb-2">💡 Dica</Text>
          <Text className="text-xs text-foreground">
            Compartilhe suas viagens com amigos e família usando o botão de compartilhamento na
            tela de rastreamento.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
