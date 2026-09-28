const ADMIN_STORAGE_KEY = 'bruna_nail_admin_sections';
const SERVICOS_KEY = 'bruna_nail_servicos';
const AGENDAMENTOS_KEY = 'bruna_nail_agendamentos';
const GASTOS_KEY = 'bruna_nail_gastos';
const CRM_KEY = 'bruna_nail_crm';
const ADMIN_HASH_KEY = 'bruna_nail_admin_hash';
const ADMIN_PASSWORD_DEFAULT = 'Leoneide';
const SERVER_URL = 'http://localhost:3000';

// ============= NOTIFICAÇÕES EM TEMPO REAL =============
let ultimoAgendamentoId = localStorage.getItem('ultimo_agendamento_id');

function verificarNovoAgendamento() {
    const agendamentos = JSON.parse(localStorage.getItem(AGENDAMENTOS_KEY) || '[]');
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
    const mensaje = `📅 Novo agendamento: ${agendamento.cliente || agendamento.nome || 'Cliente'} às ${agendamento.hora}`;
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

async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function ensureAdminPasswordHash() {
    const hashAtual = localStorage.getItem(ADMIN_HASH_KEY);
    if (!hashAtual) {
        localStorage.setItem(ADMIN_HASH_KEY, await sha256(ADMIN_PASSWORD_DEFAULT));
    }
}

async function validarSenha() {
    await ensureAdminPasswordHash();
    const senhaDigitada = document.getElementById('inputSenha').value;
    const senhaHash = await sha256(senhaDigitada);
    const hashGuardado = localStorage.getItem(ADMIN_HASH_KEY);

    if (senhaHash === hashGuardado) {
        window.location.href = 'admn.html';
    } else {
        alert('Senha incorreta');
    }
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(valor || 0));
}

function verificarPermissaoNotificacao() {
    const bar = document.getElementById('notificacaoBar');
    if (bar) {
        bar.style.display = 'block';
    }
}

function obterServicos() {
    const dados = JSON.parse(localStorage.getItem(SERVICOS_KEY) || '[]');
    return dados.length ? dados : [
        { id: 1, nome: 'Manicure', preco: 45 },
        { id: 2, nome: 'Pedicure', preco: 55 },
        { id: 3, nome: 'Alongamento', preco: 120 },
        { id: 4, nome: 'Design de Unhas', preco: 75 }
    ];
}

function salvarServicos(servicos) {
    localStorage.setItem(SERVICOS_KEY, JSON.stringify(servicos));
}

function renderizarServicosAdm() {
    const container = document.getElementById('container-servicos-checkbox');
    if (!container) return;

    const servicos = obterServicos();
    container.innerHTML = servicos.map((servico) => `
        <label class="servico-item">
            <input type="checkbox" value="${servico.nome}" />
            <span>${servico.nome} — ${formatarMoeda(servico.preco)}</span>
        </label>
    `).join('');

    const tabela = document.querySelector('#tabServicos tbody');
    if (!tabela) return;

    tabela.innerHTML = servicos.map((servico) => `
        <tr>
            <td><input type="text" value="${servico.nome}" data-editar-servico="nome" data-id="${servico.id}" /></td>
            <td><input type="number" value="${servico.preco}" min="0" step="0.01" data-editar-servico="preco" data-id="${servico.id}" /></td>
            <td><button class="btn btn-crm" data-salvar-servico="${servico.id}">Salvar</button></td>
            <td><button class="btn btn-danger" data-remover-servico="${servico.id}">Remover</button></td>
        </tr>
    `).join('');

    document.querySelectorAll('[data-salvar-servico]').forEach((botao) => {
        botao.addEventListener('click', () => {
            const id = Number(botao.dataset.salvarServico);
            const linha = botao.closest('tr');
            const nome = linha.querySelector('[data-editar-servico="nome"]').value.trim();
            const preco = Number(linha.querySelector('[data-editar-servico="preco"]').value || 0);
            const servicosAtualizados = obterServicos().map((servico) => servico.id === id ? { ...servico, nome, preco } : servico);
            salvarServicos(servicosAtualizados);
            renderizarServicosAdm();
        });
    });

    document.querySelectorAll('[data-remover-servico]').forEach((botao) => {
        botao.addEventListener('click', () => {
            const id = Number(botao.dataset.removerServico);
            const servicosAtualizados = obterServicos().filter((servico) => servico.id !== id);
            salvarServicos(servicosAtualizados);
            renderizarServicosAdm();
        });
    });
}

