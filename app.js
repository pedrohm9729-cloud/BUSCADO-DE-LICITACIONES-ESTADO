// ==========================================
// SEACE - MOTOR v6.0 (Pipeline + Kanban)
// Pipeline comercial, Kanban, Webhook, UX
// ==========================================

let currentData = [];
let lastFiltered = []; // Para exportar CSV
let isSearching = false;
let currentDrawerId = null;

// ============================
// PIPELINE (Kanban)
// ============================
const PIPELINE_KEY = 'seace_pipeline';
const STAGES = ['evaluar', 'cotizar', 'presentada', 'adjudicada'];
const STAGE_LABELS = { evaluar: 'Por Evaluar', cotizar: 'En Cotización', presentada: 'Presentada', adjudicada: 'Adjudicada' };
const STAGE_COLORS = { evaluar: 'blue', cotizar: 'amber', presentada: 'purple', adjudicada: 'green' };
const PROFILE_KEY = 'seace_company_profile';

// ============================
// COMPANY PROFILE (Onboarding)
// ============================
function getProfile() {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
}

function loadProfileUI() {
    const p = getProfile();
    const nameEl = document.getElementById('sidebarCompanyName');
    const planEl = document.getElementById('sidebarPlan');
    const subtitleEl = document.getElementById('searchSubtitle');
    if (nameEl) nameEl.textContent = p.company || 'Mi Empresa';
    if (planEl) planEl.textContent = p.company ? 'Plan Profesional • Activo' : 'Plan Gratis • Configurar';
    if (subtitleEl) subtitleEl.textContent = p.company
        ? `Encuentra oportunidades de gobierno relevantes para ${p.company}.`
        : 'Encuentra oportunidades de gobierno relevantes para tu empresa.';
}

window.openOnboarding = () => {
    const p = getProfile();
    const f = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
    f('profileCompany', p.company || '');
    f('profileSector', p.sector || 'metal');
    f('profileKeywords', p.keywords || '');
    f('profileCapacity', p.capacity || '1000000');
    f('profileWebhook', p.webhookUrl || '');
    const modal = document.getElementById('onboardingModal');
    if (modal) modal.style.display = 'flex';
};

window.closeOnboarding = () => {
    const modal = document.getElementById('onboardingModal');
    if (modal) modal.style.display = 'none';
};

