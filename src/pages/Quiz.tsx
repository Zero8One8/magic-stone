import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { crystals } from "@/data/crystals";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

type Answer = {
  label: string;
  tags: string[];
};

type Question = {
  id: number;
  question: string;
  subtitle: string;
  answers: Answer[];
};

const questions: Question[] = [
  {
    id: 1,
    question: "Что сейчас доминирует в вашем внутреннем состоянии?",
    subtitle: "Выберите то, что наиболее точно описывает ваш текущий эмоциональный фон",
    answers: [
      { label: "Тревога, беспокойство, ощущение угрозы", tags: ["Тревога", "Защита", "Страхи"] },
      { label: "Апатия, потеря смысла, эмоциональное выгорание", tags: ["Выгорание", "Усталость", "Апатия"] },
      { label: "Гнев, раздражительность, внутреннее напряжение", tags: ["Стресс", "Гнев", "Конфликты"] },
      { label: "Грусть, ощущение утраты, одиночество", tags: ["Обиды", "Потеря", "Одиночество"] },
      { label: "Рассеянность, потеря фокуса и концентрации", tags: ["Концентрация", "Ясность", "Фокус"] },
      { label: "Спокойствие, умиротворение — хочу углубить это состояние", tags: ["Гармония", "Баланс", "Медитация", "Спокойствие"] },
      { label: "Любовь, благодарность — хочу усилить и направить эту энергию", tags: ["Любовь", "Исцеление", "Сердечная", "Гармония"] },
    ],
  },
  {
    id: 2,
    question: "Какая сфера вашей жизни требует наибольшего внимания?",
    subtitle: "Определите приоритетное направление для работы с энергией",
    answers: [
      { label: "Эмоциональное здоровье и внутренний баланс", tags: ["Баланс", "Гармония", "Исцеление"] },
      { label: "Отношения — доверие, близость, принятие", tags: ["Обиды", "Потеря", "Самооценка", "Любовь"] },
      { label: "Карьера, финансы, реализация целей", tags: ["Мотивация", "Уверенность", "Успех", "Финансы"] },
      { label: "Интуиция, духовное развитие, самопознание", tags: ["Интуиция", "Ясность", "Медитация", "Мудрость"] },
      { label: "Физическое самочувствие, восстановление сил", tags: ["Здоровье", "Усталость", "Энергия", "Восстановление"] },
    ],
  },
  {
    id: 3,
    question: "Как вы ощущаете свою энергию прямо сейчас?",
    subtitle: "Честная оценка ресурсного состояния — ключ к точной рекомендации",
    answers: [
      { label: "Истощение — ресурса нет, нужна мягкая подпитка", tags: ["Усталость", "Выгорание", "Восстановление"] },
      { label: "Нестабильность — перепады, непредсказуемые эмоции", tags: ["Баланс", "Стресс", "Гармония"] },
      { label: "Блокировка — энергия есть, но она заперта внутри", tags: ["Блокировки", "Страхи", "Трансформация"] },
      { label: "Избыточность — слишком много, не могу направить", tags: ["Концентрация", "Фокус", "Заземление"] },
      { label: "Стабильность — хочу углубить практику и рост", tags: ["Интуиция", "Мудрость", "Медитация"] },
    ],
  },
  {
    id: 4,
    question: "Какой тип поддержки вам нужен от камня?",
    subtitle: "Каждый минерал работает по-разному — определите вектор",
    answers: [
      { label: "Защита — щит от негатива, энергетических атак и сглаза", tags: ["Защита", "Тревога", "Заземление"] },
      { label: "Исцеление — освобождение от старых ран, обид и травм", tags: ["Исцеление", "Обиды", "Потеря", "Трансформация"] },
      { label: "Активация — пробуждение внутренней силы и решимости действовать", tags: ["Мотивация", "Уверенность", "Энергия", "Успех"] },
      { label: "Ясность — обострение интуиции и глубинное понимание ситуации", tags: ["Ясность", "Интуиция", "Концентрация"] },
      { label: "Гармония — глубокое внутреннее спокойствие и принятие себя", tags: ["Гармония", "Баланс", "Спокойствие"] },
      { label: "Трансформация — выход на новый уровень, перезагрузка жизни", tags: ["Трансформация", "Мудрость", "Интуиция", "Медитация"] },
    ],
  },
  {
    id: 5,
    question: "Какой энергетический центр вы чувствуете наиболее ослабленным?",
    subtitle: "Если не уверены — выберите область тела, где ощущаете дискомфорт или пустоту",
    answers: [
      { label: "Муладхара (основание) — нестабильность, страх, отсутствие опоры", tags: ["Корневая"] },
      { label: "Свадхистана (низ живота) — подавленные эмоции, потеря радости и удовольствия", tags: ["Сакральная"] },
      { label: "Манипура (солнечное сплетение) — неуверенность, потеря воли и личной силы", tags: ["Солнечное сплетение"] },
      { label: "Анахата (сердце) — закрытость, обиды, недоверие к людям и миру", tags: ["Сердечная"] },
      { label: "Вишудха (горло) — трудно выражать мысли, страх быть услышанным", tags: ["Горловая"] },
      { label: "Аджна (третий глаз) — потеря интуиции, спутанность сознания", tags: ["Третий глаз"] },
      { label: "Сахасрара (макушка) — потеря связи с высшим, духовная пустота", tags: ["Коронная"] },
    ],
  },
];

