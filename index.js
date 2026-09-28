const STORAGE_KEYS = {
  AGENDAMENTOS: 'bruna_nail_agendamentos',
  CRM: 'bruna_nail_crm',
  BLOQUEIOS: 'bruna_nail_bloqueios',
  SERVICOS: 'bruna_nail_servicos',
  GASTOS: 'bruna_nail_gastos',
  ADMIN_HASH: 'bruna_nail_admin_hash'
};

const ADMIN_PASSWORD_DEFAULT = 'Leoneide';
const SEU_CELULAR = '558592532670';
const HORARIOS_PADRAO = ['08:00', '10:00', '12:00', '15:00', '17:00'];
const SERVER_URL = 'http://localhost:3000'; // URL do servidor backend
const SERVICOS_PADRAO = [
  { nome: 'Alongamento Gel', preco: 95 },
  { nome: 'Manutenção Gel', preco: 78 },
  { nome: 'Softgel Aplicação', preco: 78 },
  { nome: 'Softgel Manutenção', preco: 78 },
  { nome: 'Postiça Tradicional', preco: 40 },
  { nome: 'Postiça Efeito Gel', preco: 55 },
  { nome: 'Manicure', preco: 35 },
  { nome: 'Pedicure', preco: 35 }
];

async function hashText(text) {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function ensureAdminPasswordHash() {
  const hashAtual = localStorage.getItem(STORAGE_KEYS.ADMIN_HASH);
  if (!hashAtual) {
    const senhaHash = await hashText(ADMIN_PASSWORD_DEFAULT);
    localStorage.setItem(STORAGE_KEYS.ADMIN_HASH, senhaHash);
  }
}

// ============= SINCRONIZAÇÃO EM TEMPO REAL =============
let ultimoAgendamentoId = localStorage.getItem('ultimo_agendamento_id');

function verificarNovoAgendamento() {
  const agendamentos = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGENDAMENTOS) || '[]');
  if (agendamentos.length === 0) return;

  const ultimoAgendamento = agendamentos[agendamentos.length - 1];
  
  if (ultimoAgendamento.id !== ultimoAgendamentoId) {
    ultimoAgendamentoId = ultimoAgendamento.id;
    localStorage.setItem('ultimo_agendamento_id', ultimoAgendamentoId);
    
    mostrarNotificacao(ultimoAgendamento);
    reproduzirAudio();
  }
}

function mostrarNotificacao(agendamento) {
  const mensaje = `📅 Novo agendamento: ${agendamento.nome} às ${agendamento.hora}`;
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-weight: 500; display: flex; justify-content: space-between; align-items: center;">
      <span>${mensaje}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;">✕</button>
    </div>
  `;
  
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    document.body.appendChild(container);
  }
  
  container.appendChild(toast);
  toast.style.marginBottom = '10px';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function reproduzirAudio() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.log('Áudio não disponível');
  }
}

// ============= ENVIO VIA WHATSAPP =============
async function enviarWhatsAppViaServidor(telefone, nome, data, hora, servicos, tipo = 'cliente') {
  try {
    const response = await fetch(`${SERVER_URL}/api/enviar-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefone, nome, data, hora, servicos, tipo })
    });
    
    const resultado = await response.json();
    console.log('WhatsApp enviado:', resultado);
    return resultado;
  } catch (erro) {
    console.error('Erro ao enviar WhatsApp:', erro);
    return null;
  }
}

