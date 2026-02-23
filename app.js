// ==========================================
// SEACE - MOTOR v4.0 (Enterprise Audit)
// Tabular nums, relative dates, visited,
// CSV export, action menu, triage
// ==========================================

let currentData = [];
let lastFiltered = []; // Para exportar CSV
let isSearching = false;
let currentDrawerId = null;

// Track visited rows
const getVisited = () => JSON.parse(localStorage.getItem('visited') || '[]');
const markVisited = (id) => {
    const v = getVisited();
    if (!v.includes(id)) { v.push(id); localStorage.setItem('visited', JSON.stringify(v)); }
};

// Track discarded rows
const getDiscarded = () => JSON.parse(localStorage.getItem('discarded') || '[]');
const toggleDiscard = (id) => {
    let d = getDiscarded();
    if (d.includes(id)) d = d.filter(x => x !== id);
    else d.push(id);
    localStorage.setItem('discarded', JSON.stringify(d));
    applyFilters();
};

async function loadData() {
    showSkeleton(true);
    try {
        const resp = await fetch('data.json');
        if (!resp.ok) throw new Error('No data');
        currentData = await resp.json();
        updateDashboardStats(currentData);
        updateSidebarBadges(currentData);
        applyFilters();
    } catch (e) {
        console.warn("Demo:", e);
        currentData = [];
        applyFilters();
    }
}

// === SKELETON ===
function showSkeleton(show) {
    const sk = document.getElementById('skeletonLoader');
    const tb = document.querySelector('table');
    if (show) { sk?.classList.remove('hidden'); tb?.classList.add('hidden'); }
    else { sk?.classList.add('hidden'); tb?.classList.remove('hidden'); }
}

// === NAV ===
window.switchView = (v) => {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${v}View`)?.classList.remove('hidden');
    ['Dashboard', 'Search', 'Analytics'].forEach(id => {
        const el = document.getElementById(`nav${id}`);
        if (!el) return;
        el.className = id.toLowerCase() === v
            ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors cursor-pointer'
            : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors group cursor-pointer';
    });
};

// === DASHBOARD ===
function updateDashboardStats(data) {
    const t = data.length;
    const b = data.reduce((a, d) => a + d.budgetMax, 0);
    const m = t > 0 ? Math.round(data.reduce((a, d) => a + d.match, 0) / t) : 0;
    document.getElementById('statTotal').innerText = t;
    document.getElementById('statBudget').innerText = formatPEN(b);
    document.getElementById('statMatch').innerText = `${m}%`;
}

// === BADGES ===
function updateSidebarBadges(data) {
    const now = new Date();
    const nuevas = data.filter(d => (now - new Date(d.publishDate)) < 48 * 3600000).length;
    const cierre = data.filter(d => { const df = (new Date(d.deadline) - now) / 86400000; return df > 0 && df <= 3; }).length;
    document.getElementById('badgeNuevas').innerText = nuevas;
    document.getElementById('badgeCierre').innerText = cierre;
}

// === ALERTAS ===
window.filterByAlert = (tipo) => {
    switchView('search');
    const now = new Date();
    let f;
    if (tipo === 'nuevas') f = currentData.filter(d => (now - new Date(d.publishDate)) < 48 * 3600000);
    else f = currentData.filter(d => { const df = (new Date(d.deadline) - now) / 86400000; return df > 0 && df <= 3; });
    lastFiltered = f;
    renderTable(f); renderMobileCards(f);
};

// === SUGGEST ===
window.suggestSearch = (term) => {
    document.getElementById('searchInput').value = term;
    applyFilters();
};

// === CUSTOM BUDGET ===
const budgetSelect = document.getElementById('budgetSelect');
budgetSelect?.addEventListener('change', () => {
    const box = document.getElementById('customBudgetInputs');
    if (budgetSelect.value === 'custom') { box.classList.remove('hidden'); box.classList.add('flex'); }
    else { box.classList.add('hidden'); box.classList.remove('flex'); }
    applyFilters();
});

// === FILTERS ===
const applyFilters = () => {
    if (isSearching) return;
    isSearching = true;
    const btn = document.getElementById('searchBtn');
    btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> Buscando...`;
    btn.disabled = true;

    setTimeout(() => {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const region = document.getElementById('regionSelect').value;
        const active = document.getElementById('activeOnlyToggle').checked;
        const budget = budgetSelect.value;
        const sort = document.getElementById('sortSelect').value;
        const discarded = getDiscarded();

        let filtered = currentData.filter(item => {
            // Excluir descartados
            if (discarded.includes(item.id)) return false;
            if (active && new Date(item.deadline) < new Date()) return false;
            const txt = `${item.title} ${item.agency} ${item.location} ${item.description || ''}`.toLowerCase();
            if (search && !txt.includes(search)) return false;
            if (region && item.location !== region) return false;
            const avg = (item.budgetMin + item.budgetMax) / 2;
            if (budget === 'viable' && (avg < 50000 || avg > 1000000)) return false;
            if (budget === 'high' && avg <= 1000000) return false;
            if (budget === 'low' && avg >= 50000) return false;
            if (budget === 'custom') {
                const mn = parseFloat(document.getElementById('budgetMin').value) || 0;
                const mx = parseFloat(document.getElementById('budgetMax').value) || Infinity;
                if (item.budgetMax < mn || item.budgetMin > mx) return false;
            }
            return true;
        });

        if (sort === 'Relevancia (Match)') filtered.sort((a, b) => b.match - a.match);
        else if (sort === 'Presupuesto (Mayor a Menor)') filtered.sort((a, b) => b.budgetMax - a.budgetMax);
        else if (sort === 'Cierre Próximo') filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        lastFiltered = filtered;
        showSkeleton(false);
        renderTable(filtered);
        renderMobileCards(filtered);
        btn.innerHTML = `Buscar`;
        btn.disabled = false;
        isSearching = false;
    }, 400);
};

