import { ScrollView, Text, View, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface SystemStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  latency: number; // ms
  uptime: number; // percentage
}

export default function SystemStatusScreen() {
  const router = useRouter();
  const colors = useColors();
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      name: "API Server",
      status: "operational",
      latency: 45,
      uptime: 99.99,
    },
    {
      name: "Database",
      status: "operational",
      latency: 12,
      uptime: 99.95,
    },
    {
      name: "WebSocket",
      status: "operational",
      latency: 8,
      uptime: 99.98,
    },
    {
      name: "Google Maps",
      status: "operational",
      latency: 120,
      uptime: 99.9,
    },
    {
      name: "Push Notifications",
      status: "operational",
      latency: 35,
      uptime: 99.85,
    },
    {
      name: "Traffic API",
      status: "operational",
      latency: 250,
      uptime: 99.5,
    },
  ]);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate fetching system status
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return colors.success;
      case "degraded":
        return colors.warning;
      case "down":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "operational":
        return "Operacional";
      case "degraded":
        return "Degradado";
      case "down":
        return "Inativo";
      default:
        return "Desconhecido";
    }
  };

  const overallStatus =
    systemStatus.every((s) => s.status === "operational") ? "operational" : "degraded";

  const StatusCard = ({ item }: { item: SystemStatus }) => (
    <View className="mb-3 rounded-lg border border-border bg-surface p-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-foreground">{item.name}</Text>
        <View
          className="rounded-full px-3 py-1"
          style={{
            backgroundColor: getStatusColor(item.status),
          }}
        >
          <Text className="text-xs font-semibold text-white">
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs text-muted">Latência</Text>
          <Text className="text-sm font-semibold text-foreground">{item.latency}ms</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-muted">Uptime</Text>
          <Text className="text-sm font-semibold text-foreground">{item.uptime}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Pressable onPress={() => router.back()} className="mb-4">
            <Text className="text-primary">← Voltar</Text>
          </Pressable>
          <Text className="text-3xl font-bold text-foreground">Status do Sistema</Text>
          <Text className="mt-1 text-sm text-muted">
            Monitoramento em tempo real de todos os serviços
          </Text>
        </View>

        {/* Overall Status */}
        <View className="mb-6 rounded-lg border-2 p-4" style={{ borderColor: getStatusColor(overallStatus) }}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-muted">Status Geral</Text>
              <Text className="mt-1 text-2xl font-bold text-foreground">
                {overallStatus === "operational" ? "✓ Tudo Operacional" : "⚠ Problemas Detectados"}
              </Text>
            </View>
            <View
              className="h-12 w-12 rounded-full"
              style={{
                backgroundColor: getStatusColor(overallStatus),
              }}
            />
          </View>
        </View>

        {/* Services */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-bold text-foreground">Serviços</Text>
          {systemStatus.map((item, index) => (
            <StatusCard key={index} item={item} />
          ))}
        </View>

        {/* Last Updated */}
        <View className="rounded-lg bg-surface p-4">
          <Text className="text-xs text-muted">
            Última atualização: {lastUpdated.toLocaleTimeString("pt-BR")}
          </Text>
          <Pressable className="mt-3 rounded-lg bg-primary py-2 px-4">
            <Text className="text-center font-semibold text-white">Atualizar Agora</Text>
          </Pressable>
        </View>

        {/* Info */}
        <View className="mt-6 rounded-lg bg-primary/10 p-4">
          <Text className="font-semibold text-primary mb-2">ℹ️ Informações</Text>
          <Text className="text-xs text-foreground">
            Todos os serviços são monitorados 24/7. Se você experienciar problemas, verifique
            este painel para mais informações.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
