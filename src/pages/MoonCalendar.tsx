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

// ============================================================
// Animated SVG Moon
// ============================================================
const MoonSVG = ({ age, size = 160 }: { age: number; size?: number }) => {
  const illumination = (1 - Math.cos((age / 29.53058868) * 2 * Math.PI)) / 2;
  const isWaxing = age < 14.77;
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const innerRx = Math.abs(2 * illumination - 1) * r;
  const darkX = isWaxing ? cx : cx - r;
  const ellipseFill =
    illumination > 0.5
      ? isWaxing
        ? "#F5E6C8"
        : "#06030f"
      : isWaxing
      ? "#06030f"
      : "#F5E6C8";

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ filter: "drop-shadow(0 0 28px rgba(200,180,130,0.45))" }}
    >
      <defs>
        <clipPath id="moonClipDyn">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id="moonGradDyn" cx="38%" cy="35%">
          <stop offset="0%" stopColor="#fffbe6" />
          <stop offset="55%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#c4963e" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="url(#moonGradDyn)" />
      <g clipPath="url(#moonClipDyn)" opacity="0.12">
        <circle cx={cx * 0.65} cy={cy * 0.6} r={r * 0.1} fill="#8a6020" />
        <circle cx={cx * 1.25} cy={cy * 0.85} r={r * 0.07} fill="#8a6020" />
        <circle cx={cx * 0.9} cy={cy * 1.4} r={r * 0.08} fill="#8a6020" />
      </g>
      <g clipPath="url(#moonClipDyn)">
        <rect x={darkX} y={0} width={r} height={size} fill="#06030f" opacity="0.87" />
        {innerRx > 1 && (
          <ellipse cx={cx} cy={cy} rx={innerRx} ry={r} fill={ellipseFill} opacity="0.9" />
        )}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F5E6C8" strokeWidth="0.6" opacity="0.35" />
    </svg>
  );
};

function lunarDayForDate(date: Date): number {
  return lunarDay(date);
}

function getMoonPhaseIcon(date: Date): string {
  const phase = moonPhaseKey(date);
  return MOON_PHASE_DATA[phase]?.icon ?? "🌕";
}

function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

