# 🎀 Bruna Nail Designer - Guia de Configuração

Seu sistema de agendamento agora possui **sincronização real-time** e **notificações automáticas via WhatsApp**!

## ✨ O que foi adicionado

### 1. **Sincronização em Tempo Real**
- ✅ Quando um cliente agenda, todos os painéis (seu telefone, computador, tablet) são atualizados **instantaneamente**
- ✅ Notificações visuais (toast) aparecem quando há novo agendamento
- ✅ Som de notificação automático

### 2. **Envio de Mensagens WhatsApp**
- ✅ Mensagem automática **para o cliente** confirmando seu agendamento
- ✅ Notificação **para você** quando há novo agendamento
- ✅ Funciona em dois modos:
  - **Modo Direto**: Abre link do WhatsApp (funciona agora)
  - **Modo Servidor**: Envia automaticamente via Twilio (opcional, com configuração)

---

## 🚀 Como Usar (Modo Direto - Funciona Agora)

O sistema já está **100% funcional** sem nenhuma configuração adicional!

Quando um cliente agenda:
1. ✅ Recebe mensagem via link WhatsApp (abre diretamente)
2. ✅ Você recebe notificação no painel admin
3. ✅ Tudo sincroniza em tempo real entre seus dispositivos

## 🔧 Configuração Avançada (Opcional) - Envio Automático

Se quiser que as mensagens sejam **enviadas automaticamente** (sem clicar em link):

### Passo 1: Configurar Twilio

1. Acesse [twilio.com](https://www.twilio.com) e crie uma conta
2. Vá para Console > Account info (copie SID e Auth Token)
3. Configure **WhatsApp Sandbox** em Twilio

### Passo 2: Instalar Servidor

```bash
# Na pasta do projeto
npm install
```

### Passo 3: Configurar `.env`

Edite o arquivo `.env` na raiz do projeto:

```env
PORT=3000
TWILIO_ACCOUNT_SID=seu_sid_aqui
TWILIO_AUTH_TOKEN=seu_token_aqui
TWILIO_PHONE=whatsapp:+55XXXXXXXXXXX
OWNER_PHONE=558592532670
SERVER_URL=http://localhost:3000
```

### Passo 4: Iniciar Servidor

```bash
npm start
```

---

## 📱 Sincronização em Tempo Real

**Como funciona:**

Quando você agenda um client no **painel admin**:
1. O agendamento é salvo no localStorage
2. Todas as abas abertas são notificadas
3. Aparece notificação visual + som
4. Se o servidor está rodando, envia WhatsApp automático

**Múltiplos dispositivos:**
- Abra o sistema em seu telefone, computador e tablet
- Quando agendar em UNS, os outros são atualizados automaticamente
- Funciona enquanto os navegadores estão abertos

---

## 🔔 Notificações

### Notificação Visual (Toast)
- Aparece no canto superior direito
- Mostra: "📅 Novo agendamento: NOME às HORA"
- Some automaticamente após 5 segundos

### Notificação Sonora
- **Som suave** quando há novo agendamento
- Funciona em todos os navegadores modernos

### Notificação WhatsApp
- **Para o cliente**: Confirmação + data/hora/serviços
- **Para você**: Dados do novo agendamento
- Automática (se servidor configurado) ou via link

---

## 📝 Estrutura do Projeto

```
BrunaNailDesigner/
├── index.html          ← Site principal + formulário agendamento
├── admn.html           ← Painel administrativo
├── index.js            ← Lógica de agendamento (ATUALIZADO)
├── script.js           ← Lógica do painel admin
├── index.css           ← Estilos
├── style.css           ← Estilos admin
├── server.js           ← Servidor backend (NOVO)
├── .env                ← Configurações (NOVO)
├── package.json        ← Dependências (NOVO)
└── image/              ← Imagens
```

---

## 🛠 Troubleshooting

### "Notificações não aparecem"
- ✅ Abra o console (F12) e procure por erros
- ✅ Verifique se `AGENDAMENTOS_KEY` está correto
- ✅ Limpe o cache: Ctrl+Shift+Delete

### "WhatsApp não funciona"
- ✅ **Sem servidor**: O link deve abrir automaticamente
- ✅ **Com servidor**: Verifique se `npm start` está rodando
- ✅ **Com servidor**: Confira credenciais Twilio em `.env`

### "Sincronização não funciona entre abas"
- ✅ Certifique-se que as abas estão no **mesmo domínio/porta**
- ✅ localStorage só sincroniza entre abas da mesma origem
- ✅ Se usar servidor de teste, ambas devem acessar via HTTP

### "Erro de CORS"
- ✅ Se o servidor tiver erro de CORS, verifique `server.js`
- ✅ A origem deve estar configurada em `cors()`

---

## 📞 Contato e Suporte

Para dúvidas sobre WhatsApp Bruna Nail:
- 📱 [WhatsApp Direto](https://wa.me/558592532670)
- 📸 [Instagram](https://www.instagram.com/brunaalcantaraunhas/)

---

## 🎯 Próximas Funcionalidades

- [ ] Lembrete automático 2 dias antes do agendamento
- [ ] Dashboard em tempo real com gráficos
- [ ] Página de confirmação com código
- [ ] Cancelamento de agendamento via WhatsApp
- [ ] Integração com Google Calendar

---

**Atualizado:** Setembro 2026
**Versão:** 1.1.0