window.saveProfile = () => {
    const g = (id) => document.getElementById(id)?.value?.trim() || '';
    const profile = {
        company: g('profileCompany'),
        sector: g('profileSector'),
        keywords: g('profileKeywords'),
        capacity: parseFloat(g('profileCapacity')) || 1000000,
        webhookUrl: g('profileWebhook'),
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    loadProfileUI();
    closeOnboarding();
    // Recalculate match for all data based on new keywords
    if (currentData.length && profile.keywords) {
        recalcMatchScores(profile);
        applyFilters();
    }
    showToast('success', `✅ Perfil de "${profile.company || 'tu empresa'}" guardado. Match recalculado.`);
};

// First-time onboarding check
setTimeout(() => {
    if (!localStorage.getItem(PROFILE_KEY)) openOnboarding();
    else loadProfileUI();
}, 1200);

// ============================
// PRICING MODAL
// ============================
window.openPricing = () => {
    const modal = document.getElementById('pricingModal');
    if (modal) modal.style.display = 'flex';
};
window.closePricing = () => {
    const modal = document.getElementById('pricingModal');
    if (modal) modal.style.display = 'none';
};

// ============================
// SECTOR KEYWORD SUGGESTIONS (IA)
// ============================
const SECTOR_KEYWORDS = {
    metal: {
        keywords: 'acero, fierro, estructuras metálicas, fabricación metálica, baranda, tubería, plancha, soldadura, mantenimiento metal, galvanizado, perfiles metálicos',
        tip: 'Incluye materiales como "acero corrugado", "tubería negra", y servicios como "fabricación", "montaje estructural".'
    },
    ti: {
        keywords: 'software, hardware, licencias, soporte técnico, redes, servidores, ciberseguridad, nube, sistemas de información, desarrollo de software, mantenimiento TI',
        tip: 'Incluye términos como "ERP", "gestión documental", "ciberseguridad" y marcas específicas que provees.'
    },
    construccion: {
        keywords: 'construcción civil, obras civiles, edificación, concreto, cemento, ladrillo, techado, pavimento, carreteras, saneamiento, excavación, albañilería',
        tip: 'Diferencia entre obras nuevas, rehabilitación y mantenimiento. Agrega tu especialidad (pistas, edificios, etc.).'
    },
    salud: {
        keywords: 'insumos médicos, medicamentos, equipos médicos, oxígeno medicinal, reactivos, EPP médico, material de laboratorio, instrumental quirúrgico, bioseguridad',
        tip: 'Incluye los códigos DIGEMID de tus productos y el tipo de establecimiento al que provees.'
    },
    consultoria: {
        keywords: 'consultoría, supervisión, asesoría, estudio de factibilidad, expediente técnico, capacitación, auditoría, servicios profesionales, evaluación',
        tip: 'Añade tu especialidad: legal, financiera, ambiental, ingeniería, etc. Los códigos CUBSO para servicios empiezan con S.'
    },
    electricidad: {
        keywords: 'electricidad, transformadores, cables eléctricos, tableros eléctricos, luminarias, subestación, medidores, mantenimiento eléctrico, instalaciones eléctricas',
        tip: 'Incluye voltajes y normativas (CNE, NTP) que maneja tu empresa para mayor precisión del Match.'
    },
    otro: {
        keywords: '',
        tip: 'Escribe las palabras que mejor describan tus productos o servicios. Piensa en los términos que usa el Estado para comprar lo que tú vendes.'
    }
};

window.suggestKeywordsBySector = () => {
    const sector = document.getElementById('profileSector')?.value || 'metal';
    const suggestion = SECTOR_KEYWORDS[sector];
    if (!suggestion) return;
    const box = document.getElementById('sectorSuggestionBox');
    const text = document.getElementById('sectorSuggestionText');
    if (box && text) {
        text.textContent = `"${suggestion.keywords}" — ${suggestion.tip}`;
        box.style.display = 'block';
    }
};

window.applySuggestion = () => {
    const sector = document.getElementById('profileSector')?.value || 'metal';
    const suggestion = SECTOR_KEYWORDS[sector];
    if (!suggestion) return;
    const kw = document.getElementById('profileKeywords');
    if (kw && suggestion.keywords) kw.value = suggestion.keywords;
    const box = document.getElementById('sectorSuggestionBox');
    if (box) box.style.display = 'none';
};

// ============================
// DYNAMIC MATCH RECALCULATION
// ============================
function recalcMatchScores(profile) {
    if (!profile?.keywords) return;
    const keywords = profile.keywords.split(/[,\n]+/).map(k => k.trim().toLowerCase()).filter(Boolean);
    if (!keywords.length) return;

    currentData.forEach(item => {
        const hay = `${item.title} ${item.agency} ${item.description || ''} ${(item.requirements || []).join(' ')}`.toLowerCase();
        const hits = keywords.filter(k => hay.includes(k)).length;
        const ratio = hits / keywords.length;
        // Score: 0-24 none, 25-49 low, 50-74 medium, 75-100 high
        item.match = hits === 0 ? 0 : Math.min(100, Math.round(25 + ratio * 75));
    });
}


// ============================
// BID / NO-BID ENGINE
// ============================
function calcBidScore(item) {
    const profile = getProfile();
    const capacity = profile.capacity || 1000000;
    const keywords = (profile.keywords || 'acero fierro metal').split(/[,\s]+/).map(k => k.toLowerCase()).filter(Boolean);
    const diff = daysDiff(item.deadline);

    const checks = [
        {
            label: 'Plazo suficiente (>7 días)',
            pass: diff > 7,
            warn: diff >= 0 && diff <= 7,
            icon: 'schedule',
        },
        {
            label: `Presupuesto dentro de tu capacidad (S/ ${(capacity / 1000).toFixed(0)}K máx.)`,
            pass: item.budgetMax <= capacity,
            warn: item.budgetMax <= capacity * 1.5,
            icon: 'payments',
        },
        {
            label: `Match ≥ 50% con tu perfil (actual: ${item.match}%)`,
            pass: item.match >= 50,
            warn: item.match >= 25,
            icon: 'target',
        },
        {
            label: 'Palabras clave de tu rubro presentes',
            pass: keywords.some(k => `${item.title} ${item.description || ''}`.toLowerCase().includes(k)),
            warn: false,
            icon: 'label',
        },
        {
            label: 'Proceso abierto (no cerrado)',
            pass: diff >= 0,
            warn: false,
            icon: 'lock_open',
        },
    ];

    const passed = checks.filter(c => c.pass).length;
    const warned = checks.filter(c => !c.pass && c.warn).length;
    const score = passed >= 4 ? 'GO' : passed >= 3 || (passed === 2 && warned >= 1) ? 'CAUTION' : 'NO-GO';

    return { checks, score, passed };
}

window.toggleBidPanel = () => {
    const body = document.getElementById('bidNoBidBody');
    if (body) body.classList.toggle('hidden');
};

function renderBidNoBid(item) {
    const { checks, score } = calcBidScore(item);

    const scoreEl = document.getElementById('bidScore');
    const listEl = document.getElementById('bidChecklist');
    const recEl = document.getElementById('bidRecommendation');
    if (!scoreEl || !listEl) return;

    const scoreStyles = {
        'GO': 'bg-green-100 text-green-700',
        'CAUTION': 'bg-amber-100 text-amber-700',
        'NO-GO': 'bg-red-100 text-red-600',
    };
    const recStyles = {
        'GO': 'bg-green-50 text-green-700 border border-green-200',
        'CAUTION': 'bg-amber-50 text-amber-700 border border-amber-200',
        'NO-GO': 'bg-red-50 text-red-600 border border-red-200',
    };
    const recText = {
        'GO': '✅ Esta licitación calza bien con tu perfil. Recomendamos incluirla en el pipeline.',
        'CAUTION': '⚠️ Hay condiciones que merecen revisión antes de comprometer recursos.',
        'NO-GO': '🚫 Esta licitación presenta factores de riesgo significativos. Considera descartarla.',
    };

    scoreEl.textContent = score;
    scoreEl.className = `text-xs font-black px-3 py-1 rounded-full ${scoreStyles[score]}`;

    listEl.innerHTML = checks.map(c => `
        <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-sm shrink-0 mt-0.5 ${c.pass ? 'text-green-500' : c.warn ? 'text-amber-500' : 'text-red-400'}">${c.pass ? 'check_circle' : c.warn ? 'warning' : 'cancel'}</span>
            <span class="text-xs text-slate-700 font-medium">${c.label}</span>
        </div>`).join('');

    if (recEl) {
        recEl.className = `mt-3 p-3 rounded-xl text-xs font-semibold ${recStyles[score]}`;
        recEl.textContent = recText[score];
    }
}


function getPipeline() {
    return JSON.parse(localStorage.getItem(PIPELINE_KEY) || '{}');
}

function savePipeline(data) {
    localStorage.setItem(PIPELINE_KEY, JSON.stringify(data));
}

window.setPipelineStage = (stage) => {
    if (!currentDrawerId) return;
    const item = currentData.find(d => d.id === currentDrawerId);
    if (!item) return;

    const pipeline = getPipeline();
    pipeline[currentDrawerId] = {
        stage,
        id: item.id,
        title: item.title,
        agency: item.agency,
        budget: item.budgetMax,
        deadline: item.deadline,
        match: item.match,
        addedAt: pipeline[currentDrawerId]?.addedAt || new Date().toISOString()
    };
    savePipeline(pipeline);

    // Highlight active button
    document.querySelectorAll('.pipeline-stage-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-1', 'ring-blue-400', 'ring-amber-400', 'ring-purple-400', 'ring-green-400');
    });
    const activeBtn = document.querySelector(`[onclick="setPipelineStage('${stage}')"]`);
    if (activeBtn) activeBtn.classList.add('ring-2', 'ring-offset-1', `ring-${STAGE_COLORS[stage]}-400`);

    const status = document.getElementById('drawerPipelineStatus');
    if (status) {
        status.textContent = `✓ Agregado a "${STAGE_LABELS[stage]}"`;
        status.classList.remove('hidden');
    }

    updatePipelineBadge();
    showToast('success', `Licitación movida a "${STAGE_LABELS[stage]}".`);

    // Auto-webhook when entering "En Cotización"
    if (stage === 'cotizar') {
        const profile = getProfile();
        const webhookUrl = profile.webhookUrl;
        const item = currentData.find(d => d.id === currentDrawerId);
        if (webhookUrl && item) {
            const payload = { id: item.id, title: item.title, agency: item.agency, budget: item.budgetMax, deadline: item.deadline, match: item.match, timestamp: new Date().toISOString() };
            fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                .then(() => showToast('info', `🚀 Webhook disparado a Make.com. Propuesta siendo generada...`))
                .catch(() => showToast('warning', 'Webhook configurado pero sin respuesta. Verifica tu URL.'));
        } else if (!webhookUrl) {
            showToast('info', '💡 Configura tu webhook en “Perfil de Empresa” para auto-generar propuestas.');
        }
    }
};

function updatePipelineBadge() {
    const count = Object.keys(getPipeline()).length;
    const badge = document.getElementById('badgePipeline');
    if (badge) badge.textContent = count;
}

