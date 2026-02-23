// ==========================================
// SEACE - MOTOR DE BÚSQUEDA INTELIGENTE v2.5
// ==========================================

let currentData = [];

async function loadData() {
    simulateLoading(true);
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('No se encontró data.json');
        currentData = await response.json();

        // Sincronización Inicial
        updateDashboardStats(currentData);
        updateSidebarBadges(currentData);
        applyFilters();
    } catch (error) {
        console.warn("Usando datos de demostración...");
        currentData = []; // Opcional: cargar demo masiva aquí
        applyFilters();
    } finally {
        setTimeout(() => simulateLoading(false), 800);
    }
}

// SIMULADOR DE CARGA (Loading State)
function simulateLoading(isLoading) {
    const searchBtn = document.getElementById('searchBtn');
    if (isLoading) {
        searchBtn.innerHTML = `<span class="animate-spin material-symbols-outlined">sync</span> Cargando...`;
        searchBtn.disabled = true;
        document.getElementById('resultsTableBody').classList.add('opacity-30');
    } else {
        searchBtn.innerHTML = `Buscar <span class="material-symbols-outlined">search</span>`;
        searchBtn.disabled = false;
        document.getElementById('resultsTableBody').classList.remove('opacity-30');
    }
}

// NAVEGACIÓN ENTRE VISTAS
window.switchView = (viewName) => {
    document.querySelectorAll('.view-section').forEach(section => section.classList.add('hidden'));
    document.getElementById(`${viewName}View`).classList.remove('hidden');
    updateNavStyles(viewName);
};

function updateNavStyles(activeView) {
    const ids = ['Dashboard', 'Search', 'Analytics'];
    ids.forEach(id => {
        const el = document.getElementById(`nav${id}`);
        if (id.toLowerCase() === activeView) {
            el.classList.add('bg-primary/10', 'text-primary');
            el.classList.remove('text-slate-600', 'dark:text-slate-400');
        } else {
            el.classList.remove('bg-primary/10', 'text-primary');
            el.classList.add('text-slate-600', 'dark:text-slate-400');
        }
    });
}

// DASHBOARD: Métricas Reales
function updateDashboardStats(data) {
    const total = data.length;
    const budget = data.reduce((acc, curr) => acc + curr.budgetMax, 0);
    const match = total > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.match, 0) / total) : 0;

    document.getElementById('statTotal').innerText = total;
    document.getElementById('statBudget').innerText = formatCurrency(budget);
    document.getElementById('statMatch').innerText = `${match}%`;
}

// SIDEBAR: Badges Dinámicos
function updateSidebarBadges(data) {
    const nuevas = data.filter(d => {
        const pDate = new Date(d.publishDate);
        const hoy = new Date();
        return (hoy - pDate) < (48 * 60 * 60 * 1000); // 48h
    }).length;

    const cierre = data.filter(d => {
        const dDate = new Date(d.deadline);
        const hoy = new Date();
        const diff = (dDate - hoy) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 3;
    }).length;

    // Nota: Si los IDs de los badges no existen, esto no fallará por el opcional
    const badgeNuevas = document.querySelector('[id*="badgeNuevas"]');
    const badgeCierre = document.querySelector('[id*="badgeCierre"]');
    if (badgeNuevas) badgeNuevas.innerText = nuevas;
    if (badgeCierre) badgeCierre.innerText = cierre;
}

// FILTRADO Y RENDERIZADO
const applyFilters = () => {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const regionVal = document.getElementById("regionSelect").value;
    const activeOnly = document.getElementById("activeOnlyToggle").checked;

    let filtered = currentData.filter(item => {
        if (activeOnly) {
            if (new Date(item.deadline) < new Date()) return false;
        }
        const matchSearch = `${item.title} ${item.agency} ${item.location}`.toLowerCase().includes(searchText);
        const matchRegion = !regionVal || item.location === regionVal;
        return matchSearch && matchRegion;
    });

    renderTable(filtered);
};

const renderTable = (data) => {
    const tbody = document.getElementById("resultsTableBody");
    const emptyState = document.getElementById("emptyState");
    const pagFooter = document.getElementById("paginationFooter");
    const headerCount = document.getElementById("resultsCount");

    tbody.innerHTML = "";
    headerCount.innerText = `(${data.length} encontrados)`;

    if (data.length === 0) {
        emptyState.classList.remove('hidden');
        pagFooter.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    pagFooter.classList.remove('hidden');

    // Sincronización de Footer
    document.getElementById('totalResultsText').innerText = data.length;
    document.getElementById('currentRange').innerText = `1 a ${Math.min(data.length, 10)}`;

    data.forEach(item => {
        const hoy = new Date();
        const limite = new Date(item.deadline);
        const diff = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));

        let badge = `<span class="px-2 py-1 rounded-full text-[10px] bg-green-100 text-green-700 font-bold">Abierta</span>`;
        if (diff < 0) badge = `<span class="px-2 py-1 rounded-full text-[10px] bg-slate-100 text-slate-500 font-bold">Cerrada</span>`;
        else if (diff <= 3) badge = `<span class="px-2 py-1 rounded-full text-[10px] bg-orange-100 text-orange-600 font-bold animate-pulse">Cierra pronto</span>`;

        const row = document.createElement("tr");
        row.className = `hover:bg-slate-50 transition-all cursor-pointer group border-b border-slate-100 dark:border-slate-800 ${diff < 0 ? 'opacity-50' : ''}`;
        row.onclick = () => window.location.href = `detalle.html?id=${item.id}`;

        row.innerHTML = `
            <td class="py-5 px-6">
                <div class="flex flex-col max-w-xs md:max-w-md">
                    <span class="text-sm font-bold text-slate-900 dark:text-white truncate" title="${item.title}">${item.title}</span>
                    <span class="text-[10px] text-slate-400 font-mono mt-1">${item.id}</span>
                </div>
            </td>
            <td class="py-5 px-6"><span class="text-xs font-semibold text-slate-600 dark:text-slate-300">${item.agency}</span></td>
            <td class="py-5 px-6"><span class="text-sm font-black">${formatCurrency(item.budgetMax)}</span></td>
            <td class="py-5 px-6 text-sm text-slate-500">${item.deadline}</td>
            <td class="py-5 px-6 text-center text-xs font-bold ${item.match > 80 ? 'text-green-500' : 'text-slate-400'}">${item.match}%</td>
            <td class="py-5 px-6 text-center">${badge}</td>
            <td class="py-5 px-6 text-right"><span class="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span></td>
        `;
        tbody.appendChild(row);
    });
};

function formatCurrency(v) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(v);
}

// EVENT LISTENERS
document.getElementById("searchBtn").addEventListener("click", applyFilters);
document.getElementById("activeOnlyToggle").addEventListener("change", applyFilters);
document.addEventListener("DOMContentLoaded", loadData);
