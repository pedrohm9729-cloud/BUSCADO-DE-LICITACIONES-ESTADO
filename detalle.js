// ==========================================
// DETALLE DE LICITACIÓN v3.0
// Con Tabs, Timeline, Similares y Follow
// ==========================================

let allData = [];

async function loadDetail() {
    const tenderId = new URLSearchParams(window.location.search).get('id');
    if (!tenderId) { window.location.href = 'index.html'; return; }

    try {
        const res = await fetch('data.json');
        allData = await res.json();
        const tender = allData.find(t => t.id === tenderId);
        if (!tender) return;

        // === RESUMEN ===
        document.getElementById('tenderTitle').innerText = tender.title;
        document.getElementById('tenderId')?.setAttribute('data-id', tender.id);
        document.getElementById('topTenderId').innerText = tender.id;
        document.getElementById('tenderAgency').innerText = tender.agency;
        document.getElementById('tenderLocation').innerText = tender.location;
        document.getElementById('tenderPubDate').innerText = tender.publishDate;
        document.getElementById('tenderDescription').innerText = tender.description;
        document.getElementById('tenderBudget').innerText = formatPEN(tender.budgetMax);

        // Status Badge
        const diff = daysDiff(tender.deadline);
        const badge = document.getElementById('statusBadge');
        if (diff < 0) { badge.innerText = 'Cerrada'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500'; }
        else if (diff <= 3) { badge.innerText = 'Cierra Pronto'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600 animate-pulse'; }
        else { badge.innerText = 'Abierta'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700'; }

        // Match Circle
        const match = tender.match || 0;
        document.getElementById('matchPercent').innerText = `${match}%`;
        document.getElementById('matchArc').setAttribute('stroke-dasharray', `${match}, 100`);

        // Requirements
        const reqBox = document.getElementById('tenderRequirements');
        if (tender.requirements?.length) {
            reqBox.innerHTML = tender.requirements.map(r => `
                <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span class="material-symbols-outlined text-primary">check_circle</span>
                    <span class="text-sm font-semibold text-slate-700">${r}</span>
                </div>`).join('');
        }

        // Entity Profile
        const sameAgency = allData.filter(d => d.agency === tender.agency);
        document.getElementById('entityFreq').innerText = sameAgency.length > 5 ? 'Alta' : (sameAgency.length > 2 ? 'Media' : 'Baja');
        document.getElementById('entityHistory').innerText = `${sameAgency.length} procesos`;

        // Follow State
        const saved = JSON.parse(localStorage.getItem('seguidos') || '[]');
        if (saved.includes(tenderId)) updateFollowBtn(true);

        // === CRONOGRAMA (Timeline) ===
        renderTimeline(tender);

        // === SIMILARES ===
        renderSimilares(tender);

    } catch (e) { console.error("Error:", e); }
}

// TABS
window.switchTab = (tab) => {
    ['Resumen', 'Cronograma', 'Documentos', 'Similares'].forEach(t => {
        document.getElementById(`panel${t}`).classList.toggle('hidden', t.toLowerCase() !== tab);
        document.getElementById(`tab${t}`).className = t.toLowerCase() === tab
            ? 'tab-active pb-4 border-b-2 text-sm transition-all'
            : 'tab-inactive pb-4 border-b-2 text-sm transition-all';
    });
};

// TIMELINE VISUAL
function renderTimeline(tender) {
    const container = document.getElementById('timelineContainer');
    const diff = daysDiff(tender.deadline);

    const phases = [
        { name: 'Planificación', desc: 'Requerimiento aprobado y expediente listo.', status: 'done', icon: 'task_alt' },
        { name: 'Convocatoria', desc: `Publicado el ${tender.publishDate} en SEACE.`, status: 'done', icon: 'campaign' },
        { name: 'Consultas y Observaciones', desc: 'Período para aclaraciones técnicas.', status: diff > 10 ? 'active' : 'done', icon: 'help_center' },
        { name: 'Integración de Bases', desc: 'Bases finales con modificaciones.', status: diff > 5 ? 'pending' : 'active', icon: 'integration_instructions' },
        { name: 'Presentación de Ofertas', desc: `Fecha límite: ${tender.deadline}`, status: diff > 0 ? 'pending' : 'done', icon: 'upload_file' },
        { name: 'Adjudicación', desc: 'Evaluación y otorgamiento de Buena Pro.', status: 'pending', icon: 'emoji_events' },
    ];

    container.innerHTML = phases.map((p, i) => {
        const colors = {
            done: { dot: 'border-green-500 bg-green-500', line: 'bg-green-500', text: 'text-green-600', icon: 'text-green-500' },
            active: { dot: 'border-primary bg-primary', line: 'bg-slate-200', text: 'text-primary', icon: 'text-primary' },
            pending: { dot: 'border-slate-300 bg-white', line: 'bg-slate-200', text: 'text-slate-400', icon: 'text-slate-300' }
        }[p.status];

        return `
        <div class="flex gap-5 ${i < phases.length - 1 ? 'pb-8' : ''}">
            <div class="flex flex-col items-center">
                <div class="timeline-dot ${colors.dot}"></div>
                ${i < phases.length - 1 ? `<div class="timeline-line flex-1 ${colors.line} mt-1"></div>` : ''}
            </div>
            <div class="pb-2 -mt-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="material-symbols-outlined text-base ${colors.icon}">${p.icon}</span>
                    <h4 class="text-sm font-bold ${p.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}">${p.name}</h4>
                    ${p.status === 'active' ? '<span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">En curso</span>' : ''}
                </div>
                <p class="text-xs ${colors.text} ml-6">${p.desc}</p>
            </div>
        </div>`;
    }).join('');
}

// SIMILARES
function renderSimilares(tender) {
    const container = document.getElementById('similarContainer');
    const similares = allData
        .filter(d => d.id !== tender.id && d.match >= 25)
        .sort((a, b) => b.match - a.match)
        .slice(0, 5);

    if (!similares.length) {
        container.innerHTML = '<p class="text-slate-400 text-sm italic">No se encontraron procesos similares.</p>';
        return;
    }

    container.innerHTML = similares.map(s => `
        <a href="detalle.html?id=${s.id}" class="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-all group cursor-pointer">
            <div class="flex-1 min-w-0 mr-4">
                <p class="text-sm font-bold text-slate-800 truncate">${s.title}</p>
                <p class="text-[10px] text-slate-400 mt-1">${s.agency} • ${s.location}</p>
            </div>
            <div class="text-right flex-shrink-0">
                <p class="text-sm font-black text-slate-900">${formatPEN(s.budgetMax)}</p>
                <p class="text-[10px] font-bold ${s.match > 50 ? 'text-green-500' : 'text-slate-400'}">${s.match}% match</p>
            </div>
        </a>
    `).join('');
}

// FOLLOW / SEGUIR
window.toggleFollow = () => {
    const id = new URLSearchParams(window.location.search).get('id');
    let saved = JSON.parse(localStorage.getItem('seguidos') || '[]');
    const isFollowing = saved.includes(id);

    if (isFollowing) { saved = saved.filter(s => s !== id); }
    else { saved.push(id); }

    localStorage.setItem('seguidos', JSON.stringify(saved));
    updateFollowBtn(!isFollowing);
};

function updateFollowBtn(isFollowing) {
    const btn = document.getElementById('followBtn');
    if (isFollowing) {
        btn.innerHTML = '<span class="material-symbols-outlined text-lg">bookmark_added</span> Siguiendo';
        btn.classList.add('border-primary', 'text-primary', 'bg-primary/5');
        btn.classList.remove('border-slate-200', 'text-slate-500');
    } else {
        btn.innerHTML = '<span class="material-symbols-outlined text-lg">bookmark</span> Seguir Proceso';
        btn.classList.remove('border-primary', 'text-primary', 'bg-primary/5');
        btn.classList.add('border-slate-200', 'text-slate-500');
    }
}

// UTILIDADES
function formatPEN(v) { return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(v); }
function daysDiff(deadline) { return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)); }

document.addEventListener('DOMContentLoaded', loadDetail);
