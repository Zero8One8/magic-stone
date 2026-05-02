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
    filter: drop-shadow(0 0 22px rgba(245,230,200,0.5))
            drop-shadow(0 0 55px rgba(220,180,100,0.25));
  }
  50% {
    filter: drop-shadow(0 0 42px rgba(255,245,200,0.85))
            drop-shadow(0 0 100px rgba(220,180,100,0.45))
            drop-shadow(0 0 160px rgba(180,140,80,0.2));
  }
}
@keyframes haloBreath {
  0%,100% { transform:scale(1);   opacity:0.18; }
  50%      { transform:scale(1.12); opacity:0.32; }
}
@keyframes haloBreath2 {
  0%,100% { transform:scale(1);   opacity:0.10; }
  50%      { transform:scale(1.20); opacity:0.20; }
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
@keyframes meteorArc {
  0% {
    transform: translate3d(var(--mx0), var(--my0), 0) rotate(var(--mrot));
    opacity: 0;
  }
  8% {
    opacity: 0.95;
  }
  92% {
    opacity: 0.3;
  }
  100% {
    transform: translate3d(var(--mx1), var(--my1), 0) rotate(var(--mrot));
    opacity: 0;
  }
}
@keyframes coronaPulse {
  0%,100% { stroke-dashoffset: 0;   opacity: 0.28; }
  50%      { stroke-dashoffset: 40; opacity: 0.50; }
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
        {/* Outer halo ring 2 */}
        <div style={{
          position: "absolute",
          inset: `-${Math.round(size * 0.28)}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,220,140,0.14) 30%, transparent 70%)",
          filter: "blur(20px)",
          animation: "haloBreath2 9s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        {/* Inner halo ring */}
        <div style={{
          position: "absolute",
          inset: `-${Math.round(size * 0.14)}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,220,140,0.2) 35%, transparent 68%)",
          filter: "blur(10px)",
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
            <radialGradient id="mc-grad" cx="34%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#fffef7" />
              <stop offset="36%" stopColor="#f3eee3" />
              <stop offset="72%" stopColor="#d8d0c2" />
              <stop offset="100%" stopColor="#90857a" />
            </radialGradient>
            <radialGradient id="mc-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(255,245,200,0.35)" />
              <stop offset="100%" stopColor="rgba(255,245,200,0)" />
            </radialGradient>
            <linearGradient id="mc-shadow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(18,14,30,0.62)" />
              <stop offset="45%" stopColor="rgba(24,20,34,0.34)" />
              <stop offset="100%" stopColor="rgba(24,20,34,0.12)" />
            </linearGradient>
            <filter id="mc-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>

          {/* Soft glow behind */}
          <circle cx={cx} cy={cy} r={r + 10} fill="url(#mc-glow)" filter="url(#mc-blur)" />
          {/* Moon face */}
          <circle cx={cx} cy={cy} r={r} fill="url(#mc-grad)" />
          {/* Craters */}
          <g clipPath="url(#mc-clip)" opacity="0.18">
            <circle cx={cx * 0.62} cy={cy * 0.58} r={r * 0.09}  fill="#7a500f" />
            <circle cx={cx * 1.22} cy={cy * 0.82} r={r * 0.065} fill="#7a500f" />
            <circle cx={cx * 0.85} cy={cy * 1.38} r={r * 0.075} fill="#7a500f" />
            <circle cx={cx * 1.32} cy={cy * 1.25} r={r * 0.05}  fill="#7a500f" />
            <circle cx={cx * 0.45} cy={cy * 1.10} r={r * 0.04}  fill="#7a500f" />
          </g>
          {/* Soft artistic phase shadow */}
          <g clipPath="url(#mc-clip)">
            <circle cx={cx + shadowOffset} cy={cy} r={r} fill="url(#mc-shadow)" opacity={shadowOpacity} />
            <ellipse
              cx={cx + shadowOffset * 0.45}
              cy={cy}
              rx={r * (0.72 + illumination * 0.26)}
              ry={r}
              fill="rgba(30,24,38,0.16)"
              opacity={shadowOpacity}
            />
          </g>
          {/* Corona dashed ring */}
          <circle
            cx={cx} cy={cy} r={r + 4}
            fill="none"
            stroke="rgba(245,230,180,0.32)"
            strokeWidth="1.2"
            strokeDasharray="6 4"
            style={{ animation: "coronaPulse 4s linear infinite" }}
          />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,245,210,0.22)" strokeWidth="1" />
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

const METEOR_DATA = [
  { top: "14%", left: "8%",  width: 168, duration: "13.5s", delay: "2s",  x0: "-8vw", y0: "-2vh", x1: "66vw", y1: "24vh", rot: "24deg" },
  { top: "34%", left: "58%", width: 132, duration: "15s",   delay: "7s",  x0: "-5vw", y0: "0vh",  x1: "52vw", y1: "20vh", rot: "18deg" },
  { top: "62%", left: "18%", width: 154, duration: "17.5s", delay: "11s", x0: "-10vw", y0: "-4vh", x1: "64vw", y1: "22vh", rot: "26deg" },
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
          {/* Meteors */}
          {METEOR_DATA.map((m, i) => (
            <div
              key={`meteor-${i}`}
              style={{
                position: "absolute",
                top: m.top,
                left: m.left,
                width: `${m.width}px`,
                height: "1.6px",
                borderRadius: "999px",
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(236,246,255,0.35) 28%, rgba(255,226,162,0.95) 100%)",
                filter: "drop-shadow(0 0 7px rgba(248,210,140,0.72))",
                ["--mx0" as string]: m.x0,
                ["--my0" as string]: m.y0,
                ["--mx1" as string]: m.x1,
                ["--my1" as string]: m.y1,
                ["--mrot" as string]: m.rot,
                animation: `meteorArc ${m.duration} ${m.delay} linear infinite`,
                transform: `rotate(${m.rot})`,
              }}
            />
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
