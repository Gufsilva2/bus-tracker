# BusTracker Real-Time - Design de Interface Móvel

## Visão Geral

O **BusTracker Real-Time** é um aplicativo de rastreamento de ônibus em tempo real que permite aos passageiros acompanhar sua viagem, visualizar a localização estimada do veículo, tempo de chegada (ETA) atualizado dinamicamente e condições das rodovias em tempo real.

O aplicativo é otimizado para **orientação retrato (9:16)** e **uso com uma mão**, seguindo os padrões de design do iOS (Human Interface Guidelines).

---

## Lista de Telas

| Tela | Propósito | Dados Principais |
|------|----------|-----------------|
| **Home** | Entrada principal; exibir viagem ativa ou opção de adicionar nova | Número da passagem, status da viagem |
| **Rastreamento em Tempo Real** | Visualizar localização estimada do ônibus, ETA e progresso | Localização (km), ETA, velocidade média, tempo restante |
| **Mapa de Tráfego** | Exibir condições das rodovias (BR-116, BR-277) | Incidentes, congestionamentos, velocidade média por trecho |
| **Detalhes da Viagem** | Informações completas: origem, destino, paradas, histórico | Passagem, empresa, assentos, preço, horários |
| **Configurações** | Preferências do usuário e notificações | Notificações, tema, idioma |

---

## Fluxos Principais de Usuário

### Fluxo 1: Adicionar e Rastrear uma Viagem
1. Usuário abre o app na tela **Home**
2. Clica em "Adicionar Viagem" ou escaneia código QR da passagem
3. App valida a passagem (número, data, empresa)
4. Usuário é levado para **Rastreamento em Tempo Real**
5. Visualiza localização estimada, ETA e progresso em tempo real
6. Pode alternar para **Mapa de Tráfego** para ver condições das rodovias

### Fluxo 2: Monitorar Condições de Tráfego
1. Usuário abre **Mapa de Tráfego**
2. Visualiza incidentes na BR-116 e BR-277
3. Recebe alertas sobre bloqueios ou atrasos significativos
4. Volta para **Rastreamento** para ver impacto na ETA

### Fluxo 3: Consultar Detalhes da Viagem
1. Usuário clica em "Detalhes" na tela de **Rastreamento**
2. Visualiza informações completas: passagem, empresa, assentos, preço
3. Pode compartilhar informações ou exportar dados

---

## Conteúdo e Funcionalidade por Tela

### Tela Home
**Conteúdo Principal:**
- Cartão com viagem ativa (se houver)
- Botão "Adicionar Viagem" ou "Escanear Passagem"
- Histórico de viagens recentes (últimas 3)

**Funcionalidade:**
- Validação de passagem (número, data, empresa)
- Armazenamento local de viagens
- Acesso rápido à viagem ativa

### Tela Rastreamento em Tempo Real
**Conteúdo Principal:**
- Indicador de localização (km atual / km total)
- Barra de progresso visual
- ETA em destaque (hora de chegada estimada)
- Velocidade média e tempo restante
- Botão para alternar para Mapa de Tráfego
- Botão para Detalhes da Viagem

**Funcionalidade:**
- Atualização a cada 5 minutos (ou quando há mudança significativa)
- Cálculo de ETA baseado no ETACalculator
- Alertas de atrasos > 30 minutos
- Notificação quando falta 1 hora para chegada

### Tela Mapa de Tráfego
**Conteúdo Principal:**
- Mapa visual das rodovias (BR-116, BR-277)
- Marcadores de incidentes (acidentes, bloqueios, obras)
- Legenda de cores (verde = fluxo normal, amarelo = lentidão, vermelho = bloqueio)
- Informações de velocidade média por trecho

**Funcionalidade:**
- Atualização em tempo real de incidentes
- Filtro por tipo de incidente
- Zoom e pan no mapa
- Botão de compartilhamento de alertas

### Tela Detalhes da Viagem
**Conteúdo Principal:**
- Informações da passagem (número, data, empresa)
- Origem e destino
- Assentos e classe de serviço
- Preço pago
- Horários (saída, chegada prevista, chegada real)
- Histórico de atualizações de ETA

**Funcionalidade:**
- Copiar número da passagem
- Compartilhar detalhes via WhatsApp/SMS
- Exportar em PDF
- Histórico de atualizações

### Tela Configurações
**Conteúdo Principal:**
- Toggle de notificações
- Seleção de tema (claro/escuro)
- Preferências de atualização (a cada 5/10/15 min)
- Sobre o app

**Funcionalidade:**
- Salvar preferências localmente
- Limpar histórico de viagens
- Feedback e suporte

---

## Paleta de Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Primária** | `#0a7ea4` (Azul) | Botões principais, destaques |
| **Fundo** | `#ffffff` (Branco) / `#151718` (Preto) | Fundo de telas |
| **Superfície** | `#f5f5f5` (Cinza claro) / `#1e2022` (Cinza escuro) | Cards, superfícies elevadas |
| **Texto Principal** | `#11181C` (Preto) / `#ECEDEE` (Branco) | Títulos e texto |
| **Texto Secundário** | `#687076` (Cinza) / `#9BA1A6` (Cinza claro) | Subtítulos |
| **Sucesso** | `#22C55E` (Verde) | Status OK, viagem no horário |
| **Aviso** | `#F59E0B` (Laranja) | Atrasos pequenos, alertas |
| **Erro** | `#EF4444` (Vermelho) | Bloqueios, atrasos > 1h |
| **Borda** | `#E5E7EB` (Cinza) / `#334155` (Cinza escuro) | Divisores |

---

## Componentes Reutilizáveis

1. **TravelCard** - Exibe informações resumidas de uma viagem
2. **ProgressBar** - Barra de progresso visual da viagem
3. **ETABadge** - Exibe ETA em destaque com cor de status
4. **TrafficAlert** - Alerta de incidente de tráfego
5. **BottomSheet** - Menu de ações (compartilhar, exportar, etc.)
6. **LoadingSpinner** - Indicador de carregamento

---

## Padrões de Interação

### Atualizações em Tempo Real
- Dados são atualizados a cada 5 minutos por padrão
- Usuário pode forçar atualização com "pull-to-refresh"
- Animação suave ao atualizar valores

### Notificações
- Alerta quando há atraso > 30 minutos
- Lembrete quando falta 1 hora para chegada
- Notificação de chegada ao terminal

### Feedback Tátil
- Vibração leve ao clicar em botões principais
- Vibração média ao receber alerta importante
- Sem vibração em cliques secundários

---

## Considerações de Usabilidade

- **Tamanho de toque:** Todos os botões têm mínimo 44x44 pt
- **Contraste:** Razão de contraste ≥ 4.5:1 para texto
- **Tipografia:** Fonte padrão do sistema (SF Pro Display no iOS)
- **Espaçamento:** Padding consistente de 16pt entre elementos
- **Segurança:** Número de passagem mascarado em compartilhamentos
