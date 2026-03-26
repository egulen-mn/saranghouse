'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  MapPin, Phone, Clock, Instagram,
  Star, Utensils, Leaf, Flame, X, Menu, ChevronDown,
} from 'lucide-react';

// ─── Fonts ───────────────────────────────────────────────────────────────────
const serifKr  = { fontFamily: "'Noto Serif KR', Georgia, serif" };
const cormorant = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sansKr   = { fontFamily: "'Noto Sans KR', system-ui, sans-serif" };

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  crimson:  '#8B1A2B',
  crimsonL: '#C4384A',
  gold:     '#C9A84C',
  goldL:    '#EDD98A',   // brighter gold for small text
  ink:      '#0D0D0D',
  ink2:     '#111111',
  ink3:     '#161616',
  paper:    '#F7F3EE',
  stone:    '#8A8070',
};

// Readable Korean accent — warm gold, fully opaque
const krLabel = { color: C.goldL, ...sansKr } as const;

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
      { name: 'Bibimbap',     korean: '비빔밥', desc: 'Riz, légumes sautés, œuf, sauce gochujang maison',         price: '13,50€', tag: 'Signature',     img: '/images/bibimbap.jpg',   spicy: true,  veg: true  },
      { name: 'Tteokbokki',   korean: '떡볶이', desc: 'Galettes de riz en sauce pimentée douce, fishcake',        price: '11,00€', tag: null,            img: '/images/tteokbokki.jpg', spicy: true,  veg: false },
      { name: 'Bulgogi Bowl', korean: '불고기', desc: 'Bœuf mariné au sésame et soja, riz, kimchi maison',        price: '14,50€', tag: 'Coup de cœur',  img: '/images/bulgogi.jpg',    spicy: false, veg: false },
      { name: 'Mandu',        korean: '만두',   desc: 'Raviolis coréens vapeur ou frits, porc & ciboulette',      price: '9,50€',  tag: null,            img: '/images/gyoza.jpg',      spicy: false, veg: false },
    ],
  },
  {
    id: 'japonais', label: 'Japonais', korean: '일본',
    icon: Leaf, desc: 'Délicatesse et précision japonaises',
    items: [
      { name: 'Ramen Tonkotsu',    korean: '라멘',    desc: 'Bouillon de porc mijoté 12h, chashu, œuf mollet, nori',        price: '14,00€', tag: 'Signature', img: '/images/ramen.jpg',   spicy: false, veg: false },
      { name: 'Sushi Assortiment', korean: '스시',    desc: '8 pièces : saumon, thon, crevette, avocat — riz vinaigré',     price: '15,50€', tag: null,        img: '/images/sushi.jpg',   spicy: false, veg: false },
      { name: 'Karaage',           korean: '가라아게', desc: 'Poulet frit japonais, sauce ponzu, mayonnaise yuzu',            price: '10,50€', tag: 'Populaire', img: '/images/karaage.jpg', spicy: false, veg: false },
      { name: 'Gyoza',             korean: '교자',    desc: 'Raviolis grillés, porc & chou, sauce tsuyu maison',            price: '8,50€',  tag: null,        img: '/images/gyoza.jpg',   spicy: false, veg: false },
    ],
  },
  {
    id: 'soupes', label: 'Soupes', korean: '국물',
    icon: Utensils, desc: 'Réconfort dans chaque bol',
    items: [
      { name: 'Doenjang Jjigae', korean: '된장찌개',  desc: 'Soupe miso coréenne, tofu, légumes de saison, champignons',  price: '10,00€', tag: null,           img: '/images/soup.jpg',  spicy: false, veg: true  },
      { name: 'Sundubu Jjigae', korean: '순두부찌개', desc: 'Soupe de tofu soyeux épicée, palourdes, œuf',                price: '11,50€', tag: 'Coup de cœur', img: '/images/soup.jpg',  spicy: true,  veg: false },
      { name: 'Miso Ramen',     korean: '미소 라멘',  desc: 'Bouillon miso, maïs, beurre, champignons shiitake, menma',   price: '13,00€', tag: null,           img: '/images/ramen.jpg', spicy: false, veg: true  },
      { name: 'Soupe Miso',     korean: '미소시루',   desc: 'Miso blanc, tofu, algues wakame, ciboule — accompagnement',  price: '3,50€',  tag: null,           img: '/images/soup.jpg',  spicy: false, veg: true  },
    ],
  },
];

