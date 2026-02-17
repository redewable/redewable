/**
 * ReDewable Energy — Investor Page Gate & Tracker
 * ================================================
 * Include this script on any page that requires investor authentication.
 * Uses the same Supabase backend as admin.html and dataroom.
 *
 * Supabase tables required:
 *   - investor_visitors  (id, name, email, company, access_code, is_active, created_at)
 *   - investor_page_views (id, visitor_email, visitor_name, visitor_company, page_url, page_title, entered_at, exited_at, duration_seconds, scroll_depth_pct, sections_viewed, user_agent)
 *   - dataroom_settings   (reuses existing — keys: investor_access_mode, investor_shared_password)
 *
 * Access modes (set in admin):
 *   - "code"     → each visitor has a unique access code (default)
 *   - "password" → one shared password for all visitors
 *   - "open"     → collect identity only, no password
 */
(() => {
  'use strict';

  // =========================================
  // CONFIG
  // =========================================
  const SESSION_KEY   = 'redew_investor_session';
  const CONFIG_KEY    = 'redew_dataroom_config';   // same as data room
  const SESSION_TTL   = 7 * 24 * 60 * 60 * 1000;  // 7 days

  // Pages that should NOT be gated (public pages)
  const PUBLIC_PATHS = ['/', '/index.html', '/privacy.html', '/privacy', '/old-index.html'];

  let supabase   = null;
  let visitor     = null;
  let pageStart   = Date.now();
  let maxScroll   = 0;
  let sectionsViewed = new Set();

  // =========================================
  // DOM HELPERS
  // =========================================
  function esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function getParam(name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch(e) { return null; }
  }

  // =========================================
  // SUPABASE INIT
  // =========================================
  function getSupabaseConfig() {
    // Check URL params first (admin-shared links)
    const sbUrl = (getParam('sbUrl') || '').trim();
    const sbKey = (getParam('sbKey') || '').trim();
    if (sbUrl && sbKey) {
      try { localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: sbUrl, key: sbKey })); } catch(e) {}
    }

    let stored = null;
    try { stored = JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null'); } catch(e) {}
    return {
      url: sbUrl || (stored && stored.url) || '',
      key: sbKey || (stored && stored.key) || ''
    };
  }

  function initSupabase() {
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) return false;
    const cfg = getSupabaseConfig();
    if (!cfg.url || !cfg.key) return false;
    supabase = window.supabase.createClient(cfg.url, cfg.key);
    return true;
  }

  // =========================================
  // SESSION MANAGEMENT
  // =========================================
  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (Date.now() - s.ts > SESSION_TTL) { localStorage.removeItem(SESSION_KEY); return null; }
      return s;
    } catch(e) { return null; }
  }

  function setSession(data) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...data, ts: Date.now() }));
    } catch(e) {}
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch(e) {}
  }

  // =========================================
  // SETTINGS (from Supabase dataroom_settings)
  // =========================================
  async function getSetting(key, fallback) {
    if (!supabase) return fallback;
    try {
      const { data } = await supabase.from('dataroom_settings').select('value').eq('key', key).single();
      return (data && data.value) || fallback;
    } catch(e) { return fallback; }
  }

  // =========================================
  // TRACKING
  // =========================================
  function trackScroll() {
    const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    const winH = window.innerHeight;
    const scrolled = window.scrollY + winH;
    const pct = Math.min(100, Math.round((scrolled / docH) * 100));
    if (pct > maxScroll) maxScroll = pct;
  }

  function trackSections() {
    document.querySelectorAll('section[id]').forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        sectionsViewed.add(sec.id);
      }
    });
  }

  async function logPageView() {
    if (!supabase || !visitor) return;
    try {
      await supabase.from('investor_page_views').insert([{
        visitor_email: visitor.email,
        visitor_name: visitor.name,
        visitor_company: visitor.company,
        page_url: window.location.pathname,
        page_title: document.title,
        entered_at: new Date(pageStart).toISOString(),
        user_agent: navigator.userAgent
      }]);
    } catch(e) { console.error('Gate: page view log error', e); }
  }

  async function logPageExit() {
    if (!supabase || !visitor) return;
    const duration = Math.round((Date.now() - pageStart) / 1000);
    try {
      // Update the most recent page view for this visitor+page
      const { data } = await supabase
        .from('investor_page_views')
        .select('id')
        .eq('visitor_email', visitor.email)
        .eq('page_url', window.location.pathname)
        .order('entered_at', { ascending: false })
        .limit(1);

      if (data && data[0]) {
        await supabase.from('investor_page_views').update({
          exited_at: new Date().toISOString(),
          duration_seconds: duration,
          scroll_depth_pct: maxScroll,
          sections_viewed: Array.from(sectionsViewed).join(',')
        }).eq('id', data[0].id);
      }
    } catch(e) { console.error('Gate: exit log error', e); }
  }

  // =========================================
  // AUTH — VALIDATE CREDENTIALS
  // =========================================
  async function validateCode(email, code) {
    if (!supabase) return { ok: false, msg: 'System not configured.' };
    try {
      const { data, error } = await supabase
        .from('investor_visitors')
        .select('name, email, company, is_active')
        .eq('email', email.toLowerCase().trim())
        .eq('access_code', code.trim())
        .single();

      if (error || !data) return { ok: false, msg: 'Invalid email or access code.' };
      if (!data.is_active) return { ok: false, msg: 'Access has been revoked. Contact ReDewable.' };
      return { ok: true, visitor: data };
    } catch(e) {
      return { ok: false, msg: 'Connection error. Please try again.' };
    }
  }

  async function validatePassword(email, name, company, password) {
    const stored = await getSetting('investor_shared_password', '');
    if (!stored) return { ok: false, msg: 'Access not configured. Contact ReDewable.' };
    if (password.trim() !== stored.trim()) return { ok: false, msg: 'Incorrect password.' };
    return { ok: true, visitor: { email: email.trim(), name: name.trim(), company: company.trim() } };
  }

  async function validateOpen(email, name, company) {
    return { ok: true, visitor: { email: email.trim(), name: name.trim(), company: company.trim() } };
  }

  // =========================================
  // GATE UI
  // =========================================
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ig-overlay{position:fixed;inset:0;z-index:9999;background:rgba(10,15,13,0.92);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .4s}
      .ig-overlay.visible{opacity:1}
      .ig-modal{background:#141c19;border:1px solid #243029;border-radius:16px;padding:48px 40px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
      .ig-logo{display:flex;align-items:center;gap:10px;margin-bottom:32px}
      .ig-logo img{height:28px;width:auto}
      .ig-logo span{font-family:'Play',sans-serif;font-weight:700;font-size:15px;color:#f0f4f2;letter-spacing:.5px}
      .ig-title{font-family:'Play',sans-serif;font-size:22px;font-weight:700;color:#f0f4f2;margin-bottom:6px}
      .ig-desc{font-size:13px;color:#9ca8a3;line-height:1.65;margin-bottom:28px}
      .ig-field{margin-bottom:14px}
      .ig-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#5a6b64;margin-bottom:5px;display:block}
      .ig-input{width:100%;padding:12px 14px;background:#0a0f0d;border:1px solid #243029;border-radius:8px;color:#f0f4f2;font-size:14px;font-family:'Play',sans-serif;outline:none;transition:border-color .2s}
      .ig-input:focus{border-color:#2dd4a8}
      .ig-input::placeholder{color:#3a4a44}
      .ig-btn{width:100%;padding:14px;background:linear-gradient(135deg,#1a8a6e,#22c55e);border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;font-family:'Play',sans-serif;cursor:pointer;margin-top:8px;transition:opacity .2s;letter-spacing:.5px}
      .ig-btn:hover{opacity:.9}
      .ig-btn:disabled{opacity:.5;cursor:not-allowed}
      .ig-error{display:none;font-size:12px;color:#ef4444;margin-top:8px;padding:8px 12px;background:rgba(239,68,68,0.08);border-radius:6px;border:1px solid rgba(239,68,68,0.2)}
      .ig-error.visible{display:block}
      .ig-footer{margin-top:24px;text-align:center;font-size:11px;color:#3a4a44}
      .ig-footer a{color:#2dd4a8;text-decoration:none}
      .ig-content-hidden{filter:blur(20px);pointer-events:none;user-select:none;overflow:hidden;max-height:100vh}
    `;
    document.head.appendChild(style);
  }

  function buildModal(mode) {
    const div = document.createElement('div');
    div.className = 'ig-overlay';
    div.id = 'investorGate';

    const showName    = mode !== 'code';
    const showCompany = mode !== 'code';
    const showEmail   = true;
    const showCode    = mode === 'code';
    const showPw      = mode === 'password';

    div.innerHTML = `
      <div class="ig-modal">
        <div class="ig-logo">
          <img src="/assets/logo-mark.png" alt="ReDewable" onerror="this.style.display='none'">
          <span>ReDewable Energy</span>
        </div>
        <div class="ig-title">Investor Access</div>
        <div class="ig-desc">${mode === 'code'
          ? 'Enter the email and access code provided by our team.'
          : mode === 'password'
            ? 'Enter your details and the investor password to continue.'
            : 'Enter your details to access project materials.'}</div>
        ${showName ? `<div class="ig-field"><label class="ig-label">Full Name</label><input class="ig-input" id="igName" type="text" placeholder="Jane Smith" autocomplete="name"></div>` : ''}
        <div class="ig-field"><label class="ig-label">Email</label><input class="ig-input" id="igEmail" type="email" placeholder="jane@company.com" autocomplete="email"></div>
        ${showCompany ? `<div class="ig-field"><label class="ig-label">Company</label><input class="ig-input" id="igCompany" type="text" placeholder="Company name" autocomplete="organization"></div>` : ''}
        ${showCode ? `<div class="ig-field"><label class="ig-label">Access Code</label><input class="ig-input" id="igCode" type="text" placeholder="Your unique access code" autocomplete="off"></div>` : ''}
        ${showPw ? `<div class="ig-field"><label class="ig-label">Password</label><input class="ig-input" id="igPassword" type="password" placeholder="Investor password" autocomplete="current-password"></div>` : ''}
        <div class="ig-error" id="igError"></div>
        <button class="ig-btn" id="igSubmit">Access Project →</button>
        <div class="ig-footer">Questions? <a href="mailto:invest@redewable.com">invest@redewable.com</a></div>
      </div>
    `;
    return div;
  }

  // =========================================
  // MAIN FLOW
  // =========================================
  async function boot() {
    // Skip gating on public pages
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (PUBLIC_PATHS.includes(path)) return;

    // Check for Supabase SDK
    if (typeof window.supabase === 'undefined') {
      console.warn('Gate: Supabase SDK not loaded. Gate disabled.');
      return;
    }

    if (!initSupabase()) {
      console.warn('Gate: No Supabase config. Gate disabled.');
      return;
    }

    // Check existing session
    const session = getSession();
    if (session && session.email) {
      visitor = { email: session.email, name: session.name, company: session.company };
      startTracking();
      return; // already authenticated
    }

    // Determine access mode
    const mode = await getSetting('investor_access_mode', 'code');

    // Inject gate UI
    injectStyles();

    // Wrap existing body content so blur doesn't affect the overlay
    const wrapper = document.createElement('div');
    wrapper.id = 'ig-content-wrapper';
    while (document.body.firstChild) wrapper.appendChild(document.body.firstChild);
    document.body.appendChild(wrapper);
    wrapper.classList.add('ig-content-hidden');

    const overlay = buildModal(mode);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));

    // Focus first input
    const firstInput = overlay.querySelector('.ig-input');
    if (firstInput) setTimeout(() => firstInput.focus(), 300);

    // Handle submit
    const btn = overlay.querySelector('#igSubmit');
    const errEl = overlay.querySelector('#igError');

    async function handleSubmit() {
      errEl.classList.remove('visible');
      btn.disabled = true;
      btn.textContent = 'Verifying…';

      const email = (overlay.querySelector('#igEmail') || {}).value || '';
      const name = (overlay.querySelector('#igName') || {}).value || '';
      const company = (overlay.querySelector('#igCompany') || {}).value || '';
      const code = (overlay.querySelector('#igCode') || {}).value || '';
      const pw = (overlay.querySelector('#igPassword') || {}).value || '';

      if (!email) {
        errEl.textContent = 'Please enter your email.';
        errEl.classList.add('visible');
        btn.disabled = false;
        btn.textContent = 'Access Project →';
        return;
      }

      let result;
      if (mode === 'code') {
        result = await validateCode(email, code);
      } else if (mode === 'password') {
        if (!name) {
          errEl.textContent = 'Please enter your name.';
          errEl.classList.add('visible');
          btn.disabled = false;
          btn.textContent = 'Access Project →';
          return;
        }
        result = await validatePassword(email, name, company, pw);
      } else {
        result = await validateOpen(email, name, company);
      }

      if (!result.ok) {
        errEl.textContent = result.msg;
        errEl.classList.add('visible');
        btn.disabled = false;
        btn.textContent = 'Access Project →';
        return;
      }

      // Success
      visitor = result.visitor;
      setSession({ email: visitor.email, name: visitor.name, company: visitor.company });

      // Reveal content
      const wrap = document.getElementById('ig-content-wrapper');
      if (wrap) wrap.classList.remove('ig-content-hidden');
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 400);

      startTracking();
    }

    btn.addEventListener('click', handleSubmit);
    overlay.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });
  }

  function startTracking() {
    // Log initial page view
    logPageView();

    // Track scroll depth
    window.addEventListener('scroll', () => { trackScroll(); trackSections(); }, { passive: true });
    trackScroll();
    trackSections();

    // Log on exit
    window.addEventListener('beforeunload', () => { logPageExit(); });

    // Also try to log periodically (backup for mobile)
    setInterval(() => {
      if (visitor && supabase) logPageExit();
    }, 30000);
  }

  // =========================================
  // INIT — wait for DOM + Supabase SDK
  // =========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 100));
  } else {
    setTimeout(boot, 100);
  }
})();