function adicionarServico() {
    const nome = document.getElementById('novoServicoNome')?.value.trim();
    const preco = Number(document.getElementById('novoServicoPreco')?.value || 0);
    if (!nome || preco <= 0) {
        alert('Informe nome e preço válidos para o serviço.');
        return;
    }

    const servicos = obterServicos();
    servicos.push({ id: Date.now(), nome, preco });
    salvarServicos(servicos);
    renderizarServicosAdm();

    const inputNome = document.getElementById('novoServicoNome');
    const inputPreco = document.getElementById('novoServicoPreco');
    if (inputNome) inputNome.value = '';
    if (inputPreco) inputPreco.value = '';
}

function obterAgendamentos() {
    return JSON.parse(localStorage.getItem(AGENDAMENTOS_KEY) || '[]');
}

function salvarAgendamentos(agendamentos) {
    localStorage.setItem(AGENDAMENTOS_KEY, JSON.stringify(agendamentos));
}

function obterGastos() {
    return JSON.parse(localStorage.getItem(GASTOS_KEY) || '[]');
}

function salvarGastos(gastos) {
    localStorage.setItem(GASTOS_KEY, JSON.stringify(gastos));
}

function obterCRM() {
    return JSON.parse(localStorage.getItem(CRM_KEY) || '{}');
}

function salvarCRM(crm) {
    localStorage.setItem(CRM_KEY, JSON.stringify(crm));
}

function calcularTotais() {
    const agendamentos = obterAgendamentos();
    const gastos = obterGastos();

    const totalEntradas = agendamentos.reduce((total, item) => total + Number(item.valor || 0), 0);
    const totalGastos = gastos.reduce((total, item) => total + Number(item.valor || 0), 0);
    const lucroLiquido = totalEntradas - totalGastos;

    const totalEntradasEl = document.getElementById('totalEntradas');
    const totalGastosEl = document.getElementById('totalGastos');
    const lucroLiquidoEl = document.getElementById('lucroLiquido');

    if (totalEntradasEl) totalEntradasEl.textContent = formatarMoeda(totalEntradas);
    if (totalGastosEl) totalGastosEl.textContent = formatarMoeda(totalGastos);
    if (lucroLiquidoEl) lucroLiquidoEl.textContent = formatarMoeda(lucroLiquido);
}