async function notificarAdmin(nome, data, hora, servicos, telefone) {
  try {
    await fetch(`${SERVER_URL}/api/notificar-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, data, hora, servicos, telefone })
    });
  } catch (erro) {
    console.log('Servidor não disponível - continuar sem notificação');
  }
}

async function validarSenha() {
  await ensureAdminPasswordHash();
  const senhaDigitada = document.getElementById('inputSenha').value;
  const senhaHash = await hashText(senhaDigitada);
  const hashGuardado = localStorage.getItem(STORAGE_KEYS.ADMIN_HASH);

  if (senhaHash === hashGuardado) {
    window.location.href = 'admn.html';
  } else {
    alert('Senha incorreta');
  }
}

function obterServicos() {
  const salvos = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICOS) || 'null');
  if (!Array.isArray(salvos) || salvos.length === 0) {
    localStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(SERVICOS_PADRAO));
    return SERVICOS_PADRAO;
  }
  return salvos;
}

function renderizarServicosIndex() {
  const container = document.getElementById('listaServicos');
  if (!container) return;

  const servicos = obterServicos();
  container.innerHTML = servicos.map(servico => `
    <label class="checkbox-item"><input type="checkbox" name="servico" value="${servico.nome}" data-preco="${servico.preco}">
      ${servico.nome} - R$${Number(servico.preco).toFixed(2).replace('.', ',')}</label>
  `).join('');
}

function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('themeBtn');
  if (html.getAttribute('data-theme') === 'dark') {
    html.removeAttribute('data-theme');
    btn.innerText = 'Modo Escuro';
  } else {
    html.setAttribute('data-theme', 'dark');
    btn.innerText = 'Modo Claro';
  }
}

function verificarDisponibilidade() {
  const dataSel = document.getElementById('data').value;
  const campoHora = document.getElementById('hora');
  const agendamentos = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGENDAMENTOS) || '[]');
  const bloqueios = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOQUEIOS) || '[]');

  if (bloqueios.includes(dataSel)) {
    campoHora.innerHTML = '<option>🚫 ESGOTADO</option>';
    campoHora.disabled = true;
    return;
  }

  const ocupados = agendamentos.filter(a => a.data === dataSel).map(a => a.hora);
  campoHora.innerHTML = '<option value="">Escolha o horário</option>';
  HORARIOS_PADRAO.forEach(h => {
    if (!ocupados.includes(h)) campoHora.innerHTML += `<option value="${h}">${h}</option>`;
  });
  campoHora.disabled = false;
}

function acessoAdmin() {
  document.getElementById('modalSenha').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalSenha').style.display = 'none';
}

window.onload = async () => {
  // Limpar serviços antigos para usar os novos
  localStorage.removeItem(STORAGE_KEYS.SERVICOS);
  
  await ensureAdminPasswordHash();
  document.getElementById('data').min = new Date().toISOString().split('T')[0];
  renderizarServicosIndex();
  verificarNovoAgendamento();
  
  // Verificar novos agendamentos a cada 2 segundos
  setInterval(() => {
    verificarNovoAgendamento();
  }, 2000);
};

// Sincronização em tempo real entre abas
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEYS.SERVICOS) {
    renderizarServicosIndex();
  }
  
  if (event.key === STORAGE_KEYS.AGENDAMENTOS) {
    verificarNovoAgendamento();
  }
});

document.getElementById('formAgendamento').onsubmit = async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telRaw = document.getElementById('telefone').value;
  const telZap = telRaw.replace(/\D/g, '');
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  let servicosSelecionados = [];
  let valorTotal = 0;

  document.querySelectorAll('input[name="servico"]:checked').forEach(cb => {
    servicosSelecionados.push(cb.value);
    valorTotal += parseFloat(cb.getAttribute('data-preco'));
  });

  if (servicosSelecionados.length === 0) return alert('Por favor, selecione um serviço.');
  if (!hora) return alert('Selecione um horário.');

  const novoAgendamento = {
    id: Date.now(),
    nome,
    telefoneRaw: telRaw,
    telefoneZap: telZap,
    servicos: servicosSelecionados,
    data,
    hora,
    valor: valorTotal,
    notificado2Dias: false
  };

  let lista = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGENDAMENTOS)) || [];
  lista.push(novoAgendamento);
  localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(lista));

  let baseCRM = JSON.parse(localStorage.getItem(STORAGE_KEYS.CRM)) || {};
  if (!baseCRM[telZap]) baseCRM[telZap] = { nome, tel: telRaw, visitas: 0, ultima: data };
  baseCRM[telZap].visitas += 1;
  baseCRM[telZap].ultima = data;
  localStorage.setItem(STORAGE_KEYS.CRM, JSON.stringify(baseCRM));

  // Enviar mensagens WhatsApp
  const msg = `*Novo Agendamento Bruna Nail*%0A*Nome:* ${nome}%0A*Data:* ${data}%0A*Hora:* ${hora}%0A*Serviços:* ${servicosSelecionados.join(', ')}%0A*Total:* R$ ${valorTotal.toFixed(2)}`;
  
  // Versão tradicional (link direto)
  window.open(`https://api.whatsapp.com/send?phone=${SEU_CELULAR}&text=${msg}`, '_blank');
  
  // Versão via servidor (se disponível)
  await enviarWhatsAppViaServidor(telZap, nome, data, hora, servicosSelecionados, 'cliente');
  await notificarAdmin(nome, data, hora, servicosSelecionados, telZap);

  alert('Agendamento enviado! 🎉');
  this.reset();
  document.getElementById('hora').disabled = true;
};