import { ScrollView, Text, View, Pressable, TextInput, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { TripService } from "@/lib/trip-service";
import * as Haptics from "expo-haptics";

/**
 * Add Trip Screen - MVP Evoluído
 * Cadastro de nova viagem com validação
 */
export default function AddTripScreen() {
  const router = useRouter();
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    busCompany: "",
    tripNumber: "",
    departureTime: "",
  });

  const handleAddTrip = async () => {
    // Validação
    if (!formData.origin || !formData.destination || !formData.busCompany || !formData.tripNumber || !formData.departureTime) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      // Calcular tempo estimado de chegada (exemplo: 16 horas depois)
      const departureDate = new Date(formData.departureTime);
      const arrivalDate = new Date(departureDate.getTime() + 16 * 60 * 60 * 1000);

      const trip = await TripService.createTrip({
        origin: formData.origin,
        destination: formData.destination,
        busCompany: formData.busCompany,
        tripNumber: formData.tripNumber,
        departureTime: departureDate.toISOString(),
        estimatedArrivalTime: arrivalDate.toISOString(),
        status: "scheduled",
        passengers: [],
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Sucesso", "Viagem adicionada com sucesso!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a viagem");
    } finally {
      setLoading(false);
    }
  };

  const FormField = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
  }: {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: string;
  }) => (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-foreground">{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType as any}
        className="rounded-lg border border-border bg-background p-3 text-foreground"
        placeholderTextColor={colors.muted}
      />
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Pressable onPress={() => router.back()} className="mb-4 flex-row items-center">
            <Text className="text-lg text-primary">← Voltar</Text>
          </Pressable>
          <Text className="text-3xl font-bold text-foreground">Adicionar Viagem</Text>
          <Text className="mt-1 text-sm text-muted">Preencha os dados da sua viagem</Text>
        </View>

        {/* Form */}
        <View className="mb-6 rounded-lg bg-surface p-4">
          <FormField
            label="Origem"
            placeholder="Ex: Foz do Iguaçu"
            value={formData.origin}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, origin: text }))}
          />

          <FormField
            label="Destino"
            placeholder="Ex: São Paulo"
            value={formData.destination}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, destination: text }))}
          />

          <FormField
            label="Empresa de Ônibus"
            placeholder="Ex: Nordeste Transportes"
            value={formData.busCompany}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, busCompany: text }))}
          />

          <FormField
            label="Número da Viagem"
            placeholder="Ex: 7535"
            value={formData.tripNumber}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, tripNumber: text }))}
          />

          <FormField
            label="Horário de Saída"
            placeholder="Ex: 14:15"
            value={formData.departureTime}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, departureTime: text }))}
          />
        </View>

        {/* Info Card */}
        <View className="mb-6 rounded-lg bg-primary/10 p-4">
          <Text className="mb-2 font-semibold text-primary">ℹ️ Informações</Text>
          <Text className="text-xs text-foreground">
            Após adicionar a viagem, você poderá rastrear em tempo real, receber alertas e
            compartilhar com outras pessoas.
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 rounded-lg border border-border p-4 active:opacity-80"
          >
            <Text className="text-center font-semibold text-foreground">Cancelar</Text>
          </Pressable>

          <Pressable
            onPress={handleAddTrip}
            disabled={loading}
            className="flex-1 rounded-lg bg-primary p-4 active:opacity-80"
          >
            <Text className="text-center font-semibold text-white">
              {loading ? "Adicionando..." : "Adicionar Viagem"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