// === RELATIVE DATE ("Quedan 3 días") ===
function relativeDate(deadline) {
    const diff = daysDiff(deadline);
    if (diff < 0) return `<span class="text-slate-400 line-through">${deadline}</span>`;
    if (diff === 0) return `<span class="text-red-600 font-bold animate-pulse">¡Hoy!</span>`;
    if (diff === 1) return `<span class="text-orange-600 font-bold">Mañana</span>`;
    if (diff <= 3) return `<span class="text-orange-500 font-bold">${deadline}<br><span class="text-[10px]">Quedan ${diff} días</span></span>`;
    if (diff <= 7) return `<span class="text-slate-700">${deadline}<br><span class="text-[10px] text-slate-400">Quedan ${diff} días</span></span>`;
    return `<span class="text-slate-500">${deadline}<br><span class="text-[10px] text-slate-400">${diff} días restantes</span></span>`;
}

// === TABLE (Enterprise) ===
const renderTable = (data) => {
    const tbody = document.getElementById('resultsTableBody');
    const empty = document.getElementById('emptyState');
    const pag = document.getElementById('paginationFooter');
    const visited = getVisited();
    tbody.innerHTML = '';
    document.getElementById('resultsCount').innerText = `(${data.length} encontrados)`;

    if (!data.length) {
        empty.classList.remove('hidden');
        pag.classList.add('hidden');
        return;
    }
    empty.classList.add('hidden');
    pag.classList.remove('hidden');
    document.getElementById('totalResultsText').innerText = data.length;
    document.getElementById('currentRange').innerText = `1 a ${Math.min(data.length, 25)}`;

    data.slice(0, 25).forEach(item => {
        const diff = daysDiff(item.deadline);
        let badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Abierta</span>`;
        if (diff < 0) badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">Cerrada</span>`;
        else if (diff <= 3) badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 animate-pulse">Cierra pronto</span>`;

        const isVisited = visited.includes(item.id);
        const matchColor = item.match > 50 ? 'text-green-500' : 'text-slate-400';
        const row = document.createElement('tr');
        row.className = `hover:bg-blue-50/50 dark:hover:bg-slate-800/50 cursor-pointer group border-b border-slate-100 dark:border-slate-800 transition-all ${diff < 0 ? 'opacity-40' : ''} ${isVisited ? 'row-visited' : ''}`;
        row.onclick = (e) => { if (!e.target.closest('.action-trigger')) { markVisited(item.id); row.classList.add('row-visited'); openDrawer(item.id); } };
        row.innerHTML = `
            <td class="py-4 px-6 sticky-col">
                <div class="flex flex-col max-w-xs">
                    <span class="text-sm font-bold ${isVisited ? 'text-slate-400' : 'text-slate-900 dark:text-white'} truncate group-hover:text-primary transition-colors" title="${item.title}">${item.title}</span>
                    <span class="text-[10px] text-slate-400 font-mono mt-1">${item.id}</span>
                </div>
            </td>
            <td class="py-4 px-6"><span class="text-xs font-semibold text-slate-600">${item.agency}</span></td>
            <td class="py-4 px-6 text-right"><span class="text-sm font-black tabular-nums">${formatPEN(item.budgetMax)}</span></td>
            <td class="py-4 px-6 text-sm">${relativeDate(item.deadline)}</td>
            <td class="py-4 px-6 text-center text-xs font-bold ${matchColor}">${item.match}%</td>
            <td class="py-4 px-6 text-center">${badge}</td>
            <td class="py-4 px-6 text-center"><span class="material-symbols-outlined text-red-400 hover:text-red-600 text-lg cursor-pointer" title="Bases PDF" onclick="event.stopPropagation()">picture_as_pdf</span></td>
            <td class="py-4 px-2 text-right relative action-trigger" tabindex="0">
                <span class="material-symbols-outlined text-slate-300 hover:text-slate-600 cursor-pointer text-lg" onclick="event.stopPropagation()">more_vert</span>
                <div class="action-menu bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 w-48 right-0">
                    <button onclick="event.stopPropagation(); openDrawer('${item.id}')" class="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><span class="material-symbols-outlined text-sm">visibility</span>Ver Detalle</button>
                    <button onclick="event.stopPropagation(); sendToWebhook('${item.id}')" class="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><span class="material-symbols-outlined text-sm">send</span>Enviar a CRM</button>
                    <button onclick="event.stopPropagation(); toggleDiscard('${item.id}')" class="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2"><span class="material-symbols-outlined text-sm">archive</span>Descartar</button>
                </div>
            </td>`;
        tbody.appendChild(row);
    });
};

