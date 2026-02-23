// ==========================================
// Lógica de Detalle de Licitación
// ==========================================

async function loadDetail() {
    // 1. Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const tenderId = urlParams.get('id');

    if (!tenderId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // 2. Cargar la data
        const response = await fetch('data.json');
        const data = await response.json();

        // 3. Buscar la licitación específica
        const tender = data.find(t => t.id === tenderId);

        if (!tender) {
            console.error("Licitación no encontrada");
            return;
        }

        // 4. Inyectar los datos en el HTML
        document.getElementById('tenderTitle').innerText = tender.title;
        document.getElementById('tenderId').innerText = tender.id;
        document.getElementById('tenderAgency').innerText = tender.agency;
        document.getElementById('tenderDescription').innerText = tender.description || "No hay descripción detallada disponible.";

        // Presupuesto
        const formatCurrency = (amount) => {
            if (amount >= 1000000) return `S/ ${(amount / 1000000).toFixed(1)}M`;
            if (amount >= 1000) return `S/ ${(amount / 1000).toFixed(0)}k`;
            return `S/ ${amount}`;
        };
        document.getElementById('tenderBudget').innerHTML = `${formatCurrency(tender.budgetMin)} - ${formatCurrency(tender.budgetMax)} <span class="text-lg font-bold text-slate-400">S/</span>`;

        // Requisitos
        const reqContainer = document.getElementById('tenderRequirements');
        if (tender.requirements && tender.requirements.length > 0) {
            reqContainer.innerHTML = `
                <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/20">
                    <h4 class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined text-[16px]">info</span> Requisitos del Proceso
                    </h4>
                    <ul class="space-y-3">
                        ${tender.requirements.map(req => `
                            <li class="flex items-start gap-3 text-sm text-slate-900 dark:text-slate-100 font-medium">
                                <span class="material-symbols-outlined text-blue-500 shrink-0 text-[20px]">verified</span>
                                <span>${req}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        } else {
            reqContainer.innerHTML = `<p class="text-sm text-slate-500 italic">No se han especificado requisitos técnicos detallados todavía.</p>`;
        }

    } catch (error) {
        console.error("Error cargando detalle:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadDetail);
