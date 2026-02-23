// ==========================================
// DETALLE DE LICITACIÓN v4.0
// Layout rediseñado con referencia LicitacionesMX
// ==========================================

let allData = [];
let currentId = null;

async function loadDetail() {
    currentId = new URLSearchParams(window.location.search).get('id');
    if (!currentId) { window.location.href = 'index.html'; return; }

    // Multi-strategy data load
    if (window.SEACE_DATA && Array.isArray(window.SEACE_DATA)) {
        allData = window.SEACE_DATA;
    } else {
        try {
            const res = await fetch('data.json');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            allData = await res.json();
        } catch (e) {
            console.warn('Fetch failed, trying XHR...', e.message);
            try { allData = await loadXHR(); } catch (e2) { showError(); return; }
        }
    }

    const tender = allData.find(t => t.id === currentId);
    if (!tender) { showError(); return; }

    populatePage(tender);
}

function populatePage(tender) {
    const diff = daysDiff(tender.deadline);

    // === HERO ===
    document.title = `${tender.title} | LICITADOR PE`;
    sel('tenderTitle').innerText = tender.title;
    sel('topTenderId').innerText = tender.id;
    sel('tenderAgency').innerText = tender.agency;
    sel('tenderLocation').innerText = tender.location;
    sel('tenderPubDate').innerText = fmtDate(tender.publishDate);
    sel('tenderDescription').innerText = tender.description || 'Sin descripción disponible.';
    sel('drawerFullLink').href = `https://www.seace.gob.pe`;

    // Match Badge
    const match = tender.match || 0;
    sel('matchPct').innerText = `${match}%`;

    // Status Badge
    const badge = sel('statusBadge');
    if (diff < 0) {
        badge.innerText = 'Cerrada';
        badge.className = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500';
    } else if (diff <= 3) {
        badge.innerText = '⚡ Cierra Pronto';
        badge.className = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600 animate-pulse';
    } else {
        badge.innerText = '✓ Abierta';
        badge.className = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700';
    }

    // === METRIC CARDS ===
    sel('tenderBudget').innerText = formatPEN(tender.budgetMax);

    if (diff < 0) {
        sel('daysLeft').innerText = 'Proceso Cerrado';
        sel('daysLeft').className = 'text-2xl font-black text-slate-400 tracking-tight';
        sel('deadlineFull').innerText = `Cerró el ${fmtDate(tender.deadline)}`;
    } else {
        sel('daysLeft').innerText = `Faltan ${diff} día${diff !== 1 ? 's' : ''}`;
        sel('deadlineFull').innerText = `Cierra el ${fmtDateLong(tender.deadline)}`;
        if (diff <= 3) {
            sel('urgencyBadge').classList.remove('hidden');
            sel('deadlineCard').classList.add('border-orange-300', 'bg-orange-50/30');
        }
    }

    // === TIMELINE ===
    renderTimeline(tender);

    // === TAGS ===
    renderTags(tender);

    // === REQUIREMENTS (Checklist) ===
    const reqList = sel('tenderRequirements');
    if (tender.requirements?.length) {
        reqList.innerHTML = tender.requirements.map(r => `
            <li class="flex items-start gap-3 text-sm text-slate-900 font-medium">
                <span class="material-symbols-outlined text-red-500 shrink-0 text-[20px] mt-0.5">verified</span>
                <span>${r}</span>
            </li>`).join('');
    } else {
        reqList.innerHTML = `<li class="text-sm text-slate-500 italic">Consultar bases administrativas.</li>`;
    }

    // Fianza amount
    const fianza = tender.budgetMax * 0.10;
    const fValueEl = document.getElementById('fianzaValue');
    if (fValueEl) fValueEl.innerText = `Valor estimado: ${formatPEN(fianza)}`;

    // === SEMÁFORO ===
    renderSemaforo(tender.budgetMax);

    // === ENTITY PROFILE ===
    const sameAgency = allData.filter(d => d.agency === tender.agency);
    sel('entityFreq').innerText = sameAgency.length > 5 ? 'Alta' : sameAgency.length > 2 ? 'Media' : 'Baja';
    sel('entityHistory').innerText = `${sameAgency.length} proceso${sameAgency.length !== 1 ? 's' : ''}`;

    // === FOLLOW STATE ===
    const saved = JSON.parse(localStorage.getItem('seguidos') || '[]');
    if (saved.includes(currentId)) updateFollowBtn(true);

    // === SIMILARES ===
    renderSimilares(tender);

    // === CALCULATOR INITIAL STATE ===
    const budget = tender.budgetMax || 0;
    if (budget > 0) {
        // Initial defaults (Material: 50%, Labor: 30%)
        sel('calcMaterials').value = Math.round(budget * 0.40);
        sel('calcLabor').value = Math.round(budget * 0.25);
        updateProfitCalc();
    }
}