// === MOBILE CARDS ===
const renderMobileCards = (data) => {
    const c = document.getElementById('mobileCards');
    if (!c) return;
    c.innerHTML = data.slice(0, 25).map(item => {
        const diff = daysDiff(item.deadline);
        let bc = 'bg-green-100 text-green-700', bt = 'Abierta';
        if (diff < 0) { bc = 'bg-slate-100 text-slate-500'; bt = 'Cerrada'; }
        else if (diff <= 3) { bc = 'bg-orange-100 text-orange-600'; bt = 'Cierra pronto'; }
        return `<div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all" onclick="openDrawer('${item.id}')">
            <div class="flex justify-between items-start mb-2"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${bc}">${bt}</span><span class="text-xs font-bold ${item.match > 50 ? 'text-green-500' : 'text-slate-400'}">${item.match}%</span></div>
            <h3 class="text-sm font-bold text-slate-900 mb-1 leading-snug">${item.title}</h3>
            <p class="text-xs text-slate-500 mb-3">${item.agency} • ${item.location}</p>
            <div class="flex justify-between items-center"><span class="text-sm font-black tabular-nums">${formatPEN(item.budgetMax)}</span><span class="text-[10px] text-slate-400">${relativeDate(item.deadline)}</span></div>
        </div>`;
    }).join('');
};

