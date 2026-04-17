import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calculator, Sparkles, Star } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { crystals } from "@/data/crystals";

const numerologyStones: Record<number, { stones: string[]; meaning: string; description: string }> = {
  1: {
    stones: ["Цитрин", "Гранат", "Пирит"],
    meaning: "Лидерство, воля, независимость",
    description: "Число один — это энергия первопроходца, лидера, творца собственной реальности. Вам свойственна сильная воля, амбициозность и стремление к независимости. Камни вашего числа усиливают эти качества, помогают преодолевать сомнения и двигаться к цели с непоколебимой уверенностью. Цитрин активирует солнечное сплетение и возвращает ощущение внутренней силы, гранат разжигает страсть к жизни, а пирит привлекает изобилие и укрепляет волевой центр.",
  },
  2: {
    stones: ["Розовый кварц", "Лунный камень", "Голубой халцедон"],
    meaning: "Гармония, партнёрство, интуиция",
    description: "Число два — это энергия дипломата, миротворца, чуткого партнёра. Вы обладаете развитой интуицией, тонко чувствуете эмоции окружающих и стремитесь к гармонии в отношениях. Розовый кварц раскрывает сердечную чакру и помогает строить глубокие связи, лунный камень усиливает интуицию и связь с лунными циклами, а голубой халцедон привносит покой и мягкость в общение.",
  },
  3: {
    stones: ["Аметист", "Голубой топаз", "Флюорит"],
    meaning: "Творчество, самовыражение, радость",
    description: "Число три — это энергия творца, художника, человека, рождённого для самовыражения. Вам важно находить каналы для реализации своих идей и делиться внутренним светом с миром. Аметист помогает сосредоточиться и настроиться на творческий поток, голубой топаз открывает горловую чакру для свободного самовыражения, а флюорит упорядочивает хаотичные мысли и направляет вдохновение в конкретные действия.",
  },
  4: {
    stones: ["Чёрный турмалин", "Красная яшма", "Гематит"],
    meaning: "Стабильность, порядок, фундамент",
    description: "Число четыре — это энергия строителя, человека, который создаёт прочный фундамент для себя и других. Вы цените порядок, надёжность и системный подход к жизни. Чёрный турмалин заземляет и защищает от внешнего хаоса, красная яшма укрепляет связь с землёй и даёт выносливость, а гематит придаёт дисциплину и помогает доводить дела до конца.",
  },
  5: {
    stones: ["Аквамарин", "Ларимар", "Хризоколла"],
    meaning: "Свобода, перемены, приключения",
    description: "Число пять — это энергия путешественника, искателя, человека, жаждущего перемен и новых горизонтов. Вам тесно в рамках и рутине, вы стремитесь к свободе и разнообразию опыта. Аквамарин очищает эмоциональное поле и помогает адаптироваться к переменам, ларимар успокаивает страхи перед неизвестным, а хризоколла помогает находить мудрость в каждом новом опыте.",
  },
  6: {
    stones: ["Родонит", "Нефрит", "Розовая шпинель"],
    meaning: "Любовь, ответственность, забота",
    description: "Число шесть — это энергия целителя, хранителя семьи, человека, который заботится о других. Вы обладаете глубоким чувством ответственности и стремитесь создать вокруг себя атмосферу любви и безопасности. Родонит исцеляет эмоциональные раны и восстанавливает способность любить, нефрит привлекает гармонию в семейные отношения, а розовая шпинель помогает сбалансировать заботу о других с заботой о себе.",
  },
  7: {
    stones: ["Лабрадорит", "Содалит", "Чароит"],
    meaning: "Мудрость, духовность, самопознание",
    description: "Число семь — это энергия мистика, философа, искателя глубинных истин. Вы обладаете аналитическим умом и тягой к познанию скрытых аспектов реальности. Лабрадорит усиливает интуицию и защищает во время духовных практик, содалит активирует третий глаз и помогает в медитации, а чароит ускоряет духовную трансформацию и помогает принять перемены.",
  },
  8: {
    stones: ["Тигровый глаз", "Пирит", "Хризоберилл"],
    meaning: "Сила, изобилие, реализация",
    description: "Число восемь — это энергия воина, человека власти и реализации. Вы обладаете мощным потенциалом для достижения материальных и духовных целей. Тигровый глаз укрепляет уверенность в себе и помогает принимать смелые решения, пирит притягивает финансовое изобилие и активирует волевой центр, а хризоберилл усиливает самодисциплину и помогает превращать планы в реальность.",
  },
  9: {
    stones: ["Молдавит", "Танзанит", "Празиолит"],
    meaning: "Завершение, мудрость, служение",
    description: "Число девять — это энергия завершающего цикла, мудреца, человека, призванного служить высшей цели. Вы обладаете глубоким состраданием и способностью видеть общую картину. Молдавит ускоряет духовную эволюцию и помогает отпустить старое, танзанит соединяет сердечную и коронную чакры для духовного прозрения, а празиолит помогает интегрировать духовный опыт в повседневную жизнь.",
  },
};