window.updateProfitCalc = () => {
    const budget = allData.find(t => t.id === currentId)?.budgetMax || 0;
    const materials = parseFloat(sel('calcMaterials').value) || 0;
    const labor = parseFloat(sel('calcLabor').value) || 0;

    // Auto-calc general expenses (fixed 20%)
    const general = (materials + labor) * 0.20;
    sel('calcGeneral').value = Math.round(general);

    const totalCost = materials + labor + general;
    const profit = budget - totalCost;
    const marginPct = budget > 0 ? (profit / budget) * 100 : 0;

    // UI Updates
    sel('calcTotalCostText').innerText = `Costo Total: ${formatPEN(totalCost)}`;
    sel('calcProfitPct').innerText = `${Math.round(marginPct)}%`;

    const bar = sel('calcProfitBar');
    const verdict = sel('bidVerdict');
    const qBtn = sel('preQuoteBtn');

    // Bar and Verdict Styling
    if (marginPct >= 20) {
        bar.className = 'h-full bg-green-500 transition-all';
        sel('calcProfitPct').className = 'text-xl font-black text-green-400 tabular-nums';
        verdict.innerText = 'Excelente Rentabilidad (BID)';
        verdict.className = 'p-3 rounded-lg text-center text-xs font-black uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20';
        if (qBtn) qBtn.classList.remove('hidden');
    } else if (marginPct >= 5) {
        bar.className = 'h-full bg-amber-500 transition-all';
        sel('calcProfitPct').className = 'text-xl font-black text-amber-400 tabular-nums';
        verdict.innerText = 'Margen Ajustado (Cuidado)';
        verdict.className = 'p-3 rounded-lg text-center text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20';
        if (qBtn) qBtn.classList.remove('hidden');
    } else {
        bar.className = 'h-full bg-red-500 transition-all';
        sel('calcProfitPct').className = 'text-xl font-black text-red-400 tabular-nums';
        verdict.innerText = 'No Rentable (NO-BID)';
        verdict.className = 'p-3 rounded-lg text-center text-xs font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20';
        if (qBtn) qBtn.classList.add('hidden');
    }
    bar.style.width = `${Math.max(0, Math.min(100, marginPct))}%`;
};

// ===========================
// TIMELINE VISUAL
// ===========================
function renderTimeline(tender) {
    const container = sel('timelineContainer');
    const diff = daysDiff(tender.deadline);

    const phases = [
        { name: 'Convocatoria Publicada', desc: `Publicado el ${fmtDate(tender.publishDate)} en SEACE.`, status: 'done', date: tender.publishDate },
        { name: 'Consultas y Observaciones', desc: 'Período de aclaraciones técnicas.', status: diff > 10 ? 'active' : 'done', date: '---' },
        { name: 'Integración de Bases', desc: 'Bases finales con modificaciones aprobadas.', status: diff > 5 ? 'pending' : diff > 0 ? 'active' : 'done', date: '---' },
        { name: 'Presentación de Ofertas', desc: `Entrega física y digital de propuestas.`, status: diff > 0 ? 'pending' : 'done', date: tender.deadline },
        { name: 'Adjudicación / Buena Pro', desc: 'Evaluación y otorgamiento de Buena Pro.', status: 'pending', date: '---' },
    ];

    container.innerHTML = phases.map((p, i) => {
        const isLast = i === phases.length - 1;
        const dotClass = p.status === 'done'
            ? 'w-5 h-5 rounded-full bg-green-500 border-4 border-white'
            : p.status === 'active'
                ? 'w-5 h-5 rounded-full bg-primary border-4 border-white pulse-active'
                : 'w-5 h-5 rounded-full bg-slate-200 border-4 border-white';
        const lineClass = p.status === 'done' ? 'bg-green-400' : p.status === 'active' ? 'bg-gradient-to-b from-green-400 to-slate-200' : 'bg-slate-200';

        return `
        <div class="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <div class="absolute -left-[25px] top-1 ${dotClass}"></div>
            ${!isLast ? `<div class="absolute -left-[17px] top-5 bottom-[-28px] w-0.5 ${lineClass}"></div>` : ''}
            <div>
                <p class="text-sm font-bold ${p.status === 'done' ? 'text-slate-800' : p.status === 'active' ? 'text-primary' : 'text-slate-400'}">
                    ${p.name}
                    ${p.status === 'active' ? '<span class="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full">En curso</span>' : ''}
                </p>
                <p class="text-xs ${p.status === 'pending' ? 'text-slate-300' : 'text-slate-500'}">${p.desc}</p>
            </div>
            <span class="text-xs font-mono ${p.status === 'active' ? 'text-primary font-bold' : 'text-slate-400'} shrink-0">${p.date !== '---' ? fmtDate(p.date) : '---'}</span>
        </div>`;
    }).join('');
}

