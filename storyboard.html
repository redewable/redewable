import React, { useState, useEffect, useRef } from 'react';

// SVG Icon Components
const Icons = {
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Battery: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="10" x2="23" y2="14"/><line x1="5" y1="10" x2="5" y2="14"/><line x1="9" y1="10" x2="9" y2="14"/><line x1="13" y1="10" x2="13" y2="14"/>
    </svg>
  ),
  Zap: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Shield: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Target: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Clock: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Map: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  Grid: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ChevronUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  Building: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
    </svg>
  ),
  Leaf: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
};

// Animated counter component
const AnimatedCounter = ({ end, prefix = '', suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Progress bar component
const ProgressBar = ({ progress, label, color = 'var(--accent)' }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{progress}%</span>
    </div>
    <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ width: `${progress}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 1s ease-out' }} />
    </div>
  </div>
);

// Expandable FAQ/Info component
const Expandable = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1.25rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontFamily: 'inherit',
          fontSize: '1.125rem',
          fontWeight: 500,
          textAlign: 'left',
        }}
      >
        {title}
        <span style={{ transition: 'transform 0.3s ease' }}>
          {isOpen ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
        </span>
      </button>
      <div style={{
        maxHeight: isOpen ? '500px' : '0',
        opacity: isOpen ? 1 : 0,
        transition: 'max-height 0.4s ease, opacity 0.3s ease',
        overflow: 'hidden',
      }}>
        <div style={{ paddingBottom: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function InvestorStoryboard() {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'opportunity', label: 'The Opportunity' },
    { id: 'validation', label: 'Validation' },
    { id: 'economics', label: 'Economics' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'faq', label: 'FAQ' },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
    setActiveSection(id);
  };

  const themeVars = isDark ? {
    '--bg-primary': '#0a0f0d',
    '--bg-secondary': '#111916',
    '--bg-tertiary': '#1a2420',
    '--bg-card': '#141c18',
    '--text-primary': '#f0f4f2',
    '--text-secondary': '#8fa89c',
    '--text-muted': '#5a7568',
    '--accent': '#22c55e',
    '--accent-glow': 'rgba(34, 197, 94, 0.15)',
    '--accent-secondary': '#16a34a',
    '--border': 'rgba(143, 168, 156, 0.15)',
    '--gradient-start': '#0a0f0d',
    '--gradient-end': '#111916',
    '--highlight': '#22c55e',
  } : {
    '--bg-primary': '#fafbfa',
    '--bg-secondary': '#f0f4f2',
    '--bg-tertiary': '#e4ebe7',
    '--bg-card': '#ffffff',
    '--text-primary': '#0a1f13',
    '--text-secondary': '#4a6455',
    '--text-muted': '#7a9486',
    '--accent': '#16a34a',
    '--accent-glow': 'rgba(22, 163, 74, 0.1)',
    '--accent-secondary': '#15803d',
    '--border': 'rgba(10, 31, 19, 0.1)',
    '--gradient-start': '#fafbfa',
    '--gradient-end': '#f0f4f2',
    '--highlight': '#15803d',
  };

  return (
    <div style={{
      ...themeVars,
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: "'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        html { scroll-behavior: smooth; }
        
        ::selection {
          background: var(--accent);
          color: white;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--accent) 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1rem 2rem',
        background: isDark ? 'rgba(10, 15, 13, 0.9)' : 'rgba(250, 251, 250, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--accent)' }}><Icons.Leaf /></div>
            <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>ReDewable Energy</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === s.id ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  transition: 'color 0.2s ease',
                }}
              >
                {s.label}
              </button>
            ))}
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'background 0.2s ease',
              }}
            >
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="mobile-only" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
              }}
            >
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                marginLeft: '0.5rem',
              }}
            >
              {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-only" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: isDark ? 'rgba(10, 15, 13, 0.98)' : 'rgba(250, 251, 250, 0.98)',
            backdropFilter: 'blur(20px)',
            padding: '1rem 2rem 2rem',
            borderBottom: '1px solid var(--border)',
          }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  color: activeSection === s.id ? 'var(--accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="overview" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 2rem 4rem',
        background: `radial-gradient(ellipse at 50% 0%, var(--accent-glow) 0%, transparent 50%)`,
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1000px', textAlign: 'center' }}>
          <div className="fade-in" style={{ marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent)',
              borderRadius: '100px',
              color: 'var(--accent)',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}>
              Private Investment Brief
            </span>
          </div>
          
          <h1 className="fade-in stagger-1" style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            ReDew Anson<br />
            <span className="gradient-text">Battery Storage Project</span>
          </h1>
          
          <p className="fade-in stagger-2" style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: 1.7,
          }}>
            A 300 MW utility-scale battery project in Texas positioned for acquisition at Notice to Proceed. 
            We develop it. You acquire a ready-to-build asset.
          </p>

          {/* Key Numbers */}
          <div className="fade-in stagger-3" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            {[
              { value: '$25-35M', label: 'Target NTP Sale', sublabel: '(300 MW)' },
              { value: '300 MW', label: 'Project Capacity', sublabel: '→ 400 MW expandable' },
              { value: 'Q1 2027', label: 'Target COD', sublabel: 'Commercial Operation' },
              { value: '345 kV', label: 'Interconnection', sublabel: 'High-voltage POI' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.sublabel}</div>
              </div>
            ))}
          </div>

          <button className="fade-in stagger-4" onClick={() => scrollToSection('opportunity')} style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'inherit',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
            See How It Works <Icons.ArrowRight />
          </button>
        </div>
      </section>

      {/* What Is This Section */}
      <section id="opportunity" style={{
        padding: '6rem 2rem',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1rem',
            }}>
              The Opportunity in Plain Terms
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
              We're building what the Texas power grid desperately needs. Here's why it matters.
            </p>
          </div>

          {/* Explainer Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {[
              {
                icon: <Icons.Battery />,
                title: 'What We're Building',
                description: 'A massive battery facility that stores electricity when it's cheap and sells it when prices spike. Think of it like buying wholesale and selling retail—but for megawatts.',
              },
              {
                icon: <Icons.Zap />,
                title: 'Why Texas Needs It',
                description: 'Texas has its own power grid (ERCOT) with no connections to other states. When demand surges, prices can spike 100x in minutes. Storage arbitrages this volatility.',
              },
              {
                icon: <Icons.TrendingUp />,
                title: 'Why This Location',
                description: 'Phantom Hill 345 kV is a high-voltage substation with excellent grid strength. Our studies confirm the connection can handle 300+ MW—a major technical milestone.',
              },
              {
                icon: <Icons.Shield />,
                title: 'Why Partner With Us',
                description: 'We've done the hard early work: secured land, completed engineering studies, validated the grid connection. You're not buying an idea—you're buying a shovel-ready project.',
              },
            ].map((card, i) => (
              <div key={i} className="card-hover" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '2rem',
              }}>
                <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{card.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{card.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{card.description}</p>
              </div>
            ))}
          </div>

          {/* The Business Model */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'clamp(2rem, 4vw, 3rem)',
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center' }}>
              Our Business Model: Develop & Sell
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              position: 'relative',
            }}>
              {[
                { step: '01', title: 'We Develop', desc: 'Secure land, permits, engineering, grid studies' },
                { step: '02', title: 'Reach NTP', desc: 'Notice to Proceed = ready for construction' },
                { step: '03', title: 'Sell the Project', desc: 'Large energy company acquires at premium' },
                { step: '04', title: 'They Build & Operate', desc: 'Buyer takes construction & operating risk' },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--accent-glow)',
                    border: '2px solid var(--accent)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    margin: '0 auto 1rem',
                  }}>
                    {item.step}
                  </div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '3rem',
              padding: '1.5rem',
              background: 'var(--accent-glow)',
              borderRadius: '12px',
              border: '1px solid var(--accent)',
            }}>
              <p style={{ textAlign: 'center', color: 'var(--text-primary)', fontWeight: 500 }}>
                <strong>The Key Insight:</strong> Our $25-35M sale price is a fraction of the $400-600M total project cost. 
                Buyers pay a premium for de-risked, shovel-ready projects because the alternative—doing all this work themselves—takes years and often fails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Validation Section */}
      <section id="validation" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1rem',
            }}>
              Technical Validation
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
              Independent engineering confirms this isn't speculation—it's a technically viable project.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Grid Strength */}
            <div className="card-hover" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ color: 'var(--accent)' }}><Icons.Grid /></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Grid Strength: Excellent</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                The Short Circuit Ratio (SCR) at our connection point can support up to <strong style={{ color: 'var(--accent)' }}>4,200 MW</strong>—far exceeding our 300-400 MW target. This eliminates "weak grid" complexity that plagues many projects.
              </p>
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Our Need</span>
                <span style={{ fontWeight: 600 }}>300 MW</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Capacity</span>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>4,200 MW</span>
              </div>
            </div>

            {/* Study Validation */}
            <div className="card-hover" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ color: 'var(--accent)' }}><Icons.Target /></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Independent Study</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                Enerzinx, a specialized power systems engineering firm, performed injection analysis using ERCOT's official planning models. Results confirm feasibility.
              </p>
              <div style={{ space: '0.75rem' }}>
                {[
                  'Tested 300 MW discharge / 140 MW charge',
                  'Used official ERCOT 2027 planning case',
                  'Identified thermal constraints (normal for scale)',
                  'Defined upgrade pathway',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ color: 'var(--accent)' }}><Icons.Check /></div>
                    <span style={{ fontSize: '0.9375rem' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What This Means */}
          <div style={{
            marginTop: '2rem',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>What This Means for Investors</h4>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
              Many early-stage projects fail because the grid can't actually accept their power. Our independent study proves the connection works. 
              This validation is exactly what sophisticated buyers look for—it's why projects at our stage command premium prices.
            </p>
          </div>
        </div>
      </section>

      {/* Economics Section */}
      <section id="economics" style={{
        padding: '6rem 2rem',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1rem',
            }}>
              The Economics
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
              Understanding where our sale price fits in the total project value chain.
            </p>
          </div>

          {/* Cost Breakdown Visual */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Total Project Cost Structure (300 MW)</h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>Battery Equipment & Installation</span>
                <span style={{ fontWeight: 600 }}>$360M - $450M</span>
              </div>
              <div style={{ height: '24px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'var(--accent)', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>Transmission Network Upgrades</span>
                <span style={{ fontWeight: 600 }}>$50M - $150M</span>
              </div>
              <div style={{ height: '24px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: '#22d3ee', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'var(--accent-glow)',
              borderRadius: '12px',
              border: '2px solid var(--accent)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Development Sale (Our Exit)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>$25M - $35M</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>% of Total Project Cost</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>~5-7%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Buyers Pay */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'clamp(2rem, 4vw, 3rem)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Why Buyers Pay $75K-$125K Per MW at NTP</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Icons.Clock />
                  <h4 style={{ fontWeight: 600 }}>Time Value</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                  Development takes 2-4 years. Buyers skip this queue and can be operational years sooner.
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Icons.Target />
                  <h4 style={{ fontWeight: 600 }}>De-risked Asset</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                  Land, permits, engineering, and grid connection are secured. Buyer takes only construction and market risk.
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Icons.Map />
                  <h4 style={{ fontWeight: 600 }}>Scarce Locations</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                  Quality grid connection points are limited. Our 345 kV POI with strong SCR is increasingly rare.
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Icons.DollarSign />
                  <h4 style={{ fontWeight: 600 }}>Capital Efficiency</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                  Large infrastructure funds need deployment scale. Buying developed projects beats building internal teams.
                </p>
              </div>
            </div>
          </div>

          {/* Valuation Tiers */}
          <div style={{
            marginTop: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'clamp(2rem, 4vw, 3rem)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center' }}>Where ReDew Anson Fits</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { tier: 'Conservative', range: '$50K-$75K/MW', total: '~$22.5M', highlight: false },
                { tier: 'Market Base', range: '$75K-$125K/MW', total: '$25M-$37.5M', highlight: true },
                { tier: 'Premium', range: '$125K-$175K/MW', total: '$37.5M+', highlight: false },
              ].map((t, i) => (
                <div key={i} style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: t.highlight ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                  border: t.highlight ? '2px solid var(--accent)' : '1px solid var(--border)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t.tier}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{t.range}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: t.highlight ? 'var(--accent)' : 'var(--text-primary)' }}>{t.total}</div>
                </div>
              ))}
            </div>
            
            <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Our project lands in <strong>Market Base to Low-Premium</strong> due to validated 345 kV interconnection, strong SCR, and advanced feasibility studies.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1rem',
            }}>
              Path to NTP Sale
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
              What we've completed, what's in progress, and what remains.
            </p>
          </div>

          {/* Progress Overview */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '2rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Development Progress</h3>
            
            <ProgressBar progress={85} label="Site & Land Control" color="var(--accent)" />
            <ProgressBar progress={75} label="Interconnection Studies" color="#22d3ee" />
            <ProgressBar progress={60} label="Permitting & Environmental" color="#a78bfa" />
            <ProgressBar progress={50} label="Engineering & Design" color="#f472b6" />
            <ProgressBar progress={30} label="EPC & Procurement" color="#fbbf24" />
          </div>

          {/* Milestone Timeline */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'clamp(2rem, 4vw, 3rem)',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Key Milestones</h3>
            
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '8px',
                bottom: '8px',
                width: '2px',
                background: 'var(--border)',
              }} />
              
              {[
                { date: 'Completed', title: 'Injection Study Validated', desc: 'Enerzinx confirmed 300MW feasibility at Phantom Hill 345kV', done: true },
                { date: 'Completed', title: 'Land Control Secured', desc: 'Site agreements in place for Sparks, TX location', done: true },
                { date: 'In Progress', title: 'ERCOT Interconnection Application', desc: 'Formal application package being prepared', done: false },
                { date: 'Q2 2025', title: 'System Impact Study', desc: 'ERCOT-led study to define final upgrade scope', done: false },
                { date: 'Q3 2025', title: 'Facilities Study', desc: 'TSP defines specific transmission upgrades', done: false },
                { date: 'Q4 2025', title: 'EPC Selection', desc: 'Construction partner with capital access finalized', done: false },
                { date: 'Q1 2026', title: 'NTP Ready / Sale Target', desc: 'Project marketed to strategic acquirers', done: false },
                { date: 'Q1 2027', title: 'Commercial Operation', desc: 'Target COD for Phase 1 (150MW)', done: false },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-2rem',
                    top: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: m.done ? 'var(--accent)' : 'var(--bg-tertiary)',
                    border: m.done ? 'none' : '2px solid var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {m.done && <Icons.Check />}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: m.done ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {m.date}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{m.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{
        padding: '6rem 2rem',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1rem',
            }}>
              Common Questions
            </h2>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '1rem 2rem',
          }}>
            <Expandable title="What exactly is NTP and why does it matter?" defaultOpen={true}>
              <strong>Notice to Proceed (NTP)</strong> is the milestone where a project is ready for construction to begin. It means: land is secured, permits are approved, engineering is complete, grid connection is confirmed, and an EPC contractor is selected. At NTP, the project has been de-risked—buyers pay a premium because they're acquiring a shovel-ready asset, not a speculative idea.
            </Expandable>

            <Expandable title="Why would someone pay $25-35 million for development work?">
              Because the alternative is worse. A large infrastructure fund trying to build this from scratch would need to: hire a development team, wait 3-4 years, navigate a saturated interconnection queue, risk project failure, and tie up management bandwidth. By acquiring at NTP, they skip the queue, deploy capital immediately, and let specialists (us) handle the messy early work. The $25-35M is a fraction of the $400-600M total project—and it's cheaper than the opportunity cost of waiting.
            </Expandable>

            <Expandable title="Who buys these projects?">
              Typical acquirers include: energy infrastructure funds (Brookfield, BlackRock, Generate Capital), large IPPs (NextEra, Vistra, AES), utility-adjacent companies, and strategic buyers with grid positions (like ENGIE, which operates nearby). These buyers have capital to deploy at scale and prefer buying de-risked projects over internal development.
            </Expandable>

            <Expandable title="What are the main risks?">
              <strong>Transmission upgrade costs:</strong> Final scope comes from ERCOT studies. Our estimate is $50-150M, but could be higher. <strong>Queue dynamics:</strong> Other projects in the area affect upgrade allocation. <strong>Timeline:</strong> ERCOT study timing is partially outside our control. <strong>Market conditions:</strong> Battery storage revenues have declined 90% from 2023 peaks, affecting buyer valuations. We're mitigating through phased development (150MW first) and conservative pricing expectations.
            </Expandable>

            <Expandable title="What's special about this location?">
              Three things: (1) <strong>345 kV interconnection</strong>—high-voltage connections are more valuable and scarce; (2) <strong>Exceptional grid strength</strong>—SCR supports 4,200MW capacity vs. our 300MW need; (3) <strong>ERCOT market access</strong>—Texas's isolated grid creates price volatility that storage monetizes. The Phantom Hill substation is a quality connection point in a congested market.
            </Expandable>

            <Expandable title="How is this structured for investors?">
              ReDewable Energy Company, LLC is the development entity. Investment structure depends on timing and amount—could be direct equity in the project LLC, a note convertible at sale, or participation in a fund vehicle. All terms are negotiable and documented properly with counsel. We're seeking strategic capital partners who understand infrastructure development, not passive retail investors.
            </Expandable>

            <Expandable title="What happens if the project doesn't sell?">
              If market conditions prevent an NTP sale at acceptable terms, options include: (1) continue development through construction with a capital partner, (2) sell at an earlier stage (post-interconnection agreement), or (3) hold for market improvement. Land and permits retain value. The 345 kV interconnection position is inherently scarce—projects at quality substations eventually transact.
            </Expandable>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        background: `radial-gradient(ellipse at 50% 100%, var(--accent-glow) 0%, transparent 50%)`,
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            marginBottom: '1rem',
          }}>
            Ready to Learn More?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem' }}>
            This briefing covers the fundamentals. For detailed financials, legal structure, and next steps, let's schedule a conversation.
          </p>
          <div style={{
            padding: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--accent)' }}><Icons.Leaf /></div>
              <span style={{ fontWeight: 600 }}>ReDewable Energy Company, LLC</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Utility-scale battery storage development in ERCOT
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
      }}>
        <p>Confidential Investment Brief — Not for Distribution</p>
        <p style={{ marginTop: '0.5rem' }}>© 2026 ReDewable Energy Company, LLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
