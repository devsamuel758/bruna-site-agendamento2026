# 🔧 Arquivo de Exemplo: .env

Este é um exemplo de como configurar o arquivo `.env` para o servidor backend.

## 📋 Versão Básica (Sem Servidor)

Se você quer usar **apenas o modo link** (sem servidor), não precisa fazer nada! O arquivo `.env` já está configurado com valores padrão.

## 🔧 Versão Com Servidor (Twilio)

Substitua os valores com suas credenciais Twilio:

```env
# ============= SERVIDOR =============
PORT=3000
SERVER_URL=http://localhost:3000

# ============= TWILIO =============
# Obtenha em: https://www.twilio.com/console

# Seu Account SID (encontrado no dashboard Twilio)
TWILIO_ACCOUNT_SID=ACd6f1d91c1e1a4f9c5d3b9e8f7a6c5d4

# Seu Auth Token (cuidado, é uma chave secreta!)
TWILIO_AUTH_TOKEN=8f7a6c5d4b3a2f1e9d8c7b6a5f4d3c2b

# Seu número Twilio (fornecido ao criar conta)
TWILIO_PHONE=whatsapp:+5511988887777

# ============= SEU NÚMERO =============
# SEU número de WhatsApp para receber notificações
# FORMATO: DDI + DDD + NÚMERO (sem caracteres especiais)
# Exemplo: Brasil, Ceará: 55 + 85 + 92532670 = 558592532670
OWNER_PHONE=558592532670
```

## 📱 Como Encontrar Suas Credenciais

### 1️⃣ Crie Conta Twilio

1. Vá para https://www.twilio.com/
2. Clique em "Sign Up"
3. Preencha os dados
4. Valide email e telefone
5. Receba crédito inicial ($15)

### 2️⃣ Encontre o Account SID

1. Acesse https://www.twilio.com/console
2. Você verá na página inicial:
   ```
   Account SID: ACd6f1d91c1e1a4f9c5d3b9e8f7a6c5d4
   Auth Token:  [clique em "Show"]
   ```
3. Copie e cole no `.env`

### 3️⃣ Configure WhatsApp

1. No console Twilio, vá para: **Messaging > Try it out > Send a WhatsApp message**
2. Marque "I understand" na caixa
3. Você verá seu número Twilio:
   ```
   From: whatsapp:+5511988887777
   ```
4. Copie esse número (com whatsapp:)

### 4️⃣ Seu Número de Telefone

Seu número pessoal de WhatsApp:

Formato:
- Sem +: `558592532670`
- Com +: `+558592532670` (no .env use SEM +)

Exemplo:
- Número completo: +55 85 9 9253-2670
- No .env: `OWNER_PHONE=558592532670`

## 🔐 Segurança

⚠️ **IMPORTANTE:**

- **Nunca** coloque o `.env` no Git
- **Nunca** compartilhe seu Auth Token
- Em produção, use variáveis de ambiente do servidor
- Não comita `.env` - está no `.gitignore`

## 🧪 Testar Configuração

Após configurar:

```bash
npm install
npm start
```

Você verá:
```
🎉 Servidor rodando em http://localhost:3000
⚠️  Certifique-se de configurar as variáveis de ambiente em .env
```

Se houver erro, verifique:
1. Todos os campos foram preenchidos?
2. Não há espaços em branco extras?
3. Você copiou exatamente como aparece em Twilio?

## 📝 Template Completo

Copie e cole:

```env
# ============= SERVIDOR =============
PORT=3000
SERVER_URL=http://localhost:3000

# ============= TWILIO =============
TWILIO_ACCOUNT_SID=AC__COPIE_AQUI__
TWILIO_AUTH_TOKEN=__COPIE_AQUI__
TWILIO_PHONE=whatsapp:+55__COPIE_AQUI__

# ============= SEU NÚMERO =============
OWNER_PHONE=55XXXXXXXXXXX
```

## 🚀 Para Produção

Quando fizer deploy:

1. **Não suba o `.env`** para o repositório
2. Configure variáveis no painel do servidor:
   - Heroku: Config Vars
   - Railway: Variables
   - Replit: Secrets
   - AWS: Environment Variables

Exemplo Heroku:
```bash
heroku config:set TWILIO_ACCOUNT_SID=ACxxxxx
heroku config:set TWILIO_AUTH_TOKEN=xxxxx
heroku config:set TWILIO_PHONE=whatsapp:+55xxxxxx
heroku config:set OWNER_PHONE=558592532670
```

## ✅ Checklist

- [ ] Conta Twilio criada
- [ ] Account SID copiado
- [ ] Auth Token copiado  
- [ ] Número Twilio copiado
- [ ] Seu número configurado
- [ ] `.env` preenchido com todos os valores
- [ ] Nenhum campo vazio
- [ ] `npm install` executado
- [ ] `npm start` rodando

---

**Pronto!** Seu servidor está configurado 🎉

Para dúvidas: [WhatsApp Bruna](https://wa.me/558592532670)
