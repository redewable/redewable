(() => {
  'use strict';

  // ==========================================
  // Small DOM helpers
  // ==========================================
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escapeHtml(value) {
    const s = (value ?? '').toString();
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==========================================
  // SUPABASE CONFIGURATION
  // ==========================================
  const FALLBACK_SUPABASE_URL = '';
  const FALLBACK_SUPABASE_ANON_KEY = '';

  function getQueryParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  function getSupabaseConfig() {
    const sbUrl = (getQueryParam('sbUrl') || '').trim();
    const sbKey = (getQueryParam('sbKey') || '').trim();

    try {
      if (sbUrl && sbKey) {
        localStorage.setItem('redew_dataroom_config', JSON.stringify({ url: sbUrl, key: sbKey }));
      }
    } catch (e) {}

    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem('redew_dataroom_config') || 'null');
    } catch (e) {}

    const url = sbUrl || (stored && stored.url) || FALLBACK_SUPABASE_URL;
    const key = sbKey || (stored && stored.key) || FALLBACK_SUPABASE_ANON_KEY;
    return { url, key };
  }

  let supabase = null;
  let realtimeSubscription = null;
  let pollingTimer = null;

  // ==========================================
  // STATE
  // ==========================================
  let currentView = 'dashboard';
  let currentSection = null;
  let documents = [];
  let notes = [];
  let settings = {};

  let visitorInfo = null;
  let sessionId = null;
  let sessionStart = null;

  let docSearchTerm = '';

  // ==========================================
  // VISITOR ACTIVITY LOGGING (single definition)
  // ==========================================
  async function logActivity(action, section = null, docName = null) {
    if (!supabase || !visitorInfo) return;
    try {
      await supabase.from('visitor_logs').insert([{
        session_id: sessionId,
        visitor_name: visitorInfo.name,
        visitor_company: visitorInfo.company,
        action: action,
        section: section,
        document_name: docName
      }]);
    } catch (err) { 
      console.error("Tracking error:", err); 
    }
  }

  async function trackVisitor(action, details = {}) {
    if (!supabase || !visitorInfo) return;
    try {
      await supabase.from('visitor_logs').insert([{
        visitor_name: visitorInfo.name,
        visitor_company: visitorInfo.company,
        action: action,
        section: details.section || '',
        document_name: details.doc || ''
      }]);
    } catch (e) {
      console.error("Tracking error:", e);
    }
  }

  // ==========================================
  // SECTION DEFINITIONS
  // ==========================================
  const SECTIONS = [
    { id: 'executive', name: 'Executive Summary', desc: 'Project overview and investment materials.', icon: 'file-text', progressKey: 'progress_executive' },
    { id: 'land', name: 'Land & Site Control', desc: 'Property agreements and site documentation.', icon: 'map-pin', progressKey: 'progress_land' },
    { id: 'interconnection', name: 'Interconnection', desc: 'ERCOT interconnection studies and grid analysis.', icon: 'zap', progressKey: 'progress_interconnection' },
    { id: 'permitting', name: 'Permitting', desc: 'Permits and regulatory filings.', icon: 'clipboard', progressKey: 'progress_permitting' },
    { id: 'technical', name: 'Technical & Engineering', desc: 'Engineering specifications and designs.', icon: 'tool', progressKey: 'progress_engineering' },
    { id: 'epc', name: 'EPC & Construction', desc: 'Construction contracts and planning.', icon: 'hard-hat', progressKey: 'progress_epc' },
    { id: 'market', name: 'Market Analysis', desc: 'ERCOT market research and revenue projections.', icon: 'trending-up', progressKey: 'progress_financial' },
    { id: 'financial', name: 'Financial Model', desc: 'Pro forma and financial projections.', icon: 'dollar-sign', progressKey: 'progress_financial' },
    { id: 'risk', name: 'Risk Assessment', desc: 'Risk analysis and mitigation strategies.', icon: 'alert-triangle', progressKey: 'progress_financial' },
    { id: 'entity', name: 'Entity Structure', desc: 'Corporate structure and legal documents.', icon: 'building', progressKey: 'progress_financial' },
    { id: 'team', name: 'Team & Partners', desc: 'Development team and partner information.', icon: 'users', progressKey: 'progress_financial' }
  ];

  // ==========================================
  // DYNAMIC PROGRESS CATEGORIES
  // ==========================================
  const PROGRESS_LABEL_MAP = {
    'progress_executive': 'Executive',
    'progress_land': 'Land Control',
    'progress_interconnection': 'Interconnection',
    'progress_permitting': 'Permitting',
    'progress_engineering': 'Engineering',
    'progress_financial': 'Financial',
    'progress_epc': 'EPC'
  };

  function getEnabledProgressCategories() {
    try {
      const stored = JSON.parse(settings.progress_categories || 'null');
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    } catch (e) {}
    // Default fallback (original 5 shown in breakdown)
    return [
      'progress_executive',
      'progress_land', 
      'progress_interconnection',
      'progress_permitting',
      'progress_engineering'
    ];
  }

  const ICONS = {
    'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    'map-pin': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'zap': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'clipboard': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    'tool': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    'hard-hat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 15V6a2 2 0 0 1 4 0v9"/><path d="M4 15v-3a8 8 0 0 1 16 0v3"/></svg>',
    'trending-up': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    'dollar-sign': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    'alert-triangle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'building': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
    'users': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'dashboard': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>'
  };

  // ==========================================
  // FILE TYPE UI
  // ==========================================
  const FILE_ICONS = {
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    xlsx: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8"/><path d="M8 17h5"/></svg>',
    dwg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 17l9 4 9-4"/><path d="M3 12l9 4 9-4"/></svg>',
    www: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"/><path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"/></svg>',
    other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
  };

  const FILE_TYPE_INFO = {
    pdf: { label: 'PDF', kind: 'PDF Document', className: 'pdf' },
    img: { label: 'IMG', kind: 'Image', className: 'img' },
    xlsx: { label: 'XLS', kind: 'Spreadsheet', className: 'xlsx' },
    doc: { label: 'DOC', kind: 'Document', className: 'doc' },
    dwg: { label: 'DWG', kind: 'CAD Drawing', className: 'dwg' },
    www: { label: 'LINK', kind: 'Web Link', className: 'www' },
    other: { label: 'FILE', kind: 'File', className: 'other' }
  };

  function normalizeFileType(fileType) {
    const t = (fileType || '').toString().trim().toLowerCase();
    if (!t) return 'other';
    if (t === 'pdf') return 'pdf';
    if (['img', 'image', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(t)) return 'img';
    if (['xls', 'xlsx', 'csv'].includes(t)) return 'xlsx';
    if (['doc', 'docx', 'word'].includes(t)) return 'doc';
    if (['dwg', 'dxf', 'cad'].includes(t)) return 'dwg';
    if (['www', 'url', 'link', 'web'].includes(t)) return 'www';
    return FILE_TYPE_INFO[t] ? t : 'other';
  }

  function getFileTypeInfo(fileType) {
    const key = normalizeFileType(fileType);
    const base = FILE_TYPE_INFO[key] || FILE_TYPE_INFO.other;
    return {
      key,
      label: base.label,
      kind: base.kind,
      className: base.className,
      icon: FILE_ICONS[key] || FILE_ICONS.other
    };
  }

  // ==========================================
  // ACCESS GATING
  // ==========================================
  function getAccessMode() {
    const mode = (settings.dr_access_mode || 'password').toString().trim().toLowerCase();
    if (mode === 'open' || mode === 'token' || mode === 'password') return mode;
    return 'password';
  }

  function getPassword() {
    return (settings.dr_password || '').toString().trim();
  }

  function getLinkToken() {
    return (settings.dr_link_token || '').toString().trim();
  }

  function unlockKeyFor(mode, credential) {
    const m = (mode || 'password').toString().trim().toLowerCase();
    const c = (credential || '').toString().trim();
    return 'redew_dataroom_unlocked_v2:' + m + ':' + c;
  }

  function clearUnlock() {
    try {
      const pw = getPassword();
      const tok = getLinkToken();
      if (pw) localStorage.removeItem(unlockKeyFor('password', pw));
      if (tok) localStorage.removeItem(unlockKeyFor('token', tok));
      localStorage.removeItem('redew_dataroom_unlocked_v1');
    } catch (e) {}
  }

  function isUnlocked() {
    try {
      const mode = getAccessMode();
      if (mode === 'open') return true;

      const pw = getPassword();
      const tok = getLinkToken();

      if (mode === 'token') {
        if (!tok) return false;
        return localStorage.getItem(unlockKeyFor('token', tok)) === 'true';
      }

      if (tok && localStorage.getItem(unlockKeyFor('token', tok)) === 'true') return true;
      if (pw && localStorage.getItem(unlockKeyFor('password', pw)) === 'true') return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  function setUnlocked(val, modeUsed) {
    try {
      if (!val) {
        clearUnlock();
        return;
      }

      const mode = (modeUsed || getAccessMode()).toString().trim().toLowerCase();
      if (mode === 'token') {
        const tok = getLinkToken();
        if (tok) localStorage.setItem(unlockKeyFor('token', tok), 'true');
        return;
      }

      const pw = getPassword();
      if (pw) localStorage.setItem(unlockKeyFor('password', pw), 'true');
    } catch (e) {}
  }

  function cleanUrlParams(params) {
    try {
      const url = new URL(window.location.href);
      let changed = false;
      (params || []).forEach((p) => {
        if (url.searchParams.has(p)) {
          url.searchParams.delete(p);
          changed = true;
        }
      });
      if (!changed) return;
      const qs = url.searchParams.toString();
      const next = url.pathname + (qs ? ('?' + qs) : '') + url.hash;
      window.history.replaceState({}, '', next);
    } catch (e) {}
  }

  function showStatusBlocker(kind) {
    const blocker = $('#statusBlocker');
    const title = $('#statusTitle');
    const body = $('#statusBody');
    if (!blocker) return;

    blocker.classList.add('visible');
    if (kind === 'disabled') {
      if (title) title.textContent = 'Data Room Disabled';
      if (body) body.textContent = 'This data room is currently unavailable.';
    } else {
      if (title) title.textContent = 'Maintenance Mode';
      if (body) body.textContent = 'This data room is temporarily unavailable for maintenance. Please check back soon.';
    }

    const main = $('#mainContent');
    if (main) main.style.display = 'none';
  }

  function hideStatusBlocker() {
    const blocker = $('#statusBlocker');
    if (blocker) blocker.classList.remove('visible');

    const main = $('#mainContent');
    if (main) main.style.display = '';
  }

  function showAccessModal(message, mode) {
    const overlay = $('#accessModal');
    const msg = $('#accessMessage');
    const err = $('#accessError');
    const inp = $('#accessPassword');
    if (!overlay) return;

    const m = (mode || getAccessMode()).toString().trim().toLowerCase();
    if (inp) {
      inp.type = (m === 'token') ? 'text' : 'password';
      inp.placeholder = (m === 'token') ? 'Access token' : 'Access passcode';
      inp.value = '';
    }

    if (msg) {
      msg.textContent = message || (m === 'token'
        ? 'Enter your investor link token to continue.'
        : 'Enter the investor access passcode to continue.');
    }

    if (err) err.classList.remove('visible');
    overlay.classList.add('visible');
    setTimeout(() => {
      try { inp && inp.focus(); } catch (e) {}
    }, 50);
  }

  function hideAccessModal() {
    const overlay = $('#accessModal');
    if (overlay) overlay.classList.remove('visible');
  }

  function maybeAutoUnlockFromLink() {
    const pwParam = (getQueryParam('pw') || getQueryParam('access') || '').trim();
    const tokenParam = (getQueryParam('token') || '').trim();

    const pw = getPassword();
    const tok = getLinkToken();

    let unlocked = false;

    if (tok && tokenParam && tokenParam === tok) {
      setUnlocked(true, 'token');
      unlocked = true;
    }

    if (!unlocked && pw && pwParam && pwParam === pw) {
      setUnlocked(true, 'password');
      unlocked = true;
    }

    if (unlocked) {
      hideAccessModal();
      cleanUrlParams(['pw', 'access', 'token']);
    }
  }

  async function enforceAccessRules() {
    const status = (settings.dr_status || 'active').toLowerCase();
    if (status === 'disabled' || status === 'maintenance') {
      showStatusBlocker(status);
      return false;
    }
    hideStatusBlocker();

    const mode = getAccessMode();
    const pw = getPassword();
    const tok = getLinkToken();

    if (mode === 'open') {
      hideAccessModal();
      return true;
    }

    maybeAutoUnlockFromLink();

    if (mode === 'token') {
      if (!tok) {
        showAccessModal('This data room is configured for token-based access, but no token is set. Ask the administrator to set one in the Admin Dashboard.', 'token');
        return false;
      }
      if (!isUnlocked()) {
        showAccessModal('This data room requires an investor link token. Please use the investor link provided by the administrator, or enter your token below.', 'token');
        return false;
      }
      hideAccessModal();
      return true;
    }

    if (pw && !isUnlocked()) {
      showAccessModal('Enter the investor access passcode to continue.', 'password');
      return false;
    }

    hideAccessModal();
    return true;
  }

  function setupAccessModalHandlers() {
    const btn = $('#accessSubmit');
    const inp = $('#accessPassword');
    if (!btn || !inp) return;
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    const submit = async () => {
      const err = $('#accessError');
      const mode = getAccessMode();
      const pw = getPassword();
      const tok = getLinkToken();
      const entered = (inp.value || '').trim();

      if (mode === 'open') {
        hideAccessModal();
        await startApp();
        return;
      }

      if (mode === 'token') {
        if (!tok) {
          if (err) {
            err.textContent = 'No token is configured. Please contact the administrator.';
            err.classList.add('visible');
          }
          return;
        }
        if (entered === tok) {
          setUnlocked(true, 'token');
          hideAccessModal();
          await startApp();
        } else {
          if (err) {
            err.textContent = 'Incorrect token.';
            err.classList.add('visible');
          }
        }
        return;
      }

      if (tok && entered === tok) {
        setUnlocked(true, 'token');
        hideAccessModal();
        await startApp();
        return;
      }

      if (!pw) {
        hideAccessModal();
        await startApp();
        return;
      }

      if (entered === pw) {
        setUnlocked(true, 'password');
        hideAccessModal();
        await startApp();
      } else {
        if (err) {
          err.textContent = 'Incorrect passcode.';
          err.classList.add('visible');
        }
      }
    };

    btn.addEventListener('click', submit);
    inp.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submit();
    });

    const refresh = $('#statusRefresh');
    if (refresh && refresh.dataset.bound !== '1') {
      refresh.dataset.bound = '1';
      refresh.addEventListener('click', () => {
        try {
          window.location.reload();
        } catch (e) {}
      });
    }
  }

  // ==========================================
  // SUPABASE INIT + REALTIME
  // ==========================================
  function initSupabase() {
    try {
      const cfg = getSupabaseConfig();
      if (cfg.url && cfg.key) {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          supabase = window.supabase.createClient(cfg.url, cfg.key);
          cleanUrlParams(['sbUrl', 'sbKey']);
        }
      } else {
        const ce = $('#connectionError');
        if (ce) {
          ce.classList.add('visible');
          ce.textContent = 'Not connected: missing Supabase config. Open this page using the Admin-generated link (it includes sbUrl and sbKey).';
        }
      }
    } catch (e) {
      console.error('Failed to initialize Supabase:', e);
    }
  }

  function showSyncIndicator() {
    const indicator = $('#syncIndicator');
    if (!indicator) return;
    indicator.classList.add('visible');
    setTimeout(() => indicator.classList.remove('visible'), 1500);
  }

  function safeRerenderCurrentSection() {
    try {
      if (currentSection && currentSection.id) {
        renderDocuments(currentSection.id);
        renderNotes(currentSection.id);
        updateBreadcrumb(currentSection.name);
      }
    } catch (e) {
      console.error('Rerender failed:', e);
    }
  }

  function setupRealtimeSync() {
    if (!supabase) return;
    if (realtimeSubscription) return;

    try {
      realtimeSubscription = supabase
        .channel('dataroom-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'dataroom_documents' }, async () => {
          showSyncIndicator();
          await loadDocuments();
          if (currentView === 'dashboard') renderDashboard();
          else safeRerenderCurrentSection();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'dataroom_notes' }, async () => {
          showSyncIndicator();
          await loadNotes();
          if (currentSection) safeRerenderCurrentSection();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'dataroom_settings' }, async () => {
          showSyncIndicator();
          await loadSettings();
          maybeAutoUnlockFromLink();
          const ok = await enforceAccessRules();
          if (!ok) return;
          if (currentView === 'dashboard') renderDashboard();
          else if (currentSection) safeRerenderCurrentSection();
        })
        .subscribe();
    } catch (e) {
      console.error('Failed to setup realtime:', e);
    }
  }

  // ==========================================
  // DATA LOADING
  // ==========================================
  function showLoading() {
    const el = $('#loadingOverlay');
    if (el) el.classList.add('visible');
  }

  function hideLoading() {
    const el = $('#loadingOverlay');
    if (el) el.classList.remove('visible');
  }

  async function loadDocuments() {
    if (!supabase) return;
    const res = await supabase
      .from('dataroom_documents')
      .select('*')
      .eq('is_hidden', false)
      .order('sort_order', { ascending: true });
    if (res.data) documents = res.data;
  }

  async function loadNotes() {
    if (!supabase) return;
    const res = await supabase
      .from('dataroom_notes')
      .select('*')
      .order('sort_order', { ascending: true });
    if (res.data) notes = res.data;
  }

  async function loadSettings() {
    if (!supabase) return;
    const res = await supabase.from('dataroom_settings').select('*');
    if (res.data) {
      settings = {};
      res.data.forEach((s) => {
        settings[s.key] = s.value;
      });
    }
  }

  async function loadData() {
    showLoading();

    if (!supabase) {
      hideLoading();
      return;
    }

    try {
      await loadSettings();
      maybeAutoUnlockFromLink();

      const allowed = await enforceAccessRules();
      if (!allowed) {
        hideLoading();
        return;
      }

      await Promise.all([loadDocuments(), loadNotes()]);
    } catch (e) {
      console.error('Error loading data:', e);
      const ce = $('#connectionError');
      if (ce) {
        ce.classList.add('visible');
        ce.textContent = 'Unable to connect to database. Please try again later.';
      }
    } finally {
      hideLoading();
    }
  }

  async function refreshAll(reason = 'manual') {
    try {
      showSyncIndicator();
      await loadData();
      const allowed = await enforceAccessRules();
      if (!allowed) return;

      if (currentView === 'dashboard') {
        renderMenu();
        renderDashboard();
      } else if (currentSection) {
        renderMenu();
        safeRerenderCurrentSection();
      } else {
        renderMenu();
        renderDashboard();
      }

      setupEventListeners();
      startVisitorTracking();
      setupRealtimeSync();
      startPolling();

      void reason;
    } catch (e) {
      console.error('Refresh failed:', e);
    }
  }

  function startPolling() {
    if (pollingTimer) return;
    pollingTimer = window.setInterval(async () => {
      await refreshAll('poll');
    }, 30000);

    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden) {
        await refreshAll('visibility');
      }
    });

    window.addEventListener('online', async () => {
      await refreshAll('online');
    });
  }

  // ==========================================
  // VISITOR IDENTIFICATION + TRACKING
  // ==========================================
  function getStoredVisitor() {
    try {
      const stored = localStorage.getItem('redew_visitor');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  function storeVisitor(info) {
    try {
      localStorage.setItem('redew_visitor', JSON.stringify(info));
    } catch (e) {}
  }

  function clearVisitor() {
    try {
      localStorage.removeItem('redew_visitor');
    } catch (e) {}
  }

  function showVisitorModal() {
    const overlay = $('#visitorModal');
    if (!overlay) return;
    overlay.classList.add('visible');
    const nameInp = $('#visitorName');
    if (nameInp) nameInp.focus();

    const submitBtn = $('#visitorSubmit');
    if (submitBtn && submitBtn.dataset.bound !== '1') {
      submitBtn.dataset.bound = '1';
      submitBtn.addEventListener('click', handleVisitorSubmit);
    }

    ['visitorEmail', 'visitorCompany'].forEach((id) => {
      const el = $('#' + id);
      if (el && el.dataset.bound !== '1') {
        el.dataset.bound = '1';
        el.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') handleVisitorSubmit();
        });
      }
    });
  }

  async function handleVisitorSubmit() {
    const name = ($('#visitorName')?.value || '').trim();
    const email = ($('#visitorEmail')?.value || '').trim();
    const company = ($('#visitorCompany')?.value || '').trim();
    const err = $('#visitorError');

    if (!name || !email) {
      if (err) {
        err.textContent = 'Please enter your name and email address.';
        err.classList.add('visible');
      }
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      if (err) {
        err.textContent = 'Please enter a valid email address.';
        err.classList.add('visible');
      }
      return;
    }

    if (err) err.classList.remove('visible');

    const btn = $('#visitorSubmit');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Loading…';
    }

    visitorInfo = { name, email, company: company || null, first_visit: new Date().toISOString() };
    storeVisitor(visitorInfo);

    const overlay = $('#visitorModal');
    if (overlay) overlay.classList.remove('visible');

    renderVisitorUI();
    await startApp();

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Access Data Room';
    }
  }

  async function startVisitorTracking() {
    if (!supabase || !visitorInfo) return;
    if (sessionId) return;

    var wCrypto = (typeof window !== 'undefined' ? window.crypto : null);
    sessionId = (wCrypto && wCrypto.randomUUID) ? wCrypto.randomUUID() : ('session_' + Date.now());
    sessionStart = new Date().toISOString();

    try {
      await supabase.from('visitor_sessions').insert({
        session_id: sessionId,
        visitor_name: visitorInfo.name,
        visitor_email: visitorInfo.email,
        visitor_company: visitorInfo.company,
        started_at: sessionStart,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight
      });
    } catch (e) {}

    window.addEventListener('beforeunload', endVisitorSession);

    try {
      await supabase.from('visitor_clicks').insert({
        session_id: sessionId,
        visitor_email: visitorInfo.email,
        action: 'dashboard_view',
        clicked_at: new Date().toISOString()
      });
    } catch (e) {}
  }

  async function endVisitorSession() {
    if (!supabase || !sessionId || !sessionStart) return;
    const duration = Math.round((Date.now() - new Date(sessionStart).getTime()) / 1000);
    try {
      await supabase
        .from('visitor_sessions')
        .update({ ended_at: new Date().toISOString(), duration_seconds: duration })
        .eq('session_id', sessionId);
    } catch (e) {}
  }

  async function trackDocumentClick(doc) {
    if (!supabase || !sessionId) return;
    try {
      await supabase.from('visitor_clicks').insert({
        session_id: sessionId,
        visitor_email: visitorInfo?.email || null,
        document_id: doc.id,
        document_name: doc.name,
        section: doc.section,
        action: 'document_click',
        clicked_at: new Date().toISOString()
      });
      logActivity('view_document', doc.section, doc.name);
    } catch (e) {}
  }

  async function trackSectionView(sectionId) {
    if (!supabase || !sessionId) return;
    try {
      await supabase.from('visitor_clicks').insert({
        session_id: sessionId,
        visitor_email: visitorInfo?.email || null,
        section: sectionId,
        action: 'section_view',
        clicked_at: new Date().toISOString()
      });
      logActivity('view_section', sectionId, null);
    } catch (e) {}
  }

  // ==========================================
  // UI: VISITOR DISPLAY + LOGOUT
  // ==========================================
  function renderVisitorUI() {
    const footerYear = $('#footerYear');
    if (footerYear) footerYear.textContent = String(new Date().getFullYear());

    const name = visitorInfo?.name || 'Visitor';
    const email = visitorInfo?.email || '';
    const company = visitorInfo?.company || '';

    const initials = (name || 'V')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('') || 'V';

    const userAvatar = $('#userAvatar');
    if (userAvatar) userAvatar.textContent = initials;

    const userDisplayName = $('#userDisplayName');
    if (userDisplayName) userDisplayName.textContent = name;

    const userDisplayEmail = $('#userDisplayEmail');
    if (userDisplayEmail) userDisplayEmail.textContent = email || '—';

    const userDropdownName = $('#userDropdownName');
    if (userDropdownName) userDropdownName.textContent = name;

    const userDropdownEmail = $('#userDropdownEmail');
    if (userDropdownEmail) userDropdownEmail.textContent = email || '—';

    const userDropdownCompany = $('#userDropdownCompany');
    if (userDropdownCompany) userDropdownCompany.textContent = company ? ('Company: ' + company) : '';
  }

  async function logout() {
    try {
      await endVisitorSession();
    } catch (e) {}

    visitorInfo = null;
    clearVisitor();
    setUnlocked(false);

    sessionId = null;
    sessionStart = null;
    documents = [];
    notes = [];
    settings = {};
    currentView = 'dashboard';
    currentSection = null;
    docSearchTerm = '';

    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }

    try {
      if (supabase && realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
      }
    } catch (e) {}
    realtimeSubscription = null;

    try {
      renderVisitorUI();
      showVisitorModal();
    } catch (e) {}
  }

  // ==========================================
  // RENDERING
  // ==========================================
  function renderMenu() {
    const menuItems = $('#menuItems');
    if (!menuItems) return;

    const showEmptySections = String(settings.dr_show_empty_sections || '').toLowerCase() === 'true';
    const sectionsToRender = showEmptySections ? SECTIONS : SECTIONS.filter((s) => documents.some((d) => d.section === s.id));

    const menuHtml = `
      <a href="#" class="menu-item active" data-view="dashboard">
        ${ICONS['dashboard']}
        Dashboard
      </a>
      ${sectionsToRender.map(
        (s) => `
        <a href="#" class="menu-item" data-section="${escapeHtml(s.id)}">
          ${ICONS[s.icon]}
          ${escapeHtml(s.name)}
        </a>
      `
      ).join('')}
    `;

    menuItems.innerHTML = menuHtml;

    $$('.menu-item', menuItems).forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();

        if (item.dataset.view === 'dashboard') {
          goBack();
        } else if (item.dataset.section) {
          openSection(item.dataset.section, { track: true });
        }
      });
    });
  }

  // ==========================================
  // FIXED: renderDashboard - was split into two functions
  // ==========================================
  function renderDashboard() {
    // 1. Track dashboard view
    trackVisitor('view_dashboard');

    // 2. Update UI text from settings
    if (settings.project_name) {
      const t = $('#projectTitle');
      if (t) t.textContent = settings.project_name + ' — Project Dashboard';
    }

    if (settings.project_subtitle) {
      const st = $('#projectSubtitle');
      if (st) st.textContent = settings.project_subtitle;
    }

    if (settings.capacity) {
      const cap = $('#capacityValue');
      if (cap) cap.textContent = settings.capacity;
    }

    if (settings.target_ntp) {
      const ntp = $('#ntpValue');
      if (ntp) ntp.textContent = settings.target_ntp;
      const target = $('#targetNtp');
      if (target) target.textContent = 'Target NTP: ' + settings.target_ntp;
    }

    // 3. Calculate and render progress (dynamic from admin settings)
    const progressKeys = getEnabledProgressCategories();

    let sum = 0;
    let cnt = 0;
    progressKeys.forEach((k) => {
      const v = parseInt(settings[k] || '0', 10);
      if (!Number.isNaN(v)) {
        sum += v;
        cnt++;
      }
    });

    const avgProgress = cnt ? Math.round(sum / cnt) : 0;

    const circumference = 201;
    const offset = circumference - (avgProgress / 100) * circumference;

    const tp = $('#totalProgress');
    const prt = $('#progressRingText');
    const pr = $('#progressRing');

    if (tp) tp.textContent = avgProgress + '%';
    if (prt) prt.textContent = avgProgress + '%';
    if (pr) pr.style.strokeDashoffset = String(offset);

    // 4. Render progress breakdown (dynamic from admin settings)
    const breakdownItems = progressKeys.map(key => ({
      label: PROGRESS_LABEL_MAP[key] || key.replace('progress_', '').replace(/_/g, ' '),
      key: key
    }));

    const pb = $('#progressBreakdown');
    if (pb) {
      pb.innerHTML = breakdownItems
        .map((item) => {
          const val = escapeHtml(settings[item.key] || '0');
          return `
          <div class="progress-item">
            <span class="progress-item-label">${escapeHtml(item.label)}</span>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${val}%"></div>
            </div>
            <span class="progress-item-value">${val}%</span>
          </div>
        `;
        })
        .join('');
    }

    // 5. Render category cards
    renderCategories();
  }

  function renderCategories() {
    const grid = $('#categoryGrid');
    if (!grid) return;

    const showEmpty = String(settings.dr_show_empty_sections || '').toLowerCase() === 'true';
    const sectionsToRender = showEmpty ? SECTIONS : SECTIONS.filter((s) => documents.some((d) => d.section === s.id));

    grid.innerHTML = sectionsToRender.map((section) => {
      const sectionDocs = documents.filter((d) => d.section === section.id);
      const uploadedCount = sectionDocs.filter(
        (d) => (d.status || '').toLowerCase() === 'uploaded' && (d.url || '').trim()
      ).length;
      const totalCount = sectionDocs.length;
      const percent = totalCount ? Math.round((uploadedCount / totalCount) * 100) : 0;

      return `
        <div class="category-card" data-section="${escapeHtml(section.id)}">
          <div class="category-icon">${ICONS[section.icon]}</div>
          <div class="category-info">
            <div class="category-name">${escapeHtml(section.name)}</div>
            <div class="category-desc">${escapeHtml(section.desc)}</div>
          </div>
          <div class="category-status">
            <span class="category-badge">${percent}%</span>
            <span class="category-count">${totalCount} ${totalCount === 1 ? 'doc' : 'docs'}</span>
          </div>
        </div>
      `;
    }).join('');

    $$('.category-card', grid).forEach((card) => {
      card.addEventListener('click', () => openSection(card.dataset.section, { track: true }));
    });
  }

  function openSection(sectionId, opts = { track: true }) {
    const section = SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;

    currentView = 'section';
    currentSection = section;

    trackVisitor('view_section', { section: sectionId });

    docSearchTerm = '';
    const searchInp = $('#docSearchInput');
    if (searchInp) searchInp.value = '';

    const dash = $('#dashboardView');
    const cat = $('#categoryView');
    if (dash) dash.classList.remove('active');
    if (cat) cat.classList.add('active');

    const back = $('#backBtn');
    if (back) back.classList.add('visible');

    const icon = $('#categoryIcon');
    const title = $('#categoryTitle');
    const desc = $('#categoryDesc');
    if (icon) icon.innerHTML = ICONS[section.icon];
    if (title) title.textContent = section.name;
    if (desc) desc.textContent = section.desc;

    const sectionDocs = documents.filter((d) => d.section === sectionId);
    const uploadedCount = sectionDocs.filter(
      (d) => (d.status || '').toLowerCase() === 'uploaded' && (d.url || '').trim()
    ).length;
    const totalCount = sectionDocs.length;
    const percent = totalCount ? Math.round((uploadedCount / totalCount) * 100) : 0;

    const badge = $('#categoryBadge');
    if (badge) badge.textContent = percent + '% Complete';

    updateBreadcrumb(section.name);
    updateMenuActive(section.id);

    renderDocuments(section.id);
    renderNotes(section.id);

    if (opts && opts.track) {
      trackSectionView(section.id);
    }
  }

  function renderDocuments(sectionId) {
    const list = $('#docList');
    if (!list) return;

    let sectionDocs = documents.filter((d) => d.section === sectionId);

    const needle = (docSearchTerm || '').trim().toLowerCase();
    if (needle) {
      sectionDocs = sectionDocs.filter((doc) => {
        const name = (doc.name || '').toLowerCase();
        const ft = (doc.file_type || '').toString().toLowerCase();
        const status = (doc.status || '').toString().toLowerCase();
        return name.includes(needle) || ft.includes(needle) || status.includes(needle);
      });
    }

    if (!sectionDocs.length) {
      list.innerHTML = `
        <p style="color: var(--text-muted); font-size: 14px; padding: 8px 2px;">
          ${needle ? 'No matching documents.' : 'No documents available yet.'}
        </p>
      `;
      return;
    }

    list.innerHTML = sectionDocs
      .map((doc) => {
        const typeInfo = getFileTypeInfo(doc.file_type);
        const status = (doc.status || 'missing').toLowerCase();
        const statusText = status === 'uploaded' ? 'Uploaded' : status === 'pending' ? 'Pending' : 'Missing';
        const hasUrl = (doc.url || '').trim().length > 0;
        const isInteractive = status === 'uploaded' && hasUrl;

        const metaParts = [];
        if (typeInfo.kind) metaParts.push(typeInfo.kind);
        if (doc.date_added) metaParts.push(doc.date_added);
        const meta = metaParts.join(' • ');

        return `
          <div class="doc-item ${isInteractive ? 'clickable' : 'disabled'}" data-doc-id="${escapeHtml(String(doc.id))}" ${
          isInteractive ? '' : 'aria-disabled="true"'
        }>
            <div class="doc-type-icon ${escapeHtml(typeInfo.className)}">
              <div class="doc-type-glyph">${typeInfo.icon}</div>
              <div class="doc-type-label">${escapeHtml(typeInfo.label)}</div>
            </div>
            <div class="doc-info">
              <div class="doc-name">${escapeHtml(doc.name || '')}</div>
              <div class="doc-meta">${escapeHtml(meta || '')}</div>
            </div>
            <div class="doc-status ${escapeHtml(status)}">
              <span class="doc-status-dot"></span>
              ${escapeHtml(statusText)}
            </div>
          </div>
        `;
      })
      .join('');

    $$('.doc-item.clickable', list).forEach((item) => {
      item.addEventListener('click', () => {
        const docId = item.dataset.docId;
        const doc = documents.find((d) => String(d.id) === String(docId));
        if (doc) openDocument(doc);
      });
    });
  }

  function renderNotes(sectionId) {
    const sec = $('#notesSection');
    const notesList = $('#notesList');
    if (!sec || !notesList) return;

    const sectionNotes = notes.filter((n) => n.section === sectionId);
    if (!sectionNotes.length) {
      sec.style.display = 'none';
      return;
    }

    notesList.innerHTML = sectionNotes
      .map((note) => {
        const author = escapeHtml(note.author || 'Note');
        const date = escapeHtml(note.date || '');
        const content = escapeHtml(note.content || '');
        const highlight = note.is_highlight ? 'highlight' : '';
        return `
        <div class="note-item ${highlight}">
          <div class="note-source">${author}<span class="note-date">${date}</span></div>
          <div class="note-text">${content}</div>
        </div>
      `;
      })
      .join('');

    sec.style.display = 'block';
  }

  function openDocument(doc) {
    trackDocumentClick(doc);

    trackVisitor('view_document', { 
      section: doc.section || '', 
      doc: doc.name || '' 
    });

    const url = (doc.url || '').trim();
    const status = (doc.status || '').toLowerCase();
    
    if (status === 'uploaded' && url) {
      try {
        window.open(url, '_blank', 'noopener');
      } catch (e) {
        window.location.href = url;
      }
    }
  }

  // ==========================================
  // NAV + UI
  // ==========================================
  function updateBreadcrumb(current) {
    const bc = $('#breadcrumbCurrent');
    if (bc) bc.textContent = current || 'Dashboard';
  }

  function updateMenuActive(id) {
    $$('.menu-item').forEach((item) => {
      item.classList.remove('active');
      if (item.dataset.section === id || (id === 'dashboard' && item.dataset.view === 'dashboard')) {
        item.classList.add('active');
      }
    });
  }

  function goBack() {
    if (currentView === 'dashboard') return;
    currentView = 'dashboard';
    currentSection = null;
    updateBreadcrumb('Dashboard');

    const cat = $('#categoryView');
    const dash = $('#dashboardView');
    if (cat) cat.classList.remove('active');
    if (dash) dash.classList.add('active');

    const back = $('#backBtn');
    if (back) back.classList.remove('visible');

    updateMenuActive('dashboard');
  }

  function isDesktopSidebarPinned() {
    try {
      return window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;
    } catch (e) {
      return false;
    }
  }

  function openMenu() {
    if (isDesktopSidebarPinned()) return;
    $('#menuOverlay')?.classList.add('open');
    $('#sideMenu')?.classList.add('open');
  }

  function closeMenu() {
    if (isDesktopSidebarPinned()) return;
    $('#menuOverlay')?.classList.remove('open');
    $('#sideMenu')?.classList.remove('open');
  }

  // ==========================================
  // THEME
  // ==========================================
  function initTheme() {
    const saved = localStorage.getItem('dataroom-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dataroom-theme', newTheme);
  }

  // ==========================================
  // BANNERS
  // ==========================================
  function hideJsBanner() {
    const b = $('#jsBanner');
    if (b) b.style.display = 'none';
  }

  function hideJsHealth() {
    const h = $('#jsHealth');
    if (h) h.style.display = 'none';
  }

  function bindLogoErrorHandler() {
    const logo = $('#logoMark');
    if (!logo) return;
    if (logo.dataset.bound === '1') return;
    logo.dataset.bound = '1';
    logo.addEventListener('error', () => {
      logo.style.display = 'none';
    });
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  function setupEventListeners() {
    const menuBtn = $('#menuBtn');
    if (menuBtn && menuBtn.dataset.bound !== '1') {
      menuBtn.dataset.bound = '1';
      menuBtn.addEventListener('click', openMenu);
    }

    const menuOverlay = $('#menuOverlay');
    if (menuOverlay && menuOverlay.dataset.bound !== '1') {
      menuOverlay.dataset.bound = '1';
      menuOverlay.addEventListener('click', closeMenu);
    }

    const backBtn = $('#backBtn');
    if (backBtn && backBtn.dataset.bound !== '1') {
      backBtn.dataset.bound = '1';
      backBtn.addEventListener('click', goBack);
    }

    const breadcrumbRoot = $('#breadcrumbRoot');
    if (breadcrumbRoot && breadcrumbRoot.dataset.bound !== '1') {
      breadcrumbRoot.dataset.bound = '1';
      breadcrumbRoot.addEventListener('click', (e) => {
        e.preventDefault();
        goBack();
      });
    }

    const themeToggle = $('#themeToggle');
    if (themeToggle && themeToggle.dataset.bound !== '1') {
      themeToggle.dataset.bound = '1';
      themeToggle.addEventListener('click', toggleTheme);
    }

    const refreshBtn = $('#refreshBtn');
    if (refreshBtn && refreshBtn.dataset.bound !== '1') {
      refreshBtn.dataset.bound = '1';
      refreshBtn.addEventListener('click', async () => {
        await refreshAll('refresh-btn');
      });
    }

    const userChip = $('#userChip');
    if (userChip && userChip.dataset.bound !== '1') {
      userChip.dataset.bound = '1';
      userChip.addEventListener('click', () => {
        openMenu();
      });
    }

    const logoutBtn = $('#logoutBtn');
    if (logoutBtn && logoutBtn.dataset.bound !== '1') {
      logoutBtn.dataset.bound = '1';
      logoutBtn.addEventListener('click', async () => {
        await logout();
      });
    }

    const footerLogoutBtn = $('#footerLogoutBtn');
    if (footerLogoutBtn && footerLogoutBtn.dataset.bound !== '1') {
      footerLogoutBtn.dataset.bound = '1';
      footerLogoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logout();
      });
    }

    const searchInput = $('#docSearchInput');
    if (searchInput && searchInput.dataset.bound !== '1') {
      searchInput.dataset.bound = '1';
      searchInput.addEventListener('input', () => {
        docSearchTerm = (searchInput.value || '').trim();
        if (currentSection) renderDocuments(currentSection.id);
      });
    }

    const searchClear = $('#docSearchClear');
    if (searchClear && searchClear.dataset.bound !== '1') {
      searchClear.dataset.bound = '1';
      searchClear.addEventListener('click', () => {
        docSearchTerm = '';
        const inp = $('#docSearchInput');
        if (inp) inp.value = '';
        if (currentSection) renderDocuments(currentSection.id);
      });
    }

    window.addEventListener('resize', () => {
      if (isDesktopSidebarPinned()) {
        $('#menuOverlay')?.classList.remove('open');
        $('#sideMenu')?.classList.remove('open');
      }
    });
  }

  // ==========================================
  // BOOTSTRAP
  // ==========================================
  async function startApp() {
    hideJsBanner();

    await loadData();

    const allowed = await enforceAccessRules();
    if (!allowed) return;

    renderMenu();

    if (currentView === 'dashboard') {
      renderDashboard();
    } else if (currentSection) {
      openSection(currentSection.id, { track: false });
    } else {
      renderDashboard();
    }

    renderVisitorUI();
    setupEventListeners();

    startVisitorTracking();
    setupRealtimeSync();
    startPolling();
  }

  async function init() {
    initTheme();
    hideJsBanner();
    initSupabase();

    hideJsHealth();
    bindLogoErrorHandler();

    setupAccessModalHandlers();
    setupEventListeners();

    visitorInfo = getStoredVisitor();
    renderVisitorUI();

    if (visitorInfo) {
      await startApp();
    } else {
      showVisitorModal();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