function renderizarAgendamentos() {
    const tabela = document.querySelector('#tabAgendamentos tbody');
    if (!tabela) return;

    const agendamentos = obterAgendamentos();
    tabela.innerHTML = agendamentos.map((item) => `
        <tr>
            <td>${item.cliente || '-'}</td>
            <td>${item.whatsapp || '-'}</td>
            <td>${(item.servicos || []).join(', ') || '-'}</td>
            <td>${item.data || '-'}</td>
            <td>${item.hora || '-'}</td>
            <td>
                <button class="btn btn-crm" data-remover-agendamento="${item.id}">Excluir</button>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('[data-remover-agendamento]').forEach((botao) => {
        botao.addEventListener('click', () => {
            const id = Number(botao.dataset.removerAgendamento);
            const atualizados = obterAgendamentos().filter((item) => item.id !== id);
            salvarAgendamentos(atualizados);
            renderizarTudo();
        });
    });
}

function renderizarGastos() {
    const tabela = document.querySelector('#tabGastosTotal tbody');
    if (!tabela) return;

    const gastos = obterGastos();
    tabela.innerHTML = gastos.map((item) => `
        <tr>
            <td>${item.categoria || '-'}</td>
            <td>${item.descricao || '-'}</td>
            <td>${formatarMoeda(item.valor || 0)}</td>
            <td><button class="btn btn-crm" data-remover-gasto="${item.id}">Remover</button></td>
        </tr>
    `).join('');

    document.querySelectorAll('[data-remover-gasto]').forEach((botao) => {
        botao.addEventListener('click', () => {
            const id = Number(botao.dataset.removerGasto);
            const atualizados = obterGastos().filter((item) => item.id !== id);
            salvarGastos(atualizados);
            renderizarTudo();
        });
    });
}

function renderizarCRM() {
    const tabela = document.querySelector('#tabCRM tbody');
    if (!tabela) return;

    const clientes = obterAgendamentos().map((item) => ({
        nome: item.cliente || 'Cliente',
        whatsapp: item.whatsapp || '---',
        visitas: item.visitas || 1,
        ultimaVez: item.data || 'Sem registro'
    }));

    tabela.innerHTML = clientes.map((cliente) => `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.whatsapp}</td>
            <td>${cliente.visitas}</td>
            <td>${cliente.ultimaVez}</td>
            <td><button class="btn btn-crm">Abrir</button></td>
        </tr>
    `).join('');
}

function renderizarTudo() {
    renderizarServicosAdm();
    renderizarAgendamentos();
    renderizarGastos();
    renderizarCRM();
    calcularTotais();
    verificarLembretesAgenda();
}

async function agendarManual() {
    const nome = document.getElementById('manNome')?.value.trim();
    const tel = document.getElementById('manTel')?.value.trim();
    const data = document.getElementById('manData')?.value;
    const hora = document.getElementById('manHora')?.value.trim();
    const servicosSelecionados = [...document.querySelectorAll('#container-servicos-checkbox input:checked')].map((item) => item.value);

    if (!nome || !tel || !data || !hora || !servicosSelecionados.length) {
        alert('Preencha todos os campos e selecione ao menos um serviço.');
        return;
    }

    const servicos = obterServicos();
    const valor = servicos
        .filter((servico) => servicosSelecionados.includes(servico.nome))
        .reduce((total, servico) => total + Number(servico.preco || 0), 0);

    const agendamentos = obterAgendamentos();
    agendamentos.push({
        id: Date.now(),
        cliente: nome,
        whatsapp: tel,
        servicos: servicosSelecionados,
        data,
        hora,
        valor
    });

    salvarAgendamentos(agendamentos);
    renderizarTudo();

    // Enviar notificações WhatsApp
    const telZap = tel.replace(/\D/g, '');
    await enviarWhatsAppViaServidor(telZap, nome, data, hora, servicosSelecionados, 'cliente');
    await notificarAdmin(nome, data, hora, servicosSelecionados, telZap);

    document.getElementById('manNome').value = '';
    document.getElementById('manTel').value = '';
    document.getElementById('manData').value = '';
    document.getElementById('manHora').value = '';
    document.querySelectorAll('#container-servicos-checkbox input').forEach((checkbox) => (checkbox.checked = false));

    alert('✅ Atendimento registrado e notificações enviadas!');
}

function addGasto() {
    const descricao = document.getElementById('gastoDesc')?.value.trim();
    const valor = Number(document.getElementById('gastoVal')?.value || 0);
    const categoria = document.getElementById('gastoCat')?.value || 'Produtos';

    if (!descricao || valor <= 0) {
        alert('Informe descrição e valor válidos para a despesa.');
        return;
    }

    const gastos = obterGastos();
    gastos.push({ id: Date.now(), categoria, descricao, valor });
    salvarGastos(gastos);
    renderizarTudo();

    document.getElementById('gastoDesc').value = '';
    document.getElementById('gastoVal').value = '';
}

function exportarCSV() {
    const agendamentos = obterAgendamentos();
    if (!agendamentos.length) {
        alert('Não há agendamentos para exportar.');
        return;
    }

    const cabecalho = ['Cliente', 'WhatsApp', 'Serviços', 'Data', 'Hora', 'Valor'];
    const linhas = agendamentos.map((item) => [
        item.cliente || '',
        item.whatsapp || '',
        (item.servicos || []).join('; '),
        item.data || '',
        item.hora || '',
        item.valor || 0
    ]);

    const csv = [cabecalho, ...linhas].map((linha) => linha.map((valor) => `"${String(valor).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio-agendamentos.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function verificarLembretesAgenda() {
    const avisos = document.getElementById('avisos14dias');
    if (!avisos) return;

    const agendamentos = obterAgendamentos();
    if (!agendamentos.length) {
        avisos.innerHTML = '<div class="alerta-box"><span><b>Sem lembretes</b> — ainda não há atendimentos confirmados.</span></div>';
        return;
    }

    const proximos = agendamentos.filter((item) => item.data);
    if (!proximos.length) {
        avisos.innerHTML = '<div class="alerta-box"><span><b>Sem lembretes</b> — ainda não há atendimentos confirmados.</span></div>';
        return;
    }

    const mensagem = `📌 ${proximos.length} cliente(s) em acompanhamento nos próximos 14 dias.`;
    avisos.innerHTML = `
        <div class="alerta-box">
            <span><b>Lembrete da agenda:</b> ${mensagem}</span>
            <a class="btn-lembrete-zap" href="https://wa.me/5511999999999?text=${encodeURIComponent('Olá! Gostaria de lembrar do seu atendimento na Bruna Nail.')}">Enviar lembrete no WhatsApp</a>
        </div>
    `;
}