// ===========================
// TAGS ROW
// ===========================
function renderTags(tender) {
    const row = sel('tagsRow');
    const tags = [
        { icon: 'construction', label: 'Estructuras Metálicas' },
        { icon: 'description', label: 'Licitación Pública' },
        { icon: 'location_on', label: tender.location },
        ...(tender.cubso ? [{ icon: 'tag', label: `CUBSO ${tender.cubso}` }] : []),
    ];
    row.innerHTML = tags.map(t => `
        <div class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold flex items-center gap-2 shadow-sm">
            <span class="material-symbols-outlined text-[18px] text-slate-400">${t.icon}</span> ${t.label}
        </div>`).join('');
}

// ===========================
// SEMÁFORO FINANCIERO
// ===========================
function renderSemaforo(budget) {
    const card = sel('semaforoCard');
    const icon = sel('semaforoIcon');
    const text = sel('semaforoText');
    if (!budget || budget === 0) return;
    card.classList.remove('hidden');

    const fianza = budget * 0.10;
    if (fianza <= 50000) {
        icon.className = 'material-symbols-outlined text-2xl text-green-600';
        icon.innerText = 'check_circle';
        text.innerText = `Fianza est. ${formatPEN(fianza)} — Viable sin financiamiento`;
        text.className = 'text-sm font-bold text-green-700';
    } else if (fianza <= 300000) {
        icon.className = 'material-symbols-outlined text-2xl text-amber-500';
        icon.innerText = 'warning';
        text.innerText = `Fianza est. ${formatPEN(fianza)} — Evaluar liquidez disponible`;
        text.className = 'text-sm font-bold text-amber-700';
    } else {
        icon.className = 'material-symbols-outlined text-2xl text-red-500';
        icon.innerText = 'dangerous';
        text.innerText = `Fianza est. ${formatPEN(fianza)} — Requiere consorcio o SGR`;
        text.className = 'text-sm font-bold text-red-700';
    }
}

// ===========================
// SIMILARES
// ===========================
function renderSimilares(tender) {
    const container = sel('similarContainer');
    const similares = allData
        .filter(d => d.id !== tender.id && d.match >= 25)
        .sort((a, b) => b.match - a.match)
        .slice(0, 4);

    if (!similares.length) {
        container.innerHTML = '<p class="text-slate-400 text-sm italic">No se encontraron procesos similares.</p>';
        return;
    }

    container.innerHTML = similares.map(s => {
        const diff = daysDiff(s.deadline);
        return `
        <a href="detalle.html?id=${s.id}"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group">
            <div class="flex-1 min-w-0 mr-4">
                <p class="text-sm font-bold text-slate-800 truncate group-hover:text-primary transition-colors">${s.title}</p>
                <p class="text-xs text-slate-400 mt-0.5">${s.agency} • ${s.location}</p>
            </div>
            <div class="text-right shrink-0">
                <p class="text-sm font-black text-slate-900">${formatPEN(s.budgetMax)}</p>
                <p class="text-[10px] font-bold mt-0.5 ${s.match >= 50 ? 'text-green-600' : 'text-slate-400'}">${s.match}% match</p>
            </div>
        </a>`;
    }).join('');
}