// =========================
// EXPORT CSV
// =========================
window.exportCSV = () => {
    if (!lastFiltered.length) { alert('No hay datos para exportar.'); return; }
    const headers = ['ID', 'Título', 'Agencia', 'Región', 'Presupuesto Mín', 'Presupuesto Máx', 'Publicación', 'Cierre', 'Match (%)', 'Estado'];
    const rows = lastFiltered.map(d => {
        const diff = daysDiff(d.deadline);
        const status = diff < 0 ? 'Cerrada' : (diff <= 3 ? 'Cierre Próximo' : 'Abierta');
        return [d.id, `"${d.title}"`, `"${d.agency}"`, d.location, d.budgetMin, d.budgetMax, d.publishDate, d.deadline, d.match, status];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `licitaciones_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
};

// =========================
// WEBHOOK SIMULATION
// =========================
window.sendToWebhook = (id) => {
    const item = currentData.find(d => d.id === id);
    if (!item) return;
    const payload = { id: item.id, title: item.title, agency: item.agency, budget: item.budgetMax, deadline: item.deadline };
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));
    // Future: fetch('https://hook.make.com/xxx', { method: 'POST', body: JSON.stringify(payload) });
    alert(`✅ Datos de "${item.id}" enviados al CRM.\n\nEn producción, esto se conectará a Make.com o su ERP interno.`);
};

// =========================
// DRAWER
// =========================
window.openDrawer = (id) => {
    const item = currentData.find(d => d.id === id);
    if (!item) return;
    currentDrawerId = id;
    markVisited(id);

    document.getElementById('drawerTitle').innerText = item.title;
    document.getElementById('drawerId').innerText = item.id;
    document.getElementById('drawerAgency').innerText = item.agency;
    document.getElementById('drawerLocation').innerText = item.location;
    document.getElementById('drawerBudget').innerText = formatPEN(item.budgetMax);
    document.getElementById('drawerDesc').innerText = item.description || 'Sin descripción.';
    document.getElementById('drawerFullLink').href = `detalle.html?id=${id}`;

    const diff = daysDiff(item.deadline);
    const badge = document.getElementById('drawerBadge');
    if (diff < 0) { badge.innerText = 'Cerrada'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500'; }
    else if (diff <= 3) { badge.innerText = 'Cierra pronto'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600 animate-pulse'; }
    else { badge.innerText = 'Abierta'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700'; }

    const saved = JSON.parse(localStorage.getItem('seguidos') || '[]');
    updateDrawerFollowBtn(saved.includes(id));

    const tl = document.getElementById('drawerTimeline');
    tl.innerHTML = [
        { name: 'Convocatoria', date: item.publishDate, done: true },
        { name: 'Consultas', date: '---', done: diff < 10 },
        { name: 'Presentación', date: item.deadline, done: diff < 0 },
        { name: 'Adjudicación', date: '---', done: false },
    ].map(p => `<div class="flex items-center gap-3"><span class="material-symbols-outlined text-sm ${p.done ? 'text-green-500' : 'text-slate-300'}">${p.done ? 'check_circle' : 'radio_button_unchecked'}</span><span class="text-xs font-semibold ${p.done ? 'text-slate-700' : 'text-slate-400'}">${p.name}</span><span class="text-[10px] text-slate-400 ml-auto">${p.date}</span></div>`).join('');

    const rq = document.getElementById('drawerRequirements');
    rq.innerHTML = (item.requirements || []).map(r => `<div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"><span class="material-symbols-outlined text-primary text-sm">check_circle</span><span class="text-xs font-semibold text-slate-700">${r}</span></div>`).join('');

    const overlay = document.getElementById('drawerOverlay');
    const panel = document.getElementById('drawerPanel');
    overlay.classList.remove('hidden');
    setTimeout(() => { overlay.classList.add('opacity-100'); panel.classList.remove('translate-x-full'); }, 10);
};

window.closeDrawer = () => {
    const overlay = document.getElementById('drawerOverlay');
    const panel = document.getElementById('drawerPanel');
    overlay.classList.remove('opacity-100');
    panel.classList.add('translate-x-full');
    setTimeout(() => overlay.classList.add('hidden'), 300);
    currentDrawerId = null;
};

window.toggleDrawerFollow = () => {
    if (!currentDrawerId) return;
    let saved = JSON.parse(localStorage.getItem('seguidos') || '[]');
    const f = saved.includes(currentDrawerId);
    if (f) saved = saved.filter(s => s !== currentDrawerId);
    else saved.push(currentDrawerId);
    localStorage.setItem('seguidos', JSON.stringify(saved));
    updateDrawerFollowBtn(!f);
};

function updateDrawerFollowBtn(isFollowing) {
    const btn = document.getElementById('drawerFollowBtn');
    if (isFollowing) {
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">bookmark_added</span> Siguiendo';
        btn.classList.add('border-primary', 'text-primary', 'bg-primary/5');
        btn.classList.remove('border-slate-200', 'text-slate-500');
    } else {
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">bookmark</span> Seguir';
        btn.classList.remove('border-primary', 'text-primary', 'bg-primary/5');
        btn.classList.add('border-slate-200', 'text-slate-500');
    }
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

// === UTILS ===
function formatPEN(v) { return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(v); }
function daysDiff(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }

// === EVENTS ===
document.getElementById('searchBtn')?.addEventListener('click', applyFilters);
document.getElementById('activeOnlyToggle')?.addEventListener('change', applyFilters);
document.getElementById('sortSelect')?.addEventListener('change', applyFilters);
document.getElementById('searchInput')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFilters(); });

document.addEventListener('DOMContentLoaded', loadData);