function setupAdminNav() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-section');

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            navItems.forEach((btn) => btn.classList.toggle('active', btn === item));
            sections.forEach((section) => section.classList.toggle('active', section.id === targetId));
        });
    });
}

function salvarSecaoAdmin(section) {
    const dados = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '{}');
    const sectionId = section.id;
    const title = section.querySelector('[data-field="title"]')?.value || sectionId;
    const summary = section.querySelector('[data-field="summary"]')?.value || '';
    const stats = {};
    section.querySelectorAll('[data-stat]').forEach((input) => {
        stats[input.dataset.stat] = input.value;
    });
    const cards = {};
    section.querySelectorAll('[data-card]').forEach((input) => {
        cards[input.dataset.card] = input.value;
    });

    dados[sectionId] = { title, summary, stats, cards };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(dados));
    const titulo = section.querySelector('h3');
    if (titulo) titulo.textContent = title;
    alert('Sessão salva com sucesso!');
}

function carregarDadosAdmin() {
    const dados = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '{}');
    document.querySelectorAll('.admin-section').forEach((section) => {
        const secao = dados[section.id];
        if (!secao) return;

        const titleInput = section.querySelector('[data-field="title"]');
        if (titleInput) titleInput.value = secao.title || titleInput.value;

        const summaryInput = section.querySelector('[data-field="summary"]');
        if (summaryInput) summaryInput.value = secao.summary || summaryInput.value;

        Object.entries(secao.stats || {}).forEach(([key, value]) => {
            const input = section.querySelector(`[data-stat="${key}"]`);
            if (input) input.value = value;
        });

        Object.entries(secao.cards || {}).forEach(([key, value]) => {
            const input = section.querySelector(`[data-card="${key}"]`);
            if (input) input.value = value;
        });

        const titulo = section.querySelector('h3');
        if (titulo) titulo.textContent = secao.title || titulo.textContent;
    });
}

