// ==========================================
// SEACE - INPROMETAL Lógica de Filtrado Inteligente
// ==========================================

const mockData = [
    {
        id: "LIC-2024-8892",
        title: "Creación de techado y estructuras metálicas para patio de honor",
        agency: "Municipalidad Provincial",
        location: "Callao",
        budgetMin: 150000,
        budgetMax: 200000,
        deadline: "2024-11-15",
        publishDate: "hace 2 días",
        cubso: "7215",
        match: 95,
        status: "Abierta"
    },
    {
        id: "SEP-JAL-003",
        title: "Mantenimiento preventivo de equipos de cómputo y redes",
        agency: "Ministerio de Educación",
        location: "Lima",
        budgetMin: 30000,
        budgetMax: 45000,
        deadline: "2024-10-20",
        publishDate: "hoy",
        cubso: "OTROS",
        match: 15,
        status: "Cierre Próximo"
    },
    {
        id: "SCT-NL-442",
        title: "Construcción de Puente Peatonal con Estructuras de Hierro",
        agency: "Ministerio de Transportes",
        location: "Nacional",
        budgetMin: 1200000,
        budgetMax: 1800000,
        deadline: "2024-11-05",
        publishDate: "ayer",
        cubso: "7215",
        match: 88,
        status: "Abierta"
    },
    {
        id: "CFE-NAC-101",
        title: "Fabricación y suministro de barandas de fierro negro",
        agency: "Gobierno Regional",
        location: "Lima",
        budgetMin: 60000,
        budgetMax: 90000,
        deadline: "2024-10-30",
        publishDate: "hace 1 semana",
        cubso: "9514",
        match: 92,
        status: "Abierta"
    },
    {
        id: "PJ-QRO-555",
        title: "Servicios de Limpieza Integral y desinfección",
        agency: "Poder Judicial",
        location: "Callao",
        budgetMin: 1500000,
        budgetMax: 2200000,
        deadline: "2024-10-12",
        publishDate: "hace 3 días",
        cubso: "OTROS",
        match: 5,
        status: "Cierre Próximo"
    },
    {
        id: "MINSA-001",
        title: "Consultoría para la elaboración del expediente técnico de hospital",
        agency: "MINSA",
        location: "Nacional",
        budgetMin: 80000,
        budgetMax: 120000,
        deadline: "2024-12-01",
        publishDate: "hace 5 días",
        cubso: "OTROS",
        match: 10,
        status: "Abierta"
    }
];

// Keywords negativas para exclusión
const negativeKeywords = ["consultoría", "limpieza", "computadoras", "redes", "aire acondicionado"];

// UI Elements
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const cubsoSelect = document.getElementById("cubsoSelect");
const budgetSelect = document.getElementById("budgetSelect");
const sortSelect = document.getElementById("sortSelect");
const searchBtn = document.getElementById("searchBtn");
const activeFiltersContainer = document.getElementById("activeFilters");
const resultsTableBody = document.getElementById("resultsTableBody");
const resultsCount = document.getElementById("resultsCount");

// Format Currency
const formatCurrency = (amount) => {
    if (amount >= 1000000) return `S/ ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `S/ ${(amount / 1000).toFixed(0)}k`;
    return `S/ ${amount}`;
};

// Render Table
const renderTable = (data) => {
    resultsTableBody.innerHTML = "";
    resultsCount.innerText = `(${data.length} encontrados)`;

    if (data.length === 0) {
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="py-8 text-center text-slate-500">No se encontraron licitaciones que coincidan con los filtros.</td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {
        // Status Styling
        let statusBadge = '';
        if (item.status === 'Abierta') {
            statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Abierta</span>`;
        } else {
            statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 animate-pulse">Cierre Próximo</span>`;
        }

        // Match color
        let matchColor = 'text-green-500';
        let matchOffset = 100 - item.match;
        if (item.match < 50) matchColor = 'text-red-500';
        else if (item.match < 80) matchColor = 'text-yellow-500';

        const row = document.createElement("tr");
        row.className = "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer";
        row.onclick = () => window.location.href = 'detalle.html';

        row.innerHTML = `
            <td class="py-4 px-6">
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">${item.title}</span>
                    <span class="text-xs text-slate-400 mt-1">ID: ${item.id} • Publicado ${item.publishDate}</span>
                </div>
            </td>
            <td class="py-4 px-6">
                <div class="flex flex-col">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${item.agency}</span>
                    <span class="text-xs text-slate-500">${item.location}</span>
                </div>
            </td>
            <td class="py-4 px-6">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300 tabular-nums">${formatCurrency(item.budgetMin)} - ${formatCurrency(item.budgetMax)}</span>
            </td>
            <td class="py-4 px-6">
                <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span class="text-sm tabular-nums">${item.deadline}</span>
                </div>
            </td>
            <td class="py-4 px-6">
                <div class="flex items-center justify-center gap-2">
                    <div class="relative size-10">
                        <svg class="size-full -rotate-90" viewbox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <circle class="stroke-current text-slate-200 dark:text-slate-700" cx="18" cy="18" fill="none" r="16" stroke-width="3"></circle>
                            <circle class="stroke-current ${matchColor}" cx="18" cy="18" fill="none" r="16" stroke-dasharray="100" stroke-dashoffset="${matchOffset}" stroke-linecap="round" stroke-width="3"></circle>
                        </svg>
                        <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                            <span class="text-center text-[10px] font-bold ${matchColor}">${item.match}%</span>
                        </div>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6 text-center">
                ${statusBadge}
            </td>
            <td class="py-4 px-6 text-right">
                <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
            </td>
        `;
        resultsTableBody.appendChild(row);
    });
};

