// ==========================================
// Lógica de Detalle de Licitación (v1.1)
// ==========================================

async function loadDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const tenderId = urlParams.get('id');

    if (!tenderId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const tender = data.find(t => t.id === tenderId);

        if (!tender) {
            console.error("Licitación no encontrada");
            return;
        }

        // Inyectar datos básicos
        document.getElementById('tenderTitle').innerText = tender.title;
        document.getElementById('tenderId').innerText = tender.id;
        document.getElementById('tenderAgency').innerText = tender.agency;
        document.getElementById('tenderDescription').innerText = tender.description;

        // Formateo de Presupuesto
        const formatMoney = (amount) => {
            if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
            if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
            return amount;
        };

        const budgetText = `S/ ${formatMoney(tender.budgetMin)} - ${formatMoney(tender.budgetMax)}`;
        document.getElementById('tenderBudget').innerText = budgetText;

        // Requisitos con Diseño de Checks
        const reqContainer = document.getElementById('tenderRequirements');
        if (tender.requirements && tender.requirements.length > 0) {
            reqContainer.innerHTML = tender.requirements.map(req => `
                <div class="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span class="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                    <span class="text-slate-700 dark:text-slate-300 font-medium">${req}</span>
                </div>
            `).join('');
        } else {
            reqContainer.innerHTML = `<p class="text-slate-400 italic">No hay requisitos específicos listados.</p>`;
        }

    } catch (error) {
        console.error("Error cargando detalle:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadDetail);
