# Guia Completo: Publicar BusTracker na Apple Store e Google Play

## 🍎 Apple App Store - Passo a Passo

### Passo 1: Criar Apple Developer Account

**Custo:** US$ 99/ano

1. Acesse [developer.apple.com](https://developer.apple.com)
2. Clique em "Account" → "Sign Up"
3. Faça login com Apple ID (crie um se não tiver)
4. Preencha informações pessoais
5. Aceite Apple Developer Agreement
6. Pague taxa anual com cartão de crédito

**Documentos necessários:**
- CPF ou CNPJ
- Endereço completo
- Telefone de contato

### Passo 2: Configurar Certificados e Provisioning

1. Abra Xcode
2. Vá em "Xcode" → "Preferences" → "Accounts"
3. Clique em "+" e adicione sua conta Apple Developer
4. Clique em "Manage Certificates"
5. Crie novo certificado iOS Distribution
6. Crie Provisioning Profile para App Store

**Arquivo necessário:**
- `app.config.ts` já está configurado com bundle ID correto

### Passo 3: Preparar Conteúdo do App

**Informações necessárias:**

| Campo | Exemplo | Limite |
|-------|---------|--------|
| **Nome do App** | BusTracker | 30 caracteres |
| **Subtitle** | Rastreie seu ônibus em tempo real | 30 caracteres |
| **Descrição** | Acompanhe viagens de ônibus com ETA preciso, alertas de tráfego e notificações em tempo real. | 4000 caracteres |
| **Palavras-chave** | ônibus, rastreamento, viagem, GPS, tráfego | Até 100 caracteres |
| **Categoria** | Travel ou Transportation | - |
| **Classificação** | 4+ anos | - |

**Screenshots (obrigatório):**
- Mínimo: 2 screenshots
- Máximo: 5 screenshots
- Tamanho: 1242x2208px (iPhone 12 Pro Max)
- Formato: PNG ou JPG
- Devem mostrar funcionalidades principais

**Ícone do App:**
- Tamanho: 1024x1024px
- Formato: PNG (sem transparência)
- Sem cantos arredondados (iOS adiciona automaticamente)

### Passo 4: Configurar Informações de Contato

- **Email de suporte:** seu-email@seu-dominio.com
- **Website:** https://bustracker.com.br (ou seu domínio)
- **Política de Privacidade:** URL obrigatória
- **Termos de Serviço:** URL obrigatória

### Passo 5: Configurar Publicidade

**Importante para apps com AdMob:**
1. Vá em "App Information" → "Advertising"
2. Marque "Serves ads"
3. Selecione tipos de anúncios (banner, interstitial, rewarded)
4. Aceite Apple Advertising Practices

### Passo 6: Build e Submissão

**Comando para build:**
```bash
cd /home/ubuntu/bustracker-app
eas build --platform ios --auto-submit
```

**Ou manualmente:**
1. Abra Xcode
2. Selecione "Product" → "Archive"
3. Clique em "Distribute App"
4. Selecione "App Store Connect"
5. Siga instruções de assinatura
6. Clique em "Upload"

**Tempo de revisão:** 24-48 horas

### Passo 7: Monitorar Submissão

1. Acesse [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Vá em "My Apps" → "BusTracker"
3. Verifique status em "Build" → "Activity"
4. Aguarde aprovação ou correções

---

## 🤖 Google Play Store - Passo a Passo

### Passo 1: Criar Google Play Developer Account

**Custo:** US$ 25 (pagamento único)

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Clique em "Create Account"
3. Faça login com Google Account
4. Preencha informações pessoais
5. Aceite Google Play Developer Agreement
6. Pague taxa única com cartão de crédito

**Documentos necessários:**
- CPF ou CNPJ
- Endereço completo
- Telefone de contato

### Passo 2: Criar Novo App

1. Clique em "Create app"
2. Preencha:
   - **App name:** BusTracker
   - **Default language:** Português (Brasil)
   - **App or game:** App
   - **Free or paid:** Free
3. Clique em "Create app"

### Passo 3: Preparar Conteúdo do App

**Informações necessárias:**

| Campo | Exemplo | Limite |
|-------|---------|--------|
| **Título** | BusTracker | 50 caracteres |
| **Descrição curta** | Rastreie seu ônibus em tempo real | 80 caracteres |
| **Descrição completa** | Acompanhe viagens de ônibus com ETA preciso, alertas de tráfego e notificações em tempo real. | 4000 caracteres |
| **Categoria** | Travel | - |
| **Classificação** | 3+ | - |

**Screenshots (obrigatório):**
- Mínimo: 2 screenshots
- Máximo: 8 screenshots
- Tamanho: 1080x1920px (9:16 aspect ratio)
- Formato: PNG ou JPG

**Ícone do App:**
- Tamanho: 512x512px
- Formato: PNG
- Sem cantos arredondados

**Imagem de Destaque:**
- Tamanho: 1024x500px
- Formato: PNG ou JPG
- Mostra o app em destaque

### Passo 4: Configurar Informações de Contato

- **Email de contato:** seu-email@seu-dominio.com
- **Website:** https://bustracker.com.br
- **Política de Privacidade:** URL obrigatória
- **Termos de Serviço:** URL obrigatória

### Passo 5: Configurar Publicidade

**Importante para apps com AdMob:**
1. Vá em "Monetization" → "Ads"
2. Marque "This app displays ads"
3. Selecione tipos de anúncios
4. Forneça ID de publicador AdMob

### Passo 6: Build e Submissão

**Comando para build:**
```bash
cd /home/ubuntu/bustracker-app
eas build --platform android --auto-submit
```

**Ou manualmente:**
1. Gere APK/AAB:
   ```bash
   eas build --platform android
   ```
2. Acesse Google Play Console
3. Vá em "Release" → "Production"
4. Clique em "Create new release"
5. Faça upload do APK/AAB
6. Revise informações
7. Clique em "Review release"
8. Clique em "Start rollout to Production"

**Tempo de revisão:** 2-3 horas (geralmente automático)

### Passo 7: Monitorar Submissão

1. Acesse [play.google.com/console](https://play.google.com/console)
2. Vá em "Release" → "Production"
3. Verifique status em "Rollout"
4. Aguarde aprovação ou correções

---

## 📋 Checklist de Publicação

### Antes de Submeter

- [ ] Versão do app testada em dispositivos reais
- [ ] Sem erros de compilação
- [ ] Sem warnings críticos
- [ ] Política de Privacidade publicada online
- [ ] Termos de Serviço publicados online
- [ ] Screenshots prontos (1242x2208 para iOS, 1080x1920 para Android)
- [ ] Ícone do app 1024x1024px
- [ ] Descrição do app revisada
- [ ] Email de suporte configurado
- [ ] Website/domínio configurado

### Apple App Store

- [ ] Apple Developer Account criado
- [ ] Certificados iOS Distribution criados
- [ ] Provisioning Profile criado
- [ ] Bundle ID correto em app.config.ts
- [ ] Publicidade marcada como "Serves ads"
- [ ] Classificação de conteúdo preenchida
- [ ] Build gerado com Xcode

### Google Play Store

- [ ] Google Play Developer Account criado
- [ ] App criado no Console
- [ ] Package name correto
- [ ] Publicidade marcada como "This app displays ads"
- [ ] Classificação de conteúdo preenchida
- [ ] APK/AAB gerado e testado
- [ ] Assinatura digital configurada

---

## 🚀 Após Publicação

### Monitoramento

**Métricas importantes:**
- Downloads diários
- Ratings e reviews
- Taxa de crash
- Tempo médio de sessão
- Receita de publicidade

**Ferramentas:**
- Apple App Store Connect Analytics
- Google Play Console Analytics
- Google AdMob Dashboard
- Firebase Analytics

### Atualizações

**Ciclo de atualização:**
1. Desenvolvimento de nova versão
2. Testes locais
3. Build para ambas plataformas
4. Submissão para review
5. Publicação após aprovação

**Versioning:**
- Formato: MAJOR.MINOR.PATCH (ex: 1.0.1)
- Incrementar PATCH para bug fixes
- Incrementar MINOR para novas features
- Incrementar MAJOR para mudanças significativas

---

## 💡 Dicas Importantes

### Para Apple App Store

1. **Rejeições comuns:**
   - Publicidade enganosa ou excessiva
   - Falta de política de privacidade
   - Dados de localização sem consentimento
   - Crashes ou bugs graves

2. **Melhorar aprovação:**
   - Teste em múltiplos dispositivos
   - Siga Apple Human Interface Guidelines
   - Seja claro sobre coleta de dados
   - Responda rapidamente a feedback

### Para Google Play Store

1. **Rejeições comuns:**
   - Conteúdo inadequado
   - Violação de políticas de publicidade
   - Permissões excessivas
   - Comportamento enganoso

2. **Melhorar aprovação:**
   - Declare todas as permissões necessárias
   - Seja transparente sobre publicidade
   - Teste em múltiplos dispositivos Android
   - Siga Material Design Guidelines

---

## 📞 Suporte

| Plataforma | Contato | URL |
|-----------|---------|-----|
| **Apple** | Support | [developer.apple.com/support](https://developer.apple.com/support) |
| **Google** | Support | [support.google.com/googleplay](https://support.google.com/googleplay) |
| **Expo** | Documentation | [docs.expo.dev](https://docs.expo.dev) |

---

**Última atualização:** 01 de Março de 2026  
**Status:** Pronto para publicação
