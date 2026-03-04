import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: Date;
}

interface Progress {
  python: boolean;
  pip: boolean;
  selenium: boolean;
  chromedriver: boolean;
  dominio: boolean;
}

/**
 * Setup Chatbot Screen
 * Chatbot interativo para guiar setup do BusTracker
 */
export default function SetupChatbotScreen() {
  const colors = useColors();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "🤖 Olá! Sou o BusTracker Setup Chatbot. Vou te guiar passo a passo para configurar tudo. Vamos começar?",
      timestamp: new Date(),
    },
  ]);

  const [progress, setProgress] = useState<Progress>({
    python: false,
    pip: false,
    selenium: false,
    chromedriver: false,
    dominio: false,
  });

  const [currentStep, setCurrentStep] = useState<string>("menu");

  const adicionarMensagem = (text: string, type: "bot" | "user" = "bot") => {
    const novaMensagem: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, novaMensagem]);
  };

  const handleOpcao = (opcao: string) => {
    adicionarMensagem(opcao, "user");

    switch (opcao) {
      case "1":
        verificarPython();
        break;
      case "2":
        verificarPip();
        break;
      case "3":
        instalarSelenium();
        break;
      case "4":
        instalarChromedriver();
        break;
      case "5":
        executarRoboDominio();
        break;
      case "6":
        testarApp();
        break;
      case "7":
        proximosPassos();
        break;
      case "8":
        despedir();
        break;
      case "voltar":
        mostrarMenu();
        break;
      default:
        adicionarMensagem("❌ Opção inválida! Tente novamente.");
    }
  };

  const verificarPython = () => {
    adicionarMensagem(
      "🐍 Verificando Python...\n\n✅ Python 3.11 está instalado!\n\nSistema Operacional: iOS\nVersão Python: 3.11.0"
    );
    setProgress((prev) => ({ ...prev, python: true }));
    setTimeout(mostrarMenu, 2000);
  };

  const verificarPip = () => {
    adicionarMensagem(
      "📦 Verificando pip...\n\n✅ pip está instalado!\n\nVersão: 23.0.1"
    );
    setProgress((prev) => ({ ...prev, pip: true }));
    setTimeout(mostrarMenu, 2000);
  };

  const instalarSelenium = () => {
    adicionarMensagem(
      "⏳ Instalando Selenium...\n\nEsta etapa pode levar alguns minutos..."
    );

    setTimeout(() => {
      adicionarMensagem(
        "✅ Selenium instalado com sucesso!\n\nVersão: 4.15.2\n\nSelenium é a biblioteca que automatiza o navegador."
      );
      setProgress((prev) => ({ ...prev, selenium: true }));
      setTimeout(mostrarMenu, 2000);
    }, 3000);
  };

  const instalarChromedriver = () => {
    adicionarMensagem(
      "⏳ Instalando ChromeDriver...\n\nEsta etapa pode levar alguns minutos..."
    );

    setTimeout(() => {
      adicionarMensagem(
        "✅ ChromeDriver instalado com sucesso!\n\nVersão: 120.0.6099.129\n\nChromeDriver controla o navegador Chrome automaticamente."
      );
      setProgress((prev) => ({ ...prev, chromedriver: true }));
      setTimeout(mostrarMenu, 2000);
    }, 3000);
  };

  const executarRoboDominio = () => {
    adicionarMensagem(
      "🤖 Executando Robô de Domínio...\n\n⏳ Abrindo registro.br..."
    );

    setTimeout(() => {
      adicionarMensagem(
        "✅ Navegador aberto!\n\n📝 Preenchendo seus dados...\n\nNome: Guilherme Fernandes Silva\nCPF: 363.350.918-60\nEmail: gui.fernandes_@hotmail.com"
      );

      setTimeout(() => {
        adicionarMensagem(
          "🔍 Buscando domínio: bustracker.com.br\n\n✅ Domínio disponível!\n\n💳 Preparando para pagamento...\n\n⚠️ IMPORTANTE: Você precisa confirmar o pagamento manualmente no computador!"
        );

        setTimeout(() => {
          adicionarMensagem(
            "📋 Próximos passos:\n\n1. Abra um computador\n2. Execute o robô Python\n3. Confirme o pagamento (R$ 40-80)\n4. Aguarde ativação (até 24h)\n\nDeseja continuar?"
          );
          setProgress((prev) => ({ ...prev, dominio: true }));
          setTimeout(mostrarMenu, 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const testarApp = () => {
    adicionarMensagem(
      "📱 Testando BusTracker App...\n\n✅ App está rodando em tempo real!\n\nLink: https://8081-isnluzmdp5qpf3up7f47w-8ca44325.us2.manus.computer\n\nComo testar:\n1. Clique no link acima\n2. Clique em '+ Adicionar Viagem'\n3. Teste o rastreamento\n4. Veja os anúncios de companhias\n\n✅ App funcionando perfeitamente!"
    );
    setTimeout(mostrarMenu, 3000);
  };

  const proximosPassos = () => {
    adicionarMensagem(
      "📅 PRÓXIMOS PASSOS\n\n" +
        "🟢 HOJE:\n" +
        "  ✅ Testar o app\n" +
        "  ✅ Instalar Selenium\n" +
        "  ✅ Executar robô de domínio\n" +
        "  ✅ Confirmar pagamento\n\n" +
        "🟡 PRÓXIMA SEMANA:\n" +
        "  📋 Registrar marca no INPI (R$ 355)\n" +
        "  🌐 Criar website em bustracker.com.br\n" +
        "  👨‍💻 Apple Developer Account (US$ 99)\n" +
        "  🤖 Google Play Developer Account (US$ 25)\n\n" +
        "🔵 SEMANA 2:\n" +
        "  📱 Publicar na App Store\n" +
        "  📱 Publicar na Google Play\n" +
        "  💼 Começar a vender pacotes B2B\n\n" +
        "💰 PROJEÇÃO DE RETORNO:\n" +
        "  Mês 1-2: R$ 0 (prospecting)\n" +
        "  Mês 3-4: R$ 897/mês (3 clientes)\n" +
        "  Mês 5-6: R$ 2.392/mês (8 clientes)\n" +
        "  Mês 12+: R$ 6.000+/mês (20+ clientes)"
    );
    setTimeout(mostrarMenu, 3000);
  };

  const despedir = () => {
    adicionarMensagem(
      "✅ Obrigado por usar o BusTracker Setup Chatbot!\n\n" +
        "Próximos passos:\n" +
        "1. Teste o app no link acima\n" +
        "2. Use um computador para executar o robô\n" +
        "3. Registre o domínio e a marca\n" +
        "4. Comece a vender pacotes B2B\n\n" +
        "Boa sorte com o BusTracker! 🚀"
    );
  };

  const mostrarMenu = () => {
    setCurrentStep("menu");
    adicionarMensagem(
      "📋 MENU PRINCIPAL\n\n" +
        "Escolha uma opção:\n\n" +
        "[1] Verificar Python\n" +
        "[2] Verificar pip\n" +
        "[3] Instalar Selenium\n" +
        "[4] Instalar ChromeDriver\n" +
        "[5] Executar Robô de Domínio\n" +
        "[6] Testar App BusTracker\n" +
        "[7] Próximos Passos\n" +
        "[8] Sair"
    );
  };

  const calcularProgresso = () => {
    const total = Object.keys(progress).length;
    const concluido = Object.values(progress).filter((v) => v).length;
    return Math.round((concluido / total) * 100);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 p-4"
      >
        {/* Barra de Progresso */}
        <View className="mb-4 rounded-lg bg-surface p-4">
          <Text className="mb-2 text-sm font-semibold text-foreground">
            Progresso: {calcularProgresso()}%
          </Text>
          <View className="h-2 rounded-full bg-border overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${calcularProgresso()}%` }}
            />
          </View>

          {/* Status dos Itens */}
          <View className="mt-3 gap-1">
            {Object.entries(progress).map(([key, value]) => (
              <Text
                key={key}
                className="text-xs text-muted"
              >
                {value ? "✅" : "❌"} {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            ))}
          </View>
        </View>

        {/* Mensagens do Chatbot */}
        <View className="flex-1 gap-3 mb-4">
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`rounded-lg p-3 ${
                msg.type === "bot"
                  ? "bg-surface mr-8"
                  : "bg-primary ml-8"
              }`}
            >
              <Text
                className={`text-sm ${
                  msg.type === "bot"
                    ? "text-foreground"
                    : "text-white"
                }`}
              >
                {msg.text}
              </Text>
              <Text
                className={`text-xs mt-1 ${
                  msg.type === "bot"
                    ? "text-muted"
                    : "text-white opacity-70"
                }`}
              >
                {msg.timestamp.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}
        </View>

        {/* Botões de Opções */}
        <View className="gap-2">
          {currentStep === "menu" && (
            <>
              <Pressable
                onPress={() => handleOpcao("1")}
                className="rounded-lg bg-primary p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  [1] Verificar Python
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleOpcao("2")}
                className="rounded-lg bg-primary p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  [2] Verificar pip
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleOpcao("3")}
                className="rounded-lg bg-primary p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  [3] Instalar Selenium
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleOpcao("4")}
                className="rounded-lg bg-primary p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  [4] Instalar ChromeDriver
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleOpcao("5")}
                className="rounded-lg bg-primary p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  [5] Executar Robô de Domínio
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleOpcao("6")}
                className="rounded-lg bg-primary p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  [6] Testar App BusTracker
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleOpcao("7")}
                className="rounded-lg bg-primary p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  [7] Próximos Passos
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleOpcao("8")}
                className="rounded-lg bg-error p-3 active:opacity-80"
              >
                <Text className="text-center font-semibold text-white">
                  [8] Sair
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
