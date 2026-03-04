# BusTracker Real-Time - TODO

## ✅ Melhorias Implementadas (v2.0.0)

### Tier 1: Crítico
- [x] Implementar backend tRPC completo com 20+ procedures
- [x] Expandir schema do banco de dados (10 tabelas)
- [x] Criar database helpers para todas as operações
- [x] Implementar validação com Zod

### Tier 2: Alto
- [x] Implementar autenticação admin completa
- [x] Criar hooks de proteção de rotas
- [x] Implementar sistema de notificações push
- [x] Criar validação de entrada robusta

### Tier 3: Médio
- [x] Implementar página System Status
- [x] Criar skeleton loaders para loading states
- [x] Implementar error boundary e error display
- [x] Criar constantes de validação### Quick Wins ✅
- [x] Implementar System Status Page
- [x] Adicionar validação de entrada
- [x] Implementar loading states melhorados
- [x] Adicionar error handling robusto

### Admin Setup ✅
- [x] Criar usuário admin único (gui.fernandes_@hotmail.com)
- [x] Desabilitar criação pública de admins
- [x] Implementar proteção de rotas admin
- [x] Adicionar logging de ações admin
- [x] Implementar verificação de email
- [x] Criar script de setup de admin

---

## Funcionalidades Principais

- [x] Tela Home com opção de adicionar viagem
- [x] Tela Rastreamento em Tempo Real com ETA dinâmico
- [x] Tela Mapa de Tráfego com incidentes da BR-116/BR-277
- [x] Tela Detalhes da Viagem com informações completas
- [x] Tela Configurações com preferências do usuário (backend pronto)
- [x] Integração do script ETACalculator para cálculo de ETA
- [x] Armazenamento local de viagens com AsyncStorage
- [x] Sistema de notificações (atrasos, lembretes, chegada)
- [x] Pull-to-refresh para atualizar dados
- [x] Compartilhamento de informações da viagem
- [ ] Exportação de dados em PDF
- [x] Validação robusta com Zod (número, data, empresa)
- [x] Histórico de viagens recentes (database pronto)
- [ ] Tema claro/escuro (constantes criadas)
- [x] Feedback tátil (haptics) (já implementado)

## Integração com APIs/Dados

- [x] Integração com dados de tráfego da Arteris (BR-116)
- [x] Integração com dados de tráfego da BR-277
- [x] Rastreamento de localização estimada baseado em telemetria
- [ ] Sincronização com servidor backend em tempo real (WebSocket - próxima fase)
- [x] Notificações push (Expo Notifications - implementado)

## Design e UX

- [x] Logo customizado do app
- [ ] Ícones para tab bar
- [x] Splash screen
- [x] Paleta de cores definida
- [x] Componentes reutilizáveis (TravelCard, ProgressBar, ETABadge, etc.)
- [x] Skeleton loaders para feedback visual
- [x] Error boundaries para tratamento de erros
- [ ] Animações suaves (próxima fase)
- [x] Feedback visual em interações

## Testes

- [x] Testes unitários do ETACalculator
- [x] Testes de integração com dados de tráfego
- [x] Testes de persistência de dados
- [ ] Testes de UI (navegação entre telas) - próxima fase
- [ ] Testes em dispositivos iOS e Android - próxima fase
- [ ] Testes E2E - próxima fase

## Bugs Conhecidos

(Nenhum no momento)

## Notas

- App otimizado para orientação retrato (9:16)
- Segue padrões de design iOS (HIG)
- Uso com uma mão como prioridade
- Dados atualizados a cada 5 minutos por padrão
- Backend pronto para WebSocket em tempo real
- Validação robusta em todas as entradas
- Error handling em todos os fluxos críticos
- Autenticação admin implementada
- Notificações push funcionais


## Monetização com Publicidade

- [ ] Integração com Google AdMob
- [ ] Banners de publicidade nas telas principais
- [ ] Anúncios intersticiais (entre telas)
- [ ] Anúncios recompensados (opcional)
- [ ] Configuração de ID de publicador AdMob
- [ ] Testes de publicidade em sandbox

## Propriedade Intelectual e Proteção

- [ ] Registrar marca "BusTracker" (INPI - Brasil)
- [ ] Registrar domínio bustracker.com.br (ou similar)
- [ ] Documentação de copyright e licença
- [ ] Termos de Serviço (ToS)
- [ ] Política de Privacidade (LGPD compliant)
- [ ] Contrato de Publicidade

## Publicação em App Stores

- [ ] Configurar Apple Developer Account
- [ ] Configurar Google Play Developer Account
- [ ] Preparar screenshots e descrição da app
- [ ] Certificados e assinaturas digitais
- [ ] Submissão para Apple App Store
- [ ] Submissão para Google Play Store
- [ ] Testes em dispositivos reais (iOS e Android)


## Publicidade B2B - Companhias Rodoviárias

- [x] Criar sistema de pacotes publicitários para transportadoras
- [ ] Tela de gerenciamento de anúncios de companhias
- [x] Modelo de preços por impressões (CPM) e cliques (CPC)
- [ ] Dashboard para empresas de ônibus acompanharem performance
- [ ] Integração com sistema de pagamento (Stripe/PagSeguro)
- [x] Anúncios contextuais baseados em rota do usuário
- [x] Relatórios de ROI para clientes B2B


## MVP Evoluído - Novas Funcionalidades

### Próximas Fases (Roadmap v2.1.0+)

#### Fase 3: WebSocket para Tempo Real ✅
- [x] Integração com Socket.io
- [x] Real-time location updates
- [x] Broadcast de alertas
- [x] Sincronização multi-cliente
- [x] Hook useWebSocket
- [x] Procedures tRPC para broadcast

#### Fase 4: Google Maps Integration ✅
- [x] Mapa interativo
- [x] Polylines de rota
- [x] Marcadores de paradas
- [x] Marcador do onibus em tempo real
- [x] Auto-zoom para rota
- [x] Animacao de movimento

#### Fase 5: Dashboard Admin Completo
- [ ] Gráficos de viagens por dia/semana
- [ ] Estatísticas de atrasos
- [ ] Mapa de frota em tempo real
- [ ] Gerenciamento de usuários
- [ ] Relatórios de performance

#### Fase 5: Compartilhamento Publico ✅
- [x] Sistema de links publicos para viagens
- [x] Gerador de QR Code
- [x] Tela publica de rastreamento (sem login)
- [x] Acesso publico com WebSocket
- [x] Expiracao de links
- [x] Revogacao de links
- [x] Contador de visualizacoes
- [x] Compartilhamento nativo

#### Fase 7: Modo Escuro
- [ ] Suporte a tema escuro
- [ ] Alternância de tema
- [ ] Preferências persistentes

#### Fase 8: Exportação de Dados
- [ ] Exportar detalhes da viagem em PDF
- [ ] Incluir recibo/comprovante
- [ ] Histórico de viagens

#### Fase 9: Testes Automatizados
- [ ] Testes unitários completos
- [ ] Testes de integração E2E
- [ ] Testes de performance
- [ ] Coverage > 80%

#### Fase 10: Otimização
- [ ] Code splitting
- [ ] Lazy loading de componentes
- [ ] Otimização de imagens
- [ ] Caching de dados
- [ ] Redução de bundle size
