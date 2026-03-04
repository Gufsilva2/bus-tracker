import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";

interface TrafficIncident {
  id: string;
  type: "accident" | "congestion" | "construction";
  location: string;
  km: number;
  severity: "low" | "medium" | "high";
  description: string;
  timestamp: string;
}

const mockIncidents: TrafficIncident[] = [
  {
    id: "1",
    type: "accident",
    location: "BR-116 - Cajati/SP",
    km: 500,
    severity: "high",
    description: "Tombamento de carreta com incêndio. Bloqueio total.",
    timestamp: "Há 2 horas",
  },
  {
    id: "2",
    type: "congestion",
    location: "BR-116 - Serra do Cafezal",
    km: 420,
    severity: "medium",
    description: "Lentidão devido ao fluxo intenso de veículos.",
    timestamp: "Há 30 min",
  },
  {
    id: "3",
    type: "construction",
    location: "BR-277 - Curitiba/PR",
    km: 150,
    severity: "low",
    description: "Obras de manutenção em andamento. Uma faixa liberada.",
    timestamp: "Hoje",
  },
  {
    id: "4",
    type: "congestion",
    location: "BR-116 - Registro/SP",
    km: 460,
    severity: "medium",
    description: "Trânsito intenso. Fluxo lento em ambas as direções.",
    timestamp: "Há 15 min",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-error/10 border-error/30";
    case "medium":
      return "bg-warning/10 border-warning/30";
    case "low":
      return "bg-success/10 border-success/30";
    default:
      return "bg-surface border-border";
  }
};

const getSeverityTextColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "text-error";
    case "medium":
      return "text-warning";
    case "low":
      return "text-success";
    default:
      return "text-foreground";
  }
};

const getIncidentIcon = (type: string) => {
  switch (type) {
    case "accident":
      return "🚨";
    case "congestion":
      return "🚗";
    case "construction":
      return "🚧";
    default:
      return "ℹ️";
  }
};

export default function TrafficMapScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "accident" | "congestion" | "construction">("all");

  const filteredIncidents = selectedFilter === "all" 
    ? mockIncidents 
    : mockIncidents.filter((i) => i.type === selectedFilter);

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary text-base font-semibold">← Voltar</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground mt-4">Mapa de Tráfego</Text>
            <Text className="text-sm text-muted">BR-116 e BR-277</Text>
          </View>

          {/* Filter Buttons */}
          <View className="gap-2">
            <Text className="text-foreground font-semibold text-sm">Filtrar por:</Text>
            <View className="flex-row gap-2 flex-wrap">
              <TouchableOpacity
                onPress={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-full ${
                  selectedFilter === "all" ? "bg-primary" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    selectedFilter === "all" ? "text-white" : "text-foreground"
                  }`}
                >
                  Todos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedFilter("accident")}
                className={`px-4 py-2 rounded-full ${
                  selectedFilter === "accident" ? "bg-error" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    selectedFilter === "accident" ? "text-white" : "text-foreground"
                  }`}
                >
                  Acidentes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedFilter("congestion")}
                className={`px-4 py-2 rounded-full ${
                  selectedFilter === "congestion" ? "bg-warning" : "bg-surface border border-border"
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    selectedFilter === "congestion" ? "text-white" : "text-foreground"
                  }`}
                >
                  Congestionamento
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Incidents List */}
          <View className="gap-3">
            <Text className="text-foreground font-semibold">
              {filteredIncidents.length} incidente{filteredIncidents.length !== 1 ? "s" : ""}
            </Text>
            {filteredIncidents.map((incident) => (
              <View
                key={incident.id}
                className={`rounded-lg p-4 border ${getSeverityColor(incident.severity)}`}
              >
                <View className="gap-2">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 gap-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-lg">{getIncidentIcon(incident.type)}</Text>
                        <Text className="text-foreground font-semibold flex-1">{incident.location}</Text>
                      </View>
                      <Text className="text-muted text-xs">km {incident.km}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded ${getSeverityColor(incident.severity)}`}>
                      <Text className={`text-xs font-semibold ${getSeverityTextColor(incident.severity)}`}>
                        {incident.severity === "high"
                          ? "Alto"
                          : incident.severity === "medium"
                          ? "Médio"
                          : "Baixo"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-foreground text-sm leading-relaxed">{incident.description}</Text>
                  <Text className="text-muted text-xs">{incident.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary/30 gap-2">
            <Text className="text-primary font-semibold text-sm">ℹ️ Informação</Text>
            <Text className="text-primary/80 text-xs">
              Dados atualizados em tempo real da Arteris (BR-116) e DER/PR (BR-277). Atualizações a cada 5 minutos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
