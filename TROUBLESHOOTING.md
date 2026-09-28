# 🆘 Troubleshooting - Resolvendo Problemas

## 🔍 Problemas Comuns e Soluções

---

### ❌ Notificações Não Aparecem

#### Sintoma
> "Agendei um cliente mas não apareceu nenhuma notificação"

#### Soluções

**1. Verificar Console do Navegador**
```
1. Abra o navegador
2. Pressione F12 (Developer Tools)
3. Vá para aba "Console"
4. Procure por mensagens de erro
5. Screenshot do erro
```

**2. Atualizar Página**
```
1. Pressione F5 (ou Ctrl+R)
2. Aguarde completar carregamento
3. Tente agendar novamente
```

**3. Limpar Cache**
```
1. Pressione Ctrl+Shift+Delete
2. Selecione "Limpar tudo"
3. Selecione intervalo "Todos os tempos"
4. Clique "Limpar dados"
```

**4. Verificar localStorage**
No console do navegador, execute:
```javascript
// Ver todos os dados salvos
console.log(JSON.parse(localStorage.getItem('bruna_nail_agendamentos')))

// Ver último ID
console.log(localStorage.getItem('ultimo_agendamento_id'))

// Limpar se necessário
localStorage.clear()
```

**5. Verificar Permissões**
- Abra console (F12)
- Execute: `console.log(Notification.permission)`
- Resultado:
  - "granted" ✅ Permissão ativa
  - "denied" ❌ Bloquear, precisa resetar
  - "default" ⚠️ Ainda não pediu

Se negado, pode precisar limpar dados site no navegador.

---

### ❌ Som Não Toca

#### Sintoma
> "Vejo a notificação mas não ouve som"

#### Soluções

**1. Verificar Volume**
- 🔊 Volume do computador está ligado?
- 🔇 Navegador está silenciado?
- 🔇 Taba está silenciada?

**2. Verificar Navegador**
No console:
```javascript
// Criar som de teste
const ctx = new AudioContext()
const osc = ctx.createOscillator()
osc.frequency.value = 800
osc.connect(ctx.destination)
osc.start()
setTimeout(() => osc.stop(), 100)

// Se ouve "beep" = som funciona!
```

**3. Permitir Som no Navegador**
- Chrome: Cadeado 🔒 > Site settings > Som > Permitir
- Firefox: about:preferences > Privacy > Permissões > Som
- Safari: Preferências > Privacidade > Som

**4. Atualizar Página**
- F5
- Tente agendar novamente

---

### ❌ WhatsApp Não Abre

#### Sintoma
> "Agendei mas o WhatsApp não abriu"

#### Soluções

**1. Popup Bloqueado pelo Navegador**
- Procure 🚫 "Popup bloqueado" na URL
- Clique em "Permitir popups para este site"
- Tente novamente

**2. Reabrir Manualmente**
```
1. Vá em https://wa.me/558592532670
2. Clique em "Confirmar agendamento"
3. Mensagem será iniciada
```

**3. No Telefone**
- Se está no app: Link abre direto no WhatsApp ✅
- Se está no navegador: Leva para app WhatsApp ✅
- Se não tem WhatsApp: Pode instalar e clicar no link

**4. Verificar Número**
No código (index.js):
```javascript
const SEU_CELULAR = '558592532670'; // Altere para seu número
```

Formato correto:
- ✅ `558592532670` (correto)
- ❌ `55 85 9 9253-2670` (errado)
- ❌ `+558592532670` (sem + aqui)

**5. Testar Link Direto**
Abra no navegador:
```
https://wa.me/558592532670
```

Se abre WhatsApp = está funcionando!

---

### ❌ Não Sincroniza Entre Abas

#### Sintoma
> "Agendei em uma aba mas a outra não atualizou"

#### Soluções

**1. Verificar URL**
Ambas abas DEVEM estar no **mesmo domínio e porta**:
- ✅ `http://localhost/` e `http://localhost/`
- ✅ `https://meusite.com/` e `https://meusite.com/`
- ❌ `http://localhost/` e `http://127.0.0.1/` (diferentes!)
- ❌ `http://localhost:3000/` e `http://localhost:8000/` (portas diferentes)

**2. Ambas Janelas Abertas**
- localStorage só sincroniza entre abas **abertas**
- Se fechar a aba, não sincroniza

**3. Testar Sincronização**
No console de uma aba:
```javascript
// Simular agendamento
const agendamentos = JSON.parse(
  localStorage.getItem('bruna_nail_agendamentos') || '[]'
)
agendamentos.push({
  id: Date.now(),
  nome: 'Teste de Sincronização',
  servicos: ['Teste']
})
localStorage.setItem(
  'bruna_nail_agendamentos',
  JSON.stringify(agendamentos)
)

// Na outra aba, você deveria ver a notificação!
```

**4. Reiniciar Abas**
- Feche as abas
- Abra novamente
- Tente sincronizar

**5. Limpar localStorage**
```javascript
// No console de uma aba
localStorage.clear()
location.reload()
```

---

### ❌ Admin Não Atualiza

#### Sintoma
> "Agendei no site mas o painel admin não atualizou"

#### Soluções

**1. Recarregar Painel**
- F5 ou Ctrl+R
- Aguarde completar

**2. Verificar Senha Admin**
- Senha padrão: `Leoneide`
- Se entrou com outra senha, painel pode estar restrito
- Tente novamente com a senha correta

**3. Verificar localStorage**
No console do painel admin:
```javascript
// Ver se há agendamentos
console.log(JSON.parse(
  localStorage.getItem('bruna_nail_agendamentos')
))
```

