// ==========================================
// SEACE - MOTOR DE BÚSQUEDA INTELIGENTE v2.0
// ==========================================

let currentData = [];
const negativeKeywords = ["consultoría", "limpieza", "computadoras", "redes"];

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('No se encontró data.json');
        currentData = await response.json();
        console.log("Motor de Búsqueda: Piscina de datos cargada.");
        applyFilters();
    } catch (error) {
        console.warn("Usando datos de demostración...");
        currentData = [
            {
                id: "PRUEBA-001",
                title: "Ejemplo de Obra General (Cargando datos del robot...)",
                agency: "Institución de Prueba",
                location: "Lima",
                budgetMin: 100000, budgetMax: 200000,
                deadline: "2024-12-31", publishDate: "Hoy",
                cubso: "7212", match: 50, status: "Abierta",
                description: "Esta es una descripción de prueba para verificar el buscador."
            }
        ];
        applyFilters();
    }
}

// UI Elements
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const cubsoSelect = document.getElementById("cubsoSelect");
const budgetSelect = document.getElementById("budgetSelect");
const sortSelect = document.getElementById("sortSelect");
const activeOnlyToggle = document.getElementById("activeOnlyToggle");

const formatCurrency = (amount) => {
    if (amount >= 1000000) return `S/ ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `S/ ${(amount / 1000).toFixed(0)}k`;
    return `S/ ${amount}`;
};

const applyFilters = () => {
    const searchText = searchInput.value.toLowerCase().trim();
    const regionVal = regionSelect.value;
    const cubsoVal = cubsoSelect.value;
    const budgetVal = budgetSelect.value;
    const sortVal = sortSelect.value;
    const activeOnly = activeOnlyToggle.checked;

    let filtered = currentData.filter(item => {
        // Filtrar por activas si el interruptor está encendido
        if (activeOnly) {
            const hoy = new Date();
            const limite = new Date(item.deadline);
            if (limite < hoy) return false;
        }

        const contentToSearch = `${item.title} ${item.description} ${item.id} ${item.agency} ${item.location}`.toLowerCase();
        if (searchText && !contentToSearch.includes(searchText)) return false;
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

    if (sortVal === "Relevancia (Match)") {
        filtered.sort((a, b) => b.match - a.match);
    } else if (sortVal === "Presupuesto (Mayor a Menor)") {
        filtered.sort((a, b) => b.budgetMax - a.budgetMax);
    } else if (sortVal === "Fecha de Publicación") {
        filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    }

    renderTable(filtered);
    updateResultsCount(filtered.length);
};

const renderTable = (data) => {
    const resultsTableBody = document.getElementById("resultsTableBody");
    resultsTableBody.innerHTML = "";

    if (data.length === 0) {
        resultsTableBody.innerHTML = `<tr><td colspan="7" class="py-12 text-center text-slate-400 italic">No hay resultados para esta búsqueda. Intenta con otras palabras.</td></tr>`;
        return;
    }

    data.forEach(item => {
        // Cálculo de estatus inteligente
        const hoy = new Date();
        const limite = new Date(item.deadline);
        const diffTiempo = limite - hoy;
        const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));

        let statusBadge = '';
        let rowClass = 'opacity-100';

        if (diffDias < 0) {
            statusBadge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-500">Expirada</span>`;
            rowClass = 'opacity-50 grayscale-[0.5]';
        } else if (diffDias <= 3) {
            statusBadge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 animate-pulse">Cierra pronto</span>`;
        } else {
            statusBadge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Abierta</span>`;
        }

        const matchColor = item.match > 80 ? 'text-green-500' : (item.match > 40 ? 'text-yellow-500' : 'text-slate-400');

        const row = document.createElement("tr");
        row.className = `hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group border-b border-slate-100 dark:border-slate-800 ${rowClass}`;
        row.onclick = () => window.location.href = `detalle.html?id=${item.id}`;

        row.innerHTML = `
            <td class="py-5 px-6">
                <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">${item.title}</span>
                    <span class="text-[11px] text-slate-400 mt-1 font-mono uppercase">${item.id} • ${item.publishDate}</span>
                </div>
            </td>
            <td class="py-5 px-6">
                <div class="flex flex-col">
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-300">${item.agency}</span>
                    <span class="text-[11px] text-slate-500">${item.location}</span>
                </div>
            </td>
            <td class="py-5 px-6">
                <span class="text-sm font-black text-slate-900 dark:text-white">${formatCurrency(item.budgetMax)}</span>
            </td>
            <td class="py-5 px-6">
                <span class="text-sm text-slate-500">${item.deadline}</span>
            </td>
            <td class="py-5 px-6 text-center">
                <span class="text-xs font-bold ${matchColor}">${item.match}%</span>
            </td>
            <td class="py-5 px-6 text-center">
                ${statusBadge}
            </td>
            <td class="py-5 px-6 text-right text-slate-300 group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined">chevron_right</span>
            </td>
        `;
        resultsTableBody.appendChild(row);
    });
};

const updateResultsCount = (count) => {
    document.getElementById("resultsCount").innerText = `(${count} encontrados)`;
};

[searchInput, regionSelect, cubsoSelect, budgetSelect, sortSelect, activeOnlyToggle].forEach(el => {
    el.addEventListener("input", applyFilters);
});

document.addEventListener("DOMContentLoaded", loadData);
