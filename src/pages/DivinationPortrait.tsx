import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Gem, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimateOnScroll from "@/components/AnimateOnScroll";

import {
  sunSignIndex,
  chineseAnimalIndex,
  chineseElementIndex,
  lifePathNumber,
  celticTreeIndex,
  tzolkinPosition,
  tarotBirthCard,
  baziYearPillar,
  baziHourBranch,
  matrixPersonalCode,
  matrixDestinyCode,
} from "@/utils/divination";
import {
  ZODIAC_SIGNS,
  CHINESE_ANIMALS,
  CHINESE_ELEMENTS,
  LIFE_PATH_DATA,
  CELTIC_TREES,
  MAYAN_SIGNS,
  MAYAN_TONES,
  TAROT_ARCANA,
  BAZI_STEMS,
  BAZI_BRANCHES,
} from "@/data/divinationData";

const TELEGRAM_BOT = "https://t.me/The_magic_of_stones_bot?start=portrait_pay";

type FormData = {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  city: string;
};

type SystemResult = {
  system: string;
  icon: string;
  resultName: string;
  resultEmoji: string;
  crystal: string;
  brief: string;
  teaser: string;
  color: string;
};

type FullPreviewSection = {
  title: string;
  text: string;
};

function parseDate(dateStr: string): { year: number; month: number; day: number } | null {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m, day: d };
}

function parseTime(timeStr: string): { hour: number; minute: number } {
  const parts = timeStr.split(":");
  return { hour: Number(parts[0]) || 0, minute: Number(parts[1]) || 0 };
}

function getGeneKeyProfile(year: number, month: number, day: number, hour: number, minute: number) {
  // Julian Day Number (Meeus algorithm) — time matters for exact gate and line
  const A = Math.floor((14 - month) / 12);
  const Y = year + 4800 - A;
  const M = month + 12 * A - 3;
  const JD = day + Math.floor((153 * M + 2) / 5) + 365 * Y
    + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400)
    - 32045 + (hour + minute / 60 - 12) / 24;
  const n = JD - 2451545.0; // days from J2000.0
  // Sun mean longitude and anomaly (degrees)
  const Ldeg = ((280.460 + 0.9856474 * n) % 360 + 360) % 360;
  const gDeg = ((357.528 + 0.9856003 * n) % 360 + 360) % 360;
  const g = gDeg * (Math.PI / 180);
  // Ecliptic longitude (equation of center correction)
  let lambda = Ldeg + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  lambda = ((lambda % 360) + 360) % 360;
  // Gene Keys mandala: Gate 41 starts at 0° Aquarius = 300° ecliptic longitude
  const HD_GATES = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];
  const offset = ((lambda - 300) % 360 + 360) % 360;
  const gateIdx = Math.floor(offset / (360 / 64)) % 64;
  const key = HD_GATES[gateIdx];
  const line = Math.floor(((offset % (360 / 64)) / (360 / 64)) * 6) + 1;
  const lineNames = ["Исследователь","Отшельник","Мученик","Оппортунист","Еретик","Ролевая модель"];
  // [shadow, gift, siddhi, crystal] for all 64 Gene Keys
  const GK: Record<number, [string,string,string,string]> = {
    1:["энтропия","свежесть","красота","Розовый кварц"],
    2:["отклонение","ориентация","единство","Лабрадорит"],
    3:["хаос","инновация","невинность","Горный хрусталь"],
    4:["нетерпимость","понимание","прощение","Аметист"],
    5:["нетерпеливость","терпение","вечность","Аквамарин"],
    6:["конфликт","дипломатия","мир","Хризолит"],
    7:["авторитаризм","руководство","добродетель","Цитрин"],
    8:["посредственность","стиль","роскошь","Малахит"],
    9:["инерция","решительность","невидимость","Чёрный турмалин"],
    10:["самоотречение","естественность","бытие","Перидот"],
    11:["темнота","идеализм","свет","Белый кварц"],
    12:["тщеславие","различение","чистота","Аметист"],
    13:["разочарование","сочувствие","сдвиг","Родонит"],
    14:["скудость","компетентность","щедрость","Цитрин"],
    15:["унылость","магнетизм","цветение","Розовый кварц"],
    16:["безразличие","мастерство","одарённость","Лазурит"],
    17:["шаблонность","дальновидность","всеведение","Лабрадорит"],
    18:["осуждение","целостность","совершенство","Изумруд"],
    19:["созависимость","чувствительность","жертва","Розовый кварц"],
    20:["поверхностность","самодостаточность","присутствие","Лабрадорит"],
    21:["контроль","власть","сила","Гранат"],
    22:["бесчестие","изящество","грация","Лунный камень"],
    23:["сложность","простота","безмолвие","Горный хрусталь"],
    24:["зависимость","изобретательность","тишина","Аметист"],
    25:["мстительность","принятие","универсальная любовь","Розовый кварц"],
    26:["гордость","мастерство","невидимость","Цитрин"],
    27:["эгоизм","щедрость","бескорыстие","Нефрит"],
    28:["бесцельность","упорство","бессмертие","Гематит"],
    29:["незавершённость","преданность","капитуляция","Аквамарин"],
    30:["желание","лёгкость","сияние","Янтарь"],
    31:["высокомерие","лидерство","смирение","Лазурит"],
    32:["несостоятельность","сохранение","почитание","Нефрит"],
    33:["забывание","осознанность","откровение","Лабрадорит"],
    34:["сила ради силы","сила","мощь","Гранат"],
    35:["голод","авантюризм","безграничность","Аквамарин"],
    36:["смятение","гуманность","сострадание","Розовый кварц"],
    37:["слабость","равенство","нежность","Розовый кварц"],
    38:["борьба","упорство","честь","Гематит"],
    39:["провокация","динамика","освобождение","Флюорит"],
    40:["истощение","разрешение","уединение","Аметист"],
    41:["фантазия","ожидание","наслаждение","Янтарь"],
    42:["вмешательство","отпускание","завершение","Лунный камень"],
    43:["тупость","прозрение","понимание","Лабрадорит"],
    44:["интерференция","мастерство","синергия","Обсидиан"],
    45:["доминирование","командование","союз","Лазурит"],
    46:["серьёзность","уместность","экстаз","Аметист"],
    47:["угнетение","преобразование","трансмутация","Обсидиан"],
    48:["неадекватность","ресурсность","мудрость","Горный хрусталь"],
    49:["реакция","революция","возрождение","Гранат"],
    50:["разложение","равновесие","ответственность","Нефрит"],
    51:["шок","инициатива","пробуждение","Янтарь"],
    52:["стресс","сдержанность","безмятежность","Аквамарин"],
    53:["незрелость","начала","эволюция","Малахит"],
    54:["жадность","устремление","вознесение","Гранат"],
    55:["жертвенность","свобода","свобода","Аметист"],
    56:["отвлечение","обогащение","интоксикация","Янтарь"],
    57:["тревога","интуиция","ясность","Горный хрусталь"],
    58:["неудовлетворённость","жизнерадостность","безупречность","Цитрин"],
    59:["нечестность","открытость","прозрачность","Аквамарин"],
    60:["ограничение","реализм","справедливость","Гематит"],
    61:["психоз","вдохновение","просветление","Лабрадорит"],
    62:["интеллектуализм","детализация","незаметность","Горный хрусталь"],
    63:["сомнение","исследование","истина","Белый кварц"],
    64:["смятение","воображение","иллюминация","Аметист"],
  };
  const d = GK[key] ?? ["сомнение","исследование","ясность","Горный хрусталь"];
  return { key, line, lineName: lineNames[line-1], shadow: d[0], gift: d[1], siddhi: d[2], crystal: d[3] };
}

