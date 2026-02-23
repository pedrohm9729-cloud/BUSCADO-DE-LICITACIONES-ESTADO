// ==========================================
// SEACE - MOTOR DE BÚSQUEDA INTELIGENTE v2.2
// ==========================================

let currentData = [];

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('No se encontró data.json');
        currentData = await response.json();
        console.log("Motor de Búsqueda: Datos cargados.");

        // Inicializar vistas y estadísticas
        updateDashboardStats();
        applyFilters();
    } catch (error) {
        console.warn("Usando datos de demostración...");
        currentData = [
            { id: "DEMO-01", title: "Obra de Prueba", agency: "Muni Lima", location: "Lima", budgetMin: 100000, budgetMax: 200000, deadline: "2024-12-31", publishDate: "2024-02-23", cubso: "7212", match: 100, status: "Abierta", description: "Prueba" }
        ];
        updateDashboardStats();
        applyFilters();
    }
}

// LÓGICA DE NAVEGACIÓN (VISTAS)
window.switchView = (viewName) => {
    // Ocultar todas las secciones
    document.querySelectorAll('.view-section').forEach(section => section.classList.add('hidden'));

    // Mostrar la seleccionada
    document.getElementById(`${viewName}View`).classList.remove('hidden');

    // Actualizar estilos del menú lateral
    updateNavStyles(viewName);
};

function updateNavStyles(activeView) {
    const navItems = {
        dashboard: document.getElementById('navDashboard'),
        search: document.getElementById('navSearch'),
        analytics: document.getElementById('navAnalytics')
    };

    Object.keys(navItems).forEach(key => {
        const el = navItems[key];
        if (key === activeView) {
            el.classList.add('bg-primary/10', 'text-primary');
            el.classList.remove('text-slate-600', 'dark:text-slate-400');
        } else {
            el.classList.remove('bg-primary/10', 'text-primary');
            el.classList.add('text-slate-600', 'dark:text-slate-400');
        }
    });
}

// ESTADÍSTICAS DEL DASHBOARD
function updateDashboardStats() {
    if (!currentData.length) return;

    const total = currentData.length;
    const totalBudget = currentData.reduce((acc, curr) => acc + curr.budgetMax, 0);
    const avgMatch = Math.round(currentData.reduce((acc, curr) => acc + curr.match, 0) / total);

    document.getElementById('statTotal').innerText = total;
    document.getElementById('statBudget').innerText = formatCurrency(totalBudget);
    document.getElementById('statMatch').innerText = `${avgMatch}%`;
}

// UI Elements & Filtros (Existentes)
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const cubsoSelect = document.getElementById("cubsoSelect");
const budgetSelect = document.getElementById("budgetSelect");
const sortSelect = document.getElementById("sortSelect");
const activeOnlyToggle = document.getElementById("activeOnlyToggle");

function formatCurrency(amount) {
    if (amount >= 1000000) return `S/ ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `S/ ${(amount / 1000).toFixed(0)}k`;
    return `S/ ${amount}`;
}

const applyFilters = () => {
    const searchText = searchInput.value.toLowerCase().trim();
    const regionVal = regionSelect.value;
    const cubsoVal = cubsoSelect.value;
    const budgetVal = budgetSelect.value;
    const sortVal = sortSelect.value;
    const activeOnly = activeOnlyToggle.checked;

    let filtered = currentData.filter(item => {
        if (activeOnly) {
            const hoy = new Date();
            const limite = new Date(item.deadline);
            if (limite < hoy) return false;
        }
        const content = `${item.title} ${item.description} ${item.id} ${item.agency} ${item.location}`.toLowerCase();
        if (searchText && !content.includes(searchText)) return false;
        if (regionVal && item.location !== regionVal && item.location !== "Nacional") return false;
        if (cubsoVal && item.cubso !== cubsoVal) return false;
        if (budgetVal) {
            const avg = (item.budgetMin + item.budgetMax) / 2;
            if (budgetVal === 'viable' && (avg < 50000 || avg > 1000000)) return false;
            if (budgetVal === 'high' && avg <= 1000000) return false;
            if (budgetVal === 'low' && avg >= 50000) return false;
        }
        return true;
    });

    if (sortVal === "Relevancia (Match)") filtered.sort((a, b) => b.match - a.match);
    else if (sortVal === "Presupuesto (Mayor a Menor)") filtered.sort((a, b) => b.budgetMax - a.budgetMax);

    renderTable(filtered);
    updateResultsCount(filtered.length);
};

const renderTable = (data) => {
    const resultsTableBody = document.getElementById("resultsTableBody");
    resultsTableBody.innerHTML = "";
    data.forEach(item => {
        const hoy = new Date();
        const limite = new Date(item.deadline);
        const diffDias = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
        let statusBadge = diffDias < 0 ? `<span class="px-2 py-1 rounded-full text-[10px] bg-slate-200 text-slate-500">Expirada</span>` : (diffDias <= 3 ? `<span class="px-2 py-1 rounded-full text-[10px] bg-orange-100 text-orange-600 animate-pulse">Cierra pronto</span>` : `<span class="px-2 py-1 rounded-full text-[10px] bg-green-100 text-green-700">Abierta</span>`);
        const matchColor = item.match > 80 ? 'text-green-500' : (item.match > 40 ? 'text-yellow-500' : 'text-slate-400');
        const row = document.createElement("tr");
        row.className = `hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group border-b border-slate-100 dark:border-slate-800 ${diffDias < 0 ? 'opacity-50' : ''}`;
        row.onclick = () => window.location.href = `detalle.html?id=${item.id}`;
        row.innerHTML = `<td class="py-5 px-6"><div class="flex flex-col"><span class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary">${item.title}</span><span class="text-[11px] text-slate-400 font-mono">${item.id}</span></div></td><td class="py-5 px-6"><span class="text-xs text-slate-700 dark:text-slate-300 font-medium">${item.agency}</span></td><td class="py-5 px-6"><span class="text-sm font-black">${formatCurrency(item.budgetMax)}</span></td><td class="py-5 px-6 text-sm text-slate-500">${item.deadline}</td><td class="py-5 px-6 text-center text-xs font-bold ${matchColor}">${item.match}%</td><td class="py-5 px-6 text-center">${statusBadge}</td><td class="py-5 px-6 text-right text-slate-300 group-hover:text-primary"><span class="material-symbols-outlined">chevron_right</span></td>`;
        resultsTableBody.appendChild(row);
    });
};

const updateResultsCount = (count) => { document.getElementById("resultsCount").innerText = `(${count} encontrados)`; };

[searchInput, regionSelect, cubsoSelect, budgetSelect, sortSelect, activeOnlyToggle].forEach(el => {
    el.addEventListener("input", applyFilters);
});

document.addEventListener("DOMContentLoaded", loadData);
