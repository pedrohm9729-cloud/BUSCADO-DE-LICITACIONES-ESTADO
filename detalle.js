// ==========================================
// Lógica de Detalle de Licitación (v1.2)
// Corregido: Contraste y visibilidad de requisitos
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

        // Inyectar datos con seguridad
        document.getElementById('tenderTitle').innerText = tender.title;
        document.getElementById('tenderId').innerText = tender.id;
        document.getElementById('tenderAgency').innerText = tender.agency;
        document.getElementById('tenderDescription').innerText = tender.description;

        // Formateo de Presupuesto
        const formatMoney = (amount) => {
            return new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
                minimumFractionDigits: 0
            }).format(amount);
        };

        document.getElementById('tenderBudget').innerText = formatMoney(tender.budgetMax);

        // Requisitos con Diseño de Alto Contraste
        const reqContainer = document.getElementById('tenderRequirements');
        if (tender.requirements && tender.requirements.length > 0) {
            reqContainer.innerHTML = tender.requirements.map(req => `
                <div class="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                    <span class="material-symbols-outlined text-primary font-bold">check_circle</span>
                    <span class="text-slate-800 dark:text-slate-200 font-bold text-sm tracking-tight">${req}</span>
                </div>
            `).join('');
        } else {
            reqContainer.innerHTML = `<p class="p-4 bg-slate-50 rounded-2xl text-slate-500 italic">No hay requisitos específicos listados.</p>`;
        }

    } catch (error) {
        console.error("Error cargando detalle:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadDetail);