function firstSentence(text: string): string {
  const sentence = text.split(".")[0]?.trim() ?? text.trim();
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

function dominantCrystal(results: SystemResult[]): string {
  const counts = new Map<string, number>();
  for (const result of results) counts.set(result.crystal, (counts.get(result.crystal) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Аметист";
}

function buildIntegratedSummary(results: SystemResult[]): string {
  if (results.length < 4) return "Ваш портрет пока не собран полностью.";
  const topCrystal = dominantCrystal(results);
  const sun = results[0];
  const chinese = results[1];
  const numerology = results[2];
  const geneKey = results[8];
  const shadowStr = geneKey?.brief?.match(/тени «([^»]+)»/)?.[1] ?? "";
  const siddhiStr = geneKey?.brief?.match(/состоянии «([^»]+)»/)?.[1] ?? "";
  return [
    `Одиннадцать систем — одно ядро: ${sun.resultName}, путь ${numerology.resultName}, ${chinese.resultName} — три независимых языка об одной природе.`,
    `${firstSentence(sun.brief)} ${firstSentence(chinese.brief)}`,
    geneKey ? `Генный ключ ${geneKey.resultName}: трансформационная ось жизни — от тени «${shadowStr}» к состоянию «${siddhiStr}». Не теория — точная карта внутренней работы.` : "",
    `Камень-интегратор портрета — ${topCrystal}: связывает все уровни в единый рабочий вектор.`,
  ].filter(Boolean).join(" ");
}

function buildFullPreview(results: SystemResult[], form: FormData): FullPreviewSection[] {
  const topCrystal = dominantCrystal(results);
  const styleCrystal = results[1]?.crystal ?? topCrystal;
  const purposeCrystal = results[3]?.crystal ?? topCrystal;
  const protectionCrystal = results[7]?.crystal ?? topCrystal;
  const sun = results[0];
  const numerology = results[2];
  const tarot = results[6];
  const geneKey = results[8];
  const egyptian = results[9];
  const shadowStr = geneKey?.brief?.match(/тени «([^»]+)»/)?.[1] ?? "";
  const giftStr   = geneKey?.brief?.match(/дару «([^»]+)»/)?.[1] ?? "";
  const siddhiStr = geneKey?.brief?.match(/состоянии «([^»]+)»/)?.[1] ?? "";
  const gkNum     = geneKey?.resultName?.match(/Ключ (\d+)/)?.[1] ?? "";
  const lineNameStr = geneKey?.resultName?.match(/\(([^)]+)\)/)?.[1] ?? "";
  const parsed = parseDate(form.date);
  const pyNum = parsed ? (() => {
    const cy = new Date().getFullYear();
    const ds = `${parsed.day}${parsed.month}${cy}`;
    let s = ds.split("").reduce((a, c) => a + Number(c), 0);
    while (s > 9 && s !== 11 && s !== 22) s = String(s).split("").reduce((a, c) => a + Number(c), 0);
    return s;
  })() : null;
  const pyMeaning: Record<number, string> = {
    1: "начало нового 9-летнего цикла — время инициативы и смелости первого шага",
    2: "год союза и терпения — качество близких связей важнее количества событий",
    3: "год выражения — то, что созрело внутри, ищет форму вовне",
    4: "год строительства — время углубить основы, а не расширять",
    5: "год свободы и изменений — готовность к неожиданным поворотам",
    6: "год ответственности — отношения и пространство вокруг в фокусе",
    7: "год глубины — время внутренней работы и переосмысления",
    8: "год силы — признание и материальные результаты выходят на первый план",
    9: "год завершения — время отпустить то, что выполнило свою задачу",
    11: "мастер-год интуиции — духовное лидерство и вдохновение на подъёме",
    22: "мастер-год строительства — масштабные проекты с долгосрочным следом",
  };
  const shadowDesc: Record<string, string> = {
    "зависимость": "ментальные петли — ум прокручивает одни и те же мысли, не находя выхода; привязанность к определённым паттернам мышления, которые мешают видеть новое",
    "контроль": "стремление удержать под управлением то, что требует доверия к процессу — отношения, творчество, духовный рост",
    "поверхностность": "уход от глубины в активность — много движения без внутреннего центра, имитация прогресса вместо трансформации",
    "гордость": "трудность принять помощь или признать ограничение, не теряя внутренней опоры",
    "слабость": "жертвенность вместо равенства — отдаю больше, чем получаю, и это стало привычным",
    "страх": "избегание неизведанного под маской осторожности или перфекционизма",
  };
  const sDesc = shadowDesc[shadowStr] ?? `паттерн «${shadowStr}» — активируется в условиях стресса и перегрузки, управляет решениями незаметно, пока не назван точно`;
  const lineActivation: Record<string, string> = {
    "Оппортунист": "через правильные связи и окружение. Без правильной среды дар спит. Найти свою среду — это духовная практика, не социальная активность",
    "Еретик": "через практическое решение реальных задач для других. Когда направление на служение — дар раскрывается полностью",
    "Исследователь": "через глубокое изучение без давления срочности. Этот профиль не терпит поверхностности — ни в знании, ни в отношениях",
    "Отшельник": "в моменты уединения и тишины. Социальная активность истощает; восстановление через одиночество — не слабость, а рабочий механизм",
    "Мученик": "через личный опыт испытания. Лучшие учителя и наставники в этой линии — те, кто сам прошёл через то, о чём говорит",
    "Ролевая модель": "через бытие примером. Не слова — образ жизни. Когда он согласован с ценностями, влияние приходит без усилий",
  };
  const lineAct = lineActivation[lineNameStr] ?? `как «${lineNameStr}»`;
  const pyText = pyNum !== null ? (pyMeaning[pyNum] ?? "") : "";
  return [
    {
      title: "Архетипическая Матрица",
      text: `${sun?.resultName ?? ""}, путь ${numerology?.resultName ?? ""}, ${tarot?.resultName ?? ""}, ${egyptian?.resultName ?? ""} — четыре независимых системы, одно ядро. ${firstSentence(sun?.brief ?? "")} ${firstSentence(numerology?.brief ?? "")} Такой профиль раскрывается максимально, когда выбирает глубину вместо экспансии и длинные горизонты вместо коротких всплесков. Результаты всегда превосходят ожидания тех, кто видит только внешний слой.`,
    },
    {
      title: gkNum ? `Генный Ключ ${gkNum}: Трансформационная Ось` : "Генный Ключ: Трансформационная Ось",
      text: geneKey
        ? `${geneKey.resultName} — самая точная карта внутренней работы. Тень «${shadowStr}»: ${sDesc}. Это не характеристика слабости — это встроенный паттерн, который управляет незаметно, пока не назван. Дар «${giftStr}» возникает, когда тень осознана и интегрирована: способность, которая недоступна тем, кто тень не прожил. Сиддхи «${siddhiStr}» — горизонт жизни, не стартовая позиция. Линия «${lineNameStr}»: дар активируется ${lineAct}.`
        : "",
    },
    {
      title: "Три Закона Этого Профиля",
      text: `Первый — горизонт. Проекты и направления с горизонтом от трёх лет — родная стихия. Там, где другие сдаются через год, здесь только начинается настоящий разгон. Второй — среда. Это не про комфорт, это про функцию: в бедной среде внутренний огонь обращается внутрь и разрушает. В правильной среде — освещает. Третий — тело как инструмент, не транспорт. Без физического заземления решения теряют точность, а усталость накапливается незаметно, пока не ударяет одним разом.`,
    },
    {
      title: "Кристаллы: Рабочая Система",
      text: `Четыре уровня задачи — четыре камня: ядро личности (${topCrystal} — интеграция и ясность), стиль проявления (${styleCrystal} — усиление природного дара), реализация предназначения (${purposeCrystal} — активация ресурса судьбы), защитный контур (${protectionCrystal} — заземление и устойчивость).${form.city ? ` Астрологическая составляющая ${form.city} добавляет точность в карте пространственных энергий.` : ""} Это не коллекция — система, в которой каждый камень закрывает конкретный слой.`,
    },
    {
      title: pyNum !== null ? `Вектор Года: Личный ${pyNum}-й` : "Вектор Текущего Цикла",
      text: `${pyText ? `Личный год ${pyNum} — ${pyText}. ` : ""}Для этого профиля ключевой вопрос года не «что делать», а «что отпустить» и «где тень активируется чаще всего». Когда на этот вопрос есть честный ответ, правильные действия становятся очевидны сами по себе. Детализация вектора по кварталам — в полной версии.`,
    },
    {
      title: "Полная Версия: Что Внутри",
      text: `Пошаговая карта работы с тенью «${shadowStr || "тенью"}» — что именно её запускает и как это изменить с конкретными практиками. Кристаллический протокол с режимом использования под текущий жизненный цикл. Полная BaZi карта (все 4 столпа) с прогнозом до 2030. Activation Sequence Генных ключей — все 4 ключа профиля. Ежегодный арканный прогноз Таро. Всё в одном документе, который работает как навигатор на год вперёд.`,
    },
  ];
}

function buildPortrait(form: FormData): SystemResult[] {
  const parsed = parseDate(form.date);
  if (!parsed) return [];
  const { year, month, day } = parsed;
  const { hour, minute } = parseTime(form.time);

  const results: SystemResult[] = [];

  // 1. Western Astrology — Sun Sign
  const sunIdx = sunSignIndex(month, day);
  const sun = ZODIAC_SIGNS[sunIdx];
  results.push({
    system: "Западная астрология",
    icon: "🌟",
    resultName: `${sun.emoji} ${sun.name}`,
    resultEmoji: sun.emoji,
    crystal: sun.crystal,
    brief: sun.brief,
    teaser: sun.teaser,
    color: "from-amber-900/30 to-amber-700/10",
  });

  // 2. Chinese Zodiac
  const animalIdx = chineseAnimalIndex(year, month, day);
  const elemIdx = chineseElementIndex(year, month, day);
  const animal = CHINESE_ANIMALS[animalIdx];
  const elem = CHINESE_ELEMENTS[elemIdx];
  results.push({
    system: "Китайский гороскоп",
    icon: "🐉",
    resultName: `${elem.emoji} ${elem.name} ${animal.emoji} ${animal.name}`,
    resultEmoji: animal.emoji,
    crystal: animal.crystal,
    brief: `${animal.brief} Стихия ${elem.name}: ${elem.brief}`,
    teaser: animal.teaser,
    color: "from-red-900/30 to-red-700/10",
  });

  // 3. Numerology — Life Path
  const lp = lifePathNumber(year, month, day);
  const lpData = LIFE_PATH_DATA[lp] ?? LIFE_PATH_DATA[9];
  results.push({
    system: "Пифагорейская нумерология",
    icon: "🔢",
    resultName: `Число ${lp} — ${lpData.name}`,
    resultEmoji: lpData.emoji,
    crystal: lpData.crystal,
    brief: lpData.brief,
    teaser: lpData.teaser,
    color: "from-violet-900/30 to-violet-700/10",
  });

  // 4. Matrix of Destiny
  const personal = matrixPersonalCode(day);
  const destiny = matrixDestinyCode(year, month, day);
  results.push({
    system: "Матрица Судьбы",
    icon: "🔮",
    resultName: `Личный код ${personal} · Код Судьбы ${destiny}`,
    resultEmoji: "🔮",
    crystal: LIFE_PATH_DATA[destiny <= 9 ? destiny : destiny <= 22 ? 9 : 9]?.crystal ?? "Аметист",
    brief: `Матрица Судьбы — русская эзотерическая система, раскрывающая глубинные программы личности. Ваш личный код ${personal} отражает характер и таланты, данные при рождении. Код Судьбы ${destiny} — главная задача этого воплощения. Камень: ${LIFE_PATH_DATA[destiny % 10 || 9]?.crystal ?? "Аметист"}.`,
    teaser: "Полная матрица: 22 аркана вашей судьбы, кармические хвосты, родовые программы, финансовый и любовный каналы с рекомендациями камней.",
    color: "from-purple-900/30 to-purple-700/10",
  });

  // 5. Celtic Tree Sign
  const treeIdx = celticTreeIndex(month, day);
  const tree = CELTIC_TREES[treeIdx];
  results.push({
    system: "Кельтский гороскоп (Огам)",
    icon: "🌳",
    resultName: `${tree.emoji} ${tree.name}`,
    resultEmoji: tree.emoji,
    crystal: tree.crystal,
    brief: tree.brief,
    teaser: tree.teaser,
    color: "from-green-900/30 to-green-700/10",
  });

  // 6. Mayan Tzolkin
  const birthDate = new Date(year, month - 1, day);
  const { sign, tone } = tzolkinPosition(birthDate);
  const mayanSign = MAYAN_SIGNS[sign];
  const mayanTone = MAYAN_TONES[tone - 1];
  results.push({
    system: "Майя Цолькин",
    icon: "🌞",
    resultName: `${mayanSign.emoji} ${mayanSign.name} · ${mayanTone.name}`,
    resultEmoji: mayanSign.emoji,
    crystal: mayanSign.crystal,
    brief: `${mayanSign.brief} Тон ${tone}: ${mayanTone.name} — ${mayanTone.meaning}.`,
    teaser: "Полный расклад Цолькин: ваш Кин, задача воплощения, скрытый союзник, гид и антипод, 20-летний цикл вашей судьбы.",
    color: "from-orange-900/30 to-orange-700/10",
  });

  // 7. Tarot Birth Card
  const tarotNum = tarotBirthCard(year, month, day);
  const tarot = TAROT_ARCANA[tarotNum] ?? TAROT_ARCANA[1];
  results.push({
    system: "Таро Рождения",
    icon: "🃏",
    resultName: `${tarot.emoji} ${tarot.name} (Аркан ${tarotNum})`,
    resultEmoji: tarot.emoji,
    crystal: tarot.crystal,
    brief: tarot.brief,
    teaser: "Полный разбор: ваш теневой аркан, ежегодный арканный прогноз, камни для каждого аркана.",
    color: "from-indigo-900/30 to-indigo-700/10",
  });

  // 8. BaZi — Year Pillar + Hour (if time given)
  const { stemIndex, branchIndex } = baziYearPillar(year, month, day);
  const stem = BAZI_STEMS[stemIndex];
  const branch = BAZI_BRANCHES[branchIndex];
  const hourBranch = BAZI_BRANCHES[baziHourBranch(hour, minute)];
  const timeInfo = form.time ? ` · Час ${hourBranch.emoji} ${hourBranch.name} (${hourBranch.hours})` : "";
  results.push({
    system: "Бацзы (四柱命理)",
    icon: "☯️",
    resultName: `${stem.emoji} ${stem.name} ${branch.emoji} ${branch.name}${timeInfo}`,
    resultEmoji: stem.emoji,
    crystal: stem.crystal,
    brief: `Ваш Небесный Ствол: ${stem.name} (${stem.element}) — ${stem.brief} Земная Ветвь года: ${branch.emoji} ${branch.name}. Камень-проводник вашей стихии: ${stem.crystal}.${form.time ? ` Столп часа ${hourBranch.name} раскрывает скрытые таланты и ресурсы.` : ""}`,
    teaser: "Полный Бацзы: все 4 столпа (год, месяц, день, час), дневной мастер, пять стихий баланс, удачные годы и периоды испытаний.",
    color: "from-cyan-900/30 to-cyan-700/10",
  });

  // 9. Gene Keys
  const gene = getGeneKeyProfile(year, month, day, hour, minute);
  results.push({
    system: "Генные ключи",
    icon: "🧬",
    resultName: `Ключ ${gene.key} · Линия ${gene.line} (${gene.lineName})`,
    resultEmoji: "🧬",
    crystal: gene.crystal,
    brief: `Ваш Генный ключ ${gene.key} раскрывает путь от тени «${gene.shadow}» к дару «${gene.gift}» и высшему состоянию «${gene.siddhi}». Линия ${gene.line} показывает социальную роль: ${gene.lineName}. Камень поддержки: ${gene.crystal}.`,
    teaser: "Полный профиль Генных ключей: Activation Sequence, Venus Sequence, Pearl Sequence и связка с денежным и отношенческим кодом.",
    color: "from-sky-900/30 to-sky-700/10",
  });

  // 10. Egyptian Horoscope
  const egyptSign = getEgyptianSign(month, day);
  results.push({
    system: "Египетский гороскоп",
    icon: "𓂀",
    resultName: `${egyptSign.emoji} ${egyptSign.name}`,
    resultEmoji: egyptSign.emoji,
    crystal: egyptSign.crystal,
    brief: egyptSign.brief,
    teaser: "Полный египетский разбор: ваше послание от богов, сакральный камень фараонов, магические практики вашего покровителя.",
    color: "from-yellow-900/30 to-yellow-700/10",
  });

  // 11. Druid Horoscope
  const druidAnimal = getDruidAnimal(month, day);
  results.push({
    system: "Друидский гороскоп",
    icon: "🦎",
    resultName: `${druidAnimal.emoji} ${druidAnimal.name}`,
    resultEmoji: druidAnimal.emoji,
    crystal: druidAnimal.crystal,
    brief: druidAnimal.brief,
    teaser: "Полный друидский разбор: ваше священное животное, дерево-наставник, камни силы и кельтские ритуалы для вашего знака.",
    color: "from-emerald-900/30 to-emerald-700/10",
  });

  // 12. Jyotish (Vedic astrology)
  const jyotish = getJyotishProfile(year, month, day, hour, minute);
  results.push({
    system: "Джйотиш (Ведическая астрология)",
    icon: "🕉️",
    resultName: `${jyotish.rashi.emoji} ${jyotish.rashi.name} · ${jyotish.nakshatra.emoji} ${jyotish.nakshatra.name} (пада ${jyotish.pada})`,
    resultEmoji: jyotish.rashi.emoji,
    crystal: jyotish.nakshatra.crystal,
    brief: `Сидеральный знак — ${jyotish.rashi.name}, управитель — ${jyotish.rashi.planet}. ${jyotish.rashi.brief} Накшатра ${jyotish.nakshatra.name} (планета ${jyotish.nakshatra.ruler}): ${jyotish.nakshatra.brief} Камень накшатры: ${jyotish.nakshatra.crystal}.`,
    teaser: "Полный Джйотиш: натальная карта с домами, даши и антардаши, мухурта для важных событий, уточнённые геммологические рекомендации.",
    color: "from-rose-900/30 to-rose-700/10",
  });

  return results;
}

// ============================================================
// Jyotish (Vedic astrology) — sidereal, Lahiri ayanamsha
// ============================================================
const VEDIC_RASHIS = [
  { name: "Меша (Овен)",        emoji: "🐏", planet: "Марс",      crystal: "Красный коралл",     brief: "Меша — огненная раши Марса. Природная смелость, лидерство и способность начинать с нуля. Прямолинейность действия." },
  { name: "Вришабха (Телец)",     emoji: "🐂", planet: "Венера",    crystal: "Алмаз",              brief: "Вришабха — земная раши Венеры. Устойчивость, терпение, богатство восприятия, связь с красотой и материей." },
  { name: "Митхуна (Близнецы)",   emoji: "⚕️", planet: "Меркурий",  crystal: "Изумруд",            brief: "Митхуна — раши Меркурия. Интеллект, коммуникация, двойственность, способность видеть все стороны." },
  { name: "Карка (Рак)",          emoji: "🦀", planet: "Луна",      crystal: "Жемчуг",            brief: "Карка — водная раши Луны. Интуиция, эмоциональная глубина, связь с родом и домом." },
  { name: "Симха (Лев)",          emoji: "🦁", planet: "Солнце",    crystal: "Рубин",              brief: "Симха — огненная раши Солнца. Природное достоинство, щедрость, харизма." },
  { name: "Канья (Дева)",         emoji: "🌾", planet: "Меркурий",  crystal: "Изумруд",            brief: "Канья — земная раши Меркурия. Анализ, совершенство, служение, природная дотошность и мастерство." },
  { name: "Тула (Весы)",          emoji: "⚖️", planet: "Венера",    crystal: "Алмаз",              brief: "Тула — воздушная раши Венеры. Гармония, справедливость, дипломатия, красота." },
  { name: "Вришчика (Скорпион)",  emoji: "🦂", planet: "Марс/Кету",  crystal: "Лабрадорит",         brief: "Вришчика — водная раши Марса. Глубина, трансформация, скрытая сила." },
  { name: "Дхану (Стрелец)",      emoji: "🏹", planet: "Юпитер",    crystal: "Жёлтый сапфир",    brief: "Дхану — огненная раши Юпитера. Мудрость, философия, экспансия." },
  { name: "Макара (Козерог)",     emoji: "🐐", planet: "Сатурн",    crystal: "Синий сапфир",     brief: "Макара — земная раши Сатурна. Дисциплина, упорство, практичность." },
  { name: "Кумбха (Водолей)",     emoji: "🏺", planet: "Сатурн/Раху", crystal: "Синий сапфир",     brief: "Кумбха — воздушная раши Сатурна. Гуманизм, оригинальность, видение будущего." },
  { name: "Меена (Рыбы)",          emoji: "🐟", planet: "Юпитер",    crystal: "Жёлтый сапфир",    brief: "Меена — водная раши Юпитера. Духовность, интуиция, связь с тонким миром." },
];

const NAKSHATRA_DATA = [
  { name: "Ашвини", emoji: "🐎", ruler: "Кету",      crystal: "Кошачий глаз",    brief: "Ашвини — накшатра быстрого старта и исцеления. Способность мгновенно действовать, природный дар обновления." },
  { name: "Бхарани", emoji: "🌸", ruler: "Венера",    crystal: "Белый сапфир",    brief: "Бхарани — накшатра, управляемая Ямой (дхарма, граница) и Венерой. Творческая сила, способность вынашивать новое, связь с жизнью и смертью. Белый сапфир — камень ясности Венеры." },
  { name: "Криттика", emoji: "🔥", ruler: "Солнце",    crystal: "Рубин",             brief: "Криттика — огненная накшатра очищения. Острый ум, прямота, способность отсекать лишнее." },
  { name: "Рохини",   emoji: "🌿", ruler: "Луна",      crystal: "Жемчуг",           brief: "Рохини — самая благоприятная накшатра Луны. Красота, плодородие, творчество, природное притяжение." },
  { name: "Мригашира", emoji: "🦌", ruler: "Марс",      crystal: "Красный коралл",   brief: "Мригашира — накшатра поиска. Жажда знания, деликатность, способность находить красоту в деталях." },
  { name: "Ардра",    emoji: "💫", ruler: "Раху",       crystal: "Гессонит",         brief: "Ардра — накшатра шторма. Интеллектуальная мощь, преобразование через кризис." },
  { name: "Пунарвасу",emoji: "🏠", ruler: "Юпитер",    crystal: "Жёлтый сапфир",  brief: "Пунарвасу — накшатра возвращения. Оптимизм, восстановление, нахождение пути домой." },
  { name: "Пушья",   emoji: "⭐", ruler: "Сатурн",    crystal: "Синий сапфир",   brief: "Пушья — самая благоприятная для духовного роста. Питание, щедрость, дар заботы о других." },
  { name: "Ашлеша",  emoji: "🐍", ruler: "Меркурий",  crystal: "Изумруд",          brief: "Ашлеша — накшатра змеи. Мудрость кундалини, интуиция, способность проникать в суть." },
  { name: "Магха",    emoji: "👑", ruler: "Кету",      crystal: "Кошачий глаз",   brief: "Магха — царская накшатра предков. Достоинство, природный авторитет, связь с родовой силой." },
  { name: "Пурвафалгуни",emoji:"💃",ruler:"Венера",crystal:"Белый сапфир",brief:"Пурвафалгуни — накшатра радости. Творчество, наслаждение жизнью, щедрость." },
  { name: "Уттарафалгуни",emoji:"☀️",ruler:"Солнце",crystal:"Рубин",brief:"Уттарафалгуни — накшатра покровителя. Благородство, ответственность, защита и поддержка." },
  { name: "Хаста",    emoji: "✋", ruler: "Луна",      crystal: "Жемчуг",           brief: "Хаста — накшатра умелых рук. Мастерство, дипломатия, способность создавать прекрасное." },
  { name: "Читра",    emoji: "💎", ruler: "Марс",      crystal: "Бриллиант",         brief: "Читра — накшатра блеска. Природная яркость, эстетика, способность создавать великолепие." },
  { name: "Свати",    emoji: "🌱", ruler: "Раху",       crystal: "Гессонит",         brief: "Свати — накшатра независимости. Свобода, гибкость, способность процветать в любых условиях." },
  { name: "Вишакха",  emoji: "⚡", ruler: "Юпитер",    crystal: "Жёлтый сапфир",  brief: "Вишакха — накшатра достижения цели. Упорство, амбиции, огненная решимость." },
  { name: "Анурадха",  emoji: "🌹", ruler: "Сатурн",    crystal: "Синий сапфир",   brief: "Анурадха — накшатра дружбы. Преданность, способность создавать глубокие союзы." },
  { name: "Джьештха",  emoji: "🛡️", ruler: "Меркурий",  crystal: "Изумруд",          brief: "Джьештха — накшатра старшего. Лидерство, защита слабых, природный авторитет." },
  { name: "Мула",     emoji: "🌿", ruler: "Кету",      crystal: "Кошачий глаз",   brief: "Мула — накшатра корня. Способность доходить до сути, освобождение через разрушение иллюзий." },
  { name: "Пурвашадха",emoji:"🌊",ruler:"Венера",crystal:"Белый сапфир",brief:"Пурвашадха — накшатра вод. Непоколебимость убеждений, смелость, очищающая сила." },
  { name: "Уттарашадха",emoji:"🏔️",ruler:"Солнце",crystal:"Рубин",brief:"Уттарашадха — накшатра окончательной победы. Праведность, честность, достижение через благородство." },
  { name: "Шравана",  emoji: "👂", ruler: "Луна",      crystal: "Жемчуг",           brief: "Шравана — накшатра слушателя. Способность слышать невысказанное, передача мудрости." },
  { name: "Дхаништха",emoji:"🥁",ruler:"Марс",crystal:"Красный коралл",brief:"Дхаништха — накшатра богатства. Природная музыкальность, ритм жизни, способность притягивать изобилие." },
  { name: "Шатабхиша",emoji:"✨",ruler:"Раху",crystal:"Гессонит",brief:"Шатабхиша — накшатра сотни звёзд. Исцеление, мистерии, способность скрывать и раскрывать." },
  { name: "Пурвабхадра",emoji:"⚔️",ruler:"Юпитер",crystal:"Жёлтый сапфир",brief:"Пурвабхадра — накшатра огненного меча. Духовный воин, трансформация через огонь аскезы." },
  { name: "Уттарабхадра",emoji:"🐍",ruler:"Сатурн",crystal:"Синий сапфир",brief:"Уттарабхадра — накшатра глубин. Мудрость змея, равновесие во всех состояниях." },
  { name: "Ревати",    emoji: "🐟", ruler: "Меркурий",  crystal: "Изумруд",          brief: "Ревати — накшатра завершения цикла. Забота, питание, проводник в новый цикл." },
];

function getJyotishProfile(year: number, month: number, day: number, hour: number, minute: number) {
  const A = Math.floor((14 - month) / 12);
  const Y = year + 4800 - A;
  const M = month + 12 * A - 3;
  const JD = day + Math.floor((153 * M + 2) / 5) + 365 * Y
    + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400)
    - 32045 + (hour + minute / 60 - 12) / 24;
  const n = JD - 2451545.0;
  const Ldeg = ((280.460 + 0.9856474 * n) % 360 + 360) % 360;
  const gDeg = ((357.528 + 0.9856003 * n) % 360 + 360) % 360;
  const g = gDeg * (Math.PI / 180);
  let lambda = Ldeg + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  lambda = ((lambda % 360) + 360) % 360;
  const yearFrac = year + (month - 0.5) / 12;
  const ayanamsha = 22.460 + (yearFrac - 1900) * 0.01397;
  const sidLambda = ((lambda - ayanamsha) % 360 + 360) % 360;
  const rashiIdx = Math.floor(sidLambda / 30) % 12;
  const nakIdx = Math.floor(sidLambda / (360 / 27)) % 27;
  const pada = Math.floor((sidLambda % (360 / 27)) / (360 / 27 / 4)) + 1;
  return {
    rashi: VEDIC_RASHIS[rashiIdx],
    nakshatra: NAKSHATRA_DATA[nakIdx],
    pada,
    rashiIdx,
    nakIdx,
    sidLambda,
  };
}

// ============================================================
// Egyptian Horoscope (simplified by date ranges)
// ============================================================
type SimpleSign = { name: string; emoji: string; crystal: string; brief: string };

function getEgyptianSign(month: number, day: number): SimpleSign {
  const md = month * 100 + day;
  if ((md >= 101 && md <= 107) || (md >= 619 && md <= 628) || (md >= 901 && md <= 907) || (md >= 1118 && md <= 1126))
    return { name: "Нил", emoji: "🌊", crystal: "Аквамарин", brief: "Нил — источник жизни. Вы несёте обновление и питаете всё вокруг. Ваш путь — быть источником для других. Аквамарин поддерживает природную щедрость." };
  if ((md >= 108 && md <= 121) || (md >= 201 && md <= 211))
    return { name: "Амон-Ра", emoji: "☀️", crystal: "Цитрин", brief: "Амон-Ра — творец и хранитель. Вы наделены солнечной силой и способностью вдохновлять других. Цитрин усиливает вашу природную харизму и творческий импульс." };
  if ((md >= 122 && md <= 131) || (md >= 908 && md <= 922))
    return { name: "Мут", emoji: "🦅", crystal: "Лунный камень", brief: "Мут — Мать богов. Вы несёте архетип матери и хранительницы. Ваша сила в глубокой заботе и мудрости. Лунный камень поддерживает вашу природную нежность." };
  if ((md >= 212 && md <= 229) || (md >= 820 && md <= 831))
    return { name: "Геб", emoji: "🌍", crystal: "Нефрит", brief: "Геб — бог Земли. Вы заземлены, надёжны и связаны с природными ритмами. Нефрит поддерживает вашу природную гармонию с землёй." };
  if ((md >= 301 && md <= 310) || (md >= 1127 && md <= 1218))
    return { name: "Осирис", emoji: "⚖️", crystal: "Лазурит", brief: "Осирис — бог возрождения и справедливости. Вы умеете умирать и возрождаться, находя смысл в самых тёмных опытах. Лазурит поддерживает связь с высшей мудростью." };
  if ((md >= 311 && md <= 331) || (md >= 1018 && md <= 1029) || (md >= 1219))
    return { name: "Исида", emoji: "🌺", crystal: "Лапис лазурь", brief: "Исида — богиня магии и исцеления. Вы обладаете природным даром исцеления и магической интуицией. Лапис лазурь открывает ваши магические способности." };
  if ((md >= 401 && md <= 419) || (md >= 1108 && md <= 1117))
    return { name: "Тот", emoji: "🪶", crystal: "Флюорит", brief: "Тот — бог мудрости и письма. Вы посредник между знанием и миром. Ваш дар — понимать глубокое и передавать его ясно. Флюорит структурирует ваш интеллект." };
  if ((md >= 420 && md <= 507) || (md >= 812 && md <= 819))
    return { name: "Гор", emoji: "🦅", crystal: "Тигровый глаз", brief: "Гор — сокол-победитель. Вы обладаете орлиным видением и природной силой победителя. Тигровый глаз усиливает вашу природную смелость и целеустремлённость." };
  if ((md >= 508 && md <= 527) || (md >= 629 && md <= 713))
    return { name: "Анубис", emoji: "🐺", crystal: "Обсидиан", brief: "Анубис — проводник душ. Вы умеете находить путь в темноте и помогать другим в переходные периоды. Обсидиан защищает вас в пограничных состояниях." };
  if ((md >= 528 && md <= 618) || (md >= 928 && md <= 1002))
    return { name: "Сет", emoji: "⚡", crystal: "Гранат", brief: "Сет — бог трансформирующего хаоса. Вы несёте в себе силу перемен и не боитесь разрушать устаревшее. Гранат поддерживает вашу природную огненную энергию." };
  if ((md >= 714 && md <= 728) || (md >= 923 && md <= 927) || (md >= 1003 && md <= 1017))
    return { name: "Бастет", emoji: "🐱", crystal: "Малахит", brief: "Бастет — богиня радости и красоты. Вы несёте игривость, грацию и умение наслаждаться жизнью. Малахит поддерживает вашу природную элегантность." };
  if ((md >= 729 && md <= 811) || (md >= 1030 && md <= 1107))
    return { name: "Сехмет", emoji: "🦁", crystal: "Красный гранат", brief: "Сехмет — богиня войны и исцеления. Вы обладаете двойственной природой воина и целителя. Красный гранат поддерживает вашу природную силу и витальность." };
  return { name: "Исида", emoji: "🌺", crystal: "Лапис лазурь", brief: "Исида — богиня магии и исцеления." };
}

// ============================================================
// Druid Animal Horoscope
// ============================================================
function getDruidAnimal(month: number, day: number): SimpleSign {
  const md = month * 100 + day;
  const animals: { from: number; to: number; name: string; emoji: string; crystal: string; brief: string }[] = [
    { from: 1224, to: 9999, name: "Олень", emoji: "🦌", crystal: "Нефрит", brief: "Олень — благородство, интуиция, природная элегантность. Вы двигаетесь по жизни с достоинством и чувствуете опасность раньше других. Нефрит поддерживает вашу природную грациозность." },
    { from: 101, to: 120, name: "Кошка", emoji: "🐱", crystal: "Малахит", brief: "Кошка — независимость, мистика, ночное знание. Вы идёте своим путём и видите то, что скрыто от других. Малахит поддерживает вашу природную загадочность." },
    { from: 121, to: 217, name: "Змея", emoji: "🐍", crystal: "Молдавит", brief: "Змея — мудрость, трансформация, скрытая сила. Вы несёте мудрость веков и умеете обновляться. Молдавит ускоряет ваш природный эволюционный импульс." },
    { from: 218, to: 317, name: "Лиса", emoji: "🦊", crystal: "Цитрин", brief: "Лиса — хитрость, адаптивность, быстрый ум. Вы видите нестандартные решения там, где другие заходят в тупик. Цитрин поддерживает вашу природную смекалку." },
    { from: 318, to: 414, name: "Бык", emoji: "🐂", crystal: "Чёрный турмалин", brief: "Бык — сила, упорство, надёжность. Вы строите медленно, но на века. Чёрный турмалин укрепляет вашу природную устойчивость." },
    { from: 415, to: 512, name: "Морской конёк", emoji: "🦄", crystal: "Аквамарин", brief: "Морской конёк — уникальность, магия, нежная сила. Вы редкий тип — ваша сила в том, что вы ни на кого не похожи. Аквамарин поддерживает вашу природную уникальность." },
    { from: 513, to: 609, name: "Олень", emoji: "🦌", crystal: "Розовый кварц", brief: "Олень (весенний) — возрождение, нежность, связь с природой. Вы несёте обновляющую энергию и умеете видеть красоту в простом. Розовый кварц открывает сердце." },
    { from: 610, to: 707, name: "Конь", emoji: "🐎", crystal: "Гранат", brief: "Конь — свобода, скорость, дух. Вы рождены в движении — ваша стихия — широкое пространство и скорость. Гранат поддерживает ваш природный огонь." },
    { from: 708, to: 804, name: "Лосось", emoji: "🐟", crystal: "Лапис лазурь", brief: "Лосось — мудрость, возвращение к истокам, интуиция. Вы несёте мудрость предков и умеете находить дорогу домой. Лапис лазурь усиливает интуитивный навигатор." },
    { from: 805, to: 901, name: "Лебедь", emoji: "🦢", crystal: "Лунный камень", brief: "Лебедь — красота, трансформация, духовная элегантность. Вы несёте в себе красоту внутреннего перерождения. Лунный камень усиливает вашу природную утончённость." },
    { from: 902, to: 929, name: "Ворон", emoji: "🪶", crystal: "Обсидиан", brief: "Ворон — магия, пророчество, связь с миром духов. Вы обладаете природным даром ясновидения. Обсидиан защищает вас в мистических путешествиях." },
    { from: 930, to: 1027, name: "Белый олень", emoji: "🦌", crystal: "Горный хрусталь", brief: "Белый олень — священность, редкость, чистота. Редкая душа с особой миссией. Горный хрусталь усиливает природную ясность." },
    { from: 1028, to: 1124, name: "Сова", emoji: "🦉", crystal: "Флюорит", brief: "Сова — ночная мудрость, истина, видение в темноте. Вы знаете то, что скрыто от дневного взора. Флюорит помогает структурировать ваше тайное знание." },
    { from: 1125, to: 1222, name: "Олень (зимний)", emoji: "🦌", crystal: "Аметист", brief: "Зимний олень — мудрость, путеводная звезда, защита. Вы ведёте других через тьму к свету. Аметист поддерживает вашу природную роль наставника." },
    { from: 1223, to: 1223, name: "Сова зимняя", emoji: "🦉", crystal: "Молдавит", brief: "Зимняя сова — мудрость солнцестояния, рождение света. Вы несёте особую миссию — являть свет в самую тёмную ночь." },
  ];

  for (let i = animals.length - 1; i >= 0; i--) {
    if (md >= animals[i].from) return animals[i];
  }
  return animals[0];
}

// ============================================================
// UI
// ============================================================
const CRYSTAL_BOT_LINK = "https://t.me/The_magic_of_stones_bot?start=crystal_";

const SYSTEMS_PREVIEW = [
  { icon: "🌟", name: "Западная астрология", hint: "Ваш знак зодиака, раскрытый глубже" },
  { icon: "🐉", name: "Китайский гороскоп", hint: "Ваше животное + стихия 60-летнего цикла" },
  { icon: "🔢", name: "Нумерология", hint: "Число жизненного пути и архетип личности" },
  { icon: "🔮", name: "Матрица Судьбы", hint: "Ваши кармические коды и задачи воплощения" },
  { icon: "🌳", name: "Кельтский огам", hint: "Ваше сакральное дерево по кельтскому календарю" },
  { icon: "🌞", name: "Майя Цолькин", hint: "Ваш Кин и тон из 260-дневного календаря майя" },
  { icon: "🃏", name: "Таро рождения", hint: "Ваш главный аркан — карта судьбы" },
  { icon: "☯️", name: "Бацзы", hint: "Четыре столпа судьбы китайской астрологии" },
  { icon: "🧬", name: "Генные ключи", hint: "Тень, Дар и Сиддхи вашего ДНК-кода" },
  { icon: "𓂀", name: "Египетский гороскоп", hint: "Ваш бог-покровитель из пантеона Древнего Египта" },
  { icon: "🦎", name: "Друидский гороскоп", hint: "Ваше священное животное-тотем по кельтской традиции" },
  { icon: "🕉️", name: "Джйотиш (Ведическая астрология)", hint: "Ваша сидеральная раши и накшатра (лунная обитель) по ведической традиции" },
];

export default function DivinationPortrait() {
  const [form, setForm] = useState<FormData>({ name: "", date: "", time: "", city: "" });
  const [results, setResults] = useState<SystemResult[] | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Портрет Судьбы — 11 систем предсказания | Magic Stone";
    const setMeta = (attr: "name" | "property", key: string, val: string) => {
      let tag = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attr, key); document.head.appendChild(tag); }
      tag.content = val;
    };
    const desc = "Бесплатный персональный портрет судьбы по 11 системам: западная астрология, китайский гороскоп, нумерология, Матрица Судьбы, кельтский огам, Майя Цолькин, Таро, Бацзы, Генные ключи, египетский и друидский гороскоп. С рекомендациями камней для каждого архетипа.";
    setMeta("name", "description", desc);
    setMeta("property", "og:title", "Портрет Судьбы — 11 систем предсказания");
    setMeta("property", "og:description", desc);
    let canonical = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://magic-stone.com/portrait";
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) { setError("Введите дату рождения"); return; }
    setError("");
    const portrait = buildPortrait(form);
    setResults(portrait);
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [form]);

  const allCrystals = results ? [...new Set(results.map((r) => r.crystal))].slice(0, 6) : [];
  const integratedSummary = results ? buildIntegratedSummary(results) : "";
  const fullPreview = results ? buildFullPreview(results, form) : [];

  return (
    <main className="min-h-screen bg-background">
      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Портрет Судьбы — 11 систем",
            description: "Бесплатный персональный портрет по 11 системам предсказания с рекомендациями камней",
            url: "https://magic-stone.com/portrait",
          }),
        }}
      />

      {/* Back */}
      <div className="container mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 py-14 text-center">
        <AnimateOnScroll>
          {/* Glowing orb */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600/40 via-primary/30 to-amber-500/30 blur-xl animate-pulse" />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-violet-900/80 via-primary/40 to-amber-900/60 flex items-center justify-center shadow-2xl shadow-primary/30 border border-primary/20">
              <Sparkles className="w-14 h-14 text-amber-300 drop-shadow-lg" />
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.22em] text-primary mb-3 font-medium">Первый в своём роде</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-5 leading-tight">
            Портрет Судьбы
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            Ваша судьба записана одновременно в <strong className="text-foreground">11 древних системах мира.</strong><br className="hidden md:block" />
            Никто раньше не собирал их все в одном месте — до сейчас.
          </p>

          {/* Value badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
              🆓 Бесплатно: краткий портрет + камни
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-600/20 border border-amber-500/40 text-amber-300 text-sm font-medium">
              ✨ Полный расклад — 499 ₽
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium">
              ⚡ Мгновенно, без регистрации
            </span>
          </div>

          {/* Unique feature callout */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-8">
            <div className="bg-card/60 border border-border/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-semibold text-foreground text-sm mb-1">11 систем — одна правда</h3>
              <p className="text-xs text-muted-foreground">Восток и Запад, древность и наука — все системы говорят о вас одновременно. Совпадения шокируют.</p>
            </div>
            <div className="bg-card/60 border border-border/50 rounded-xl p-4">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="font-semibold text-foreground text-sm mb-1">Камни для каждого архетипа</h3>
              <p className="text-xs text-muted-foreground">Для каждой из 11 систем — личный камень-резонатор. Не просто список, а точное попадание в вашу природу.</p>
            </div>
            <div className="bg-card/60 border border-border/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🧩</div>
              <h3 className="font-semibold text-foreground text-sm mb-1">Синтез — главный инсайт</h3>
              <p className="text-xs text-muted-foreground">После 11 карточек — единый синтез всех систем. Одно ёмкое описание вашего пути, которого не даст ни один отдельный гороскоп.</p>
            </div>
          </div>

          {/* Systems preview grid */}
          <div className="max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Что входит в ваш портрет</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SYSTEMS_PREVIEW.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs hover:border-primary/30 hover:text-foreground transition-colors cursor-default" title={s.hint}>
                  <span>{s.icon}</span> {s.name}
                </span>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Form */}
      <section className="container mx-auto px-4 pb-14">
        <AnimateOnScroll>
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-card border border-primary/20 rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/10"
          >
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Введите данные рождения</h2>
              <p className="text-sm text-muted-foreground">Только дата обязательна — остальное улучшает точность</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm text-muted-foreground mb-1 block">Ваше имя <span className="text-xs opacity-60">(необязательно)</span></Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Как вас зовут?"
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-sm text-muted-foreground mb-1 block">Дата рождения <span className="text-primary">*</span></Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  required
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm text-muted-foreground mb-1 block">
                  Время рождения <span className="text-xs opacity-60">(для Бацзы + Генных ключей)</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-sm text-muted-foreground mb-1 block">
                  Место рождения <span className="text-xs opacity-60">(для полного расклада с асцендентом)</span>
                </Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="Город рождения"
                  className="bg-background"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full py-6 text-base font-semibold bg-gradient-to-r from-violet-600 to-amber-600 hover:from-violet-500 hover:to-amber-500 text-white border-0 shadow-lg shadow-violet-900/30">
                <Sparkles className="w-5 h-5 mr-2" />
                Раскрыть мой портрет судьбы →
              </Button>
            </div>
          </form>
        </AnimateOnScroll>
      </section>

      {/* Results */}
      {results && (
        <section id="results" className="container mx-auto px-4 pb-16">
          <AnimateOnScroll>
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-2">
              {form.name ? `Портрет судьбы: ${form.name}` : "Ваш портрет судьбы"}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Дата рождения: {form.date.split("-").reverse().join(".")}
              {form.time && ` · ${form.time}`}
              {form.city && ` · ${form.city}`}
            </p>

            {/* Crystal summary card */}
            <div className="max-w-2xl mx-auto mb-10 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30 rounded-2xl p-6 text-center">
              <Gem className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold mb-2">Ваши ключевые камни</h3>
              <p className="text-muted-foreground text-sm mb-3">Собраны по всем 11 системам вашего портрета</p>
              <div className="flex flex-wrap justify-center gap-2">
                {allCrystals.map((c) => (
                  <a
                    key={c}
                    href={`${CRYSTAL_BOT_LINK}${encodeURIComponent(c)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-full text-sm font-medium hover:bg-primary/30 transition-colors"
                  >
                    💎 {c}
                  </a>
                ))}
              </div>
            </div>

            <div className="max-w-3xl mx-auto mb-10 bg-card border border-primary/20 rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">Компиляция всех систем</p>
              <h3 className="font-serif text-2xl font-bold mb-3">Общий синтез портрета</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{integratedSummary}</p>
            </div>

            {/* System cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {results.map((res, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${res.color} border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-colors`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{res.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{res.system}</p>
                      <h3 className="font-serif text-lg font-bold text-foreground leading-tight">{res.resultName}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Gem className="w-4 h-4 text-primary/70 flex-shrink-0" />
                    <span className="text-sm text-primary font-medium">{res.crystal}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {expanded[idx] ? res.brief : `${res.brief.slice(0, 120)}${res.brief.length > 120 ? "…" : ""}`}
                  </p>

                  {res.brief.length > 120 && (
                    <button
                      onClick={() => setExpanded((e) => ({ ...e, [idx]: !e[idx] }))}
                      className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      {expanded[idx] ? <><ChevronUp className="w-3 h-3" /> Свернуть</> : <><ChevronDown className="w-3 h-3" /> Читать полностью</>}
                    </button>
                  )}

                  {res.teaser && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-start gap-2 text-xs text-amber-400/80">
                        <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{res.teaser}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Paid CTA */}
            <div className="max-w-2xl mx-auto mt-10">
              <div className="bg-gradient-to-br from-amber-950/40 to-primary/20 border border-amber-700/40 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  Полный развёрнутый расклад
                </h3>
                <p className="text-muted-foreground mb-2">
                  Для каждой из 10 систем — детальный разбор на 3–5 страниц:
                </p>
                <ul className="text-sm text-muted-foreground mb-6 space-y-1 text-left max-w-sm mx-auto">
                  <li>🌟 Полная натальная карта с асцендентом и луной</li>
                  <li>🔮 Полная Матрица Судьбы (22 аркана вашей жизни)</li>
                  <li>☯️ Четыре столпа Бацзы + прогноз удачных лет</li>
                  <li>🌞 Полный Цолькин-профиль с волновым заклинанием</li>
                  <li>💎 Индивидуальная подборка камней под каждую задачу</li>
                  <li>📅 Ваши лучшие и сложные периоды до 2030 года</li>
                </ul>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button asChild className="w-full sm:w-auto min-w-[280px] py-6 text-base font-semibold bg-amber-600 hover:bg-amber-500 text-white border-0">
                    <a href={TELEGRAM_BOT} target="_blank" rel="noopener noreferrer">
                      Получить полный расклад — 499 ₽
                    </a>
                  </Button>
                  <Button variant="outline" type="button" className="w-full sm:w-auto min-w-[280px] py-6 text-base font-semibold" onClick={() => setShowPreview((value) => !value)}>
                    {showPreview ? "Скрыть предпросмотр" : "Посмотреть, что войдёт в полный расклад"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Кнопка ведёт в Telegram-бота сразу к оплате услуги. Ниже можно открыть предпросмотр полного расклада без оплаты.
                </p>
              </div>
            </div>

            {showPreview && (
              <div className="max-w-3xl mx-auto mt-6 bg-card border border-border rounded-2xl p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">Предпросмотр для владельца сайта</p>
                <h3 className="font-serif text-2xl font-bold mb-4">Как выглядит полный расклад</h3>
                <div className="space-y-4 text-left">
                  {fullPreview.map((section) => (
                    <div key={section.title} className="border border-border rounded-xl p-4">
                      <h4 className="font-semibold mb-2">{section.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimateOnScroll>
        </section>
      )}

      {/* SEO content */}
      <section className="container mx-auto px-4 pb-16 max-w-3xl">
        <AnimateOnScroll>
          <div className="prose prose-invert max-w-none">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">О системах предсказания</h2>
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>
                <strong className="text-foreground">Западная астрология</strong> — древнейшая система, основанная на положении Солнца в зодиакальных созвездиях. 12 знаков зодиака описывают базовые архетипы личности и судьбы.
              </p>
              <p>
                <strong className="text-foreground">Китайский гороскоп (Шэнсяо)</strong> — 12-летний цикл животных, каждое из которых несёт уникальные качества. В сочетании с 5 стихиями (木水火土金) образует 60-летний цикл судьбы.
              </p>
              <p>
                <strong className="text-foreground">Матрица Судьбы</strong> — современная русская эзотерическая система, основанная на нумерологии карт Таро. Раскрывает кармические программы, таланты и задачи воплощения.
              </p>
              <p>
                <strong className="text-foreground">Бацзы (四柱命理)</strong> — «Четыре столпа судьбы» — китайская астрология, использующая год, месяц, день и час рождения для построения полной картины жизни.
              </p>
              <p>
                <strong className="text-foreground">Майя Цолькин</strong> — 260-дневный календарь майя из 20 знаков дней и 13 тонов. Открывает вашу духовную миссию и энергетический профиль.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </main>
  );
}
