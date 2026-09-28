# 🚀 Instalação do Servidor Backend

Este guia explica como configurar o servidor backend para envio automático de mensagens WhatsApp.

## ⚡ Opção 1: Uso Imediato (SEM Servidor)

**O sistema funciona 100% sem o servidor!**

Quando um cliente agenda:
- ✅ Link WhatsApp abre automaticamente
- ✅ Notificações aparecem em tempo real
- ✅ Sincronização entre seus dispositivos

**Não precisa de nenhuma configuração para começar agora!**

---

## 🔧 Opção 2: Com Servidor (Envio Automático)

Se quiser que as mensagens sejam **enviadas automaticamente** sem clicar em link:

### Pré-requisitos
- Node.js v14+ instalado
- Conta Twilio (gratuita)

### Passo 1: Instalar Node.js

Baixe de: https://nodejs.org/ (versão LTS recomendada)

### Passo 2: Instalar Dependências

na pasta do projeto:

```bash
npm install
```

Isso irá instalar:
- `express` (servidor web)
- `cors` (segurança)
- `dotenv` (variáveis de ambiente)
- `twilio` (envio de WhatsApp)

### Passo 3: Configurar Twilio

1. Acesse: https://www.twilio.com/console
2. Crie uma conta gratuita (recebe crédito)
3. Copie seu **Account SID** e **Auth Token**
4. Vá em: Messaging > Try it out > Send an SMS
5. Configure **WhatsApp Sandbox**

### Passo 4: Configurar Arquivo `.env`

Edite `.env` na raiz do projeto:

```env
PORT=3000
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE=whatsapp:+551234567890
OWNER_PHONE=85992532670
SERVER_URL=http://localhost:3000
```

**Onde obter:**
- `TWILIO_ACCOUNT_SID`: Console Twilio > Account > SID
- `TWILIO_AUTH_TOKEN`: Console Twilio > Account > Auth Token
- `TWILIO_PHONE`: Sua linha Twilio (está no sandbox)
- `OWNER_PHONE`: SEU número (DDD + número, sem +55)

### Passo 5: Iniciar o Servidor

```bash
npm start
```

Você verá:
```
🎉 Servidor rodando em http://localhost:3000
⚠️  Certifique-se de configurar as variáveis de ambiente em .env
```

### Passo 6: Testar

1. Abra o site: `http://localhost:3000` (ou seu domínio)
2. Agende um cliente
3. Você receberá mensagem WhatsApp automática

---

## 📝 Estrutura de Arquivos

```
BrunaNailDesigner/
├── server.js              ← Servidor (NOVO)
├── .env                   ← Configurações (NOVO)
├── package.json           ← Dependências (NOVO)
├── package-lock.json      ← Lock de dependências
├── node_modules/          ← Pacotes instalados
├── index.html
├── admn.html
├── index.js
├── script.js
└── ...
```

---

## 🔗 Como Fazer o Servidor Rodar 24/7

### Opção A: Usar Serviço em Nuvem (Recomendado)

**Heroku** (gratuito):
1. Faça upload para GitHub
2. Conecte ao Heroku
3. Deploy automático

**Replit** (gratuito):
1. Upload files
2. Cole `.env`
3. Command: `npm start`

**Railway** (barato):
1. Conecte GitHub
2. Deploy em 1 clique

### Opção B: Servidor Local Sempre Ligado

Windows (CMD):
```bash
npm start
```
Mantenha o CMD aberto. Para parar: `Ctrl+C`

Linux/Mac:
```bash
nohup npm start &
```

---

## 🐛 Troubleshooting

### "npm command not found"
- Reinstale Node.js
- Reinicie o terminal depois

### "Cannot find module 'express'"
- Execute: `npm install`
- Espere completar

### "EADDRINUSE: address already in use :::3000"
- Outra aplicação está na porta 3000
- Use: `npm start -- --port 3001`

### "WhatsApp não enviado"
- Verifique credenciais Twilio em `.env`
- Certifique que o servidor está rodando
- Confira o número de telefone (formato: 85992532670)

### "Erro de CORS"
- Servidor deve estar na mesma porta que o site
- Se está em domínios diferentes, configure CORS

---

## 📊 Monitorar Servidor

Abra outro terminal:

```bash
npm install -g pm2
pm2 start server.js
pm2 logs
```

---

## 🎯 Próximas Etapas

- [ ] Deploy em nuvem
- [ ] Configurar HTTPS
- [ ] Integrar com banco de dados
- [ ] Dashboard de mensagens enviadas
- [ ] Webhook para receber respostas

---

**Dúvidas?** Consulte:
- Documentação Twilio: https://www.twilio.com/docs
- Documentação Express: https://expressjs.com

---

**Atualizado:** Setembro 2026
