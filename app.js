// ==========================================
// SEACE - MOTOR DE BÚSQUEDA INTELIGENTE v3.0
// Todas las observaciones implementadas
// ==========================================

let currentData = [];
let isSearching = false; // Anti doble-clic

async function loadData() {
    showSkeleton(true);
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('No data.json');
        currentData = await response.json();
        updateDashboardStats(currentData);
        updateSidebarBadges(currentData);
        applyFilters();
    } catch (error) {
        console.warn("Demo mode:", error);
        currentData = [];
        applyFilters();
    }
}

// === SKELETON LOADER ===
function showSkeleton(show) {
    const skeleton = document.getElementById('skeletonLoader');
    const table = document.querySelector('table');
    if (show) {
        skeleton.classList.remove('hidden');
        table.classList.add('hidden');
    } else {
        skeleton.classList.add('hidden');
        table.classList.remove('hidden');
    }
}

// === NAVEGACIÓN ENTRE VISTAS ===
window.switchView = (viewName) => {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${viewName}View`).classList.remove('hidden');
    ['Dashboard', 'Search', 'Analytics'].forEach(id => {
        const el = document.getElementById(`nav${id}`);
        if (id.toLowerCase() === viewName) {
            el.className = 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors cursor-pointer';
        } else {
            el.className = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors group cursor-pointer';
        }
    });
};

// === DASHBOARD: Métricas Reales ===
function updateDashboardStats(data) {
    const total = data.length;
    const budget = data.reduce((acc, d) => acc + d.budgetMax, 0);
    const match = total > 0 ? Math.round(data.reduce((acc, d) => acc + d.match, 0) / total) : 0;
    document.getElementById('statTotal').innerText = total;
    document.getElementById('statBudget').innerText = formatPEN(budget);
    document.getElementById('statMatch').innerText = `${match}%`;
}

// === SIDEBAR: Badges Dinámicos ===
function updateSidebarBadges(data) {
    const hoy = new Date();
    const nuevas = data.filter(d => {
        const p = new Date(d.publishDate);
        return (hoy - p) < (48 * 60 * 60 * 1000); // últimas 48h
    }).length;
    const cierre = data.filter(d => {
        const dif = (new Date(d.deadline) - hoy) / (1000 * 60 * 60 * 24);
        return dif > 0 && dif <= 3;
    }).length;
    document.getElementById('badgeNuevas').innerText = nuevas;
    document.getElementById('badgeCierre').innerText = cierre;
}

// === ALERTAS: Filtrar desde sidebar ===
window.filterByAlert = (tipo) => {
    switchView('search');
    const hoy = new Date();
    if (tipo === 'nuevas') {
        const filtered = currentData.filter(d => (hoy - new Date(d.publishDate)) < (48 * 60 * 60 * 1000));
        renderTable(filtered);
        renderMobileCards(filtered);
    } else if (tipo === 'cierre') {
        const filtered = currentData.filter(d => {
            const dif = (new Date(d.deadline) - hoy) / (1000 * 60 * 60 * 24);
            return dif > 0 && dif <= 3;
        });
        renderTable(filtered);
        renderMobileCards(filtered);
    }
};

// === FILTRO DE PRESUPUESTO: Custom Min/Max ===
const budgetSelect = document.getElementById('budgetSelect');
budgetSelect.addEventListener('change', () => {
    const custom = document.getElementById('customBudgetInputs');
    if (budgetSelect.value === 'custom') {
        custom.classList.remove('hidden');
        custom.classList.add('flex');
    } else {
        custom.classList.add('hidden');
        custom.classList.remove('flex');
    }
    applyFilters();
});

// === FILTRADO PRINCIPAL ===
const applyFilters = () => {
    // Anti doble-clic
    if (isSearching) return;
    isSearching = true;
    const btn = document.getElementById('searchBtn');
    btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> Buscando...`;
    btn.disabled = true;

    setTimeout(() => {
        const searchText = document.getElementById('searchInput').value.toLowerCase();
        const regionVal = document.getElementById('regionSelect').value;
        const activeOnly = document.getElementById('activeOnlyToggle').checked;
        const budgetVal = budgetSelect.value;
        const sortVal = document.getElementById('sortSelect').value;

        let filtered = currentData.filter(item => {
            // Filtro activas
            if (activeOnly && new Date(item.deadline) < new Date()) return false;

            // Búsqueda global
            const content = `${item.title} ${item.agency} ${item.location} ${item.description || ''}`.toLowerCase();
            if (searchText && !content.includes(searchText)) return false;

            // Región
            if (regionVal && item.location !== regionVal) return false;

            // Presupuesto
            const avg = (item.budgetMin + item.budgetMax) / 2;
            if (budgetVal === 'viable' && (avg < 50000 || avg > 1000000)) return false;
            if (budgetVal === 'high' && avg <= 1000000) return false;
            if (budgetVal === 'low' && avg >= 50000) return false;
            if (budgetVal === 'custom') {
                const minInput = parseFloat(document.getElementById('budgetMin').value) || 0;
                const maxInput = parseFloat(document.getElementById('budgetMax').value) || Infinity;
                if (item.budgetMax < minInput || item.budgetMin > maxInput) return false;
            }
            return true;
        });

        // Ordenamiento
        if (sortVal === 'Relevancia (Match)') filtered.sort((a, b) => b.match - a.match);
        else if (sortVal === 'Presupuesto (Mayor a Menor)') filtered.sort((a, b) => b.budgetMax - a.budgetMax);
        else if (sortVal === 'Cierre Próximo') filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        showSkeleton(false);
        renderTable(filtered);
        renderMobileCards(filtered);

        // Restaurar botón
        btn.innerHTML = `Buscar`;
        btn.disabled = false;
        isSearching = false;
    }, 600); // Simula carga para UX
};

