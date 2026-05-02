import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/AnimateOnScroll";

import {
  moonAge,
  lunarDay,
  moonIllumination,
  moonPhaseKey,
  moonZodiacIndex,
} from "@/utils/divination";
import {
  LUNAR_DAYS,
  MOON_PHASE_DATA,
  MOON_IN_SIGN,
  type LunarDayData,
} from "@/data/divinationData";

// ──────────────────────────────────────────────────────────────
// CSS keyframes injected once
// ──────────────────────────────────────────────────────────────
const MOON_CSS = `
@keyframes moonFloat {
  0%,100% { transform: translateY(0px) rotate(-1deg); }
  50%      { transform: translateY(-18px) rotate(1deg); }
}
@keyframes moonGlow {
  0%,100% {
    filter: drop-shadow(0 0 28px rgba(245,228,185,0.62))
            drop-shadow(0 0 70px rgba(220,175,90,0.30));
  }
  50% {
    filter: drop-shadow(0 0 55px rgba(255,248,200,0.92))
            drop-shadow(0 0 140px rgba(220,175,90,0.54))
            drop-shadow(0 0 250px rgba(175,130,60,0.22));
  }
}
@keyframes haloBreath {
  0%,100% { transform:scale(1);   opacity:0.22; }
  50%      { transform:scale(1.10); opacity:0.44; }
}
@keyframes haloBreath2 {
  0%,100% { transform:scale(1);   opacity:0.14; }
  50%      { transform:scale(1.18); opacity:0.30; }
}
@keyframes coronaBreath {
  0%,100% { transform:scale(1);   opacity:0.08; }
  50%      { transform:scale(1.06); opacity:0.17; }
}
@keyframes twinkle {
  0%,100% { opacity:var(--tw-base); transform:scale(1); }
  45%     { opacity:calc(var(--tw-base)*2.8); transform:scale(1.7); }
}
@keyframes starDrift {
  0%,100% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(var(--drift-x), var(--drift-y), 0); }
}
@keyframes nebulaFloat {
  0%,100% { transform:scale(1) translate(0,0);   opacity:.055; }
  50%      { transform:scale(1.12) translate(-2%,2%); opacity:.10; }
}
@keyframes nebula2 {
  0%,100% { transform:scale(1) translate(0,0);   opacity:.04; }
  50%      { transform:scale(1.08) translate(2%,-3%); opacity:.085; }
}
@keyframes shootStar {
  0%   { transform:translateX(-120px) translateY(-60px) rotate(30deg); opacity:1; }
  100% { transform:translateX(320px) translateY(160px) rotate(30deg); opacity:0; }
}
@keyframes cometFly {
  0%   { transform: translate(-20vw, -9vh); opacity: 0; }
  8%   { opacity: 1; }
  90%  { opacity: 0.88; }
  100% { transform: translate(82vw, 33vh); opacity: 0; }
}
`;

