import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  package: "iniciante" | "profissional" | "premium";
  status: "ativo" | "pendente" | "bloqueado";
  agreementSigned: boolean;
}

/**
 * Company Portal Screen
 * Portal seguro para empresas de ônibus anunciarem
 * Com proteção contra roubo de ideia
 */
export default function CompanyPortalScreen() {
  const colors = useColors();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "iniciante" as const,
  });

  const handleAddCompany = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    // Verificar se empresa já existe
    if (companies.some((c) => c.email === formData.email)) {
      Alert.alert("Erro", "Esta empresa já está registrada");
      return;
    }

    const newCompany: Company = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      package: formData.package,
      status: "pendente",
      agreementSigned: false,
    };

    setCompanies((prev) => [...prev, newCompany]);
    setFormData({ name: "", email: "", phone: "", package: "iniciante" });
    setShowForm(false);

    Alert.alert(
      "Sucesso",
      "Empresa registrada! Aguardando assinatura do contrato."
    );
  };

  const handleSignAgreement = (companyId: string) => {
    Alert.alert(
      "Contrato de Proteção",
      "A empresa concorda em:\n\n" +
        "✅ NÃO copiar o código-fonte\n" +
        "✅ NÃO roubar a ideia\n" +
        "✅ NÃO divulgar funcionalidades\n" +
        "✅ APENAS anunciar seus serviços\n\n" +
        "Violação resulta em:\n" +
        "❌ Bloqueio imediato\n" +
        "❌ Ação legal\n" +
        "❌ Multa de R$ 10.000+\n\n" +
        "Você concorda?",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Concordo",
          onPress: () => {
            setCompanies((prev) =>
              prev.map((c) =>
                c.id === companyId
                  ? { ...c, agreementSigned: true, status: "ativo" }
                  : c
              )
            );
            Alert.alert("Sucesso", "Contrato assinado! Anúncios ativos.");
          },
        },
      ]
    );
  };

  const handleBlockCompany = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, status: "bloqueado" } : c
      )
    );
    Alert.alert("Bloqueado", "Empresa bloqueada por violação de contrato");
  };

  const getPackagePrice = (pkg: string) => {
    switch (pkg) {
      case "iniciante":
        return "R$ 299/mês";
      case "profissional":
        return "R$ 799/mês";
      case "premium":
        return "R$ 1.999/mês";
      default:
        return "N/A";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return colors.success;
      case "pendente":
        return colors.warning;
      case "bloqueado":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">
            Portal de Empresas
          </Text>
          <Text className="text-sm text-muted mt-2">
            Gerenciar anúncios de companhias rodoviárias
          </Text>
        </View>

        {/* Stats */}
        <View className="mb-6 grid grid-cols-3 gap-3">
          <View className="rounded-lg bg-surface p-3">
            <Text className="text-2xl font-bold text-primary">
              {companies.length}
            </Text>
            <Text className="text-xs text-muted">Empresas</Text>
          </View>
          <View className="rounded-lg bg-surface p-3">
            <Text className="text-2xl font-bold text-success">
              {companies.filter((c) => c.status === "ativo").length}
            </Text>
            <Text className="text-xs text-muted">Ativas</Text>
          </View>
          <View className="rounded-lg bg-surface p-3">
            <Text className="text-2xl font-bold text-warning">
              {companies.filter((c) => c.status === "pendente").length}
            </Text>
            <Text className="text-xs text-muted">Pendentes</Text>
          </View>
        </View>

        {/* Add Company Button */}
        {!showForm && (
          <Pressable
            onPress={() => setShowForm(true)}
            className="mb-6 rounded-lg bg-primary p-4 active:opacity-80"
          >
            <Text className="text-center font-semibold text-white">
              + Adicionar Empresa
            </Text>
          </Pressable>
        )}

        {/* Add Company Form */}
        {showForm && (
          <View className="mb-6 rounded-lg border border-border bg-surface p-4">
            <Text className="mb-4 text-lg font-bold text-foreground">
              Registrar Empresa
            </Text>

            <TextInput
              placeholder="Nome da Empresa"
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              className="mb-3 rounded-lg border border-border bg-background p-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              className="mb-3 rounded-lg border border-border bg-background p-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <TextInput
              placeholder="Telefone"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              keyboardType="phone-pad"
              className="mb-3 rounded-lg border border-border bg-background p-3 text-foreground"
              placeholderTextColor={colors.muted}
            />

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-foreground">
                Pacote
              </Text>
              <View className="flex-row gap-2">
                {["iniciante", "profissional", "premium"].map((pkg) => (
                  <Pressable
                    key={pkg}
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        package: pkg as any,
                      }))
                    }
                    className={`flex-1 rounded-lg p-2 ${
                      formData.package === pkg
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                  >
                    <Text
                      className={`text-center text-xs font-semibold ${
                        formData.package === pkg
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      {pkg.charAt(0).toUpperCase() + pkg.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-border p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-foreground">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={handleAddCompany}
                className="flex-1 rounded-lg bg-primary p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  Registrar
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Companies List */}
        <View className="gap-3">
          {companies.length === 0 ? (
            <View className="rounded-lg bg-surface p-6">
              <Text className="text-center text-muted">
                Nenhuma empresa registrada ainda
              </Text>
            </View>
          ) : (
            companies.map((company) => (
              <View
                key={company.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                {/* Company Header */}
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground">
                      {company.name}
                    </Text>
                    <Text className="text-xs text-muted">{company.email}</Text>
                  </View>
                  <View
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: getStatusColor(company.status) }}
                  >
                    <Text className="text-xs font-semibold text-white">
                      {company.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Company Details */}
                <View className="mb-3 gap-1">
                  <Text className="text-xs text-muted">
                    📞 {company.phone}
                  </Text>
                  <Text className="text-xs text-muted">
                    💰 {getPackagePrice(company.package)}
                  </Text>
                  <Text className="text-xs text-muted">
                    📋 Contrato:{" "}
                    {company.agreementSigned ? "✅ Assinado" : "❌ Pendente"}
                  </Text>
                </View>

                {/* Actions */}
                <View className="flex-row gap-2">
                  {company.status === "pendente" && !company.agreementSigned && (
                    <Pressable
                      onPress={() => handleSignAgreement(company.id)}
                      className="flex-1 rounded-lg bg-success p-2 active:opacity-80"
                    >
                      <Text className="text-center text-xs font-semibold text-white">
                        Assinar Contrato
                      </Text>
                    </Pressable>
                  )}

                  {company.status === "ativo" && (
                    <Pressable
                      onPress={() => handleBlockCompany(company.id)}
                      className="flex-1 rounded-lg bg-error p-2 active:opacity-80"
                    >
                      <Text className="text-center text-xs font-semibold text-white">
                        Bloquear
                      </Text>
                    </Pressable>
                  )}

                  {company.status === "bloqueado" && (
                    <View className="flex-1 rounded-lg bg-error/20 p-2">
                      <Text className="text-center text-xs font-semibold text-error">
                        Bloqueado por Violação
                      </Text>
                    </View>
                  )}
                </View>

                {/* Protection Notice */}
                {company.agreementSigned && (
                  <View className="mt-3 rounded-lg bg-primary/10 p-2">
                    <Text className="text-xs text-primary">
                      🔒 Protegido por contrato de confidencialidade
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Protection Info */}
        <View className="mt-6 rounded-lg bg-primary/10 p-4">
          <Text className="mb-2 font-bold text-primary">🛡️ Proteção</Text>
          <Text className="text-xs text-foreground">
            Todas as empresas devem assinar contrato de confidencialidade antes
            de ativar anúncios. Violação resulta em bloqueio imediato e ação
            legal.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
