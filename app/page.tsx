'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  MapPin, Phone, Clock, Instagram, Mail,
  Star, Utensils, Leaf, Flame, X, Menu, ChevronDown, UtensilsCrossed,
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
// Single source of truth for all colors, typography, and spacing.

const C = {
  crimson:   '#8B1A2B',
  crimsonL:  '#C4384A',
  crimsonXL: '#D94F5F',
  gold:      '#C9A84C',
  goldL:     '#EDD98A',
  goldDim:   '#C9A84C60',
  ink:       '#0D0D0D',
  ink2:      '#111111',
  ink3:      '#161616',
  card:      '#141414',
  cardHover: '#181818',
  paper:     '#F7F3EE',
  // Warm off-white for body text — much easier on eyes than pure white
  body:      '#D4CFC8',
  // Muted label text — bright enough to read on #0D0D0D backgrounds
  muted:     '#9A9080',
  mutedL:    '#B8AA9A',
  border:    'rgba(201,168,76,0.15)',
  borderHov: 'rgba(201,168,76,0.40)',
};

// Typography stacks
const F = {
  serif:    { fontFamily: "'Noto Serif KR', Georgia, serif" },
  display:  { fontFamily: "'Cormorant Garamond', Georgia, serif" },
  sans:     { fontFamily: "'Noto Sans KR', system-ui, sans-serif" },
};

// Contact — single place to update
const PHONE     = '05 31 61 33 75';
const PHONE_TEL = 'tel:+33531613375';
const EMAIL     = 'saranghouse31@gmail.com';
const ADDRESS   = '25 rue du Taur, 31000 Toulouse';
const INSTAGRAM = 'https://www.instagram.com/saranghouse31/';