// Render Active Chips
const renderChips = (filters) => {
    activeFiltersContainer.innerHTML = "";

    // Create base function for chip
    const createChip = (label, colorClass, onClose) => {
        const span = document.createElement("span");
        span.className = `inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`;
        span.innerHTML = `
            ${label}
            <button class="ml-1 hover:opacity-75" onclick="event.stopPropagation(); window.removeFilter('${onClose}')">
                <span class="material-symbols-outlined text-[14px]">close</span>
            </button>
        `;
        activeFiltersContainer.appendChild(span);
    };

    if (filters.region) {
        createChip(`Región: ${filters.region}`, "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700", 'region');
    }
    if (filters.cubso) {
        let label = filters.cubso;
        if (filters.cubso === '7215') label = 'Estructuras Metálicas';
        if (filters.cubso === '9514') label = 'Fabricación Metal';
        createChip(`CUBSO: ${label}`, "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800/30", 'cubso');
    }
    if (filters.budget) {
        let label = filters.budget === 'viable' ? 'S/ 50k - 1M' : (filters.budget === 'high' ? '> 1M' : '< 50k');
        createChip(`Presupuesto: ${label}`, "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700", 'budget');
    }

    if (activeFiltersContainer.innerHTML !== "") {
        const clearBtn = document.createElement("button");
        clearBtn.className = "text-xs text-primary hover:underline font-medium ml-2";
        clearBtn.innerText = "Limpiar todo";
        clearBtn.onclick = () => {
            regionSelect.value = "";
            cubsoSelect.value = "";
            budgetSelect.value = "";
            searchInput.value = "";
            applyFilters();
        };
        activeFiltersContainer.appendChild(clearBtn);
    }
};

// Remove filter handler (exposed to window for onclick string)
window.removeFilter = (type) => {
    if (type === 'region') regionSelect.value = "";
    if (type === 'cubso') cubsoSelect.value = "";
    if (type === 'budget') budgetSelect.value = "";
    applyFilters();
};

// Filter Logic Core
const applyFilters = () => {
    const searchText = searchInput.value.toLowerCase();
    const regionVal = regionSelect.value;
    const cubsoVal = cubsoSelect.value;
    const budgetVal = budgetSelect.value;
    const sortVal = sortSelect.value;

    renderChips({ region: regionVal, cubso: cubsoVal, budget: budgetVal });

    let filtered = mockData.filter(item => {
        // 1. Text Search
        const searchMatch = item.title.toLowerCase().includes(searchText) || item.id.toLowerCase().includes(searchText);
        if (!searchMatch && searchText !== "") return false;

        // 2. Negative Keyword Exclusion (Inteligencia)
        const hasNegative = negativeKeywords.some(kw => item.title.toLowerCase().includes(kw));
        if (hasNegative) return false;

        // 3. Region Filter
        if (regionVal && item.location !== regionVal && item.location !== "Nacional") return false;

        // 4. CUBSO Filter
        if (cubsoVal && item.cubso !== cubsoVal) return false;

        // 5. Budget Viability Filter
        if (budgetVal) {
            const avgBudget = (item.budgetMin + item.budgetMax) / 2;
            if (budgetVal === 'viable' && (avgBudget < 50000 || avgBudget > 1000000)) return false;
            if (budgetVal === 'high' && avgBudget <= 1000000) return false;
            if (budgetVal === 'low' && avgBudget >= 50000) return false;
        }

        return true;
    });

    // Sort Logic
    if (sortVal === "Relevancia (Match)") {
        filtered.sort((a, b) => b.match - a.match);
    } else if (sortVal === "Presupuesto (Mayor a Menor)") {
        filtered.sort((a, b) => b.budgetMax - a.budgetMax);
    } else if (sortVal === "Fecha de Publicación") {
        // Simple sort by deadline for demo
        filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    renderTable(filtered);
};

// Listeners
searchInput.addEventListener("input", applyFilters);
regionSelect.addEventListener("change", applyFilters);
cubsoSelect.addEventListener("change", applyFilters);
budgetSelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);
searchBtn.addEventListener("click", applyFilters);

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    applyFilters();
});