// === RENDER TABLE (Desktop) ===
const renderTable = (data) => {
    const tbody = document.getElementById('resultsTableBody');
    const emptyState = document.getElementById('emptyState');
    const pagFooter = document.getElementById('paginationFooter');

    tbody.innerHTML = '';
    document.getElementById('resultsCount').innerText = `(${data.length} encontrados)`;

    if (data.length === 0) {
        emptyState.classList.remove('hidden');
        pagFooter.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    pagFooter.classList.remove('hidden');
    document.getElementById('totalResultsText').innerText = data.length;
    document.getElementById('currentRange').innerText = `1 a ${Math.min(data.length, 25)}`;

    data.slice(0, 25).forEach(item => {
        const diff = daysDiff(item.deadline);
        let badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Abierta</span>`;
        if (diff < 0) badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">Cerrada</span>`;
        else if (diff <= 3) badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 animate-pulse">Cierra pronto</span>`;

        const matchColor = item.match > 50 ? 'text-green-500' : 'text-slate-400';
        const row = document.createElement('tr');
        row.className = `hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group border-b border-slate-100 dark:border-slate-800 transition-all ${diff < 0 ? 'opacity-50' : ''}`;
        row.onclick = () => window.location.href = `detalle.html?id=${item.id}`;
        row.innerHTML = `
            <td class="py-5 px-6"><div class="flex flex-col max-w-xs"><span class="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors" title="${item.title}">${item.title}</span><span class="text-[10px] text-slate-400 font-mono mt-1">${item.id}</span></div></td>
            <td class="py-5 px-6"><span class="text-xs font-semibold text-slate-600">${item.agency}</span></td>
            <td class="py-5 px-6"><span class="text-sm font-black">${formatPEN(item.budgetMax)}</span></td>
            <td class="py-5 px-6 text-sm text-slate-500">${item.deadline}</td>
            <td class="py-5 px-6 text-center text-xs font-bold ${matchColor}">${item.match}%</td>
            <td class="py-5 px-6 text-center">${badge}</td>
            <td class="py-5 px-6 text-right"><span class="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span></td>`;
        tbody.appendChild(row);
    });
};

// === RENDER MOBILE CARDS (Responsive) ===
const renderMobileCards = (data) => {
    const container = document.getElementById('mobileCards');
    if (!container) return;
    container.innerHTML = data.slice(0, 25).map(item => {
        const diff = daysDiff(item.deadline);
        let badgeColor = 'bg-green-100 text-green-700';
        let badgeText = 'Abierta';
        if (diff < 0) { badgeColor = 'bg-slate-100 text-slate-500'; badgeText = 'Cerrada'; }
        else if (diff <= 3) { badgeColor = 'bg-orange-100 text-orange-600'; badgeText = 'Cierra pronto'; }

        return `
        <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:shadow-md transition-all" onclick="window.location.href='detalle.html?id=${item.id}'">
            <div class="flex justify-between items-start mb-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}">${badgeText}</span>
                <span class="text-xs font-bold ${item.match > 50 ? 'text-green-500' : 'text-slate-400'}">${item.match}% match</span>
            </div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">${item.title}</h3>
            <p class="text-xs text-slate-500 mb-3">${item.agency} • ${item.location}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm font-black text-slate-900">${formatPEN(item.budgetMax)}</span>
                <span class="text-[10px] text-slate-400">${item.deadline}</span>
            </div>
        </div>`;
    }).join('');
};

// === UTILIDADES ===
function formatPEN(v) { return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(v); }
function daysDiff(deadline) { return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)); }

// === EVENT LISTENERS ===
document.getElementById('searchBtn').addEventListener('click', applyFilters);
document.getElementById('activeOnlyToggle').addEventListener('change', applyFilters);
document.getElementById('sortSelect').addEventListener('change', applyFilters);
document.getElementById('searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFilters(); });

document.addEventListener('DOMContentLoaded', loadData);