function renderKanban() {
    const pipeline = getPipeline();
    const byStage = { evaluar: [], cotizar: [], presentada: [], adjudicada: [] };
    Object.values(pipeline).forEach(item => {
        if (byStage[item.stage]) byStage[item.stage].push(item);
    });

    const STAGE_BADGE = {
        evaluar: { label: 'Por Evaluar', cls: 'text-blue-600 bg-blue-50 border-blue-100' },
        cotizar: { label: 'En Cotización', cls: 'text-amber-600 bg-amber-50 border-amber-100' },
        presentada: { label: 'Presentada', cls: 'text-purple-600 bg-purple-50 border-purple-100' },
        adjudicada: { label: 'Adjudicada', cls: 'text-green-700 bg-green-50 border-green-100' },
    };

    STAGES.forEach(stage => {
        const col = document.getElementById(`kanban${stage.charAt(0).toUpperCase() + stage.slice(1)}`);
        const counter = document.getElementById(`count${stage.charAt(0).toUpperCase() + stage.slice(1)}`);
        if (!col) return;
        const items = byStage[stage];
        if (counter) counter.textContent = `(${items.length})`;

        if (!items.length) {
            col.innerHTML = `<div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <p class="text-xs text-slate-400 italic">Sin procesos aquí</p>
            </div>`;
            return;
        }

        col.innerHTML = items.map(item => {
            const diff = daysDiff(item.deadline);
            const urgent = diff >= 0 && diff <= 3;
            const closed = diff < 0;
            const badge = STAGE_BADGE[stage];
            // Move-to buttons (next stage)
            const nextStage = STAGES[STAGES.indexOf(stage) + 1];
            const prevStage = STAGES[STAGES.indexOf(stage) - 1];

            return `
            <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border ${stage === 'cotizar' ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-slate-200 dark:border-slate-800 shadow-sm'} hover:border-primary/40 transition-all group">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider ${stage === 'cotizar' ? 'text-primary' : 'text-slate-400'}">${item.id}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}">${badge.label}</span>
                </div>
                <h4 class="font-black text-slate-800 dark:text-slate-100 leading-snug mb-1 text-sm group-hover:text-primary transition-colors">${item.title}</h4>
                <p class="text-xs text-slate-500 mb-3">${item.agency}</p>

                <div class="flex items-center gap-2 text-xs font-bold mb-3 px-2.5 py-2 rounded-lg ${urgent ? 'text-amber-700 bg-amber-50 border border-amber-100' : closed ? 'text-slate-400 bg-slate-50 border border-slate-100' : 'text-slate-600 bg-slate-50 border border-slate-100'}">
                    <span class="material-symbols-outlined text-sm">${urgent ? 'event' : 'schedule'}</span>
                    ${closed ? 'Cerrada' : urgent ? `⚡ Cierra en ${diff} día${diff !== 1 ? 's' : ''}` : `Límite: ${fmtShortDate(item.deadline)}`}
                </div>

                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-black text-slate-800">${formatPEN(item.budget)}</span>
                    <span class="text-[10px] font-bold ${item.match >= 50 ? 'text-green-600' : 'text-slate-400'}">${item.match}% match</span>
                </div>

                <div class="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 gap-2">
                    <button onclick="openDrawer('${item.id}'); switchView('search');"
                        class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">visibility</span> Ver detalle
                    </button>
                    <div class="flex gap-1">
                        ${nextStage ? `<button onclick="event.stopPropagation(); moveStage('${item.id}','${nextStage}')" title="Mover a ${STAGE_LABELS[nextStage]}" class="p-1 rounded text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"><span class="material-symbols-outlined text-sm">arrow_forward</span></button>` : ''}
                        <button onclick="event.stopPropagation(); removePipelineItem('${item.id}')" title="Quitar del pipeline" class="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');
    });

    // Footer Stats
    const all = Object.values(pipeline);
    const total = all.length;
    const totalValor = all.reduce((s, i) => s + (i.budget || 0), 0);
    const cotizando = byStage.cotizar.length;
    const urgentes = all.filter(i => { const d = daysDiff(i.deadline); return d >= 0 && d <= 3; }).length;
    const avgMatch = total > 0 ? Math.round(all.reduce((s, i) => s + (i.match || 0), 0) / total) : 0;

    const totalEl = document.getElementById('pipelineTotal');
    if (totalEl) totalEl.textContent = `${total} proceso${total !== 1 ? 's' : ''} activo${total !== 1 ? 's' : ''}`;
    const valEl = document.getElementById('pipelineValor');
    if (valEl) valEl.textContent = formatPEN(totalValor);
    const cotEl = document.getElementById('pipelineCotizando');
    if (cotEl) cotEl.textContent = cotizando;
    const urgEl = document.getElementById('pipelineUrgentes');
    if (urgEl) urgEl.textContent = urgentes;
    const matchEl = document.getElementById('pipelineMatchAvg');
    if (matchEl) matchEl.textContent = `${avgMatch}%`;
}

window.moveStage = (id, newStage) => {
    const pipeline = getPipeline();
    if (!pipeline[id]) return;
    pipeline[id].stage = newStage;
    savePipeline(pipeline);
    renderKanban();
    updatePipelineBadge();
    showToast('info', `Licitación movida a "${STAGE_LABELS[newStage]}".`);
};

function fmtShortDate(d) {
    if (!d) return '---';
    return new Date(d + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' });
}

window.removePipelineItem = (id) => {
    const pipeline = getPipeline();
    delete pipeline[id];
    savePipeline(pipeline);
    renderKanban();
    updatePipelineBadge();
    showToast('info', 'Licitación eliminada del pipeline.');
};

// Recarga el kanban al abrir la vista
const _origSwitchView = window.switchView;

// Track visited rows
const getVisited = () => JSON.parse(localStorage.getItem('visited') || '[]');
const markVisited = (id) => {
    const v = getVisited();
    if (!v.includes(id)) { v.push(id); localStorage.setItem('visited', JSON.stringify(v)); }
};

// Track discarded rows
const getDiscarded = () => JSON.parse(localStorage.getItem('discarded') || '[]');
const toggleDiscard = (id) => {
    let d = getDiscarded();
    if (d.includes(id)) d = d.filter(x => x !== id);
    else d.push(id);
    localStorage.setItem('discarded', JSON.stringify(d));
    applyFilters();
};

function onDataLoaded(data) {
    currentData = data;
    showSkeleton(false);
    showToast('success', `${currentData.length} licitaciones cargadas correctamente.`);
    updateDashboardStats(currentData);
    updateSidebarBadges(currentData);
    updateTopMaterials(currentData);
    populateAgencyFilter(currentData);
    applyFilters();
}

function loadDataViaXHR() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', 'data.json', true);
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0) {
                try { resolve(JSON.parse(xhr.responseText)); } catch (e) { reject(e); }
            } else { reject(new Error(`XHR ${xhr.status}`)); }
        };
        xhr.onerror = () => reject(new Error('XHR failed'));
        xhr.send();
    });
}

async function loadData(retryCount = 0) {
    showSkeleton(true);

    // Strategy 1: If data was pre-loaded via script tag (window.SEACE_DATA)
    if (window.SEACE_DATA && Array.isArray(window.SEACE_DATA)) {
        onDataLoaded(window.SEACE_DATA);
        return;
    }

    // Strategy 2: fetch API (works on servers / GitHub Pages)
    try {
        const resp = await fetch('data.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        onDataLoaded(data);
        return;
    } catch (fetchErr) {
        console.warn('Fetch failed, trying XHR fallback...', fetchErr.message);
    }

    // Strategy 3: XMLHttpRequest (works with file:// in some browsers)
    try {
        const data = await loadDataViaXHR();
        onDataLoaded(data);
        return;
    } catch (xhrErr) {
        console.warn('XHR fallback failed, trying script injection...', xhrErr.message);
    }

    // Strategy 4: Script tag injection
    try {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'data.js';
            script.onload = () => {
                if (window.SEACE_DATA && Array.isArray(window.SEACE_DATA)) {
                    resolve();
                } else { reject(new Error('data.js loaded but SEACE_DATA not found')); }
            };
            script.onerror = () => reject(new Error('data.js not found'));
            document.head.appendChild(script);
        });
        onDataLoaded(window.SEACE_DATA);
        return;
    } catch (scriptErr) {
        console.warn('Script injection fallback failed:', scriptErr.message);
    }

    // All strategies failed
    if (retryCount < 1) {
        showToast('warning', `Reintentando carga de datos... (${retryCount + 1}/2)`);
        setTimeout(() => loadData(retryCount + 1), 3000);
        return;
    }
    showToast('error', 'No se pudo cargar datos. Verifique su conexión o abra desde un servidor.');
    currentData = [];
    showSkeleton(false);
    applyFilters();
}

// === SKELETON ===
function showSkeleton(show) {
    const sk = document.getElementById('skeletonLoader');
    const tb = document.querySelector('table');
    if (show) { sk?.classList.remove('hidden'); tb?.classList.add('hidden'); }
    else { sk?.classList.add('hidden'); tb?.classList.remove('hidden'); }
}

// === NAV ===
window.switchView = (v) => {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${v}View`)?.classList.remove('hidden');

    // Mostrar/ocultar sección de resultados y header de búsqueda
    const resultsSection = document.getElementById('searchResultsSection');
    const searchHeader = document.querySelector('header.flex-shrink-0');
    const isSearch = v === 'search';
    if (resultsSection) resultsSection.classList.toggle('hidden', !isSearch);
    if (searchHeader) searchHeader.classList.toggle('hidden', !isSearch);

    ['Dashboard', 'Search', 'Analytics', 'Pipeline'].forEach(id => {
        const el = document.getElementById(`nav${id}`);
        if (!el) return;
        el.className = id.toLowerCase() === v
            ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors cursor-pointer'
            : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors group cursor-pointer';
    });
    if (v === 'pipeline') renderKanban();
    if (v === 'analytics') renderAnalytics();
};

// === DASHBOARD ===
function updateDashboardStats(data) {
    const t = data.length;
    const b = data.reduce((a, d) => a + d.budgetMax, 0);
    const m = t > 0 ? Math.round(data.reduce((a, d) => a + d.match, 0) / t) : 0;
    document.getElementById('statTotal').innerText = t;
    document.getElementById('statBudget').innerText = formatPEN(b);
    document.getElementById('statMatch').innerText = `${m}%`;
    updateTopMaterials(data);
}

function updateTopMaterials(data) {
    const container = document.getElementById('topMaterials');
    if (!container) return;

    const keywords = [
        { key: 'acero', label: 'Acero Estructural' },
        { key: 'fierro', label: 'Fierro Corrugado' },
        { key: 'puente', label: 'Puentes y Viales' },
        { key: 'techo', label: 'Coberturas y Techos' },
        { key: 'mantenimiento', label: 'Mantenimiento Metal' },
        { key: 'pintura', label: 'Pintura y Acabados' }
    ];

    const counts = keywords.map(kw => {
        const matching = data.filter(d => d.title.toLowerCase().includes(kw.key));
        return { ...kw, count: matching.length };
    }).sort((a, b) => b.count - a.count);

    container.innerHTML = counts.map(c => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    ${c.count}
                </div>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">${c.label}</span>
            </div>
            <div class="h-1.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-primary" style="width: ${Math.min(100, (c.count / data.length) * 500)}%"></div>
            </div>
        </div>
    `).join('');
}

// === BADGES ===
function updateSidebarBadges(data) {
    const now = new Date();
    const nuevas = data.filter(d => (now - new Date(d.publishDate)) < 48 * 3600000).length;
    const cierre = data.filter(d => { const df = (new Date(d.deadline) - now) / 86400000; return df > 0 && df <= 3; }).length;
    document.getElementById('badgeNuevas').innerText = nuevas;
    document.getElementById('badgeCierre').innerText = cierre;
}

// === ALERTAS ===
window.filterByAlert = (tipo) => {
    switchView('search');
    const now = new Date();
    let f;
    if (tipo === 'nuevas') f = currentData.filter(d => (now - new Date(d.publishDate)) < 48 * 3600000);
    else f = currentData.filter(d => { const df = (new Date(d.deadline) - now) / 86400000; return df > 0 && df <= 3; });
    lastFiltered = f;
    renderTable(f); renderMobileCards(f);
};

// === SUGGEST ===
window.suggestSearch = (term) => {
    document.getElementById('searchInput').value = term;
    applyFilters();
};

// === CUSTOM BUDGET (now always visible range inputs) ===
// No dropdown needed — inputs are always shown.

// === POPULATE AGENCY FILTER ===
function populateAgencyFilter(data) {
    const select = document.getElementById('agencySelect');
    if (!select) return;
    const agencies = [...new Set(data.map(d => d.agency))].sort();
    select.innerHTML = '<option value="">Organismo: Todos</option>' +
        agencies.map(a => `<option value="${a}">${a}</option>`).join('');
}

// === CLEAR FILTERS ===
window.clearFilters = () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('regionSelect').value = '';
    document.getElementById('agencySelect').value = '';
    document.getElementById('budgetMin').value = '';
    document.getElementById('budgetMax').value = '';
    document.getElementById('matchSelect').value = '';
    document.getElementById('statusSelect').value = '';
    document.getElementById('activeOnlyToggle').checked = false;
    document.getElementById('sortSelect').value = document.getElementById('sortSelect').options[0].value;
    applyFilters();
    showToast('info', 'Filtros limpiados.');
};

// === FILTERS ===
const applyFilters = () => {
    if (isSearching) return;
    isSearching = true;
    const btn = document.getElementById('searchBtn');
    if (btn) { btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> Buscando...`; btn.disabled = true; }

    setTimeout(() => {
        const search = sanitizeSearch(document.getElementById('searchInput')?.value || '');
        const region = document.getElementById('regionSelect')?.value || '';
        const agency = document.getElementById('agencySelect')?.value || '';
        const budgetMinVal = parseFloat(document.getElementById('budgetMin')?.value) || 0;
        const budgetMaxVal = parseFloat(document.getElementById('budgetMax')?.value) || Infinity;
        const matchMin = parseInt(document.getElementById('matchSelect')?.value) || 0;
        const statusFilter = document.getElementById('statusSelect')?.value || '';
        const active = document.getElementById('activeOnlyToggle')?.checked || false;
        const sort = document.getElementById('sortSelect')?.value || '';
        const discarded = getDiscarded();

        let filtered = currentData.filter(item => {
            if (discarded.includes(item.id)) return false;

            // Estatus
            const diff = daysDiff(item.deadline);
            if (statusFilter === 'abierta' && (diff < 0 || diff <= 3)) return false;
            if (statusFilter === 'cierre' && !(diff >= 0 && diff <= 3)) return false;
            if (statusFilter === 'cerrada' && diff >= 0) return false;
            if (active && diff < 0) return false;

            // Búsqueda texto
            const rawInput = document.getElementById('searchInput')?.value.trim() || '';
            const txt = `${item.title} ${item.agency} ${item.location} ${item.description || ''}`.toLowerCase();
            if (search) {
                if (rawInput.startsWith('"') && rawInput.endsWith('"')) {
                    const exactPhrase = rawInput.slice(1, -1).toLowerCase();
                    if (!txt.includes(exactPhrase)) return false;
                } else {
                    if (!txt.includes(search)) return false;
                }
            }

            // Región
            if (region && item.location.toLowerCase() !== region.toLowerCase()) return false;

            // Organismo
            if (agency && item.agency !== agency) return false;

            // Presupuesto (rango libre)
            if (budgetMinVal > 0 && item.budgetMax < budgetMinVal) return false;
            if (budgetMaxVal < Infinity && item.budgetMin > budgetMaxVal) return false;

            // Match mínimo
            if (matchMin > 0 && item.match < matchMin) return false;

            return true;
        });

        if (sort === 'Relevancia (Match)') filtered.sort((a, b) => b.match - a.match);
        else if (sort === 'Presupuesto (Mayor a Menor)') filtered.sort((a, b) => b.budgetMax - a.budgetMax);
        else if (sort === 'Cierre Próximo') filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        lastFiltered = filtered;
        showSkeleton(false);
        renderTable(filtered);
        renderMobileCards(filtered);
        renderActiveFilterChips({ region, agency, budgetMinVal, budgetMaxVal, matchMin, statusFilter });
        if (btn) { btn.innerHTML = `Buscar`; btn.disabled = false; }
        isSearching = false;
    }, 300);
};

// === CHIPS DE FILTROS ACTIVOS ===
function renderActiveFilterChips({ region, agency, budgetMinVal, budgetMaxVal, matchMin, statusFilter }) {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    const chips = [];
    if (region) chips.push({ label: `Región: ${region}`, clear: () => { document.getElementById('regionSelect').value = ''; applyFilters(); } });
    if (agency) chips.push({ label: `Organismo: ${agency}`, clear: () => { document.getElementById('agencySelect').value = ''; applyFilters(); } });
    if (budgetMinVal > 0) chips.push({ label: `S/ Mín: ${budgetMinVal.toLocaleString()}`, clear: () => { document.getElementById('budgetMin').value = ''; applyFilters(); } });
    if (budgetMaxVal < Infinity) chips.push({ label: `S/ Máx: ${budgetMaxVal.toLocaleString()}`, clear: () => { document.getElementById('budgetMax').value = ''; applyFilters(); } });
    if (matchMin > 0) chips.push({ label: `Match ${matchMin}%+`, clear: () => { document.getElementById('matchSelect').value = ''; applyFilters(); } });
    if (statusFilter) chips.push({ label: `Estatus: ${statusFilter}`, clear: () => { document.getElementById('statusSelect').value = ''; applyFilters(); } });
    container.innerHTML = chips.map((c, i) =>
        `<span class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">${c.label}<button onclick="(${c.clear.toString()})()" class="ml-1 hover:text-red-500 transition-colors">&times;</button></span>`
    ).join('');
}

// === RELATIVE DATE ("Quedan 3 días") ===
function relativeDate(deadline) {
    const diff = daysDiff(deadline);
    if (diff < 0) return `<span class="text-slate-400 line-through">${deadline}</span>`;
    if (diff === 0) return `<span class="text-red-600 font-bold animate-pulse">¡Hoy!</span>`;
    if (diff === 1) return `<span class="text-orange-600 font-bold">Mañana</span>`;
    if (diff <= 3) return `<span class="text-orange-500 font-bold">${deadline}<br><span class="text-[10px]">Quedan ${diff} días</span></span>`;
    if (diff <= 7) return `<span class="text-slate-700">${deadline}<br><span class="text-[10px] text-slate-400">Quedan ${diff} días</span></span>`;
    return `<span class="text-slate-500">${deadline}<br><span class="text-[10px] text-slate-400">${diff} días restantes</span></span>`;
}

// === TABLE (Enterprise) ===
const renderTable = (data) => {
    const tbody = document.getElementById('resultsTableBody');
    const empty = document.getElementById('emptyState');
    const pag = document.getElementById('paginationFooter');
    const visited = getVisited();
    tbody.innerHTML = '';
    document.getElementById('resultsCount').innerText = `(${data.length} encontrados)`;

    if (!data.length) {
        empty.classList.remove('hidden');
        pag.classList.add('hidden');
        return;
    }
    empty.classList.add('hidden');
    pag.classList.remove('hidden');
    document.getElementById('totalResultsText').innerText = data.length;
    document.getElementById('currentRange').innerText = `1 a ${Math.min(data.length, 25)}`;

    data.slice(0, 25).forEach(item => {
        const diff = daysDiff(item.deadline);
        let badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Abierta</span>`;
        if (diff < 0) badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">Cerrada</span>`;
        else if (diff <= 3) badge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 animate-pulse">Cierra pronto</span>`;

        const isVisited = visited.includes(item.id);
        const matchColor = item.match > 50 ? 'text-green-500' : 'text-slate-400';
        const row = document.createElement('tr');
        row.className = `hover:bg-blue-50/50 dark:hover:bg-slate-800/50 cursor-pointer group border-b border-slate-100 dark:border-slate-800 transition-all ${diff < 0 ? 'opacity-40' : ''} ${isVisited ? 'row-visited' : ''}`;
        row.onclick = (e) => { if (!e.target.closest('.action-trigger')) { markVisited(item.id); row.classList.add('row-visited'); openDrawer(item.id); } };
        row.innerHTML = `
            <td class="py-4 px-6 sticky-col">
                <div class="flex flex-col max-w-xs">
                    <span class="text-sm font-bold ${isVisited ? 'text-slate-400' : 'text-slate-900 dark:text-white'} truncate group-hover:text-primary transition-colors" title="${item.title}">${item.title}</span>${getProductionBadge(item)}
                    <span class="text-[10px] text-slate-400 font-mono mt-1">${item.id}</span>
                </div>
            </td>
            <td class="py-4 px-6"><span class="text-xs font-semibold text-slate-600">${item.agency}</span></td>
            <td class="py-4 px-6 text-right"><span class="text-sm font-black tabular-nums">${formatPEN(item.budgetMax)}</span></td>
            <td class="py-4 px-6 text-sm">${relativeDate(item.deadline)}</td>
            <td class="py-4 px-6 text-center text-xs font-bold ${matchColor}">${item.match}%</td>
            <td class="py-4 px-6 text-center">${badge}</td>
            <td class="py-4 px-6 text-center"><span class="material-symbols-outlined text-red-400 hover:text-red-600 text-lg cursor-pointer" title="Bases PDF" onclick="event.stopPropagation()">picture_as_pdf</span></td>
            <td class="py-4 px-2 text-right relative action-trigger" tabindex="0">
                <span class="material-symbols-outlined text-slate-300 hover:text-slate-600 cursor-pointer text-lg" onclick="event.stopPropagation()">more_vert</span>
                <div class="action-menu bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 w-48 right-0">
                    <button onclick="event.stopPropagation(); openDrawer('${item.id}')" class="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><span class="material-symbols-outlined text-sm">visibility</span>Ver Detalle</button>
                    <button onclick="event.stopPropagation(); sendToWebhook('${item.id}')" class="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"><span class="material-symbols-outlined text-sm">send</span>Enviar a CRM</button>
                    <button onclick="event.stopPropagation(); toggleDiscard('${item.id}')" class="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2"><span class="material-symbols-outlined text-sm">archive</span>Descartar</button>
                </div>
            </td>`;
        tbody.appendChild(row);
    });
};

// === MOBILE CARDS ===
const renderMobileCards = (data) => {
    const c = document.getElementById('mobileCards');
    if (!c) return;
    c.innerHTML = data.slice(0, 25).map(item => {
        const diff = daysDiff(item.deadline);
        let bc = 'bg-green-100 text-green-700', bt = 'Abierta';
        if (diff < 0) { bc = 'bg-slate-100 text-slate-500'; bt = 'Cerrada'; }
        else if (diff <= 3) { bc = 'bg-orange-100 text-orange-600'; bt = 'Cierra pronto'; }
        return `<div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all" onclick="openDrawer('${item.id}')">
            <div class="flex justify-between items-start mb-2"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${bc}">${bt}</span><span class="text-xs font-bold ${item.match > 50 ? 'text-green-500' : 'text-slate-400'}">${item.match}%</span></div>
            <h3 class="text-sm font-bold text-slate-900 mb-1 leading-snug">${item.title}</h3>
            <p class="text-xs text-slate-500 mb-3">${item.agency} • ${item.location}</p>
            <div class="flex justify-between items-center"><span class="text-sm font-black tabular-nums">${formatPEN(item.budgetMax)}</span><span class="text-[10px] text-slate-400">${relativeDate(item.deadline)}</span></div>
        </div>`;
    }).join('');
};

// =========================
// EXPORT CSV
// =========================
window.exportCSV = () => {
    if (!lastFiltered.length) { alert('No hay datos para exportar.'); return; }
    const headers = ['ID', 'Título', 'Agencia', 'Región', 'Presupuesto Mín', 'Presupuesto Máx', 'Publicación', 'Cierre', 'Match (%)', 'Estado'];
    const rows = lastFiltered.map(d => {
        const diff = daysDiff(d.deadline);
        const status = diff < 0 ? 'Cerrada' : (diff <= 3 ? 'Cierre Próximo' : 'Abierta');
        return [d.id, `"${d.title}"`, `"${d.agency}"`, d.location, d.budgetMin, d.budgetMax, d.publishDate, d.deadline, d.match, status];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `licitaciones_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
};

// =========================
// WEBHOOK SIMULATION
// =========================
window.sendToWebhook = (id) => {
    const item = currentData.find(d => d.id === id);
    if (!item) return;
    const payload = { id: item.id, title: item.title, agency: item.agency, budget: item.budgetMax, deadline: item.deadline };
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));
    // Future: fetch('https://hook.make.com/xxx', { method: 'POST', body: JSON.stringify(payload) });
    alert(`✅ Datos de "${item.id}" enviados al CRM.\n\nEn producción, esto se conectará a Make.com o su ERP interno.`);
};

// =========================
// DRAWER
// =========================
window.openDrawer = (id) => {
    const item = currentData.find(d => d.id === id);
    if (!item) return;
    currentDrawerId = id;
    markVisited(id);

    document.getElementById('drawerTitle').innerText = item.title;
    document.getElementById('drawerId').innerText = item.id;
    document.getElementById('drawerAgency').innerText = item.agency;
    document.getElementById('drawerLocation').innerText = item.location;
    document.getElementById('drawerBudget').innerText = formatPEN(item.budgetMax);
    document.getElementById('drawerDesc').innerText = item.description || 'Sin descripción.';
    document.getElementById('drawerFullLink').href = `detalle.html?id=${id}`;
    updateSemaforo(item.budgetMax);

    // Reset & sync pipeline stage buttons
    const pipeline = getPipeline();
    const currentStage = pipeline[id]?.stage || null;
    document.querySelectorAll('.pipeline-stage-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-1', 'ring-blue-400', 'ring-amber-400', 'ring-purple-400', 'ring-green-400');
    });
    const statusEl = document.getElementById('drawerPipelineStatus');
    if (currentStage) {
        const activeBtn = document.querySelector(`[onclick="setPipelineStage('${currentStage}')"]`);
        if (activeBtn) activeBtn.classList.add('ring-2', 'ring-offset-1', `ring-${STAGE_COLORS[currentStage]}-400`);
        if (statusEl) { statusEl.textContent = `✓ En "${STAGE_LABELS[currentStage]}"`; statusEl.classList.remove('hidden'); }
    } else {
        if (statusEl) statusEl.classList.add('hidden');
    }


    const diff = daysDiff(item.deadline);
    const badge = document.getElementById('drawerBadge');
    if (diff < 0) { badge.innerText = 'Cerrada'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500'; }
    else if (diff <= 3) { badge.innerText = 'Cierra pronto'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600 animate-pulse'; }
    else { badge.innerText = 'Abierta'; badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700'; }

    const saved = JSON.parse(localStorage.getItem('seguidos') || '[]');
    updateDrawerFollowBtn(saved.includes(id));

    const tl = document.getElementById('drawerTimeline');
    tl.innerHTML = [
        { name: 'Convocatoria', date: item.publishDate, done: true },
        { name: 'Consultas', date: '---', done: diff < 10 },
        { name: 'Presentación', date: item.deadline, done: diff < 0 },
        { name: 'Adjudicación', date: '---', done: false },
    ].map(p => `<div class="flex items-center gap-3"><span class="material-symbols-outlined text-sm ${p.done ? 'text-green-500' : 'text-slate-300'}">${p.done ? 'check_circle' : 'radio_button_unchecked'}</span><span class="text-xs font-semibold ${p.done ? 'text-slate-700' : 'text-slate-400'}">${p.name}</span><span class="text-[10px] text-slate-400 ml-auto">${p.date}</span></div>`).join('');

    const rq = document.getElementById('drawerRequirements');
    rq.innerHTML = (item.requirements || []).map(r => `<div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"><span class="material-symbols-outlined text-primary text-sm">check_circle</span><span class="text-xs font-semibold text-slate-700">${r}</span></div>`).join('');

    // Bid / No-Bid Score
    renderBidNoBid(item);
    // Reset panel to collapsed each time
    document.getElementById('bidNoBidBody')?.classList.add('hidden');

    const overlay = document.getElementById('drawerOverlay');
    const panel = document.getElementById('drawerPanel');
    overlay.classList.remove('hidden');
    setTimeout(() => { overlay.classList.add('opacity-100'); panel.classList.remove('translate-x-full'); }, 10);
};

window.closeDrawer = () => {
    const overlay = document.getElementById('drawerOverlay');
    const panel = document.getElementById('drawerPanel');
    overlay.classList.remove('opacity-100');
    panel.classList.add('translate-x-full');
    setTimeout(() => overlay.classList.add('hidden'), 300);
    currentDrawerId = null;
};

window.toggleDrawerFollow = () => {
    if (!currentDrawerId) return;
    let saved = JSON.parse(localStorage.getItem('seguidos') || '[]');
    const f = saved.includes(currentDrawerId);
    if (f) saved = saved.filter(s => s !== currentDrawerId);
    else saved.push(currentDrawerId);
    localStorage.setItem('seguidos', JSON.stringify(saved));
    updateDrawerFollowBtn(!f);
};

function updateDrawerFollowBtn(isFollowing) {
    const btn = document.getElementById('drawerFollowBtn');
    if (isFollowing) {
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">bookmark_added</span> Siguiendo';
        btn.classList.add('border-primary', 'text-primary', 'bg-primary/5');
        btn.classList.remove('border-slate-200', 'text-slate-500');
    } else {
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">bookmark</span> Seguir';
        btn.classList.remove('border-primary', 'text-primary', 'bg-primary/5');
        btn.classList.add('border-slate-200', 'text-slate-500');
    }
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

// =========================
// UTILIDADES (con edge cases)
// =========================
function formatPEN(v) {
    // Edge case: presupuesto nulo, undefined o 0
    if (v === null || v === undefined || isNaN(v) || v === 0) {
        return 'Valor Reservado';
    }
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(v);
}
function daysDiff(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }

// =========================
// ANALYTICS
// =========================
function renderAnalytics() {
    const data = currentData;
    if (!data.length) return;

    // KPIs
    const totalBudget = data.reduce((s, d) => s + d.budgetMax, 0);
    const avgMatch = Math.round(data.reduce((s, d) => s + d.match, 0) / data.length);
    const pipelineCount = Object.keys(getPipeline()).length;
    const elQ = document.getElementById('kpiTotal'); if (elQ) elQ.textContent = data.length;
    const elV = document.getElementById('kpiValor'); if (elV) elV.textContent = formatPENShort(totalBudget);
    const elM = document.getElementById('kpiMatch'); if (elM) elM.textContent = `${avgMatch}%`;
    const elP = document.getElementById('kpiPipeline'); if (elP) elP.textContent = pipelineCount;

    // Agency Bar Chart (top 7)
    const agencyCounts = {};
    data.forEach(d => { agencyCounts[d.agency] = (agencyCounts[d.agency] || 0) + 1; });
    const topAgencies = Object.entries(agencyCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);
    const maxCount = Math.max(...topAgencies.map(a => a[1]));
    const chart = document.getElementById('agencyBarChart');
    if (chart) {
        chart.innerHTML = topAgencies.map(([name, count]) => {
            const pct = Math.round((count / maxCount) * 100);
            const abbr = name.split(' ').filter(w => w.length > 3).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase();
            return `<div class="flex-1 flex flex-col items-center gap-2">
                <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-full">
                    <div class="absolute bottom-0 w-full bg-primary/40 hover:bg-primary rounded-t-lg transition-all" style="height:${pct}%" title="${name}: ${count}"></div>
                </div>
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">${abbr}</span>
            </div>`;
        }).join('');
    }

    // Donut (match distribution)
    const high = data.filter(d => d.match >= 75).length;
    const med = data.filter(d => d.match >= 25 && d.match < 75).length;
    const low = data.filter(d => d.match < 25).length;
    const circ = 2 * Math.PI * 14; // circumference
    const highPct = high / data.length;
    const medPct = med / data.length;
    const highDash = circ * highPct;
    const medDash = circ * medPct;
    const donutH = document.getElementById('donutHigh');
    const donutM = document.getElementById('donutMed');
    if (donutH) { donutH.setAttribute('stroke-dasharray', `${highDash.toFixed(2)} ${circ.toFixed(2)}`); donutH.setAttribute('stroke-dashoffset', '0'); }
    if (donutM) { donutM.setAttribute('stroke-dasharray', `${medDash.toFixed(2)} ${circ.toFixed(2)}`); donutM.setAttribute('stroke-dashoffset', `${-highDash.toFixed(2)}`); }
    const donutL = document.getElementById('donutLabel'); if (donutL) donutL.textContent = `${Math.round(highPct * 100)}%`;
    const elHigh = document.getElementById('matchHigh'); if (elHigh) elHigh.textContent = high;
    const elMed = document.getElementById('matchMed'); if (elMed) elMed.textContent = med;
    const elLow = document.getElementById('matchLow'); if (elLow) elLow.textContent = low;

    // Top Agencies Table
    const table = document.getElementById('topAgenciesTable');
    if (table) {
        const top5 = Object.entries(agencyCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        table.innerHTML = top5.map(([name, count], i) => {
            const abbr = name.split(' ').filter(w => w.length > 3).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase();
            const prob = i === 0 ? { label: 'Alta Probabilidad', cls: 'text-green-600' } : i < 3 ? { label: 'Media Probabilidad', cls: 'text-amber-600' } : { label: 'Baja Probabilidad', cls: 'text-slate-400' };
            return `<div class="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-500">${abbr}</div>
                    <div><p class="text-sm font-bold text-slate-900 dark:text-white">${name.split(' ').slice(0, 3).join(' ')}</p>
                    <p class="text-xs text-slate-500">${count} licitaciones detectadas</p></div>
                </div>
                <div class="text-right"><p class="text-sm font-black text-slate-900 dark:text-white">${count} Licit.</p><p class="text-[10px] font-bold ${prob.cls}">${prob.label}</p></div>
            </div>`;
        }).join('');
    }

    // Insights
    const insights = document.getElementById('insightsPanel');
    if (insights) {
        const topRegion = (() => { const rc = {}; data.forEach(d => { rc[d.location] = (rc[d.location] || 0) + 1; }); return Object.entries(rc).sort((a, b) => b[1] - a[1])[0]; })();
        const highBudget = data.filter(d => d.budgetMax > 1000000).length;
        insights.innerHTML = `
        <div class="flex gap-4">
            <div class="w-1.5 shrink-0 bg-primary rounded-full"></div>
            <div><p class="text-sm font-bold text-slate-900 dark:text-white">Mayor actividad en ${topRegion ? topRegion[0] : 'Lima'}</p>
            <p class="text-xs text-slate-600 mt-1">${topRegion ? topRegion[1] : 0} procesos en esa región. Prioridad alta para INPROMETAL.</p></div>
        </div>
        <div class="flex gap-4">
            <div class="w-1.5 shrink-0 bg-green-500 rounded-full"></div>
            <div><p class="text-sm font-bold text-slate-900 dark:text-white">${highBudget} megaproyecto${highBudget !== 1 ? 's' : ''} detectado${highBudget !== 1 ? 's' : ''}</p>
            <p class="text-xs text-slate-600 mt-1">Contratos sobre S/ 1M. Evaluar consorcio o SGR para carta fianza.</p></div>
        </div>`;
    }

    // Top Material
    const matEl = document.getElementById('topMaterialInsight');
    const matCnt = document.getElementById('topMaterialCount');
    if (matEl && currentData.length) {
        const terms = ['acero', 'fierro', 'metal', 'tuber', 'panel', 'baranda', 'techo'];
        const counts = terms.map(t => ({ t, c: data.filter(d => `${d.title} ${d.description || ''}`.toLowerCase().includes(t)).length }));
        const top = counts.sort((a, b) => b.c - a.c)[0];
        matEl.textContent = top.t.charAt(0).toUpperCase() + top.t.slice(1);
        if (matCnt) matCnt.textContent = `${top.c} procesos`;
    }
}

function formatPENShort(v) {
    if (v >= 1e9) return `S/ ${(v / 1e9).toFixed(1)}B`;
    if (v >= 1e6) return `S/ ${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `S/ ${(v / 1e3).toFixed(0)}K`;
    return `S/ ${v}`;
}

// Sanitizar búsqueda (tolerancia a caracteres especiales)
function sanitizeSearch(text) {
    return text.replace(/[%&$<>"']/g, '').toLowerCase().trim();
}

// =========================
// COPIAR DATOS AL PORTAPAPELES
// =========================
window.copiarDatos = () => {
    if (!currentDrawerId) return;
    const item = currentData.find(d => d.id === currentDrawerId);
    if (!item) return;
    const texto = `ID: ${item.id}\nTítulo: ${item.title}\nEntidad: ${item.agency}\nRegión: ${item.location}\nPresupuesto: ${formatPEN(item.budgetMax)}\nCierre: ${item.deadline}\nMatch: ${item.match}%`;
    navigator.clipboard.writeText(texto).then(() => {
        showToast('info', 'Datos copiados al portapapeles.');
    }).catch(() => showToast('error', 'No se pudo copiar.'));
};

// =========================
// WEBHOOK (SIMULADO — listo para conectar)
// =========================
window.enviarWebhook = () => {
    if (!currentDrawerId) return;
    const item = currentData.find(d => d.id === currentDrawerId);
    if (!item) return;
    const payload = {
        tipo: 'LICITACION_CRM',
        fecha: new Date().toISOString(),
        id: item.id,
        titulo: item.title,
        agencia: item.agency,
        region: item.location,
        presupuesto: item.budgetMax,
        cierre: item.deadline,
        match: item.match,
        empresa: 'INPROMETAL SAC'
    };
    // TODO: Conectar a Make.com/Zapier:
    // fetch('https://hook.make.com/TU_WEBHOOK', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    console.log('📤 Webhook payload:', JSON.stringify(payload, null, 2));
    showToast('success', `"${item.id}" enviado al CRM. (Modo simulación)`);
};

// =========================
// MATERIALES MÁS DEMANDADOS (Dashboard)
// =========================
function updateTopMaterials(data) {
    const container = document.getElementById('topMaterials');
    if (!container) return;

    const keywords = [
        { term: 'acero', label: 'Acero Estructural', icon: '🔩' },
        { term: 'fierro', label: 'Fierro Negro', icon: '⚙️' },
        { term: 'metal', label: 'Estructuras Metálicas', icon: '🏗️' },
        { term: 'puente', label: 'Puentes / Reticulados', icon: '🌉' },
        { term: 'techo', label: 'Techados / Coberturas', icon: '🏠' },
        { term: 'baranda', label: 'Barandas / Cercos', icon: '🚧' },
        { term: 'tuber', label: 'Tuberías', icon: '🔧' },
        { term: 'panel', label: 'Paneles / Revestimiento', icon: '📐' },
    ];

    const counts = keywords.map(k => {
        const count = data.filter(d =>
            `${d.title} ${d.description || ''}`.toLowerCase().includes(k.term)
        ).length;
        return { ...k, count };
    }).filter(k => k.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);

    const maxCount = counts[0]?.count || 1;

    container.innerHTML = counts.map(k => {
        const pct = Math.round((k.count / maxCount) * 100);
        return `
        <div class="flex items-center gap-3">
            <span class="text-lg">${k.icon}</span>
            <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-bold text-slate-700">${k.label}</span>
                    <span class="text-[10px] font-bold text-slate-400">${k.count} procesos</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all" style="width: ${pct}%"></div>
                </div>
            </div>
        </div>`;
    }).join('');
}



// =========================
// TOAST NOTIFICATIONS
// =========================
function showToast(type, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { error: 'error', success: 'check_circle', warning: 'warning', info: 'info' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="material-symbols-outlined text-sm">${icons[type]}</span>${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4500);
}

// =========================
// SEMÁFORO FINANCIERO (Drawer)
// =========================
function updateSemaforo(budget) {
    const el = document.getElementById('drawerSemaforo');
    const icon = document.getElementById('semaforoIcon');
    const text = document.getElementById('semaforoText');
    if (!el) return;

    if (!budget || budget === 0) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');

    const fianza = budget * 0.10; // 10% carta fianza estándar

    if (fianza <= 50000) {
        icon.className = 'material-symbols-outlined text-sm semaforo-verde';
        text.className = 'font-bold semaforo-verde';
        text.innerText = `Fianza estimada: ${formatPEN(fianza)} — Viable sin financiamiento`;
    } else if (fianza <= 300000) {
        icon.className = 'material-symbols-outlined text-sm semaforo-amarillo';
        text.className = 'font-bold semaforo-amarillo';
        text.innerText = `Fianza estimada: ${formatPEN(fianza)} — Evaluar liquidez disponible`;
    } else {
        icon.className = 'material-symbols-outlined text-sm semaforo-rojo';
        text.className = 'font-bold semaforo-rojo';
        text.innerText = `Fianza estimada: ${formatPEN(fianza)} — Requiere consorcio o SGR`;
    }
}

// =========================
// BADGE "MATCH EXACTO" en filas
// =========================
function getProductionBadge(item) {
    const exactTerms = ['fierro negro', 'acero estructural', 'encofrado', 'perfil metálico', 'plancha de acero', 'soldadura'];
    const txt = `${item.title} ${item.description || ''}`.toLowerCase();
    const found = exactTerms.filter(t => txt.includes(t));
    if (found.length > 0) {
        return `<span class="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-bold rounded-full ml-1" title="Coincide con: ${found.join(', ')}">MATCH EXACTO</span>`;
    }
    return '';
}

// =========================
// DETECCIÓN ONLINE/OFFLINE
// =========================
window.addEventListener('online', () => {
    document.getElementById('offlineBanner')?.classList.add('hidden');
    showToast('success', 'Conexión restaurada.');
});
window.addEventListener('offline', () => {
    document.getElementById('offlineBanner')?.classList.remove('hidden');
    showToast('error', 'Conexión perdida.');
});

// === EVENTS ===
document.getElementById('searchBtn')?.addEventListener('click', applyFilters);
document.getElementById('activeOnlyToggle')?.addEventListener('change', applyFilters);
document.getElementById('sortSelect')?.addEventListener('change', applyFilters);
document.getElementById('searchInput')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFilters(); });
// Nuevos filtros — reaccionan en tiempo real
['regionSelect', 'agencySelect', 'matchSelect', 'statusSelect'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', applyFilters);
});
['budgetMin', 'budgetMax'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', applyFilters);
});

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updatePipelineBadge();
});