// Opening hours
const HOURS = [
  { day: 'Mercredi',  time: '12h–15h · 18h30–21h' },
  { day: 'Jeudi',     time: '12h–15h · 18h30–21h' },
  { day: 'Vendredi',  time: '12h–15h · 18h30–21h' },
  { day: 'Samedi',    time: '12h–15h · 18h30–21h' },
  { day: 'Dimanche',  time: '12h–17h' },
  { day: 'Lundi',     time: 'Fermé', closed: true },
  { day: 'Mardi',     time: 'Fermé', closed: true },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV = [
  { label: 'Histoire', href: '#histoire' },
  { label: 'Menu',     href: '#menu' },
  { label: 'Galerie',  href: '#galerie' },
  { label: 'Contact',  href: '#contact' },
];

const MENU_CATS = [
  {
    id: 'coreen', label: 'Coréen', korean: '한국',
    icon: Flame, desc: 'Saveurs authentiques de Séoul',
    items: [
      {
        name: 'Bibimbap', korean: '비빔밥',
        desc: 'Riz, légumes sautés, œuf, sauce gochujang maison',
        price: '13,50€', tag: 'Signature', img: '/images/bibimbap.jpg',
        spicy: true, veg: true,
      },
      {
        name: 'Tteokbokki', korean: '떡볶이',
        desc: 'Galettes de riz en sauce pimentée douce, fishcake',
        price: '11,00€', tag: null, img: '/images/tteokbokki.jpg',
        spicy: true, veg: false,
      },
      {
        name: 'Bulgogi Bowl', korean: '불고기',
        desc: 'Bœuf mariné au sésame et soja, riz, kimchi maison',
        price: '14,50€', tag: 'Coup de cœur', img: '/images/bulgogi.jpg',
        spicy: false, veg: false,
      },
      {
        name: 'Mandu', korean: '만두',
        desc: 'Raviolis coréens vapeur ou frits, porc & ciboulette',
        price: '9,50€', tag: null, img: '/images/gyoza.jpg',
        spicy: false, veg: false,
      },
    ],
  },
  {
    id: 'japonais', label: 'Japonais', korean: '일본',
    icon: Leaf, desc: 'Délicatesse et précision japonaises',
    items: [
      {
        name: 'Ramen Tonkotsu', korean: '라멘',
        desc: 'Bouillon de porc mijoté 12h, chashu, œuf mollet, nori',
        price: '14,00€', tag: 'Signature', img: '/images/ramen.jpg',
        spicy: false, veg: false,
      },
      {
        name: 'Sushi Assortiment', korean: '스시',
        desc: '8 pièces : saumon, thon, crevette, avocat — riz vinaigré',
        price: '15,50€', tag: null, img: '/images/sushi.jpg',
        spicy: false, veg: false,
      },
      {
        name: 'Karaage', korean: '가라아게',
        desc: 'Poulet frit japonais, sauce ponzu, mayonnaise yuzu',
        price: '10,50€', tag: 'Populaire', img: '/images/karaage.jpg',
        spicy: false, veg: false,
      },
      {
        name: 'Gyoza', korean: '교자',
        desc: 'Raviolis grillés, porc & chou, sauce tsuyu maison',
        price: '8,50€', tag: null, img: '/images/gyoza.jpg',
        spicy: false, veg: false,
      },
    ],
  },
  {
    id: 'soupes', label: 'Soupes', korean: '국물',
    icon: Utensils, desc: 'Réconfort dans chaque bol',
    items: [
      {
        name: 'Doenjang Jjigae', korean: '된장찌개',
        desc: 'Soupe miso coréenne, tofu, légumes de saison, champignons',
        price: '10,00€', tag: null, img: '/images/soup.jpg',
        spicy: false, veg: true,
      },
      {
        name: 'Sundubu Jjigae', korean: '순두부찌개',
        desc: 'Soupe de tofu soyeux épicée, palourdes, œuf',
        price: '11,50€', tag: 'Coup de cœur', img: '/images/soup.jpg',
        spicy: true, veg: false,
      },
      {
        name: 'Miso Ramen', korean: '미소 라멘',
        desc: 'Bouillon miso, maïs, beurre, champignons shiitake, menma',
        price: '13,00€', tag: null, img: '/images/ramen.jpg',
        spicy: false, veg: true,
      },
      {
        name: 'Soupe Miso', korean: '미소시루',
        desc: 'Miso blanc, tofu, algues wakame, ciboule — accompagnement',
        price: '3,50€', tag: null, img: '/images/soup.jpg',
        spicy: false, veg: true,
      },
    ],
  },
];

const GALLERY = [
  { src: '/images/bibimbap.jpg',   alt: 'Bibimbap — riz coréen aux légumes sautés',    kr: '비빔밥',   featured: true },
  { src: '/images/ramen.jpg',      alt: 'Ramen tonkotsu — bouillon mijoté 12 heures',  kr: '라멘',     featured: false },
  { src: '/images/bulgogi.jpg',    alt: 'Bulgogi — bœuf mariné au sésame',             kr: '불고기',   featured: false },
  { src: '/images/sushi.jpg',      alt: 'Sushi assortiment — 8 pièces fraîches',       kr: '스시',     featured: false },
  { src: '/images/karaage.jpg',    alt: 'Karaage — poulet frit japonais',              kr: '가라아게', featured: false },
  { src: '/images/tteokbokki.jpg', alt: 'Tteokbokki — galettes de riz épicées',        kr: '떡볶이',   featured: false },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionLabel({ text, kr }: { text: string; kr?: string }) {
  return (
    <p style={{ ...F.sans, fontSize: 12, color: C.mutedL, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      {text}
      {kr && <span style={{ color: C.goldL, letterSpacing: '0.1em' }}>{kr}</span>}
    </p>
  );
}

function GoldRule() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}30, transparent)` }} />
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.goldDim }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}30, transparent)` }} />
    </div>
  );
}

// Tag chip with clear visual distinction per type
function Tag({ text }: { text: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    'Signature':    { bg: `${C.crimson}DD`, color: C.goldL,   border: `${C.gold}50` },
    'Coup de cœur': { bg: '#1E0A0E',        color: '#E87080', border: `${C.crimsonL}50` },
    'Populaire':    { bg: '#0D1A0A',        color: '#7DC45A', border: '#4A8A2A60' },
  };
  const s = styles[text] ?? { bg: '#ffffff14', color: C.body, border: '#ffffff20' };
  return (
    <span style={{
      ...F.sans, background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 500,
      padding: '3px 9px', borderRadius: 99,
      letterSpacing: '0.04em',
    }}>
      {text}
    </span>
  );
}