// ──────────────────────────────────────────────────────────────
// Animated Moon
// ──────────────────────────────────────────────────────────────
const AnimatedMoon = ({ age, size = 200 }: { age: number; size?: number }) => {
  const illumination = (1 - Math.cos((age / 29.53058868) * 2 * Math.PI)) / 2;
  const isWaxing = age < 14.77;
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const phaseCurve = Math.abs(2 * illumination - 1);
  const shadowOpacity = 0.14 + (1 - illumination) * 0.28;
  const shadowOffset = (isWaxing ? -1 : 1) * r * (0.18 + phaseCurve * 0.64);

  return (
    <div style={{ animation: "moonFloat 7s ease-in-out infinite" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Far corona — large atmospheric glow */}
        <div style={{
          position: "absolute",
          inset: `-${Math.round(size * 0.65)}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(210,182,105,0.12) 28%, rgba(190,155,78,0.05) 56%, transparent 72%)",
          filter: "blur(45px)",
          animation: "coronaBreath 14s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        {/* Mid halo */}
        <div style={{
          position: "absolute",
          inset: `-${Math.round(size * 0.36)}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,218,132,0.20) 30%, rgba(220,185,88,0.08) 58%, transparent 74%)",
          filter: "blur(26px)",
          animation: "haloBreath2 10s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        {/* Near glow */}
        <div style={{
          position: "absolute",
          inset: `-${Math.round(size * 0.15)}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,232,150,0.28) 38%, rgba(240,210,110,0.10) 64%, transparent 78%)",
          filter: "blur(12px)",
          animation: "haloBreath 5.5s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          style={{ animation: "moonGlow 5s ease-in-out infinite", display: "block" }}
        >
          <defs>
            <clipPath id="mc-clip">
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>

            {/* Base surface — warm off-white with natural tonal range */}
            <radialGradient id="mc-base" cx="38%" cy="30%" r="78%">
              <stop offset="0%"   stopColor="#fdfbf2" />
              <stop offset="22%"  stopColor="#f5f0e3" />
              <stop offset="55%"  stopColor="#e4dcd0" />
              <stop offset="82%"  stopColor="#c8bfb2" />
              <stop offset="100%" stopColor="#a09080" />
            </radialGradient>

            {/* Limb darkening — dark edge ring, concentric inward */}
            <radialGradient id="mc-limb" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
              <stop offset="72%"  stopColor="rgba(0,0,0,0)" />
              <stop offset="88%"  stopColor="rgba(8,6,18,0.18)" />
              <stop offset="100%" stopColor="rgba(8,6,18,0.62)" />
            </radialGradient>

            {/* Specular highlight — top-left bright spot */}
            <radialGradient id="mc-spec" cx="28%" cy="22%" r="38%">
              <stop offset="0%"   stopColor="rgba(255,253,245,0.70)" />
              <stop offset="45%"  stopColor="rgba(255,248,230,0.18)" />
              <stop offset="100%" stopColor="rgba(255,248,230,0)" />
            </radialGradient>

            {/* Phase shadow — terminator */}
            <linearGradient id="mc-shadow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="rgba(10,8,22,0.88)" />
              <stop offset="35%"  stopColor="rgba(14,10,26,0.52)" />
              <stop offset="70%"  stopColor="rgba(16,12,28,0.18)" />
              <stop offset="100%" stopColor="rgba(16,12,28,0.04)" />
            </linearGradient>

            {/* Maria (dark surface patches) */}
            <radialGradient id="mc-maria1" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(90,78,64,0.28)" />
              <stop offset="100%" stopColor="rgba(90,78,64,0)" />
            </radialGradient>
            <radialGradient id="mc-maria2" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(80,70,58,0.22)" />
              <stop offset="100%" stopColor="rgba(80,70,58,0)" />
            </radialGradient>

            {/* Soft outer glow */}
            <radialGradient id="mc-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(255,242,196,0.22)" />
              <stop offset="60%"  stopColor="rgba(255,235,170,0.08)" />
              <stop offset="100%" stopColor="rgba(255,235,170,0)" />
            </radialGradient>

            <filter id="mc-gblur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="mc-sblur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>

          {/* Outer atmospheric glow */}
          <circle cx={cx} cy={cy} r={r + 18} fill="url(#mc-glow)" filter="url(#mc-gblur)" />

          {/* Base sphere surface */}
          <circle cx={cx} cy={cy} r={r} fill="url(#mc-base)" clipPath="url(#mc-clip)" />

          {/* Maria — major lunar seas, proper placement */}
          <g clipPath="url(#mc-clip)">
            {/* Mare Imbrium — upper-left, large dominant sea */}
            <ellipse cx={cx - r*0.12} cy={cy - r*0.18} rx={r*0.36} ry={r*0.28} fill="url(#mc-maria1)" />
            {/* Oceanus Procellarum — left side, vast */}
            <ellipse cx={cx - r*0.26} cy={cy - r*0.02} rx={r*0.20} ry={r*0.40} fill="url(#mc-maria1)" opacity="0.72" />
            {/* Mare Serenitatis — upper center-right */}
            <ellipse cx={cx + r*0.06} cy={cy - r*0.16} rx={r*0.20} ry={r*0.17} fill="url(#mc-maria2)" />
            {/* Mare Tranquilitatis — center (Apollo 11) */}
            <ellipse cx={cx + r*0.12} cy={cy + r*0.04} rx={r*0.22} ry={r*0.16} fill="url(#mc-maria2)" opacity="0.88" />
            {/* Mare Nubium — lower center */}
            <ellipse cx={cx - r*0.05} cy={cy + r*0.28} rx={r*0.18} ry={r*0.13} fill="url(#mc-maria1)" opacity="0.80" />
            {/* Mare Crisium — far right edge */}
            <ellipse cx={cx + r*0.40} cy={cy - r*0.08} rx={r*0.11} ry={r*0.09} fill="url(#mc-maria2)" opacity="0.85" />
          </g>

          {/* Craters — subtle, natural */}
          <g clipPath="url(#mc-clip)" opacity="0.22">
            <circle cx={cx * 0.64} cy={cy * 0.56} r={r * 0.072} fill="none" stroke="rgba(100,88,70,0.6)" strokeWidth="0.8" />
            <circle cx={cx * 1.20} cy={cy * 0.80} r={r * 0.054} fill="none" stroke="rgba(100,88,70,0.5)" strokeWidth="0.7" />
            <circle cx={cx * 0.84} cy={cy * 1.36} r={r * 0.062} fill="none" stroke="rgba(100,88,70,0.55)" strokeWidth="0.7" />
            <circle cx={cx * 1.30} cy={cy * 1.24} r={r * 0.042} fill="none" stroke="rgba(100,88,70,0.4)" strokeWidth="0.6" />
            <circle cx={cx * 0.46} cy={cy * 1.08} r={r * 0.035} fill="none" stroke="rgba(100,88,70,0.38)" strokeWidth="0.6" />
          </g>

          {/* Phase terminator shadow */}
          <g clipPath="url(#mc-clip)">
            <circle cx={cx + shadowOffset} cy={cy} r={r} fill="url(#mc-shadow)" opacity={shadowOpacity} />
          </g>

          {/* Limb darkening overlay — makes sphere 3D */}
          <circle cx={cx} cy={cy} r={r} fill="url(#mc-limb)" clipPath="url(#mc-clip)" />

          {/* Specular highlight */}
          <circle cx={cx} cy={cy} r={r} fill="url(#mc-spec)" clipPath="url(#mc-clip)" />

          {/* Subtle edge ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,248,220,0.12)" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Star field (stable data, outside component)
// ──────────────────────────────────────────────────────────────
function createSeededRandom(seed = 18731) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const rand = createSeededRandom();
const STAR_DATA = Array.from({ length: 165 }, (_, i) => {
  const cluster = i % 5;
  const baseX = [14, 31, 48, 68, 84][cluster];
  const baseY = [18, 42, 66, 28, 58][cluster];
  const left = Math.max(1, Math.min(99, baseX + (rand() - 0.5) * 30));
  const top = Math.max(1, Math.min(99, baseY + (rand() - 0.5) * 38));
  const bright = rand() > 0.9;
  const size = bright ? 1.7 + rand() * 1.6 : 0.5 + rand() * 1.6;
  return {
    top: `${top.toFixed(2)}%`,
    left: `${left.toFixed(2)}%`,
    size,
    base: bright ? 0.42 + rand() * 0.28 : 0.14 + rand() * 0.24,
    delay: `${(rand() * 6).toFixed(2)}s`,
    dur: `${(2.1 + rand() * 4.8).toFixed(2)}s`,
    driftX: `${((rand() - 0.5) * 2.8).toFixed(2)}px`,
    driftY: `${((rand() - 0.5) * 2.4).toFixed(2)}px`,
    bright,
    warm: rand() > 0.72,
  };
});

// Single slow comet — elegant background presence
const METEOR_DATA = [
  { top: "20%", left: "6%", duration: "52s", delay: "5s" },
];

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function getMoonPhaseIcon(date: Date): string {
  return MOON_PHASE_DATA[moonPhaseKey(date)]?.icon ?? "🌕";
}

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────
const MoonCalendar = () => {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedLunarDay, setSelectedLunarDay] = useState<LunarDayData | null>(null);

  const todayAge      = useMemo(() => moonAge(today), [today]);
  const todayLunarDay = useMemo(() => lunarDay(today), [today]);
  const todayPhaseKey = useMemo(() => moonPhaseKey(today), [today]);
  const todayIllum    = useMemo(() => moonIllumination(today), [today]);
  const todayZodiac   = useMemo(() => moonZodiacIndex(today), [today]);
  const todayPhaseData  = MOON_PHASE_DATA[todayPhaseKey];
  const todayLunarData  = LUNAR_DAYS[(todayLunarDay - 1) % 30] ?? LUNAR_DAYS[0];
  const todayMoonSign   = MOON_IN_SIGN[todayZodiac];

  useEffect(() => {
    const phase = todayPhaseData?.name ?? "Луна";
    const sign  = todayMoonSign?.name ?? "";
    document.title = `Лунный календарь — ${todayLunarDay} лунный день, Луна в ${sign} | Magic Stone`;
    const desc = `Сегодня ${todayLunarDay} лунный день, фаза: ${phase}, Луна в ${sign}. Камень дня: ${todayLunarData?.crystal}.`;
    const setMeta = (attr: "name" | "property", key: string, val: string) => {
      let tag = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attr, key); document.head.appendChild(tag); }
      tag.content = val;
    };
    setMeta("name", "description", desc);
    setMeta("property", "og:title", "Лунный календарь | Magic Stone");
    setMeta("property", "og:description", desc);
    let canonical = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://magic-stone.com/moon";
  }, [todayLunarDay, todayPhaseData, todayMoonSign, todayLunarData]);

  const { year, month } = { year: viewDate.getFullYear(), month: viewDate.getMonth() };
  const monthNames = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
  const dayNames   = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay    = (new Date(year, month, 1).getDay() + 6) % 7;
    const prevDays    = getDaysInMonth(year, month - 1);
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
    for (let i = firstDay - 1; i >= 0; i--)
      days.push({ day: prevDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevDays - i) });
    for (let d = 1; d <= daysInMonth; d++)
      days.push({ day: d, isCurrentMonth: true, date: new Date(year, month, d) });
    const rem = 42 - days.length;
    for (let d = 1; d <= rem; d++)
      days.push({ day: d, isCurrentMonth: false, date: new Date(year, month + 1, d) });
    return days;
  }, [year, month]);

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  return (
    <main className="min-h-screen bg-background">
      <style>{MOON_CSS}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Лунный календарь с камнями",
        url: "https://magic-stone.com/moon",
      }) }} />

      {/* ══════════════════════════════════════════════
          HERO — full-screen cosmic
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "100dvh" }}>
        {/* Deep space background */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(120% 90% at 50% 10%, #1a2742 0%, #0a1428 46%, #050a16 74%, #02040b 100%)",
        }} />

        {/* Animated nebulae */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div style={{
            position: "absolute", top: "5%", left: "10%",
            width: "60%", height: "55%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(42,84,155,0.22) 0%, transparent 72%)",
            filter: "blur(40px)",
            animation: "nebulaFloat 14s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "10%", right: "8%",
            width: "50%", height: "50%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(34,72,122,0.18) 0%, transparent 72%)",
            filter: "blur(50px)",
            animation: "nebula2 18s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", top: "40%", right: "20%",
            width: "30%", height: "30%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(188,151,78,0.14) 0%, transparent 68%)",
            filter: "blur(35px)",
            animation: "nebulaFloat 22s 4s ease-in-out infinite",
          }} />
        </div>

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {STAR_DATA.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: s.top,
                left: s.left,
                width: `${s.bright ? s.size * 2.0 : s.size}px`,
                height: `${s.bright ? s.size * 2.0 : s.size}px`,
                borderRadius: "50%",
                background: s.warm ? "#f6ddb4" : "#e9f1ff",
                ["--tw-base" as string]: s.base,
                ["--drift-x" as string]: s.driftX,
                ["--drift-y" as string]: s.driftY,
                animation: `twinkle ${s.dur} ${s.delay} ease-in-out infinite, starDrift ${Number.parseFloat(s.dur) * 2.2}s ${s.delay} ease-in-out infinite`,
                boxShadow: s.bright
                  ? `0 0 ${Math.round(s.size * 6)}px rgba(245,214,156,0.78), 0 0 ${Math.round(s.size * 14)}px rgba(132,173,240,0.28)`
                  : "0 0 2px rgba(184,211,255,0.25)",
              }}
            />
          ))}
          {/* Single beautiful slow comet */}
          {METEOR_DATA.map((m, i) => (
            <div
              key={`comet-${i}`}
              style={{
                position: "absolute",
                top: m.top,
                left: m.left,
                animation: `cometFly ${m.duration} ${m.delay} linear infinite`,
                pointerEvents: "none",
              }}
            >
              <div style={{
                transform: "rotate(23deg)",
                transformOrigin: "calc(100% - 32px) 50%",
                position: "relative",
                width: "320px",
                height: "80px",
              }}>
                {/* Ion tail — primary sharp streak */}
                <div style={{
                  position: "absolute",
                  left: "2px", top: "50%",
                  width: "280px", height: "2px",
                  marginTop: "-1px",
                  borderRadius: "999px",
                  background: "linear-gradient(to right, transparent 0%, rgba(185,215,255,0.08) 14%, rgba(255,218,148,0.55) 65%, rgba(255,250,218,0.84) 90%, rgba(255,248,215,0.52) 100%)",
                }} />
                {/* Ion tail — secondary faint parallel */}
                <div style={{
                  position: "absolute",
                  left: "58px", top: "50%",
                  width: "218px", height: "1px",
                  marginTop: "3px",
                  borderRadius: "999px",
                  background: "linear-gradient(to right, transparent 0%, rgba(185,215,255,0.05) 22%, rgba(255,218,148,0.26) 80%, rgba(255,248,215,0.34) 100%)",
                }} />
                {/* Dust tail — wide warm glow */}
                <div style={{
                  position: "absolute",
                  left: "56px", top: "50%",
                  width: "238px", height: "50px",
                  marginTop: "-25px",
                  borderRadius: "50%",
                  background: "linear-gradient(to right, transparent 0%, rgba(255,205,110,0.04) 22%, rgba(255,220,148,0.13) 72%, rgba(255,238,188,0.18) 96%, transparent 100%)",
                  filter: "blur(12px)",
                }} />
                {/* Coma — outer diffuse sphere */}
                <div style={{
                  position: "absolute",
                  right: "2px", top: "50%",
                  width: "78px", height: "78px",
                  marginTop: "-39px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,254,240,0.52) 0%, rgba(255,242,195,0.22) 38%, rgba(255,228,162,0.06) 65%, transparent 80%)",
                  filter: "blur(10px)",
                }} />
                {/* Coma — inner bright */}
                <div style={{
                  position: "absolute",
                  right: "14px", top: "50%",
                  width: "48px", height: "48px",
                  marginTop: "-24px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,253,242,0.80) 0%, rgba(255,245,210,0.38) 48%, transparent 76%)",
                  filter: "blur(5px)",
                }} />
                {/* Nucleus — brilliant core with deep glow */}
                <div style={{
                  position: "absolute",
                  right: "26px", top: "50%",
                  width: "13px", height: "13px",
                  marginTop: "-6.5px",
                  borderRadius: "50%",
                  background: "#fffef5",
                  boxShadow: "0 0 6px 4px rgba(255,252,220,0.98), 0 0 18px 9px rgba(255,234,162,0.80), 0 0 46px 20px rgba(255,214,108,0.50), 0 0 92px 40px rgba(255,200,80,0.22)",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Back button — offset for fixed header */}
        <div className="absolute top-20 left-4 sm:left-8 z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm px-4 py-2 rounded-full border border-white/10"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
        </div>

        {/* Hero content */}
        <div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
          style={{ paddingTop: "100px", paddingBottom: "60px" }}
        >
          {/* Moon */}
          <div className="mb-10">
            <AnimatedMoon age={todayAge} size={220} />
          </div>

          <h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight"
            style={{ textShadow: "0 2px 30px rgba(200,170,100,0.4)" }}
          >
            Лунный календарь
          </h1>
          <p className="text-white/50 text-sm sm:text-base mb-8 max-w-lg">
            {todayLunarData.name} · {todayPhaseData?.name} · Луна в {todayMoonSign?.name}
          </p>

          {/* Status badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {[
              { icon: todayLunarData.emoji, text: `${todayLunarDay} лунный день` },
              { icon: todayPhaseData?.icon ?? "🌕", text: todayPhaseData?.name ?? "" },
              { icon: "🌙", text: `Луна в ${todayMoonSign?.name}` },
              { icon: "✨", text: `${todayIllum}% освещённость` },
            ].map((b, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-white/85 border border-white/15"
                style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}
              >
                <span>{b.icon}</span>{b.text}
              </span>
            ))}
          </div>

          {/* Crystal of the day */}
          <div
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-amber-400/25 text-amber-200/90 text-sm"
            style={{ background: "rgba(180,130,40,0.12)", backdropFilter: "blur(8px)" }}
          >
            <Gem className="w-4 h-4" />
            <span>Камень дня: <strong>{todayLunarData.crystal}</strong></span>
            {todayLunarData.crystalExtra && (
              <span className="text-white/40 ml-1">& {todayLunarData.crystalExtra}</span>
            )}
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
            <span className="text-white text-xs tracking-widest uppercase">Листать</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Today's Crystal & Guidance */}
      <section className="container mx-auto px-4 py-10">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gem className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-xl font-bold">Камень сегодня</h2>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">💎 {todayLunarData.crystal}</div>
              {todayLunarData.crystalExtra && (
                <div className="text-lg text-muted-foreground mb-3">& {todayLunarData.crystalExtra}</div>
              )}
              <p className="text-sm italic text-muted-foreground mb-3">"{todayLunarData.affirmation}"</p>
              <p className="text-xs text-muted-foreground">Луна в {todayMoonSign?.name} · {todayMoonSign?.crystal}</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-serif text-xl font-bold mb-4">Рекомендации дня</h2>
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wider text-primary mb-2">✅ Делать</p>
                <ul className="space-y-1">
                  {todayLunarData.actions.map((a, i) => (
                    <li key={i} className="text-sm text-muted-foreground">· {a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-destructive/70 mb-2">⚠️ Избегать</p>
                <ul className="space-y-1">
                  {todayLunarData.avoid.map((a, i) => (
                    <li key={i} className="text-sm text-muted-foreground">· {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-4 bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
            <span className="text-3xl">🌙</span>
            <div>
              <p className="text-sm font-semibold mb-1">Луна в {todayMoonSign?.name}</p>
              <p className="text-sm text-muted-foreground">{todayMoonSign?.energy}</p>
              <p className="text-xs text-primary mt-1">Камень знака: {todayMoonSign?.crystal}</p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Phase info */}
      <section className="container mx-auto px-4 pb-6">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-6">
            <h2 className="font-serif text-xl font-bold mb-3">
              {todayPhaseData?.icon} {todayPhaseData?.name}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">{todayPhaseData?.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-primary mb-2">Камни фазы</p>
                <div className="flex flex-wrap gap-2">
                  {todayPhaseData?.stones.map((s) => (
                    <span key={s} className="px-3 py-1 bg-primary/10 rounded-full text-xs border border-primary/20">💎 {s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-primary mb-2">Практики</p>
                <ul className="space-y-1">
                  {todayPhaseData?.actions.map((a, i) => (
                    <li key={i} className="text-xs text-muted-foreground">· {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Monthly calendar */}
      <section className="container mx-auto px-4 py-6">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-serif text-xl font-bold">{monthNames[month]} {year}</h2>
              <Button variant="ghost" size="icon" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell, i) => {
                const ld = lunarDay(cell.date);
                const icon = getMoonPhaseIcon(cell.date);
                const todayCell = isToday(cell.date);
                return (
                  <div
                    key={i}
                    onClick={() => cell.isCurrentMonth && setSelectedLunarDay(LUNAR_DAYS[(ld - 1) % 30] ?? LUNAR_DAYS[0])}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors
                      ${cell.isCurrentMonth ? "bg-background hover:bg-primary/10" : "opacity-25"}
                      ${todayCell ? "bg-primary/20 border border-primary ring-1 ring-primary/40" : "border border-transparent"}
                    `}
                  >
                    <span className="text-[10px] leading-none">{icon}</span>
                    <span className={`text-xs font-medium leading-none mt-0.5 ${todayCell ? "text-primary font-bold" : ""}`}>{cell.day}</span>
                    <span className="text-[8px] text-muted-foreground leading-none">{ld}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Нажмите на дату · цифра внизу = лунный день
            </p>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Selected day popup */}
      {selectedLunarDay && (
        <section className="container mx-auto px-4 pb-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-6 relative">
            <button onClick={() => setSelectedLunarDay(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg">✕</button>
            <h3 className="font-serif text-xl font-bold mb-1">
              {selectedLunarDay.emoji} {selectedLunarDay.day} лунный день — {selectedLunarDay.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedLunarDay.meaning}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-sm">💎 {selectedLunarDay.crystal}</span>
              {selectedLunarDay.crystalExtra && (
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm">💎 {selectedLunarDay.crystalExtra}</span>
              )}
            </div>
            <p className="text-sm italic text-muted-foreground mb-3">"{selectedLunarDay.affirmation}"</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-primary uppercase tracking-wider mb-1">Делать:</p>
                {selectedLunarDay.actions.map((a, i) => <p key={i} className="text-muted-foreground">· {a}</p>)}
              </div>
              <div>
                <p className="text-xs text-destructive/70 uppercase tracking-wider mb-1">Избегать:</p>
                {selectedLunarDay.avoid.map((a, i) => <p key={i} className="text-muted-foreground">· {a}</p>)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 30 Lunar Days */}
      <section className="container mx-auto px-4 py-8">
        <AnimateOnScroll>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2">Все 30 лунных дней</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">Камни, аффирмации и рекомендации на каждый день</p>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {LUNAR_DAYS.map((ld) => (
              <LunarDayCard key={ld.day} data={ld} isToday={ld.day === todayLunarDay} />
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* 8 Phases */}
      <section className="container mx-auto px-4 py-8">
        <AnimateOnScroll>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2">Фазы Луны и камни</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">Как использовать кристаллы в каждую фазу</p>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(MOON_PHASE_DATA).map(([key, phase]) => (
              <div key={key} className={`bg-card border rounded-2xl p-5 ${key === todayPhaseKey ? "border-primary ring-1 ring-primary/40" : "border-border"}`}>
                <div className="text-3xl text-center mb-2">{phase.icon}</div>
                <h3 className="font-serif text-center font-bold mb-2 text-sm">{phase.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>
                <div className="flex flex-wrap gap-1">
                  {phase.stones.slice(0, 2).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">💎 {s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* Moon in zodiac */}
      <section className="container mx-auto px-4 py-8">
        <AnimateOnScroll>
          <h2 className="font-serif text-2xl font-bold text-center mb-2">Луна в знаках Зодиака</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">Каждые 2–3 дня Луна меняет знак и энергетику</p>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {MOON_IN_SIGN.map((sign, i) => (
              <div key={i} className={`bg-card border rounded-xl p-4 ${i === todayZodiac ? "border-primary ring-1 ring-primary/40" : "border-border"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">🌙 в {sign.name}</span>
                  {i === todayZodiac && <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full text-primary border border-primary/30">сейчас</span>}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{sign.energy}</p>
                <span className="text-xs text-primary">💎 {sign.crystal}</span>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* SEO */}
      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <AnimateOnScroll>
          <div className="space-y-5 text-muted-foreground text-sm leading-relaxed">
            <h2 className="font-serif text-2xl font-bold text-foreground">Лунный календарь и кристаллы</h2>
            <p>Лунный календарь — инструмент синхронизации практики с природными ритмами. Луна совершает полный оборот за 29.5 суток, создавая 30 лунных дней с уникальной энергетикой.</p>
            <p><strong className="text-foreground">Как работать с камнями по луне:</strong> В новолуние очищайте кристаллы и закладывайте намерения. В растущую луну заряжайте камни на привлечение желаемого. В полнолуние выставляйте коллекцию на подоконник — это самый мощный способ зарядки.</p>
            <p><strong className="text-foreground">Луна в Зодиаке:</strong> Луна в Тельце — для камней изобилия, в Скорпионе — для трансформации, в Рыбах — для медитации и исцеления.</p>
          </div>
        </AnimateOnScroll>
      </section>
    </main>
  );
};

// ──────────────────────────────────────────────────────────────
// Lunar Day Card
// ──────────────────────────────────────────────────────────────
const LunarDayCard = ({ data, isToday }: { data: LunarDayData; isToday: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-colors ${isToday ? "border-primary ring-1 ring-primary/40" : "border-border hover:border-primary/30"}`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 p-4 text-left">
        <span className="text-xl flex-shrink-0">{data.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{data.day}-й день</span>
            {isToday && <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full border border-primary/30">сегодня</span>}
          </div>
          <span className="text-xs text-muted-foreground">{data.name} · 💎 {data.crystal}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border/50 pt-3">
          <p className="text-xs text-muted-foreground mb-2">{data.meaning}</p>
          <p className="text-xs italic text-muted-foreground mb-3">"{data.affirmation}"</p>
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">💎 {data.crystal}</span>
            {data.crystalExtra && <span className="text-xs px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">💎 {data.crystalExtra}</span>}
          </div>
          <div className="space-y-1">
            {data.actions.map((a, i) => <p key={i} className="text-xs text-muted-foreground">✅ {a}</p>)}
            {data.avoid.map((a, i) => <p key={i} className="text-xs text-muted-foreground">⚠️ {a}</p>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoonCalendar;
