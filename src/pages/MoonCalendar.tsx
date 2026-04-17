import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/AnimateOnScroll";

type MoonPhase = {
  name: string;
  icon: string;
  actions: string[];
  avoid: string[];
  stones: string[];
  description: string;
};

const moonPhases: MoonPhase[] = [
  {
    name: "Новолуние",
    icon: "🌑",
    actions: [
      "Программирование камней на новые намерения",
      "Очищение камней в проточной воде",
      "Медитация с камнями на постановку целей",
      "Подбор новых камней для предстоящего цикла",
    ],
    avoid: [
      "Активная энергетическая работа с камнями",
      "Передача камней другим людям",
    ],
    stones: ["Лунный камень", "Обсидиан", "Лабрадорит"],
    description: "Новолуние — время тишины, обнуления и посева новых намерений. Энергия минимальна, что делает этот период идеальным для очищения камней от накопленной информации и закладки свежих программ. Камни, очищенные в новолуние, обретают особую чистоту и готовность к работе.",
  },
  {
    name: "Растущая луна",
    icon: "🌒",
    actions: [
      "Зарядка камней на привлечение желаемого",
      "Работа с камнями на усиление ресурсов",
      "Ношение камней для привлечения изобилия",
      "Создание кристаллических сеток на рост",
    ],
    avoid: [
      "Ритуалы отпускания и избавления",
      "Очищение камней от программ",
    ],
    stones: ["Цитрин", "Пирит", "Тигровый глаз", "Гранат"],
    description: "Растущая луна — период накопления и роста энергии. Это лучшее время для работы с камнями, направленной на привлечение нового: денег, отношений, здоровья, возможностей. Минералы, заряженные в этот период, усиливают созидательные намерения и помогают материализовать желаемое.",
  },
  {
    name: "Полнолуние",
    icon: "🌕",
    actions: [
      "Зарядка камней лунным светом на подоконнике",
      "Медитация с камнями для получения ответов",
      "Работа с интуитивными камнями",
      "Максимально глубокие энергетические практики",
    ],
    avoid: [
      "Программирование камней — энергия слишком интенсивна",
      "Работа с камнями при эмоциональной нестабильности",
    ],
    stones: ["Лунный камень", "Аметист", "Селенит", "Флюорит"],
    description: "Полнолуние — пик лунной энергии и самый мощный период для зарядки камней. Достаточно положить минералы на подоконник на ночь, чтобы они напитались лунным светом. Это время усиленной интуиции, когда камни третьего глаза и коронной чакры работают особенно ярко. Однако избыток энергии может усилить эмоциональную нестабильность.",
  },
  {
    name: "Убывающая луна",
    icon: "🌘",
    actions: [
      "Очищение камней от негативной энергии",
      "Работа с камнями на избавление от блоков",
      "Ритуалы отпускания с чёрным турмалином",
      "Чистка энергетического пространства с помощью шунгита",
    ],
    avoid: [
      "Программирование камней на привлечение нового",
      "Начало работы с новыми камнями",
    ],
    stones: ["Чёрный турмалин", "Шунгит", "Обсидиан", "Гематит"],
    description: "Убывающая луна — время очищения, отпускания и завершения. Энергия идёт на спад, что идеально подходит для работы с защитными и очищающими камнями. В этот период эффективно избавляться от энергетических привязок, блоков и всего, что отжило своё. Камни-защитники работают с максимальной силой.",
  },
];

const getMoonPhase = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = Math.floor(year / 100);
  let y = year - 19 * Math.floor(year / 19);
  let k = Math.floor((c - 17) / 25);
  let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * y + 15;
  i = i - 30 * Math.floor(i / 30);
  i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - y) / 11));
  let j = year + Math.floor(year / 4) + i + 2 - c + Math.floor(c / 4);
  j = j - 7 * Math.floor(j / 7);
  let l = i - j;
  let m = 3 + Math.floor((l + 40) / 44);
  let d = l + 28 - 31 * Math.floor(m / 4);

  const newMoonDate = new Date(year, m - 1, d);
  const diffDays = Math.floor((date.getTime() - newMoonDate.getTime()) / (1000 * 60 * 60 * 24));
  const lunarDay = ((diffDays % 30) + 30) % 30;

  if (lunarDay < 2 || lunarDay >= 28) return 0;
  if (lunarDay < 14) return 1;
  if (lunarDay < 16) return 2;
  return 3;
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const MoonCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPhase, setSelectedPhase] = useState<number>(getMoonPhase(new Date()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
  ];

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const days: { day: number; phase: number; isCurrentMonth: boolean }[] = [];

    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, phase: getMoonPhase(new Date(year, month - 1, prevMonthDays - i)), isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, phase: getMoonPhase(new Date(year, month, d)), isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, phase: getMoonPhase(new Date(year, month + 1, d)), isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isToday = (day: number, isCurrentMonth: boolean) =>
    isCurrentMonth && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const phaseIcons = ["🌑", "🌒", "🌕", "🌘"];
  const phaseColors = [
    "bg-secondary/50",
    "bg-primary/20",
    "bg-primary/40",
    "bg-accent/20",
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </div>

      <section className="container mx-auto px-4 py-12 text-center">
        <AnimateOnScroll>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-6 flex items-center justify-center">
            <Moon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Лунный календарь
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Планируйте работу с камнями в соответствии с лунными циклами.
            Каждая фаза луны создаёт уникальные условия для различных
            практик с минералами — от очищения до программирования.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border p-6">
            {/* Шапка месяца */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-serif text-xl font-bold text-foreground">
                {monthNames[month]} {year}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Дни недели */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Дни */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => item.isCurrentMonth && setSelectedPhase(item.phase)}
                  className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                    item.isCurrentMonth
                      ? `${phaseColors[item.phase]} hover:ring-1 hover:ring-primary/30 cursor-pointer`
                      : "opacity-30"
                  } ${isToday(item.day, item.isCurrentMonth) ? "ring-2 ring-primary" : ""}`}
                >
                  <span className="text-[10px] leading-none mb-0.5">{phaseIcons[item.phase]}</span>
                  <span className={`text-xs ${item.isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}>{item.day}</span>
                </button>
              ))}
            </div>

            {/* Легенда */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center text-xs text-muted-foreground">
              {moonPhases.map((phase, idx) => (
                <button
                  key={phase.name}
                  onClick={() => setSelectedPhase(idx)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    selectedPhase === idx ? "bg-secondary text-foreground" : "hover:text-foreground"
                  }`}
                >
                  <span>{phase.icon}</span> {phase.name}
                </button>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Описание фазы */}
      <section className="container mx-auto px-4 pb-16">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{moonPhases[selectedPhase].icon}</span>
              <h3 className="font-serif text-2xl font-bold text-foreground">{moonPhases[selectedPhase].name}</h3>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{moonPhases[selectedPhase].description}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4" /> Рекомендуемые практики
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {moonPhases[selectedPhase].actions.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✦</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-destructive mb-3">Лучше избегать</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {moonPhases[selectedPhase].avoid.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✦</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold text-foreground mb-3">Камни для этой фазы</h4>
              <div className="flex flex-wrap gap-2">
                {moonPhases[selectedPhase].stones.map((s) => (
                  <Link
                    key={s}
                    to={`/catalog/${encodeURIComponent(s)}`}
                    className="px-3 py-1.5 bg-secondary/50 rounded-full text-sm text-foreground hover:bg-primary/20 transition-colors"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </main>
  );
};

export default MoonCalendar;