// ============================================================
// Page
// ============================================================
const MoonCalendar = () => {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedLunarDay, setSelectedLunarDay] = useState<LunarDayData | null>(null);

  const todayAge = useMemo(() => moonAge(today), [today]);
  const todayLunarDay = useMemo(() => lunarDay(today), [today]);
  const todayPhaseKey = useMemo(() => moonPhaseKey(today), [today]);
  const todayIllum = useMemo(() => moonIllumination(today), [today]);
  const todayZodiac = useMemo(() => moonZodiacIndex(today), [today]);
  const todayPhaseData = MOON_PHASE_DATA[todayPhaseKey];
  const todayLunarData = LUNAR_DAYS[(todayLunarDay - 1) % 30] ?? LUNAR_DAYS[0];
  const todayMoonSign = MOON_IN_SIGN[todayZodiac];

  useEffect(() => {
    const phase = todayPhaseData?.name ?? "Луна";
    const sign = todayMoonSign?.name ?? "";
    document.title = `Лунный календарь — ${todayLunarDay} лунный день, Луна в ${sign} | Magic Stone`;
    const desc = `Сегодня ${todayLunarDay} лунный день, фаза: ${phase}, Луна в ${sign}. Камень дня: ${todayLunarData?.crystal}. Лунный календарь с рекомендациями камней на каждый день.`;
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
  const dayNames = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const prevDays = getDaysInMonth(year, month - 1);
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

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Лунный календарь с камнями",
        description: "Лунный календарь с фазами луны и рекомендациями кристаллов на каждый лунный день",
        url: "https://magic-stone.com/moon",
      }) }} />

      <div className="container mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>
      </div>

      {/* Hero — cosmic dark with animated moon */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#06030f] via-[#0d0820] to-background pointer-events-none" />
        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 55 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${1 + (i % 3) * 0.5}px`,
                height: `${1 + (i % 3) * 0.5}px`,
                top: `${(i * 37 % 65)}%`,
                left: `${(i * 61 % 100)}%`,
                opacity: 0.25 + (i % 5) * 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 py-14 flex flex-col items-center text-center">
          <AnimateOnScroll>
            <div className="mb-6"><MoonSVG age={todayAge} size={180} /></div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow">
              Лунный календарь
            </h1>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm border border-white/20">
                {todayLunarData.emoji} {todayLunarDay} лунный день
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm border border-white/20">
                {todayPhaseData?.icon} {todayPhaseData?.name}
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm border border-white/20">
                🌙 Луна в {todayMoonSign?.name}
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm border border-white/20">
                💡 {todayIllum}% освещённость
              </span>
            </div>
            <p className="text-white/65 max-w-xl text-sm">{todayLunarData.meaning}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Today's Crystal & Guidance */}
      <section className="container mx-auto px-4 py-8">
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
              <h2 className="font-serif text-xl font-bold mb-4">Рекомендации</h2>
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

      {/* Monthly Calendar */}
      <section className="container mx-auto px-4 py-6">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="w-5 h-5" /></Button>
              <h2 className="font-serif text-xl font-bold">{monthNames[month]} {year}</h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="w-5 h-5" /></Button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell, i) => {
                const ld = lunarDayForDate(cell.date);
                const icon = getMoonPhaseIcon(cell.date);
                const isTodayCell = isToday(cell.date);
                return (
                  <div
                    key={i}
                    onClick={() => cell.isCurrentMonth && setSelectedLunarDay(LUNAR_DAYS[(ld - 1) % 30] ?? LUNAR_DAYS[0])}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors
                      ${cell.isCurrentMonth ? "bg-background hover:bg-primary/10" : "opacity-30"}
                      ${isTodayCell ? "bg-primary/20 border border-primary ring-1 ring-primary/40" : "border border-transparent"}
                    `}
                    title={`${ld} лунный день`}
                  >
                    <span className="text-[10px] leading-none">{icon}</span>
                    <span className={`text-xs font-medium leading-none mt-0.5 ${isTodayCell ? "text-primary font-bold" : ""}`}>{cell.day}</span>
                    <span className="text-[8px] text-muted-foreground leading-none">{ld}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Нажмите на дату чтобы узнать о лунном дне · цифра внизу ячейки = лунный день
            </p>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Selected day popup */}
      {selectedLunarDay && (
        <section className="container mx-auto px-4 pb-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-6 relative">
            <button onClick={() => setSelectedLunarDay(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
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

      {/* 30 Lunar Days Guide */}
      <section className="container mx-auto px-4 py-8">
        <AnimateOnScroll>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2">
            Все 30 лунных дней и камни
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Нажмите на день чтобы узнать подробнее — практики, аффирмации и рекомендации камней
          </p>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {LUNAR_DAYS.map((ld) => (
              <LunarDayCard key={ld.day} data={ld} isToday={ld.day === todayLunarDay} />
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* 8 Phases overview */}
      <section className="container mx-auto px-4 py-8">
        <AnimateOnScroll>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2">Фазы Луны и камни</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Как использовать кристаллы в каждую фазу лунного цикла
          </p>
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

      {/* Moon in zodiac signs */}
      <section className="container mx-auto px-4 py-8">
        <AnimateOnScroll>
          <h2 className="font-serif text-2xl font-bold text-center mb-2">Луна в знаках Зодиака</h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Луна проходит все 12 знаков за 27.3 дня — каждые 2–3 дня меняя знак и энергию дня
          </p>
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
            <h2 className="font-serif text-2xl font-bold text-foreground">Лунный календарь и кристаллы: как это работает</h2>
            <p>Лунный календарь — древний инструмент синхронизации практики с кристаллами с природными ритмами. Луна совершает полный оборот за 29.5 суток, создавая 30 лунных дней с уникальной энергетикой.</p>
            <p><strong className="text-foreground">Как работать с камнями по луне:</strong> В новолуние очищайте кристаллы и закладывайте намерения. В растущую луну заряжайте камни на привлечение желаемого. В полнолуние выставляйте коллекцию на подоконник — это самый мощный способ зарядки. В убывающую луну используйте защитные камни и практикуйте отпускание.</p>
            <p><strong className="text-foreground">Лунные дни:</strong> Каждый из 30 дней несёт свою энергетику. 1-й — новолуние, время тишины. 15-й — полнолуние, пик силы. С 16-го по 29-й энергия убывает, открывая время очищения и отпускания.</p>
            <p><strong className="text-foreground">Луна в Зодиаке:</strong> Помимо фаз, важно учитывать знак Луны. Луна в Тельце — для работы с камнями изобилия, в Скорпионе — для трансформации, в Рыбах — для медитации и исцеления.</p>
          </div>
        </AnimateOnScroll>
      </section>
    </main>
  );
};

// ============================================================
// Lunar Day Card
// ============================================================
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