function getRecommendations(selectedAnswers: Record<number, number>) {
  const allTags: string[] = [];
  for (const [qId, aIdx] of Object.entries(selectedAnswers)) {
    const q = questions.find((q) => q.id === Number(qId));
    if (q) allTags.push(...q.answers[aIdx].tags);
  }

  const scored = crystals.map((crystal) => {
    let score = 0;
    for (const tag of allTags) {
      if (crystal.problems.some((p) => p.toLowerCase() === tag.toLowerCase())) score += 3;
      if (crystal.chakras.some((c) => c.toLowerCase() === tag.toLowerCase())) score += 2;
      if (crystal.effects.some((e) => e.toLowerCase().includes(tag.toLowerCase()))) score += 1;
    }
    return { crystal, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, 3);
}

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[ёЁ]/g, "е");
}

const Quiz = () => {
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = result
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQuestion = step >= 1 && step <= 5 ? questions[step - 1] : null;

  const results = useMemo(() => {
    if (step !== 6) return [];
    return getRecommendations(answers);
  }, [step, answers]);

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [step]: answerIndex }));
    setTimeout(() => setStep((s) => s + 1), 300);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
          {step >= 1 && step <= 5 && (
            <div className="flex items-center gap-2">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i < step ? "w-8 bg-primary" : i === step - 1 ? "w-8 bg-primary/60" : "w-4 bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
          <span className="text-muted-foreground text-sm font-light">
            {step >= 1 && step <= 5 ? `${step} / 5` : ""}
          </span>
        </div>
      </div>

      <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto min-h-screen flex items-center justify-center">
        {/* Intro */}
        {step === 0 && (
          <AnimateOnScroll>
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm">
                <Sparkles className="w-4 h-4" />
                Мини-диагностика энергетического состояния
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
                Подбери свой камень
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light">
                5 вопросов о вашем состоянии. Алгоритм проанализирует ответы и подберёт минерал, 
                чья энергетическая частота наиболее резонирует с вашим запросом.
              </p>
              <p className="text-muted-foreground/60 text-sm max-w-md mx-auto">
                Основано на анализе 100 минералов по параметрам чакр, энергетического воздействия и терапевтических свойств
              </p>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Начать мини-диагностику
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </AnimateOnScroll>
        )}

        {/* Questions */}
        {currentQuestion && (
          <div className="w-full space-y-8" key={currentQuestion.id}>
            <AnimateOnScroll>
              <div className="space-y-3 text-center mb-10">
                <p className="text-primary/70 text-sm tracking-widest uppercase">
                  Вопрос {currentQuestion.id}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-light leading-snug">
                  {currentQuestion.question}
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  {currentQuestion.subtitle}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="space-y-3">
              {currentQuestion.answers.map((answer, idx) => (
                <AnimateOnScroll key={idx} delay={idx * 80}>
                  <button
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left px-6 py-5 rounded-xl border transition-all duration-300 group hover:scale-[1.01] active:scale-[0.99] ${
                      answers[currentQuestion.id] === idx
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center text-xs text-primary/70 group-hover:border-primary group-hover:text-primary transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm md:text-base leading-relaxed pt-1">
                        {answer.label}
                      </span>
                    </div>
                  </button>
                </AnimateOnScroll>
              ))}
            </div>

            {step > 1 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Предыдущий вопрос
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {step === 6 && (
          <div className="w-full space-y-10">
            <AnimateOnScroll>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm">
                  <Sparkles className="w-4 h-4" />
                  Результат мини-диагностики
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-light">
                  {results.length > 0 ? "Ваши камни" : "Рекомендация не найдена"}
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-sm">
                  {results.length > 0
                    ? "На основе анализа ваших ответов мы определили минералы с наивысшим энергетическим резонансом для вашего текущего состояния"
                    : "Попробуйте пройти диагностику ещё раз"}
                </p>
              </div>
            </AnimateOnScroll>

            {results.map(({ crystal, score }, idx) => (
              <AnimateOnScroll key={crystal.name} delay={idx * 150}>
                <div className={`relative rounded-2xl border overflow-hidden ${
                  idx === 0 ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card/50"
                }`}>
                  {idx === 0 && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs tracking-wider uppercase">
                      Лучший резонанс
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 aspect-square md:aspect-auto">
                      <img
                        src={crystal.image}
                        alt={crystal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:p-8 flex-1 space-y-4">
                      <div>
                        <p className="text-primary/60 text-xs tracking-widest uppercase mb-1">
                          #{idx + 1} рекомендация • совпадение {Math.min(Math.round((score / 15) * 100), 99)}%
                        </p>
                        <h3 className="font-serif text-2xl md:text-3xl font-light">
                          {crystal.name}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {crystal.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {crystal.chakras.map((c) => (
                          <span key={c} className="px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs">
                            {c}
                          </span>
                        ))}
                        {crystal.problems.slice(0, 3).map((p) => (
                          <span key={p} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">
                            {p}
                          </span>
                        ))}
                      </div>
                      <blockquote className="border-l-2 border-primary/30 pl-4 italic text-muted-foreground text-sm">
                        «{crystal.quote}»
                      </blockquote>
                      <Link
                        to={`/catalog/${slugify(crystal.name)}`}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
                      >
                        Подробнее о камне
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}

            {/* Upsell: Master Diagnosis */}
            <AnimateOnScroll delay={results.length * 150 + 200}>
              <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-card/50 p-8 md:p-10 text-center space-y-5">
                <p className="text-primary/60 text-xs tracking-[0.3em] uppercase">
                  Следующий шаг
                </p>
                <h3 className="font-serif text-2xl md:text-3xl font-light leading-snug">
                  Хотите узнать, что <span className="text-gradient-gold italic">на самом деле</span> происходит с вашей энергетикой?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
                  Алгоритм подбирает камни по вашим ответам — но не видит скрытых блоков, привязок и деструктивных программ. 
                  Мастер проводит диагностику по фото и даёт точечные рекомендации, подобранные индивидуально под вас.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    to="/diagnostika"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    Узнать о диагностике
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            <div className="text-center space-y-4 pt-6">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Пройти заново
              </button>
              <div>
                <Link
                  to="/catalog"
                  className="text-primary/70 hover:text-primary text-sm transition-colors"
                >
                  Смотреть весь каталог →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Quiz;