// ===========================
// FOLLOW / SEGUIR
// ===========================
window.toggleFollow = () => {
    let saved = JSON.parse(localStorage.getItem('seguidos') || '[]');
    const isFollowing = saved.includes(currentId);
    if (isFollowing) { saved = saved.filter(s => s !== currentId); }
    else { saved.push(currentId); }
    localStorage.setItem('seguidos', JSON.stringify(saved));
    updateFollowBtn(!isFollowing);
};

function updateFollowBtn(isFollowing) {
    [sel('followBtn'), sel('followBtnMobile')].forEach(btn => {
        if (!btn) return;
        if (isFollowing) {
            btn.innerHTML = `<span class="material-symbols-outlined text-lg">bookmark_added</span> <span class="${btn.id === 'followBtnMobile' ? '' : 'hidden sm:inline'}">Siguiendo</span>`;
            btn.classList.add('border-primary', 'text-primary', 'bg-primary/5');
            btn.classList.remove('border-slate-300', 'border-slate-200', 'text-slate-700', 'text-slate-900');
        } else {
            btn.innerHTML = `<span class="material-symbols-outlined text-lg">bookmark_border</span> <span class="${btn.id === 'followBtnMobile' ? '' : 'hidden sm:inline'}">Seguir</span>`;
            btn.classList.remove('border-primary', 'text-primary', 'bg-primary/5');
        }
    });
}

// ===========================
// ACCIONES
// ===========================
window.enviarCRM = () => {
    const tender = allData.find(d => d.id === currentId);
    if (!tender) return;
    // Add to pipeline localStorage
    const pipeline = JSON.parse(localStorage.getItem('seace_pipeline') || '{}');
    pipeline[tender.id] = {
        stage: 'evaluar',
        id: tender.id,
        title: tender.title,
        agency: tender.agency,
        budget: tender.budgetMax,
        deadline: tender.deadline,
        match: tender.match,
        addedAt: pipeline[tender.id]?.addedAt || new Date().toISOString()
    };
    localStorage.setItem('seace_pipeline', JSON.stringify(pipeline));
    showToast(`"${tender.id}" agregado al Pipeline (Por Evaluar). Cámbialo en el buscador.`);
};

window.copiarEnlace = () => {
    navigator.clipboard.writeText(window.location.href)
        .then(() => showToast('Enlace copiado al portapapeles.'))
        .catch(() => showToast('No se pudo copiar.'));
};

// ===========================
// TOAST
// ===========================
window.generatePreQuote = () => {
    const tender = allData.find(d => d.id === currentId);
    if (!tender) return;

    const btn = sel('preQuoteBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="material-symbols-outlined animate-spin">sync</span> Generando...`;
    btn.disabled = true;

    // Simulate Webhook / IA Generation
    setTimeout(() => {
        showToast('✨ Pre-Cotización generada y enviada al equipo de compras.');
        btn.innerHTML = `<span class="material-symbols-outlined">check_circle</span> Solicitado`;
        btn.classList.replace('bg-amber-400', 'bg-green-500');
        btn.classList.add('text-white');

        // Final "Webhook" call (console log for proof)
        console.log('WEBHOOK TRIGGERED:', {
            event: 'pre_quote_requested',
            tenderId: tender.id,
            budget: tender.budgetMax,
            estimatedMargin: sel('calcProfitPct').innerText,
            timestamp: new Date().toISOString()
        });
    }, 1500);
};

function showToast(msg) {
    let t = document.getElementById('detalleToast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'detalleToast';
        t.className = 'fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl z-50 max-w-xs text-center transition-all';
        document.body.appendChild(t);
    }
    t.innerText = msg;
    t.style.opacity = '1';
    t.style.transform = 'translate(-50%, 0)';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

function showError() {
    sel('tenderTitle').innerText = 'No se pudo cargar la licitación.';
}

// ===========================
// XHR FALLBACK
// ===========================
function loadXHR() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data.json');
        xhr.onload = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { reject(); } };
        xhr.onerror = () => reject();
        xhr.send();
    });
}

// ===========================
// UTILITIES
// ===========================
function sel(id) { return document.getElementById(id); }
function formatPEN(v) { return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(v || 0); }
function daysDiff(deadline) { return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)); }
function fmtDate(d) {
    if (!d || d === '---') return '---';
    return new Date(d + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateLong(d) {
    if (!d) return '---';
    return new Date(d + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', loadDetail);