// Primary CTA button
function BtnPrimary({ href, children, onClick }: { href?: string; children: React.ReactNode; onClick?: () => void }) {
  const style: React.CSSProperties = {
    ...F.sans, display: 'inline-flex', alignItems: 'center', gap: 8,
    background: C.crimson, color: C.paper,
    padding: '13px 28px', borderRadius: 99,
    fontSize: 13, fontWeight: 500,
    textDecoration: 'none', letterSpacing: '0.07em',
    border: 'none', cursor: 'pointer',
    boxShadow: `0 6px 28px ${C.crimson}45`,
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
  };
  const enter = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.background = C.crimsonL;
    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 36px ${C.crimson}60`;
    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
  };
  const leave = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.background = C.crimson;
    (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 28px ${C.crimson}45`;
    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
  };
  if (href) return <a href={href} style={style} onMouseEnter={enter} onMouseLeave={leave}>{children}</a>;
  return <button style={style} onMouseEnter={enter} onMouseLeave={leave} onClick={onClick}>{children}</button>;
}

// Ghost/outline button
function BtnGhost({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{
      ...F.sans, display: 'inline-flex', alignItems: 'center', gap: 8,
      border: `1px solid ${C.gold}55`, color: C.gold,
      padding: '12px 28px', borderRadius: 99,
      fontSize: 13, fontWeight: 400,
      textDecoration: 'none', letterSpacing: '0.07em',
      transition: 'border-color 0.2s, color 0.2s, background 0.2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = C.gold;
        (e.currentTarget as HTMLElement).style.background = `${C.gold}12`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${C.gold}55`;
        (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}>
      {children}
    </a>
  );
}

// Info card used in contact section
function InfoCard({ icon: Icon, title, kr, children }: {
  icon: React.ElementType; title: string; kr: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex', gap: 16,
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '18px 20px',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: `${C.crimson}30`, border: `1px solid ${C.crimson}60`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color={C.goldL} aria-hidden="true" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
          <span style={{ ...F.sans, fontSize: 14, color: C.paper, fontWeight: 500 }}>{title}</span>
          <span style={{ ...F.sans, fontSize: 12, color: C.mutedL }}>{kr}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SarangHousePage() {
  const [activeCat, setActiveCat]   = useState('coreen');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const cat = MENU_CATS.find(c => c.id === activeCat)!;

  // Darken nav on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>

      <div style={{ background: C.ink, color: C.paper, minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ── NAV ───────────────────────────────────────────────────────────── */}
        <nav
          role="navigation"
          aria-label="Navigation principale"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            background: scrolled ? 'rgba(10,10,10,0.97)' : 'rgba(13,13,13,0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${scrolled ? C.gold + '25' : C.gold + '12'}`,
            transition: 'background 0.3s, border-color 0.3s',
          }}>
          <div className="section-container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Logo */}
            <a href="#" aria-label="Sarang House — retour en haut" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <span style={{ ...F.serif, fontSize: 18, color: C.paper, letterSpacing: '0.02em' }}>Sarang House</span>
              <span style={{ ...F.sans, fontSize: 12, color: C.goldL, letterSpacing: '0.15em' }}>사랑</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
              {NAV.map(l => (
                <a key={l.href} href={l.href}
                  className="nav-link"
                  style={{ ...F.sans, fontSize: 13, color: C.body, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {l.label}
                </a>
              ))}
              <a href={PHONE_TEL}
                style={{
                  ...F.sans, fontSize: 13, fontWeight: 500,
                  background: C.crimson, color: C.paper,
                  padding: '9px 22px', borderRadius: 99,
                  textDecoration: 'none', letterSpacing: '0.07em',
                  display: 'flex', alignItems: 'center', gap: 7,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.crimsonL)}
                onMouseLeave={e => (e.currentTarget.style.background = C.crimson)}>
                <Phone size={12} aria-hidden="true" /> Réserver
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(o => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              style={{ background: 'none', border: 'none', color: C.body, cursor: 'pointer', padding: 8, borderRadius: 8 }}>
              {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div
              id="mobile-menu"
              className="slide-down"
              style={{ background: C.ink2, borderTop: `1px solid ${C.border}`, padding: '20px 24px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {NAV.map(l => (
                  <a key={l.href} href={l.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      ...F.sans, fontSize: 15, color: C.body,
                      textDecoration: 'none', padding: '11px 0',
                      borderBottom: `1px solid ${C.border}`,
                      letterSpacing: '0.06em',
                    }}>
                    {l.label}
                  </a>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <a href="#menu" onClick={() => setMobileOpen(false)}
                  style={{
                    ...F.sans, flex: 1, textAlign: 'center',
                    fontSize: 13, fontWeight: 500,
                    border: `1px solid ${C.gold}50`, color: C.gold,
                    padding: '11px 16px', borderRadius: 99,
                    textDecoration: 'none',
                  }}>
                  Voir le menu
                </a>
                <a href={PHONE_TEL} onClick={() => setMobileOpen(false)}
                  style={{
                    ...F.sans, flex: 1, textAlign: 'center',
                    fontSize: 13, fontWeight: 500,
                    background: C.crimson, color: C.paper,
                    padding: '11px 16px', borderRadius: 99,
                    textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  <Phone size={13} aria-hidden="true" /> Réserver
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section
          id="home"
          aria-label="Accueil"
          style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

          {/* Background */}
          <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
            <Image
              src="/images/hero-real.jpg"
              alt=""
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              priority
              quality={90}
            />
            {/* Overlay: strong uniform base + heavier bottom for text legibility */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.52)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.55) 50%, rgba(13,13,13,1) 100%)' }} />
          </div>

          {/* Ghost watermark */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none' }} aria-hidden="true">
            <span style={{ ...F.serif, fontSize: 'clamp(100px, 22vw, 260px)', color: `${C.crimson}15`, fontWeight: 700, lineHeight: 1 }}>사랑</span>
          </div>

          {/* Content */}
          <main id="main-content" ref={mainRef} tabIndex={-1}
            className="fade-up"
            style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '80px 24px 120px', maxWidth: 740, width: '100%' }}>

            {/* Eyebrow */}
            <p style={{ ...F.sans, fontSize: 13, color: C.goldL, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 22, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
              사랑 · Cuisine Coréenne &amp; Japonaise · Toulouse
            </p>

            {/* Brand name — split for visual drama */}
            <h1 style={{ margin: 0, lineHeight: 1 }}>
              <span style={{ ...F.serif, display: 'block', fontSize: 'clamp(60px, 11vw, 112px)', fontWeight: 300, color: '#FFFFFF', letterSpacing: '-0.01em', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                Sarang
              </span>
              <span style={{ ...F.display, display: 'block', fontSize: 'clamp(26px, 4.5vw, 46px)', fontWeight: 300, fontStyle: 'italic', color: C.goldL, marginTop: 4, textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}>
                House
              </span>
            </h1>

            {/* Tagline */}
            <p style={{ ...F.serif, fontSize: 'clamp(17px, 2.4vw, 22px)', fontWeight: 300, fontStyle: 'italic', color: '#FFFFFF', lineHeight: 1.75, marginTop: 24, marginBottom: 36, textShadow: '0 1px 10px rgba(0,0,0,0.7)', letterSpacing: '0.02em' }}>
              Faite avec amour, au cœur de Toulouse.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <BtnPrimary href="#menu">
                <UtensilsCrossed size={14} aria-hidden="true" /> Découvrir le menu
              </BtnPrimary>
              <BtnGhost href={PHONE_TEL}>
                <Phone size={13} aria-hidden="true" /> Réserver une table
              </BtnGhost>
            </div>

            {/* Practical info strip */}
            <div style={{ marginTop: 48, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: MapPin, text: ADDRESS },
                { icon: Clock,  text: 'Mer–Sam 12h–15h & 18h30–21h · Dim 12h–17h' },
                { icon: Phone,  text: PHONE },
              ].map(({ icon: Icon, text }) => (
                <span key={text} style={{ ...F.sans, fontSize: 13, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 7, letterSpacing: '0.02em', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                  <Icon size={13} color={C.goldL} aria-hidden="true" style={{ flexShrink: 0 }} /> {text}
                </span>
              ))}
            </div>
          </main>

          {/* Scroll cue */}
          <div
            className="bounce-slow"
            aria-hidden="true"
            style={{ position: 'absolute', bottom: 28, left: '50%', color: `${C.gold}55` }}>
            <ChevronDown size={22} />
          </div>
        </section>

        {/* ── HISTOIRE ──────────────────────────────────────────────────────── */}
        <section id="histoire" aria-labelledby="histoire-heading" style={{ padding: '100px 24px', background: C.ink }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 72, alignItems: 'center' }}>

              {/* Image column */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/5' }}>
                  <Image src="/images/about.jpg" alt="La cuisine de Sarang House — faite avec amour" fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.45), transparent 60%)' }} aria-hidden="true" />
                </div>
                {/* Floating badge */}
                <div
                  aria-hidden="true"
                  className="lantern-glow"
                  style={{
                    position: 'absolute', bottom: -18, right: -18,
                    background: C.crimson, borderRadius: 16,
                    padding: '14px 18px',
                  }}>
                  <p style={{ ...F.serif, fontSize: 26, color: C.goldL, fontWeight: 300, lineHeight: 1 }}>사랑</p>
                  <p style={{ ...F.display, fontStyle: 'italic', color: `${C.paper}BB`, fontSize: 13, marginTop: 3 }}>L&apos;amour</p>
                </div>
                {/* Corner accent */}
                <div aria-hidden="true" style={{ position: 'absolute', top: -12, left: -12, width: 56, height: 56, borderTop: `2px solid ${C.gold}45`, borderLeft: `2px solid ${C.gold}45`, borderRadius: '10px 0 0 0', pointerEvents: 'none' }} />
              </div>

              {/* Text column */}
              <div>
                <SectionLabel text="Notre Histoire" kr="우리의 이야기" />
                <h2 id="histoire-heading" style={{ margin: 0 }}>
                  <span style={{ ...F.serif, display: 'block', fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 300, color: C.paper, lineHeight: 1.2 }}>
                    Née d&apos;une passion,
                  </span>
                  <span style={{ ...F.display, display: 'block', fontSize: 'clamp(24px, 4vw, 40px)', fontStyle: 'italic', color: C.gold, lineHeight: 1.3, marginTop: 4 }}>
                    nourrie d&apos;amour.
                  </span>
                </h2>

                <GoldRule />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <p style={{ ...F.sans, fontSize: 15, color: C.body, lineHeight: 1.85 }}>
                    <span style={{ ...F.serif, color: C.gold, fontSize: 20 }}>사랑</span> — en coréen, ce mot signifie <em>amour</em>. C&apos;est l&apos;ingrédient que nous mettons dans chaque plat.
                  </p>
                  <p style={{ ...F.sans, fontSize: 15, color: C.body, lineHeight: 1.85 }}>
                    Au cœur du Vieux Toulouse, notre petite maison vous invite à un voyage entre Séoul et Tokyo. Des recettes transmises, revisitées avec soin, servies dans la chaleur d&apos;une table intime.
                  </p>
                  <p style={{ ...F.sans, fontSize: 15, color: C.body, lineHeight: 1.85 }}>
                    Kimchi fermenté maison, bouillons mijotés des heures, riz vinaigré avec patience — ici, rien n&apos;est pressé.
                  </p>
                </div>

                <GoldRule />

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {[
                    { num: '25',   label: 'Rue du Taur', sub: 'Toulouse' },
                    { num: '100%', label: 'Fait maison',  sub: '손수 만든' },
                    { num: '2',    label: 'Cuisines',     sub: '코리아 · 재팬' },
                  ].map(s => (
                    <div key={s.num} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 12, background: `${C.gold}08`, border: `1px solid ${C.gold}15` }}>
                      <p style={{ ...F.serif, fontSize: 28, color: C.gold, fontWeight: 300, lineHeight: 1 }}>{s.num}</p>
                      <p style={{ ...F.sans, fontSize: 13, color: C.paper, marginTop: 6, fontWeight: 500 }}>{s.label}</p>
                      <p style={{ ...F.sans, fontSize: 12, color: C.mutedL, marginTop: 2 }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MENU ──────────────────────────────────────────────────────────── */}
        <section id="menu" aria-labelledby="menu-heading" style={{ padding: '100px 24px', background: '#0A0A0A' }}>
          <div className="section-container">

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <SectionLabel text="Notre Menu" kr="메뉴" />
              <h2 id="menu-heading" style={{ ...F.serif, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 300, color: C.paper, marginBottom: 12 }}>
                Saveurs de Corée &amp; du Japon
              </h2>
              <p style={{ ...F.sans, fontSize: 16, color: C.body, maxWidth: 520, margin: '0 auto' }}>
                Chaque plat est une lettre d&apos;amour à deux cultures culinaires.
              </p>
            </div>

            {/* Category tabs */}
            <div role="tablist" aria-label="Catégories du menu" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
              {MENU_CATS.map(c => {
                const Icon = c.icon;
                const active = activeCat === c.id;
                return (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${c.id}`}
                    id={`tab-${c.id}`}
                    onClick={() => setActiveCat(c.id)}
                    style={{
                      ...F.sans,
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '10px 22px', borderRadius: 99, fontSize: 13,
                      cursor: 'pointer', fontWeight: active ? 500 : 400,
                      border: active ? 'none' : `1px solid ${C.gold}40`,
                      background: active ? C.crimson : 'transparent',
                      color: active ? C.paper : C.body,
                      transition: 'all 0.2s',
                      boxShadow: active ? `0 4px 20px ${C.crimson}40` : 'none',
                    }}>
                    <Icon size={13} aria-hidden="true" />
                    <span>{c.label}</span>
                    <span style={{ fontSize: 12, color: active ? `${C.paper}99` : C.mutedL }}>{c.korean}</span>
                  </button>
                );
              })}
            </div>

            {/* Category description */}
            <p style={{ ...F.sans, color: C.mutedL, fontSize: 15, textAlign: 'center', marginBottom: 32 }}>
              {cat.desc}
            </p>

            {/* Items grid */}
            <div
              role="tabpanel"
              id={`panel-${cat.id}`}
              aria-labelledby={`tab-${cat.id}`}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 14 }}>
              {cat.items.map(item => (
                <article
                  key={item.name}
                  className="menu-card"
                  style={{
                    display: 'flex', gap: 0,
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 18, overflow: 'hidden',
                  }}>

                  {/* Image — fixed aspect ratio, no broken sizing on mobile */}
                  <div style={{ position: 'relative', width: 140, flexShrink: 0, aspectRatio: '1/1' }}>
                    <Image
                      src={item.img}
                      alt={`${item.name} — ${item.desc}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="140px"
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Name + price row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                        <div>
                          <p style={{ ...F.serif, fontSize: 16, color: C.paper, fontWeight: 500, lineHeight: 1.3 }}>{item.name}</p>
                          <p style={{ ...F.sans, fontSize: 12, color: C.mutedL, marginTop: 2, letterSpacing: '0.05em' }}>{item.korean}</p>
                        </div>
                        {/* Price — prominent, gold */}
                        <span style={{ ...F.serif, fontSize: 16, color: C.gold, fontWeight: 400, flexShrink: 0, marginTop: 1 }}>{item.price}</span>
                      </div>
                      {/* Description */}
                      <p style={{ ...F.sans, fontSize: 13, color: C.body, lineHeight: 1.6, marginBottom: 10 }}>{item.desc}</p>
                    </div>
                    {/* Chips */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      {item.tag && <Tag text={item.tag} />}
                      {item.spicy && (
                        <span style={{ ...F.sans, fontSize: 12, color: '#E87080', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Flame size={11} aria-hidden="true" /> Épicé
                        </span>
                      )}
                      {item.veg && (
                        <span style={{ ...F.sans, fontSize: 12, color: '#7DC45A', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Leaf size={11} aria-hidden="true" /> Végé
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Footer note */}
            <div style={{ marginTop: 44, textAlign: 'center' }}>
              <GoldRule />
              <p style={{ ...F.sans, color: C.mutedL, fontSize: 14 }}>
                Menu susceptible d&apos;évoluer selon les saisons. Allergènes disponibles sur demande.
              </p>
            </div>
          </div>
        </section>

        {/* ── GALERIE ───────────────────────────────────────────────────────── */}
        <section id="galerie" aria-labelledby="galerie-heading" style={{ padding: '100px 24px', background: C.ink }}>
          <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <SectionLabel text="Galerie" kr="갤러리" />
              <h2 id="galerie-heading" style={{ ...F.serif, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 300, color: C.paper, marginBottom: 12 }}>
                L&apos;art dans l&apos;assiette
              </h2>
              <p style={{ ...F.sans, fontSize: 16, color: C.body }}>
                Chaque plat est une œuvre — éphémère et délicieuse.
              </p>
            </div>

            {/* Responsive grid: 2-col on mobile, masonry-like on desktop */}
            <div className="gallery-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(2, 220px)',
              gap: 10,
            }}>
              {GALLERY.map((img, i) => (
                <div
                  key={img.src}
                  className="gallery-item"
                  style={{
                    position: 'relative', borderRadius: 14, overflow: 'hidden',
                    gridColumn: i === 0 ? 'span 2' : 'span 1',
                    gridRow: i === 0 ? 'span 2' : 'span 1',
                    cursor: 'pointer',
                  }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes={i === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
                  />
                  {/* Overlay — CSS-driven so it works on touch too */}
                  <div className="gallery-overlay" style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.1) 55%)',
                  }}>
                    <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
                      <p style={{ ...F.sans, color: C.gold, fontSize: 13, fontWeight: 500 }}>{img.kr}</p>
                      <p style={{ ...F.display, fontStyle: 'italic', color: `${C.paper}CC`, fontSize: 12 }}>{img.alt.split(' — ')[0]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── QUOTE STRIP ───────────────────────────────────────────────────── */}
        <section aria-label="Citation" style={{ position: 'relative', padding: '88px 24px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
            <Image src="/images/interior.jpg" alt="" fill style={{ objectFit: 'cover', objectPosition: 'center 40%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.84)' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: 660, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ ...F.sans, fontSize: 12, color: C.mutedL, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 28 }}>
              우리의 공간 · Notre espace
            </p>
            <blockquote style={{ margin: 0 }}>
              <p style={{ ...F.display, fontStyle: 'italic', fontSize: 'clamp(20px, 3.5vw, 32px)', color: C.paper, fontWeight: 300, lineHeight: 1.65 }}>
                &ldquo;Un repas partagé est un acte d&apos;amour.<br />
                Ici, chaque table est une scène.&rdquo;
              </p>
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 24 }}>
              <div style={{ width: 24, height: 1, background: `${C.gold}45` }} />
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} color={`${C.gold}AA`} fill={`${C.gold}AA`} aria-hidden="true" />
              ))}
              <div style={{ width: 24, height: 1, background: `${C.gold}45` }} />
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────────────── */}
        <section id="contact" aria-labelledby="contact-heading" style={{ padding: '100px 24px', background: '#0A0A0A' }}>
          <div className="section-container">
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <SectionLabel text="Nous trouver" kr="찾아오세요" />
              <h2 id="contact-heading" style={{ ...F.serif, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 300, color: C.paper, marginBottom: 12 }}>
                Venez partager un repas
              </h2>
              <p style={{ ...F.sans, fontSize: 16, color: C.body }}>
                Une petite maison, un grand cœur.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'stretch' }}>

              {/* Left column — info cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoCard icon={MapPin} title="Adresse" kr="주소">
                  <p style={{ ...F.sans, fontSize: 14, color: C.paper, lineHeight: 1.6 }}>25 rue du Taur</p>
                  <p style={{ ...F.sans, fontSize: 14, color: C.body, lineHeight: 1.6 }}>31000 Toulouse</p>
                </InfoCard>

                <InfoCard icon={Phone} title="Téléphone" kr="전화">
                  <a href={PHONE_TEL} style={{ ...F.sans, fontSize: 16, color: C.paper, textDecoration: 'none', fontWeight: 500, letterSpacing: '0.05em' }}>
                    {PHONE}
                  </a>
                </InfoCard>

                <InfoCard icon={Mail} title="Email" kr="이메일">
                  <a href={`mailto:${EMAIL}`} style={{ ...F.sans, fontSize: 14, color: C.gold, textDecoration: 'none', letterSpacing: '0.02em' }}>
                    {EMAIL}
                  </a>
                  <p style={{ ...F.sans, fontSize: 13, color: C.mutedL, marginTop: 4 }}>Pour groupes, événements ou questions</p>
                </InfoCard>

                <InfoCard icon={Instagram} title="Instagram" kr="소셜">
                  <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer"
                    style={{ ...F.sans, fontSize: 14, color: C.gold, textDecoration: 'none', letterSpacing: '0.03em' }}>
                    @saranghouse31
                  </a>
                  <p style={{ ...F.sans, fontSize: 13, color: C.mutedL, marginTop: 4 }}>Suivez-nous pour nos plats du jour</p>
                </InfoCard>
              </div>

              {/* Right column — horaires + map + reservation CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoCard icon={Clock} title="Horaires" kr="영업시간">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
                    {HOURS.map(h => (
                      <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <span style={{ ...F.sans, fontSize: 13, color: h.closed ? C.mutedL : C.paper, fontWeight: h.closed ? 400 : 500, minWidth: 90 }}>{h.day}</span>
                        <span style={{ ...F.sans, fontSize: 13, color: h.closed ? C.mutedL : C.body, fontStyle: h.closed ? 'italic' : 'normal' }}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </InfoCard>

                {/* Map — flex:1 so it grows to fill remaining height and equalises columns */}
                <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.border}`, minHeight: 200 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.7!2d1.4437!3d43.6047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12aebb6f5b0c0001%3A0x1!2s25+Rue+du+Taur%2C+31000+Toulouse!5e0!3m2!1sfr!2sfr!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: 'block', filter: 'invert(88%) hue-rotate(180deg) saturate(0.7)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sarang House — 25 rue du Taur, Toulouse"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer role="contentinfo" style={{ background: '#080808', borderTop: `1px solid ${C.gold}12`, padding: '48px 24px 32px' }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 36 }}>

              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ ...F.serif, fontSize: 17, color: C.paper }}>Sarang House</span>
                  <span style={{ ...F.sans, fontSize: 12, color: C.goldL, letterSpacing: '0.12em' }}>사랑</span>
                </div>
                <p style={{ ...F.sans, color: C.mutedL, fontSize: 14, lineHeight: 1.7 }}>
                  Cuisine coréenne &amp; japonaise<br />au cœur de Toulouse.
                </p>
              </div>

              {/* Quick links */}
              <nav aria-label="Liens rapides" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ ...F.sans, fontSize: 12, color: C.mutedL, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>Navigation</p>
                {NAV.map(l => (
                  <a key={l.href} href={l.href} style={{ ...F.sans, fontSize: 13, color: C.body, textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.body)}>
                    {l.label}
                  </a>
                ))}
              </nav>

              {/* Contact quick */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ ...F.sans, fontSize: 12, color: C.mutedL, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>Contact</p>
                <a href={PHONE_TEL} style={{ ...F.sans, fontSize: 13, color: C.body, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Phone size={12} color={C.mutedL} aria-hidden="true" /> {PHONE}
                </a>
                <a href={`mailto:${EMAIL}`} style={{ ...F.sans, fontSize: 13, color: C.body, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Mail size={12} color={C.mutedL} aria-hidden="true" /> {EMAIL}
                </a>
                <p style={{ ...F.sans, fontSize: 13, color: C.body, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <MapPin size={12} color={C.mutedL} aria-hidden="true" /> 25 rue du Taur, Toulouse
                </p>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer"
                  style={{ ...F.sans, fontSize: 13, color: C.body, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Instagram size={12} color={C.mutedL} aria-hidden="true" /> @saranghouse31
                </a>
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: `1px solid ${C.gold}10`, paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <p style={{ ...F.sans, fontSize: 13, color: C.mutedL }}>© 2026 Sarang House · Tous droits réservés</p>
              <p style={{ ...F.serif, fontSize: 13, color: C.mutedL, letterSpacing: '0.22em' }}>
                밥 먹었어요?
              </p>
            </div>
          </div>
        </footer>

        {/* ── MOBILE STICKY BOOKING BAR ─────────────────────────────────────── */}
        <div className="mobile-booking-bar" role="complementary" aria-label="Réservation rapide">
          <a href="#menu" style={{
            ...F.sans, flex: 1, textAlign: 'center',
            fontSize: 13, fontWeight: 500,
            border: `1px solid ${C.gold}50`, color: C.gold,
            padding: '12px 16px', borderRadius: 99,
            textDecoration: 'none',
          }}>
            Voir le menu
          </a>
          <a href={PHONE_TEL} style={{
            ...F.sans, flex: 1, textAlign: 'center',
            fontSize: 13, fontWeight: 500,
            background: C.crimson, color: C.paper,
            padding: '12px 16px', borderRadius: 99,
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            boxShadow: `0 4px 20px ${C.crimson}40`,
          }}>
            <Phone size={13} aria-hidden="true" /> Réserver
          </a>
        </div>

      </div>
    </>
  );
}