const calculateLifePath = (dateStr: string): number | null => {
  const parts = dateStr.split(/[.\-/]/);
  if (parts.length !== 3) return null;

  const digits = dateStr.replace(/[.\-/]/g, "");
  if (!/^\d+$/.test(digits)) return null;

  let sum = 0;
  for (const d of digits) {
    sum += parseInt(d);
  }

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    let newSum = 0;
    for (const d of sum.toString()) {
      newSum += parseInt(d);
    }
    sum = newSum;
  }

  if (sum === 11 || sum === 22 || sum === 33) {
    let reduced = 0;
    for (const d of sum.toString()) {
      reduced += parseInt(d);
    }
    sum = reduced;
  }

  return sum;
};

const BirthstoneCalculator = () => {
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<{ number: number; data: typeof numerologyStones[1] } | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    setResult(null);

    const num = calculateLifePath(dateInput);
    if (!num || num < 1 || num > 9) {
      setError("Пожалуйста, введите корректную дату в формате ДД.ММ.ГГГГ");
      return;
    }

    setResult({ number: num, data: numerologyStones[num] });
  };

  const findCrystal = (name: string) => {
    return crystals.find((c) => c.name === name);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </div>

      <section className="container mx-auto px-4 py-16 text-center">
        <AnimateOnScroll>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-6 flex items-center justify-center">
            <Calculator className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Камень по дате рождения
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Нумерологический расчёт вашего числа жизненного пути и подбор минералов,
            которые резонируют с вашей энергетикой от рождения. Введите дату рождения
            и узнайте, какие камни усилят ваши сильные стороны.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="max-w-md mx-auto bg-card rounded-2xl border border-border p-8">
            <label className="block text-sm text-muted-foreground mb-2 text-left">Дата рождения</label>
            <Input
              type="text"
              placeholder="Например: 15.03.1990"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            />
            {error && <p className="text-destructive text-sm mb-4">{error}</p>}
            <Button onClick={handleCalculate} className="w-full" size="lg">
              <Star className="w-4 h-4 mr-2" />
              Рассчитать
            </Button>
          </div>
        </AnimateOnScroll>
      </section>

      {result && (
        <section className="container mx-auto px-4 pb-16">
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-8 md:p-12 mb-8 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-serif font-bold text-primary-foreground">{result.number}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Ваше число жизненного пути — {result.number}
                </h2>
                <p className="text-primary font-medium mb-6">{result.data.meaning}</p>
                <p className="text-muted-foreground leading-relaxed">{result.data.description}</p>
              </div>

              <h3 className="font-serif text-2xl font-bold text-foreground mb-6 text-center">
                Ваши камни
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {result.data.stones.map((stoneName) => {
                  const crystal = findCrystal(stoneName);
                  return (
                    <Link
                      key={stoneName}
                      to={crystal ? `/catalog/${encodeURIComponent(crystal.name)}` : "/catalog"}
                      className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors block"
                    >
                      {crystal && (
                        <img
                          src={crystal.image}
                          alt={crystal.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                        />
                      )}
                      <h4 className="font-serif text-lg font-semibold text-foreground mb-2 text-center">{stoneName}</h4>
                      {crystal && (
                        <p className="text-muted-foreground text-xs text-center line-clamp-3">{crystal.description}</p>
                      )}
                      <div className="flex items-center justify-center gap-1 mt-3 text-primary text-xs">
                        <Sparkles className="w-3 h-3" />
                        Подробнее
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-10">
                <p className="text-muted-foreground mb-4">
                  Хотите узнать больше о своей энергетике и получить персональный подбор камней?
                </p>
                <Link to="/diagnostika">
                  <Button size="lg">Записаться на диагностику</Button>
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </section>
      )}
    </main>
  );
};

export default BirthstoneCalculator;