**4. localStorage Corrompido**
```javascript
// Limpar tudo
localStorage.clear()

// Recarregar
location.reload()

// Tentar novamente
```

**5. Navegador Cache**
```
1. F12 > Application (Chrome) ou Storage (Firefox)
2. localStorage > seu-dominio
3. Verifique se há dados salvos
4. Force refresh: Ctrl+Shift+R
```

---

### ❌ Servidor Não Funciona

#### Sintoma
> "npm start dá erro" ou "Não consegue conectar ao servidor"

#### Soluções

**1. Node.js Não Instalado**
```bash
# Verifique se tem Node.js
node --version

# Se não tiver, baixe em:
# https://nodejs.org/ (LTS recomendado)
```

**2. Dependências Não Instaladas**
```bash
# Na pasta do projeto
npm install

# Se erro, limpe cache
npm cache clean --force
npm install
```

**3. Porta 3000 Em Uso**
```bash
# Procurar processo usando porta 3000
# Windows (PowerShell):
netstat -ntlp | findstr :3000

# Se alguma coisa está usando, use outra porta:
npm start -- --port 3001
```

**4. Arquivo .env Incorreto**
Verifique `.env`:
```env
PORT=3000
TWILIO_ACCOUNT_SID=ACxxxxxx  # Sem espaços
TWILIO_AUTH_TOKEN=xxxxxxx    # Verificar exatamente
TWILIO_PHONE=whatsapp:+55xxxx
OWNER_PHONE=55xxxxxx
```

Se há espaços extras:
```
❌ PORT = 3000       (espaços = erro)
✅ PORT=3000         (correto)
```

**5. Credenciais Twilio**
Se credenciais estão erradas:
```
1. Vá para https://www.twilio.com/console
2. Copie valores exatos
3. Cola em .env
4. Salve arquivo (.env sem extensão)
5. Reinicie npm start
```

**6. Erro de CORS**
Se recebe erro de CORS:
```javascript
// Verifique em server.js
app.use(cors()) // Deve estar presente

// Se ainda problema:
app.use(cors({
  origin: 'http://localhost' // ou seu domínio
}))
```

**7. Reiniciar Servidor**
```bash
# Parar (Ctrl+C)
# Limpar
npm cache clean --force

# Reinstalir
rm -rf node_modules package-lock.json
npm install

# Reiniciar
npm start
```

---

### ✅ Tudo Funcionando Agora?

Se resolveu o problema:
- ✅ Teste novamente agendando
- ✅ Verifique notificação
- ✅ Abra em outro dispositivo
- ✅ Confirme sincronização

Se **ainda** tem problema:

---

### 🆘 Problema Persiste?

**1. Coletar Informações**
- Qual erro está vendo?
- Qual navegador está usando?
- Qual dispositivo (Windows/Mac/Linux)?
- Qual versão do projeto (veja `CHANGELOG.md`)?

**2. Enviar para Suporte**
- 📞 WhatsApp: https://wa.me/558592532670
- 📸 Print da tela com erro
- 💻 Screenshot do console (F12 > Console)

**3. Verificar Documentação**
- [`README.md`](README.md) - Documentação
- [`FLUXO_VISUAL.md`](FLUXO_VISUAL.md) - Visualizar fluxo
- [`ENV_EXAMPLE.md`](ENV_EXAMPLE.md) - Configuração

---

### 🧠 Dicas Gerais

✅ **Sempre que agent em algo:**
1. Feche completamente o navegador
2. Limpe cache (Ctrl+Shift+Delete)
3. Abra novamente
4. Tente novamente

✅ **Para desenvolvimento:**
- Mantenha console aberto (F12)
- Veja erros em tempo real
- Use Chrome DevTools (melhor para debug)

✅ **Para sincronização:**
- Ambas abas mesma URL
- Ambas abertas
- Mesmo navegador (geralmente)

✅ **Para WhatsApp:**
- Sempre teste link direto primeiro
- wa.me irá sempre funcionar
- Servidor é opcional

---

### 📊 Checklist de Verificação

Se problemas, verifique:

- [ ] Navegador está atualizado? (Chrome 90+, Firefox 88+, Safari 14+)
- [ ] URL está correta? (mesmo domínio em ambas abas)
- [ ] localStorage habilitado no navegador?
- [ ] Permissões de notificação ativas?
- [ ] Volume do computador está ligado?
- [ ] Número de WhatsApp está correto?
- [ ] Arquivo `.env` tem credenciais corretas?
- [ ] Servidor está rodando? (`npm start`)
- [ ] Dependências instaladas? (`npm install`)
- [ ] Porta 3000 não está em uso?
- [ ] Firewall permite localhost?
- [ ] HTTPS em produção?

---

## 📞 Suporte Final

Se nada funcionou:

1. **Releia a documentação:**
   - [`README.md`](README.md)
   - [`QUICKSTART.md`](QUICKSTART.md)
   - [`INSTALL.md`](INSTALL.md)

2. **Verifique exemplos:**
   - [`ENV_EXAMPLE.md`](ENV_EXAMPLE.md)
   - [`FLUXO_VISUAL.md`](FLUXO_VISUAL.md)

3. **Limpe tudo e comece:**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   npm start
   ```

4. **Contate:**
   - 📱 WhatsApp: https://wa.me/558592532670
   - 📸 Instagram: https://instagram.com/brunaalcantaraunhas

---

**Bom sorte! O sistema vai funcionar! 💪**
