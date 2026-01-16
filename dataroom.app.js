(() => {
'use strict';

  function hideJsHealth() {
    const el = document.getElementById('jsHealth');
    if (el) el.classList.remove('visible');
  }

  function bindLogoErrorHandler() {
    const logo = document.getElementById('logoMark');
    if (!logo || logo.dataset.bound === '1') return;
    logo.dataset.bound = '1';
    logo.addEventListener('error', () => {
      logo.style.display = 'none';
    });
  }

// ==========================================
    // SUPABASE CONFIGURATION
    // ==========================================
    // This page expects credentials via query params:
    //   ?sbUrl=<SUPABASE_URL>&sbKey=<SUPABASE_ANON_KEY>
    // Admin generates this link in Admin -> Settings -> Public Data Room Link.

    const FALLBACK_SUPABASE_URL = '';
    const FALLBACK_SUPABASE_ANON_KEY = '';

    function getQueryParam(name) {
      try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
    }

    function getSupabaseConfig() {
      const sbUrl = (getQueryParam('sbUrl') || '').trim();
      const sbKey = (getQueryParam('sbKey') || '').trim();

      // Persist provided config for future loads
      try {
        if (sbUrl && sbKey) {
          localStorage.setItem('redew_dataroom_config', JSON.stringify({ url: sbUrl, key: sbKey }));
        }
      } catch (e) {}

      let stored = null;
      try { stored = JSON.parse(localStorage.getItem('redew_dataroom_config') || 'null'); } catch (e) {}

      const url = sbUrl || (stored && stored.url) || FALLBACK_SUPABASE_URL;
      const key = sbKey || (stored && stored.key) || FALLBACK_SUPABASE_ANON_KEY;
      return { url, key };
    }

    let supabase = null;
    let realtimeSubscription = null;

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
    // ACCESS GATING
    // ==========================================
    function getUnlockKey() { return 'redew_dataroom_unlocked_v1'; }
    function isUnlocked() { try { return localStorage.getItem(getUnlockKey()) === 'true'; } catch (e) { return false; } }
    function setUnlocked(val) { try { localStorage.setItem(getUnlockKey(), val ? 'true' : 'false'); } catch (e) {} }

    function showStatusBlocker(kind) {
      const blocker = document.getElementById('statusBlocker');
      const title = document.getElementById('statusTitle');
      const body = document.getElementById('statusBody');
      if (!blocker) return;
      blocker.classList.add('visible');
      if (kind === 'disabled') {
        if (title) title.textContent = 'Data Room Disabled';
        if (body) body.textContent = 'This data room is currently unavailable.';
      } else {
        if (title) title.textContent = 'Maintenance Mode';
        if (body) body.textContent = 'This data room is temporarily unavailable for maintenance. Please check back soon.';
      }
      const main = document.getElementById('mainContent');
      if (main) main.style.display = 'none';
    }

    function hideStatusBlocker() {
      const blocker = document.getElementById('statusBlocker');
      if (blocker) blocker.classList.remove('visible');
      const main = document.getElementById('mainContent');
      if (main) main.style.display = '';
    }

    function showAccessModal(message) {
      const overlay = document.getElementById('accessModal');
      const msg = document.getElementById('accessMessage');
      const err = document.getElementById('accessError');
      const inp = document.getElementById('accessPassword');
      if (!overlay) return;
      if (msg) msg.textContent = message || 'Enter the access password to continue.';
      if (err) err.classList.remove('visible');
      if (inp) inp.value = '';
      overlay.classList.add('visible');
      setTimeout(() => inp && inp.focus(), 50);
    }

    function hideAccessModal() {
      const overlay = document.getElementById('accessModal');
      if (overlay) overlay.classList.remove('visible');
    }

    async function enforceAccessRules() {
      const status = (settings.dr_status || 'active').toLowerCase();
      if (status === 'disabled' || status === 'maintenance') {
        showStatusBlocker(status);
        return false;
      }
      hideStatusBlocker();

      const pw = (settings.dr_password || '').trim();
      if (pw && !isUnlocked()) {
        showAccessModal('Enter the investor access password to continue.');
        return false;
      }
      return true;
    }

    function setupAccessModalHandlers() {
      const btn = document.getElementById('accessSubmit');
      const inp = document.getElementById('accessPassword');
      if (!btn || !inp) return;
      if (btn.dataset.bound === '1') return;
      btn.dataset.bound = '1';

      const submit = async () => {
        const err = document.getElementById('accessError');
        const pw = (settings.dr_password || '').trim();
        const entered = (inp.value || '').trim();
        if (!pw) {
          setUnlocked(true);
          hideAccessModal();
          return;
        }
        if (entered === pw) {
          setUnlocked(true);
          hideAccessModal();
          const ok = await enforceAccessRules();
          if (!ok) return;
          if (currentView === 'dashboard') renderDashboard();
          else if (currentSection) safeRerenderCurrentSection();

          // Start tracking + realtime only after access is granted
          await startVisitorTracking();
          setupRealtimeSync();
        } else {
          if (err) {
            err.textContent = 'Incorrect password.';
            err.classList.add('visible');
          }
        }
      };

      btn.addEventListener('click', submit);
      inp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submit();
      });
    }

    // ==========================================
    // SUPABASE INIT + REALTIME
    // ==========================================
    function initSupabase() {
      try {
        const cfg = getSupabaseConfig();
        if (cfg.url && cfg.key) {
          supabase = window.supabase.createClient(cfg.url, cfg.key);
        } else {
          const ce = document.getElementById('connectionError');
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
      const indicator = document.getElementById('syncIndicator');
      if (!indicator) return;
      indicator.classList.add('visible');
      setTimeout(() => indicator.classList.remove('visible'), 2000);
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
      if (!supabase || realtimeSubscription) return;
      try {
        realtimeSubscription = supabase
          .channel('dataroom-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'dataroom_documents' }, async () => {
            showSyncIndicator();
            await loadDocuments();
            if (currentView === 'dashboard') renderDashboard();
            else safeRerenderCurrentSection();
            await enforceAccessRules();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'dataroom_notes' }, async () => {
            showSyncIndicator();
            await loadNotes();
            if (currentSection) safeRerenderCurrentSection();
            await enforceAccessRules();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'dataroom_settings' }, async () => {
            showSyncIndicator();
            await loadSettings();
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
      const el = document.getElementById('loadingOverlay');
      if (el) el.classList.add('visible');
    }

    function hideLoading() {
      const el = document.getElementById('loadingOverlay');
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
        res.data.forEach(s => { settings[s.key] = s.value; });
      }
    }

    async function loadData() {
      showLoading();
      if (!supabase) { hideLoading(); return; }
      try {
        // Prevent a "forever spinner" if the network hangs
        const loadPromise = Promise.all([loadDocuments(), loadNotes(), loadSettings()]);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000));
        await Promise.race([loadPromise, timeoutPromise]);
      } catch (e) {
        console.error('Error loading data:', e);
        const ce = document.getElementById('connectionError');
        if (ce) {
          ce.classList.add('visible');
          ce.textContent = (e && e.message === 'timeout')
            ? 'Database connection timed out. Check your Supabase URL/key and network. (Showing UI without data.)'
            : 'Unable to connect to database. Check your Supabase URL/key and network. (Showing UI without data.)';
        }
      } finally {
        hideLoading();
      }
    }

    // ==========================================
    // VISITOR IDENTIFICATION + TRACKING
    // ==========================================
    function getStoredVisitor() {
      try {
        const stored = localStorage.getItem('redew_visitor');
        return stored ? JSON.parse(stored) : null;
      } catch (e) { return null; }
    }

    function storeVisitor(info) {
      try { localStorage.setItem('redew_visitor', JSON.stringify(info)); } catch (e) {}
    }

    function showVisitorModal() {
      const overlay = document.getElementById('visitorModal');
      if (!overlay) return;
      overlay.classList.add('visible');
      document.getElementById('visitorName')?.focus();

      const submitBtn = document.getElementById('visitorSubmit');
      if (submitBtn && submitBtn.dataset.bound !== '1') {
        submitBtn.dataset.bound = '1';
        submitBtn.addEventListener('click', handleVisitorSubmit);
      }

      ['visitorEmail','visitorCompany'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.dataset.bound !== '1') {
          el.dataset.bound = '1';
          el.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleVisitorSubmit();
          });
        }
      });
    }

    async function handleVisitorSubmit() {
      const name = (document.getElementById('visitorName')?.value || '').trim();
      const email = (document.getElementById('visitorEmail')?.value || '').trim();
      const company = (document.getElementById('visitorCompany')?.value || '').trim();
      const err = document.getElementById('visitorError');

      if (!name || !email) {
        if (err) { err.textContent = 'Please enter your name and email address.'; err.classList.add('visible'); }
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        if (err) { err.textContent = 'Please enter a valid email address.'; err.classList.add('visible'); }
        return;
      }
      if (err) err.classList.remove('visible');

      const btn = document.getElementById('visitorSubmit');
      if (btn) { btn.disabled = true; btn.textContent = 'Loading...'; }

      visitorInfo = { name, email, company: company || null, first_visit: new Date().toISOString() };
      storeVisitor(visitorInfo);

      document.getElementById('visitorModal')?.classList.remove('visible');

      await startApp();

      if (btn) { btn.disabled = false; btn.textContent = 'Access Data Room'; }
    }

    async function startVisitorTracking() {
      if (!supabase || !visitorInfo) return;
      if (sessionId) return;
      const _hasUUID = (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function');
      sessionId = _hasUUID ? window.crypto.randomUUID() : ('session_' + Date.now() + '_' + Math.random().toString(16).slice(2));
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
      } catch (e) {
        // Non-blocking
      }

      window.addEventListener('beforeunload', endVisitorSession);
    }

    async function endVisitorSession() {
      if (!supabase || !sessionId || !sessionStart) return;
      const duration = Math.round((Date.now() - new Date(sessionStart).getTime()) / 1000);
      try {
        await supabase.from('visitor_sessions').update({
          ended_at: new Date().toISOString(),
          duration_seconds: duration
        }).eq('session_id', sessionId);
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
      } catch (e) {}
    }

    // ==========================================
    // RENDERING
    // ==========================================
    function renderMenu() {
      const menuHtml = `
        <a href="#" class="menu-item active" data-view="dashboard">
          ${ICONS['dashboard']}
          Dashboard
        </a>
        ${SECTIONS.map(s => `
          <a href="#" class="menu-item" data-section="${s.id}">
            ${ICONS[s.icon]}
            ${s.name}
          </a>
        `).join('')}
      `;
      document.getElementById('menuItems').innerHTML = menuHtml;

      document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          closeMenu();
          if (item.dataset.view === 'dashboard') {
            goBack();
          } else if (item.dataset.section) {
            openSection(item.dataset.section);
          }
        });
      });
    }

    function renderDashboard() {
      if (settings.project_name) {
        document.getElementById('projectTitle').textContent = settings.project_name + ' — Project Dashboard';
      }
      if (settings.capacity) {
        document.getElementById('capacityValue').textContent = settings.capacity;
      }
      if (settings.target_ntp) {
        document.getElementById('ntpValue').textContent = settings.target_ntp;
        document.getElementById('targetNtp').textContent = 'Target NTP: ' + settings.target_ntp;
      }

      const progressKeys = ['progress_executive','progress_land','progress_interconnection','progress_permitting','progress_engineering','progress_financial','progress_epc'];
      let sum = 0;
      let cnt = 0;
      progressKeys.forEach(k => {
        const v = parseInt(settings[k] || '0', 10);
        if (!Number.isNaN(v)) { sum += v; cnt++; }
      });
      const avgProgress = cnt ? Math.round(sum / cnt) : 0;

      const circumference = 201;
      const offset = circumference - (avgProgress / 100) * circumference;
      document.getElementById('totalProgress').textContent = avgProgress + '%';
      document.getElementById('progressRingText').textContent = avgProgress + '%';
      document.getElementById('progressRing').style.strokeDashoffset = offset;

      // Breakdown
      const breakdownItems = [
        { label: 'Executive', key: 'progress_executive' },
        { label: 'Land Control', key: 'progress_land' },
        { label: 'Interconnection', key: 'progress_interconnection' },
        { label: 'Permitting', key: 'progress_permitting' },
        { label: 'Engineering', key: 'progress_engineering' }
      ];
      document.getElementById('progressBreakdown').innerHTML = breakdownItems.map(item => `
        <div class="progress-item">
          <span class="progress-item-label">${item.label}</span>
          <span class="progress-item-value">${settings[item.key] || '0'}%</span>
        </div>
      `).join('');

      renderCategories();
    }

    function renderCategories() {
      const grid = document.getElementById('categoryGrid');
      grid.innerHTML = SECTIONS.map(section => {
        const sectionDocs = documents.filter(d => d.section === section.id);
        const uploadedCount = sectionDocs.filter(d => (d.status || '').toLowerCase() === 'uploaded' && (d.url || '').trim()).length;
        const totalCount = sectionDocs.length;
        const percent = totalCount ? Math.round((uploadedCount / totalCount) * 100) : 0;

        return `
          <div class="category-card" data-section="${section.id}">
            <div class="category-icon">${ICONS[section.icon]}</div>
            <div class="category-info">
              <div class="category-name">${section.name}</div>
              <div class="category-desc">${section.desc}</div>
            </div>
            <div class="category-status">
              <span class="category-badge">${percent}%</span>
              <span class="category-count">${totalCount} docs</span>
            </div>
          </div>
        `;
      }).join('');

      document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => openSection(card.dataset.section));
      });
    }

    function openSection(sectionId) {
      // If a password is configured, block navigation until unlocked
      const pw = (settings.dr_password || '').trim();
      if (pw && !isUnlocked()) {
        showAccessModal('Enter the investor access password to continue.');
        return;
      }
      const section = SECTIONS.find(s => s.id === sectionId);
      if (!section) return;

      currentView = 'section';
      currentSection = section;

      document.getElementById('dashboardView').classList.remove('active');
      document.getElementById('categoryView').classList.add('active');
      document.getElementById('backBtn').classList.add('visible');

      document.getElementById('categoryIcon').innerHTML = ICONS[section.icon];
      document.getElementById('categoryTitle').textContent = section.name;
      document.getElementById('categoryDesc').textContent = section.desc;

      const sectionDocs = documents.filter(d => d.section === sectionId);
      const uploadedCount = sectionDocs.filter(d => (d.status || '').toLowerCase() === 'uploaded' && (d.url || '').trim()).length;
      const totalCount = sectionDocs.length;
      const percent = totalCount ? Math.round((uploadedCount / totalCount) * 100) : 0;
      document.getElementById('categoryBadge').textContent = percent + '% Complete';

      updateBreadcrumb(section.name);
      updateMenuActive(section.id);

      renderDocuments(section.id);
      renderNotes(section.id);
      trackSectionView(section.id);
    }

    function renderDocuments(sectionId) {
      const sectionDocs = documents.filter(d => d.section === sectionId);
      const list = document.getElementById('docList');
      if (!sectionDocs.length) {
        list.innerHTML = '<p style="color: var(--text-muted); font-size: 14px;">No documents available yet.</p>';
        return;
      }

      list.innerHTML = sectionDocs.map(doc => {
        const fileType = (doc.file_type || 'pdf').toUpperCase();
        const status = (doc.status || 'missing').toLowerCase();
        const statusText = status === 'uploaded' ? 'Uploaded' : status === 'pending' ? 'Pending' : 'Missing';
        const hasUrl = (doc.url || '').trim().length > 0;
        const isInteractive = status === 'uploaded' && hasUrl;

        return `
          <div class="doc-item ${isInteractive ? 'clickable' : 'disabled'}" data-doc-id="${doc.id}" ${isInteractive ? '' : 'aria-disabled="true"'}>
            <div class="doc-type-icon ${(doc.file_type || 'pdf').toLowerCase()}">${fileType}</div>
            <div class="doc-info">
              <div class="doc-name">${doc.name}</div>
              <div class="doc-meta">${fileType}${doc.date_added ? ' • ' + doc.date_added : ''}</div>
            </div>
            <div class="doc-status ${status}">
              <span class="doc-status-dot"></span>
              ${statusText}
            </div>
          </div>
        `;
      }).join('');

      document.querySelectorAll('.doc-item.clickable').forEach(item => {
        item.addEventListener('click', () => {
          const docId = item.dataset.docId;
          const doc = documents.find(d => String(d.id) === String(docId));
          if (doc) openDocument(doc);
        });
      });
    }

    function renderNotes(sectionId) {
      const sectionNotes = notes.filter(n => n.section === sectionId);
      const sec = document.getElementById('notesSection');
      if (!sectionNotes.length) {
        sec.style.display = 'none';
        return;
      }

      document.getElementById('notesList').innerHTML = sectionNotes.map(note => `
        <div class="note-item ${note.is_highlight ? 'highlight' : ''}">
          <div class="note-source">${note.author || 'Note'}<span class="note-date">${note.date || ''}</span></div>
          <div class="note-text">${note.content || ''}</div>
        </div>
      `).join('');
      sec.style.display = 'block';
    }

    function openDocument(doc) {
      // If a password is configured, block opening until unlocked
      const pw = (settings.dr_password || '').trim();
      if (pw && !isUnlocked()) {
        showAccessModal('Enter the investor access password to continue.');
        return;
      }
      trackDocumentClick(doc);
      const url = (doc.url || '').trim();
      const status = (doc.status || '').toLowerCase();
      if (status === 'uploaded' && url) {
        window.open(url, '_blank');
      }
    }

    // ==========================================
    // NAV + UI
    // ==========================================
    function updateBreadcrumb(current) {
      const bc = document.getElementById('breadcrumbCurrent');
      if (bc) bc.textContent = current || 'Dashboard';
    }

    function updateMenuActive(id) {
      document.querySelectorAll('.menu-item').forEach(item => {
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
      document.getElementById('categoryView').classList.remove('active');
      document.getElementById('dashboardView').classList.add('active');
      document.getElementById('backBtn').classList.remove('visible');
      updateMenuActive('dashboard');
    }

    function openMenu() {
      document.getElementById('menuOverlay').classList.add('open');
      document.getElementById('sideMenu').classList.add('open');
    }

    function closeMenu() {
      document.getElementById('menuOverlay').classList.remove('open');
      document.getElementById('sideMenu').classList.remove('open');
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
    // EVENT LISTENERS
    // ==========================================
    function setupEventListeners() {
      const menuBtn = document.getElementById('menuBtn');
      if (menuBtn && menuBtn.dataset.bound !== '1') {
        menuBtn.dataset.bound = '1';
        menuBtn.addEventListener('click', openMenu);
      }

      const menuOverlay = document.getElementById('menuOverlay');
      if (menuOverlay && menuOverlay.dataset.bound !== '1') {
        menuOverlay.dataset.bound = '1';
        menuOverlay.addEventListener('click', closeMenu);
      }

      const backBtn = document.getElementById('backBtn');
      if (backBtn && backBtn.dataset.bound !== '1') {
        backBtn.dataset.bound = '1';
        backBtn.addEventListener('click', goBack);
      }

      const breadcrumbRoot = document.getElementById('breadcrumbRoot');
      if (breadcrumbRoot && breadcrumbRoot.dataset.bound !== '1') {
        breadcrumbRoot.dataset.bound = '1';
        breadcrumbRoot.addEventListener('click', (e) => { e.preventDefault(); goBack(); });
      }

      const statusRefresh = document.getElementById('statusRefresh');
      if (statusRefresh && statusRefresh.dataset.bound !== '1') {
        statusRefresh.dataset.bound = '1';
        statusRefresh.addEventListener('click', () => window.location.reload());
      }

      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle && themeToggle.dataset.bound !== '1') {
        themeToggle.dataset.bound = '1';
        themeToggle.addEventListener('click', toggleTheme);
      }
    }

    // ==========================================
    // BOOTSTRAP
    // ==========================================
    async function startApp() {
      await loadData();

      // Build the UI first so password/maintenance gating doesn't leave the page uninitialized
      renderMenu();
      renderDashboard();
      setupEventListeners();

      const allowed = await enforceAccessRules();
      if (allowed) {
        await startVisitorTracking();
        setupRealtimeSync();
      }
    }

    async function init() {
      hideJsHealth();
      bindLogoErrorHandler();
      initTheme();
      initSupabase();
      setupAccessModalHandlers();

      visitorInfo = getStoredVisitor();
      if (visitorInfo) {
        await startApp();
      } else {
        showVisitorModal();
      }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