const GALLERY = [
  { src: '/images/bibimbap.jpg',   alt: 'Bibimbap',   kr: '비빔밥',   span: 'col-span-2 row-span-2' },
  { src: '/images/ramen.jpg',      alt: 'Ramen',      kr: '라멘',     span: '' },
  { src: '/images/bulgogi.jpg',    alt: 'Bulgogi',    kr: '불고기',   span: '' },
  { src: '/images/sushi.jpg',      alt: 'Sushi',      kr: '스시',     span: '' },
  { src: '/images/karaage.jpg',    alt: 'Karaage',    kr: '가라아게', span: '' },
  { src: '/images/tteokbokki.jpg', alt: 'Tteokbokki', kr: '떡볶이',   span: '' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function GoldDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}40, transparent)` }} />
      {label && <span style={{ ...sansKr, color: '#ffffff', fontSize: 12, letterSpacing: '0.3em' }}>{label}</span>}
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}40, transparent)` }} />
    </div>
  );
}

function Tag({ text }: { text: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    'Signature':    { bg: `${C.crimson}CC`, color: C.goldL,   border: `${C.gold}40` },
    'Coup de cœur': { bg: '#1A0A0D',        color: C.crimsonL, border: `${C.crimson}60` },
    'Populaire':    { bg: '#0D1A0A',        color: '#6BAA4A',  border: '#4A8A2A60' },
  };
  const s = map[text] ?? { bg: '#ffffff18', color: '#ffffff80', border: '#ffffff20' };
  return (
    <span style={{ ...sansKr, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 10, padding: '2px 8px', borderRadius: 99 }}>
      {text}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SarangHousePage() {
  const [activeCat, setActiveCat] = useState('coreen');
  const [mobileOpen, setMobileOpen] = useState(false);
  const cat = MENU_CATS.find(c => c.id === activeCat)!;

  return (
    <div style={{ background: C.ink, color: C.paper, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.gold}18` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ ...serifKr, fontSize: 18, color: C.paper }}>Sarang House</span>
            <span style={{ ...sansKr, fontSize: 11, color: '#ffffff', marginLeft: 2 }}>사랑</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
            {NAV.map(l => (
              <a key={l.href} href={l.href} style={{ ...sansKr, fontSize: 13, color: `${C.paper}AA`, textDecoration: 'none', letterSpacing: '0.08em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = `${C.paper}AA`)}>
                {l.label}
              </a>
            ))}
            <a href="#contact" style={{ ...sansKr, fontSize: 13, background: C.crimson, color: C.paper, padding: '8px 20px', borderRadius: 99, textDecoration: 'none', letterSpacing: '0.06em', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = C.crimsonL)}
              onMouseLeave={e => (e.currentTarget.style.background = C.crimson)}>
              Commander
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(o => !o)} style={{ background: 'none', border: 'none', color: `${C.paper}AA`, cursor: 'pointer', padding: 4 }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div style={{ background: C.ink2, borderTop: `1px solid ${C.gold}18`, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NAV.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ ...sansKr, fontSize: 14, color: `${C.paper}AA`, textDecoration: 'none', padding: '6px 0' }}>
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMobileOpen(false)}
              style={{ ...sansKr, fontSize: 14, background: C.crimson, color: C.paper, padding: '10px 20px', borderRadius: 99, textDecoration: 'none', textAlign: 'center', marginTop: 4 }}>
              Commander
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* BG image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image src="/images/hero-real.jpg" alt="Sarang House" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,13,0.65) 0%, rgba(13,13,13,0.35) 50%, rgba(13,13,13,1) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,13,13,0.5), transparent, rgba(13,13,13,0.3))' }} />
        </div>

        {/* Ghost Korean characters */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none' }}>
          <span style={{ ...serifKr, fontSize: 'clamp(120px, 25vw, 280px)', color: `${C.crimson}18`, fontWeight: 700, lineHeight: 1 }}>사랑</span>
        </div>

        {/* Content */}
        <div className="fade-up" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 720, width: '100%' }}>
          <p style={{ ...sansKr, fontSize: 13, color: '#ffffff', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 20 }}>
            사랑 · L&apos;Amour dans chaque assiette
          </p>

          <h1 style={{ ...serifKr, fontSize: 'clamp(64px, 12vw, 120px)', fontWeight: 300, color: C.paper, lineHeight: 1, marginBottom: 4 }}>
            Sarang
          </h1>
          <h2 style={{ ...cormorant, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 300, fontStyle: 'italic', color: C.gold, marginBottom: 28 }}>
            House
          </h2>

          <p style={{ ...cormorant, fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#ffffff', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 36 }}>
            Cuisine coréenne &amp; japonaise — faite avec amour,<br />
            au cœur de Toulouse.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#menu" style={{ ...sansKr, fontSize: 13, background: C.crimson, color: C.paper, padding: '12px 28px', borderRadius: 99, textDecoration: 'none', letterSpacing: '0.08em', boxShadow: `0 8px 30px ${C.crimson}40` }}>
              Découvrir le menu
            </a>
            <a href="#histoire" style={{ ...sansKr, fontSize: 13, border: `1px solid ${C.gold}50`, color: C.gold, padding: '12px 28px', borderRadius: 99, textDecoration: 'none', letterSpacing: '0.08em' }}>
              Notre histoire
            </a>
          </div>

          {/* Info strip */}
          <div style={{ marginTop: 48, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ ...sansKr, fontSize: 11, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.05em' }}>
              <MapPin size={11} color={C.goldL} /> 25 rue du Taur, Toulouse
            </span>
            <span style={{ ...sansKr, fontSize: 11, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '0.05em' }}>
              <Clock size={11} color={C.goldL} /> Mar–Sam · 12h–14h30 / 19h–22h
            </span>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="bounce-slow" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', color: `${C.gold}50` }}>
          <ChevronDown size={22} />
        </div>
      </section>

      {/* ── HISTOIRE ────────────────────────────────────────────────────────── */}
      <section id="histoire" style={{ padding: '96px 24px', background: C.ink }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

          {/* Image */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', height: 480, borderRadius: 20, overflow: 'hidden' }}>
              <Image src="/images/about.jpg" alt="Notre cuisine" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.5), transparent)' }} />
            </div>
            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: -20, right: -20, background: C.crimson, borderRadius: 16, padding: '16px 20px', boxShadow: `0 12px 40px ${C.crimson}50` }}>
              <p style={{ ...serifKr, fontSize: 28, color: C.goldL, fontWeight: 300 }}>사랑</p>
              <p style={{ ...cormorant, fontStyle: 'italic', color: `${C.paper}CC`, fontSize: 13, marginTop: 2 }}>L&apos;amour</p>
            </div>
            {/* Corner accent */}
            <div style={{ position: 'absolute', top: -10, left: -10, width: 60, height: 60, borderTop: `2px solid ${C.gold}50`, borderLeft: `2px solid ${C.gold}50`, borderRadius: '12px 0 0 0', pointerEvents: 'none' }} />
          </div>

          {/* Text */}
          <div>
            <p style={{ ...sansKr, fontSize: 13, color: '#ffffff', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
              Notre Histoire · 우리의 이야기
            </p>
            <h2 style={{ ...serifKr, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: C.paper, lineHeight: 1.2, marginBottom: 8 }}>
              Née d&apos;une passion,
            </h2>
            <h2 style={{ ...cormorant, fontSize: 'clamp(28px, 4.5vw, 44px)', fontStyle: 'italic', color: C.gold, lineHeight: 1.2, marginBottom: 24 }}>
              nourrie d&apos;amour.
            </h2>

            <GoldDivider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                <><span style={{ ...serifKr, color: C.gold, fontSize: 22, marginRight: 4 }}>사랑</span> — en coréen, ce mot signifie <em>amour</em>. C&apos;est le nom que nous avons choisi, car c&apos;est l&apos;ingrédient que nous mettons dans chaque plat.</>,
                <>Au cœur du Vieux Toulouse, notre petite maison vous invite à un voyage entre Séoul et Tokyo. Des recettes transmises, revisitées avec soin, servies dans la chaleur d&apos;une table intime.</>,
                <>Kimchi fermenté maison, bouillons mijotés des heures, riz vinaigré avec patience — ici, rien n&apos;est pressé. Tout est fait avec amour.</>,
              ].map((text, i) => (
                <p key={i} style={{ ...cormorant, fontSize: 18, color: '#ffffff', lineHeight: 1.75 }}>{text}</p>
              ))}
            </div>

            <GoldDivider />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 8 }}>
              {[
                { num: '25', label: 'Rue du Taur', sub: 'Toulouse' },
                { num: '100%', label: 'Fait maison', sub: '손수 만든' },
                { num: '2', label: 'Cuisines', sub: '코리아 · 재팬' },
              ].map(s => (
                <div key={s.num} style={{ textAlign: 'center' }}>
                  <p style={{ ...serifKr, fontSize: 26, color: C.gold, fontWeight: 300 }}>{s.num}</p>
                  <p style={{ ...sansKr, fontSize: 11, color: '#ffffff', marginTop: 4 }}>{s.label}</p>
                  <p style={{ ...sansKr, fontSize: 12, color: '#ffffff', marginTop: 2 }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MENU ────────────────────────────────────────────────────────────── */}
      <section id="menu" style={{ padding: '96px 24px', background: '#0A0A0A' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ ...sansKr, fontSize: 13, color: '#ffffff', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14 }}>
              Notre Menu · 메뉴
            </p>
            <h2 style={{ ...serifKr, fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 300, color: C.paper, marginBottom: 12 }}>
              Saveurs de Corée &amp; du Japon
            </h2>
            <p style={{ ...cormorant, fontStyle: 'italic', fontSize: 18, color: '#ffffff' }}>
              Chaque plat est une lettre d&apos;amour à deux cultures culinaires.
            </p>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {MENU_CATS.map(c => {
              const Icon = c.icon;
              const active = activeCat === c.id;
              return (
                <button key={c.id} onClick={() => setActiveCat(c.id)}
                  style={{ ...sansKr, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 99, fontSize: 13, cursor: 'pointer', border: active ? 'none' : `1px solid ${C.gold}50`, background: active ? C.crimson : 'transparent', color: active ? C.paper : C.paper, transition: 'all 0.2s', boxShadow: active ? `0 4px 20px ${C.crimson}40` : 'none' }}>
                  <Icon size={13} />
                  <span>{c.label}</span>
                  <span style={{ fontSize: 12, color: '#ffffff' }}>{c.korean}</span>
                </button>
              );
            })}
          </div>

          <p style={{ ...cormorant, fontStyle: 'italic', color: '#ffffff', fontSize: 16, textAlign: 'center', marginBottom: 32 }}>
            {cat.desc}
          </p>

          {/* Items grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 16 }}>
            {cat.items.map(item => (
              <div key={item.name} style={{ display: 'flex', gap: 20, background: '#141414', border: `1px solid ${C.gold}18`, borderRadius: 18, padding: 18, transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${C.gold}40`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = `${C.gold}18`)}>

                {/* Image */}
                <div style={{ position: 'relative', width: 160, height: 160, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 2 }}>
                    <div>
                      <p style={{ ...serifKr, fontSize: 15, color: C.paper, fontWeight: 500 }}>{item.name}</p>
                      <p style={{ ...sansKr, fontSize: 12, color: '#ffffff', marginTop: 1 }}>{item.korean}</p>
                    </div>
                    <span style={{ ...serifKr, fontSize: 15, color: C.gold, fontWeight: 300, flexShrink: 0 }}>{item.price}</span>
                  </div>
                  <p style={{ ...cormorant, fontSize: 15, color: '#ffffff', lineHeight: 1.5, marginBottom: 8 }}>{item.desc}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    {item.tag && <Tag text={item.tag} />}
                    {item.spicy && <span style={{ ...sansKr, fontSize: 11, color: '#E05060', display: 'flex', alignItems: 'center', gap: 3 }}><Flame size={11} /> Épicé</span>}
                    {item.veg   && <span style={{ ...sansKr, fontSize: 11, color: '#7DC45A', display: 'flex', alignItems: 'center', gap: 3 }}><Leaf size={11} /> Végé</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <GoldDivider label="참고" />
            <p style={{ ...cormorant, fontStyle: 'italic', color: '#ffffff', fontSize: 14 }}>
              Menu susceptible d&apos;évoluer selon les saisons. Allergènes disponibles sur demande.
            </p>
          </div>
        </div>
      </section>

      {/* ── GALERIE ─────────────────────────────────────────────────────────── */}
      <section id="galerie" style={{ padding: '96px 24px', background: C.ink }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ ...sansKr, fontSize: 13, color: '#ffffff', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14 }}>
              Galerie · 갤러리
            </p>
            <h2 style={{ ...serifKr, fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 300, color: C.paper, marginBottom: 12 }}>
              L&apos;art dans l&apos;assiette
            </h2>
            <p style={{ ...cormorant, fontStyle: 'italic', fontSize: 18, color: '#ffffff' }}>
              Chaque plat est une œuvre — éphémère et délicieuse.
            </p>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 220px)', gap: 12 }}>
            {GALLERY.map((img, i) => (
              <div key={img.src}
                style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', gridColumn: i === 0 ? 'span 2' : 'span 1', gridRow: i === 0 ? 'span 2' : 'span 1', cursor: 'pointer' }}>
                <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover', transition: 'transform 0.6s' }}
                  onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.08)')}
                  onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                  <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                    <p style={{ ...sansKr, color: C.gold, fontSize: 13 }}>{img.kr}</p>
                    <p style={{ ...cormorant, fontStyle: 'italic', color: `${C.paper}CC`, fontSize: 12 }}>{img.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE STRIP ─────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '80px 24px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image src="/images/interior.jpg" alt="Ambiance" fill style={{ objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.82)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ ...sansKr, fontSize: 13, color: '#ffffff', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 24 }}>
            우리의 공간 · Notre espace
          </p>
          <blockquote style={{ ...cormorant, fontStyle: 'italic', fontSize: 'clamp(22px, 4vw, 36px)', color: C.paper, fontWeight: 300, lineHeight: 1.6, marginBottom: 24 }}>
            &ldquo;Un repas partagé est un acte d&apos;amour.<br />
            Ici, chaque table est une scène.&rdquo;
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 1, background: `${C.gold}50` }} />
            {[...Array(5)].map((_, i) => <Star key={i} size={11} color={`${C.gold}AA`} fill={`${C.gold}AA`} />)}
            <div style={{ width: 28, height: 1, background: `${C.gold}50` }} />
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: '96px 24px', background: '#0A0A0A' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ ...sansKr, fontSize: 13, color: '#ffffff', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14 }}>
              Nous trouver · 찾아오세요
            </p>
            <h2 style={{ ...serifKr, fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 300, color: C.paper, marginBottom: 12 }}>
              Venez partager un repas
            </h2>
            <p style={{ ...cormorant, fontStyle: 'italic', fontSize: 18, color: '#ffffff' }}>
              Une petite maison, un grand cœur.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start' }}>

            {/* Info cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: MapPin, title: 'Adresse', kr: '주소', lines: ['25 rue du Taur', '31000 Toulouse'] },
                { icon: Clock,  title: 'Horaires', kr: '영업시간', lines: ['Mardi – Samedi', '12h00 – 14h30  /  19h00 – 22h00', 'Dimanche & Lundi : Fermé'] },
                { icon: Phone,  title: 'Téléphone', kr: '전화', lines: ['Réservations conseillées'] },
              ].map(card => {
                const Icon = card.icon;
                return (
                  <div key={card.title} style={{ display: 'flex', gap: 14, background: '#141414', border: `1px solid ${C.gold}18`, borderRadius: 16, padding: '16px 18px' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${C.crimson}55`, border: `1px solid ${C.crimson}80`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={C.goldL} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ ...sansKr, fontSize: 13, color: C.paper, fontWeight: 500 }}>{card.title}</span>
                        <span style={{ ...sansKr, fontSize: 12, color: '#ffffff' }}>{card.kr}</span>
                      </div>
                      {card.lines.map((line, i) => (
                        <p key={i} style={{ ...cormorant, fontSize: 16, color: '#ffffff', lineHeight: 1.6 }}>{line}</p>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Instagram */}
              <div style={{ display: 'flex', gap: 14, background: '#141414', border: `1px solid ${C.gold}18`, borderRadius: 16, padding: '16px 18px' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${C.crimson}55`, border: `1px solid ${C.crimson}80`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Instagram size={15} color={C.goldL} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ ...sansKr, fontSize: 13, color: C.paper, fontWeight: 500 }}>Réseaux</span>
                    <span style={{ ...sansKr, fontSize: 12, color: '#ffffff' }}>소셜</span>
                  </div>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                    style={{ ...cormorant, fontSize: 16, color: '#ffffff', textDecoration: 'none' }}>
                    @saranghouse.toulouse
                  </a>
                </div>
              </div>
            </div>

            {/* Map + CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gold}18`, height: 240 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.7!2d1.4437!3d43.6047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12aebb6f5b0c0001%3A0x1!2s25+Rue+du+Taur%2C+31000+Toulouse!5e0!3m2!1sfr!2sfr!4v1"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sarang House Toulouse"
                />
              </div>

              <div style={{ background: `linear-gradient(135deg, ${C.crimson}40, ${C.crimson}18)`, border: `1px solid ${C.crimson}50`, borderRadius: 18, padding: '28px 24px', textAlign: 'center' }}>
                <h3 style={{ ...serifKr, fontSize: 20, color: C.paper, marginBottom: 8 }}>Réserver une table</h3>
                <p style={{ ...cormorant, fontStyle: 'italic', color: '#ffffff', fontSize: 16, marginBottom: 20 }}>
                  Pour une expérience intime et mémorable.
                </p>
                <a href="tel:+33000000000"
                  style={{ ...sansKr, display: 'inline-flex', alignItems: 'center', gap: 8, background: C.crimson, color: C.paper, padding: '12px 26px', borderRadius: 99, fontSize: 13, textDecoration: 'none', letterSpacing: '0.06em', boxShadow: `0 8px 24px ${C.crimson}50` }}>
                  <Phone size={14} /> Appeler pour réserver
                </a>
                <p style={{ ...sansKr, fontSize: 11, color: '#ffffff', marginTop: 12 }}>
                  Réservations conseillées le week-end
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#080808', borderTop: `1px solid ${C.gold}15`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ ...serifKr, fontSize: 16, color: C.paper }}>Sarang House</span>
              <span style={{ ...sansKr, fontSize: 12, color: '#ffffff' }}>사랑</span>
            </div>

            {/* Center */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ ...cormorant, fontStyle: 'italic', color: '#ffffff', fontSize: 14 }}>
                Cuisine coréenne &amp; japonaise · 25 rue du Taur, Toulouse
              </p>
              <p style={{ ...sansKr, fontSize: 12, color: '#ffffff', marginTop: 4 }}>
                사랑을 담아 — Fait avec amour
              </p>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${C.gold}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none' }}>
                <Instagram size={14} />
              </a>
              <span style={{ ...sansKr, fontSize: 12, color: '#ffffff' }}>© 2026 Sarang House</span>
            </div>
          </div>

          {/* Poetry line */}
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <p style={{ ...serifKr, fontSize: 13, color: '#ffffff', letterSpacing: '0.4em' }}>
              사랑은 음식 속에 있다 · L&apos;amour est dans la nourriture
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
