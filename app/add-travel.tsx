import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function AddTravelScreen() {
  const router = useRouter();
  const [passageNumber, setPassageNumber] = useState("");
  const [company, setCompany] = useState("Nordeste Transportes");
  const [origin, setOrigin] = useState("Foz do Iguaçu - PR");
  const [destination, setDestination] = useState("São Paulo - SP");
  const [departureTime, setDepartureTime] = useState("14:15");
  const [estimatedArrival, setEstimatedArrival] = useState("08:35");
  const [date, setDate] = useState(new Date().toLocaleDateString("pt-BR"));

  const handleAddTravel = async () => {
    if (!passageNumber.trim()) {
      Alert.alert("Erro", "Por favor, insira o número da passagem");
      return;
    }

    try {
      const newTravel: Travel = {
        id: Date.now().toString(),
        passageNumber,
        company,
        origin,
        destination,
        departureTime,
        estimatedArrival,
        date,
        status: "active",
      };

      const stored = await AsyncStorage.getItem("travels");
      const travels = stored ? JSON.parse(stored) : [];
      travels.push(newTravel);
      await AsyncStorage.setItem("travels", JSON.stringify(travels));

      Alert.alert("Sucesso", "Viagem adicionada com sucesso!");
      router.push({
        pathname: "/tracking",
        params: { travelId: newTravel.id },
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar viagem");
      console.error(error);
    }
  };

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary text-base font-semibold">← Voltar</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground mt-4">Adicionar Viagem</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Passage Number */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Número da Passagem *</Text>
              <TextInput
                placeholder="Ex: SPPR0123001"
                placeholderTextColor="#687076"
                value={passageNumber}
                onChangeText={setPassageNumber}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Company */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Empresa</Text>
              <TextInput
                placeholder="Ex: Nordeste Transportes"
                placeholderTextColor="#687076"
                value={company}
                onChangeText={setCompany}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Origin */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Origem</Text>
              <TextInput
                placeholder="Ex: Foz do Iguaçu - PR"
                placeholderTextColor="#687076"
                value={origin}
                onChangeText={setOrigin}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Destination */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Destino</Text>
              <TextInput
                placeholder="Ex: São Paulo - SP"
                placeholderTextColor="#687076"
                value={destination}
                onChangeText={setDestination}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Departure Time */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Horário de Saída</Text>
              <TextInput
                placeholder="Ex: 14:15"
                placeholderTextColor="#687076"
                value={departureTime}
                onChangeText={setDepartureTime}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Estimated Arrival */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Chegada Estimada</Text>
              <TextInput
                placeholder="Ex: 08:35"
                placeholderTextColor="#687076"
                value={estimatedArrival}
                onChangeText={setEstimatedArrival}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Date */}
            <View className="gap-2">
              <Text className="text-foreground font-semibold">Data</Text>
              <TextInput
                placeholder="Ex: 01/03/2026"
                placeholderTextColor="#687076"
                value={date}
                onChangeText={setDate}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleAddTravel}
            className="bg-primary rounded-full px-6 py-4 items-center active:opacity-80 mt-4"
          >
            <Text className="text-white font-semibold text-base">Adicionar Viagem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