function atualizarDadosAdminComBaseNoSistema() {
    const agendamentos = obterAgendamentos();
    const gastos = obterGastos();
    const crm = obterCRM();
    const clientes = Object.values(crm).filter((item) => item && item.nome).length;
    const totalAtendimentos = agendamentos.length;
    const entradas = agendamentos.reduce((total, item) => total + Number(item.valor || 0), 0);
    const saidas = gastos.reduce((total, item) => total + Number(item.valor || 0), 0);
    const lucro = entradas - saidas;
    const repeticoes = Object.values(crm).filter((item) => Number(item.visitas || 0) > 1).length;
    const taxaRetorno = clientes > 0 ? Math.round((repeticoes / clientes) * 100) : 0;

    const relatorios = document.getElementById('relatorios');
    if (relatorios) {
        const campo1 = relatorios.querySelector('[data-stat="stat1"]');
        if (campo1) campo1.value = String(clientes || 0);
        const campo2 = relatorios.querySelector('[data-stat="stat2"]');
        if (campo2) campo2.value = String(totalAtendimentos || 0);
        const campo3 = relatorios.querySelector('[data-stat="stat3"]');
        if (campo3) campo3.value = formatarMoeda(entradas);
        const campo4 = relatorios.querySelector('[data-stat="stat4"]');
        if (campo4) campo4.value = `${taxaRetorno}%`;

        const card1 = relatorios.querySelector('[data-card="card1"]');
        if (card1) card1.value = clientes > 0 ? `Clientes ativos: ${clientes}\nAtendimentos registrados: ${totalAtendimentos}\nRetorno: ${taxaRetorno}%` : 'Aguardando primeiro cliente e primeiro agendamento.';

        const card2 = relatorios.querySelector('[data-card="card2"]');
        if (card2) card2.value = agendamentos.length ? agendamentos.slice(0, 3).map((item) => `${item.data} • ${item.hora} • ${item.cliente}`).join('\n') : 'Sem atendimentos registrados ainda.';
    }

    const financeiro = document.getElementById('financeiro');
    if (financeiro) {
        const campo1 = financeiro.querySelector('[data-stat="stat1"]');
        if (campo1) campo1.value = formatarMoeda(entradas);
        const campo2 = financeiro.querySelector('[data-stat="stat2"]');
        if (campo2) campo2.value = formatarMoeda(saidas);
        const campo3 = financeiro.querySelector('[data-stat="stat3"]');
        if (campo3) campo3.value = formatarMoeda(lucro);
        const campo4 = financeiro.querySelector('[data-stat="stat4"]');
        if (campo4) campo4.value = formatarMoeda(lucro >= 0 ? lucro : 0);

        const card1 = financeiro.querySelector('[data-card="card1"]');
        if (card1) card1.value = gastos.length ? gastos.slice(0, 3).map((item) => `${item.categoria} • ${item.descricao} • ${formatarMoeda(item.valor)}`).join('\n') : 'Nenhuma despesa registrada ainda.';
    }

    const clientesSecao = document.getElementById('clientes');
    if (clientesSecao) {
        const listaClientes = Object.values(crm)
            .filter((item) => item && item.nome)
            .sort((a, b) => Number(b.visitas || 0) - Number(a.visitas || 0))
            .slice(0, 3);

        const card1 = clientesSecao.querySelector('[data-card="card1"]');
        const card2 = clientesSecao.querySelector('[data-card="card2"]');
        const card3 = clientesSecao.querySelector('[data-card="card3"]');

        if (card1) card1.value = listaClientes[0] ? `${listaClientes[0].nome} — ${listaClientes[0].visitas || 0} visitas` : 'Aguardando primeiro cadastro de cliente.';
        if (card2) card2.value = listaClientes[1] ? `${listaClientes[1].nome} — ${listaClientes[1].visitas || 0} visitas` : 'Ainda não há segundo cliente.';
        if (card3) card3.value = listaClientes[2] ? `${listaClientes[2].nome} — ${listaClientes[2].visitas || 0} visitas` : 'Ainda não há terceiro cliente.';
    }

    const agendaSecao = document.getElementById('agenda');
    if (agendaSecao) {
        const proximo = agendamentos.slice(0, 3);
        const card1 = agendaSecao.querySelector('[data-card="card1"]');
        const card2 = agendaSecao.querySelector('[data-card="card2"]');
        const card3 = agendaSecao.querySelector('[data-card="card3"]');

        if (card1) card1.value = proximo[0] ? `${proximo[0].cliente} • ${proximo[0].data} • ${proximo[0].hora}` : 'Nenhum agendamento confirmado.';
        if (card2) card2.value = proximo[1] ? `${proximo[1].cliente} • ${proximo[1].data} • ${proximo[1].hora}` : 'Sem próximos agendamentos.';
        if (card3) card3.value = proximo[2] ? `${proximo[2].cliente} • ${proximo[2].data} • ${proximo[2].hora}` : 'Sem mais agendamentos.';
    }

    const cobrancasSecao = document.getElementById('cobrancas');
    if (cobrancasSecao) {
        const card1 = cobrancasSecao.querySelector('[data-card="card1"]');
        if (card1) card1.value = entradas > 0 ? `Total em recebimentos: ${formatarMoeda(entradas)}` : 'Nenhum recebimento registrado ainda.';
    }
}

function prepararSecoesAdminVazias() {
    document.querySelectorAll('.admin-section').forEach((section) => {
        const titleInput = section.querySelector('[data-field="title"]');
        if (titleInput && !titleInput.value.trim()) {
            titleInput.value = section.querySelector('h3')?.textContent || section.id;
        }

        const summaryInput = section.querySelector('[data-field="summary"]');
        if (summaryInput && !summaryInput.value.trim()) {
            summaryInput.value = 'Aguardando dados do sistema.';
        }
    });
}

function atualizarPainelAdmin() {
    prepararSecoesAdminVazias();
    atualizarDadosAdminComBaseNoSistema();
}

window.addEventListener('storage', () => {
    atualizarPainelAdmin();
    if (event.key === AGENDAMENTOS_KEY) {
        verificarNovoAgendamento();
    }
});

async function iniciarAdmin() {
    await ensureAdminPasswordHash();
    renderizarTudo();
    setupAdminNav();
    carregarDadosAdmin();
    atualizarPainelAdmin();

    // Verificar novos agendamentos a cada 2 segundos
    setInterval(() => {
        verificarNovoAgendamento();
    }, 2000);

    document.querySelectorAll('.save-section-btn').forEach((botao) => {
        botao.addEventListener('click', () => salvarSecaoAdmin(botao.closest('.admin-section')));
    });
}

window.addEventListener('DOMContentLoaded', iniciarAdmin);
