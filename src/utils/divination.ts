// ============================================================
// Julian Day Number
// ============================================================
export function julianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours() + date.getMinutes() / 60;
  const A = Math.floor((14 - m) / 12);
  const Y = y + 4800 - A;
  const M = m + 12 * A - 3;
  const JDN =
    d +
    Math.floor((153 * M + 2) / 5) +
    365 * Y +
    Math.floor(Y / 4) -
    Math.floor(Y / 100) +
    Math.floor(Y / 400) -
    32045;
  return JDN + (h - 12) / 24;
}

// ============================================================
// Moon calculations
// ============================================================
// Returns moon age in days (0 = new moon, ~14.77 = full moon, 29.53 = next new)
export function moonAge(date: Date): number {
  const JD = julianDay(date);
  const knownNew = 2451549.5; // Jan 6, 2000 was a new moon
  const cycle = 29.53058868;
  const age = (JD - knownNew) % cycle;
  return age < 0 ? age + cycle : age;
}

export function lunarDay(date: Date): number {
  return Math.floor(moonAge(date)) + 1;
}

export function moonIllumination(date: Date): number {
  const age = moonAge(date);
  return Math.round(((1 - Math.cos((age / 29.53058868) * 2 * Math.PI)) / 2) * 100);
}

export type PhaseKey =
  | "new"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

export function moonPhaseKey(date: Date): PhaseKey {
  const age = moonAge(date);
  if (age < 1.85 || age >= 27.68) return "new";
  if (age < 7.38) return "waxing_crescent";
  if (age < 9.22) return "first_quarter";
  if (age < 14.77) return "waxing_gibbous";
  if (age < 16.61) return "full";
  if (age < 22.15) return "waning_gibbous";
  if (age < 23.99) return "last_quarter";
  return "waning_crescent";
}

// Simplified mean longitude → zodiac sign (0=Aries … 11=Pisces)
export function moonZodiacIndex(date: Date): number {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;
  const L = 218.3164477 + 481267.88123421 * T;
  const normalized = ((L % 360) + 360) % 360;
  return Math.floor(normalized / 30);
}

// ============================================================
// Western Astrology — Sun Sign (0=Aries … 11=Pisces)
// ============================================================
export function sunSignIndex(month: number, day: number): number {
  const starts: [number, number, number][] = [
    [1, 1, 9],
    [1, 20, 10],
    [2, 19, 11],
    [3, 21, 0],
    [4, 20, 1],
    [5, 21, 2],
    [6, 21, 3],
    [7, 23, 4],
    [8, 23, 5],
    [9, 23, 6],
    [10, 23, 7],
    [11, 22, 8],
    [12, 22, 9],
  ];
  let result = 9;
  for (const [m, d, sign] of starts) {
    if (month > m || (month === m && day >= d)) result = sign;
  }
  return result;
}

// ============================================================
// Chinese Zodiac
// ============================================================
function chineseYear(year: number, month: number, day: number): number {
  return month < 2 || (month === 2 && day < 4) ? year - 1 : year;
}

export function chineseAnimalIndex(year: number, month: number, day: number): number {
  const y = chineseYear(year, month, day);
  return (((y - 4) % 12) + 12) % 12;
}

export function chineseElementIndex(year: number, month: number, day: number): number {
  const y = chineseYear(year, month, day);
  const stem = (((y - 4) % 10) + 10) % 10;
  return Math.floor(stem / 2); // 0=Wood, 1=Fire, 2=Earth, 3=Metal, 4=Water
}

// ============================================================
// Numerology — Life Path Number (master numbers 11, 22, 33 kept)
// ============================================================
function reduceDigits(n: number, keepMaster = true): number {
  while (n > 9 && !(keepMaster && (n === 11 || n === 22 || n === 33))) {
    n = String(n)
      .split("")
      .reduce((a, c) => a + Number(c), 0);
  }
  return n;
}

export function lifePathNumber(year: number, month: number, day: number): number {
  return reduceDigits(year + month + day);
}

// ============================================================
// Celtic Tree Sign (Ogham Calendar, 0=Birch … 13=Yew)
// ============================================================
export function celticTreeIndex(month: number, day: number): number {
  const starts: [number, number, number][] = [
    [1, 1, 0],
    [1, 21, 1],
    [2, 18, 2],
    [3, 18, 3],
    [4, 15, 4],
    [5, 13, 5],
    [6, 10, 6],
    [7, 8, 7],
    [8, 5, 8],
    [9, 2, 9],
    [9, 30, 10],
    [10, 28, 11],
    [11, 25, 12],
    [12, 23, 13],
    [12, 24, 0],
  ];
  let result = 0;
  for (const [m, d, sign] of starts) {
    if (month > m || (month === m && day >= d)) result = sign;
  }
  return result;
}

// ============================================================
// Mayan Tzolkin (anchor: July 26, 1983 = 1 Imix)
// ============================================================
const TZOLKIN_ANCHOR = new Date(1983, 6, 26);

export function tzolkinPosition(date: Date): { sign: number; tone: number } {
  const msPerDay = 86400000;
  const d1 = Date.UTC(TZOLKIN_ANCHOR.getFullYear(), TZOLKIN_ANCHOR.getMonth(), TZOLKIN_ANCHOR.getDate());
  const d2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.floor((d2 - d1) / msPerDay);
  const pos = ((days % 260) + 260) % 260;
  return { sign: pos % 20, tone: (pos % 13) + 1 };
}

// ============================================================
// Tarot Birth Card (reduced to 1–22)
// ============================================================
function reduceTo22(n: number): number {
  while (n > 22) {
    n = String(n)
      .split("")
      .reduce((a, c) => a + Number(c), 0);
  }
  return n;
}

export function tarotBirthCard(year: number, month: number, day: number): number {
  return reduceTo22(year + month + day);
}

// ============================================================
// BaZi (Four Pillars) — Year Pillar
// ============================================================
export function baziYearPillar(
  year: number,
  month: number,
  day: number
): { stemIndex: number; branchIndex: number } {
  const y = chineseYear(year, month, day);
  return {
    stemIndex: (((y - 4) % 10) + 10) % 10,
    branchIndex: (((y - 4) % 12) + 12) % 12,
  };
}

// Hour earthly branch (0=Rat 23-1, 1=Ox 1-3, …, 11=Pig 21-23)
export function baziHourBranch(hour: number, minute: number): number {
  const totalMin = hour * 60 + minute;
  const shifted = (totalMin + 60) % 1440; // shift so 23:00 maps to 0
  return Math.floor(shifted / 120);
}

// ============================================================
// Matrix of Destiny (simplified — Personal Code from birth day)
// ============================================================
export function matrixPersonalCode(day: number): number {
  // Days 1-22 map directly; 23-31 reduced
  if (day <= 22) return day;
  return reduceDigits(day, false);
}

export function matrixDestinyCode(year: number, month: number, day: number): number {
  const sum = String(year)
    .concat(String(month).padStart(2, "0"))
    .concat(String(day).padStart(2, "0"))
    .split("")
    .reduce((a, c) => a + Number(c), 0);
  return reduceTo22(sum);
}
