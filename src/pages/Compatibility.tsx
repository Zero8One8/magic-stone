import { useState } from "react";
import { Link } from "react-router-dom";
import { crystals } from "@/data/crystals";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, Check, X, AlertTriangle } from "lucide-react";
import PageSEO from "@/components/PageSEO";

// Compatibility rules based on chakras and energy properties
const getCompatibility = (a: typeof crystals[0], b: typeof crystals[0]): { status: "good" | "neutral" | "conflict"; reason: string } => {
  const sharedChakras = a.chakras.filter((c) => b.chakras.includes(c));
  const sharedProblems = a.problems.filter((p) => b.problems.includes(p));

  // Conflicting energies
  const groundingStones = ["Чёрный турмалин", "Обсидиан", "Гематит", "Оникс", "Шунгит"];
  const highVibrationStones = ["Молдавит", "Селенит", "Чароит", "Танзанит", "Сугилит"];
  const aIsGrounding = groundingStones.includes(a.name);
  const bIsGrounding = groundingStones.includes(b.name);
  const aIsHigh = highVibrationStones.includes(a.name);
  const bIsHigh = highVibrationStones.includes(b.name);

  if ((aIsGrounding && bIsHigh) || (aIsHigh && bIsGrounding)) {
    return {
      status: "conflict",
      reason: "Заземляющий камень подавляет высокочастотную энергию. Лучше использовать по отдельности или в разное время суток.",
    };
  }

  if (sharedChakras.length > 0 && sharedProblems.length > 0) {
    return {
      status: "good",
      reason: `Отличная пара! Работают на ${sharedChakras.join(", ")} чакре и усиливают друг друга в работе с: ${sharedProblems.join(", ").toLowerCase()}.`,
    };
  }

  if (sharedChakras.length > 0) {
    return {
      status: "good",
      reason: `Совместимы — оба работают с ${sharedChakras.join(", ")} чакрой, дополняя друг друга.`,
    };
  }

  if (sharedProblems.length > 0) {
    return {
      status: "good",
      reason: `Хорошая комбинация для работы с: ${sharedProblems.join(", ").toLowerCase()}. Работают на разных уровнях.`,
    };
  }

  return {
    status: "neutral",
    reason: "Нейтральная совместимость. Камни не конфликтуют, но и не усиливают друг друга. Можно носить вместе без проблем.",
  };
};

const Compatibility = () => {
  const [stoneA, setStoneA] = useState<string>("");
  const [stoneB, setStoneB] = useState<string>("");

  const crystalA = crystals.find((c) => c.name === stoneA);
  const crystalB = crystals.find((c) => c.name === stoneB);
  const result = crystalA && crystalB && stoneA !== stoneB ? getCompatibility(crystalA, crystalB) : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageSEO
        title="Совместимость камней"
        description="Проверьте энергетическую совместимость двух камней. Узнайте, какие минералы усиливают друг друга, а какие создают дисбаланс."
        path="/compatibility"
      />
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link to="/catalog" className="text-primary/70 hover:text-primary text-sm transition-colors">
            Каталог камней →
          </Link>
        </div>
      </div>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimateOnScroll>
            <p className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-6">Инструмент</p>
            <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-6">
              Совместимость <span className="text-gradient-gold italic">камней</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Проверьте, какие камни усиливают друг друга, а какие лучше не сочетать
            </p>
          </AnimateOnScroll>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimateOnScroll>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">Первый камень</label>
                <select
                  value={stoneA}
                  onChange={(e) => setStoneA(e.target.value)}
                  className="w-full bg-card/60 border border-border/50 rounded-xl px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">Выберите камень</option>
                  {crystals.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">Второй камень</label>
                <select
                  value={stoneB}
                  onChange={(e) => setStoneB(e.target.value)}
                  className="w-full bg-card/60 border border-border/50 rounded-xl px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">Выберите камень</option>
                  {crystals.filter((c) => c.name !== stoneA).map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </AnimateOnScroll>

          {stoneA && stoneB && stoneA === stoneB && (
            <div className="text-center text-muted-foreground text-sm py-8">
              Выберите два разных камня
            </div>
          )}

          {result && crystalA && crystalB && (
            <AnimateOnScroll>
              <div className={`rounded-2xl border p-8 md:p-10 ${
                result.status === "good" ? "border-green-500/30 bg-green-500/5" :
                result.status === "conflict" ? "border-red-500/30 bg-red-500/5" :
                "border-border/50 bg-card/30"
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  <img src={crystalA.image} alt={crystalA.name} className="w-16 h-16 rounded-full object-cover border-2 border-border/50" />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    result.status === "good" ? "bg-green-500/20" :
                    result.status === "conflict" ? "bg-red-500/20" :
                    "bg-muted"
                  }`}>
                    {result.status === "good" && <Check className="w-5 h-5 text-green-500" />}
                    {result.status === "conflict" && <X className="w-5 h-5 text-red-500" />}
                    {result.status === "neutral" && <AlertTriangle className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <img src={crystalB.image} alt={crystalB.name} className="w-16 h-16 rounded-full object-cover border-2 border-border/50" />
                </div>

                <h3 className="font-display text-xl mb-2">
                  {crystalA.name} + {crystalB.name}
                </h3>
                <p className={`font-display text-lg mb-4 ${
                  result.status === "good" ? "text-green-500" :
                  result.status === "conflict" ? "text-red-500" :
                  "text-muted-foreground"
                }`}>
                  {result.status === "good" && "✓ Отличная совместимость"}
                  {result.status === "conflict" && "✗ Конфликтующие энергии"}
                  {result.status === "neutral" && "~ Нейтральная совместимость"}
                </p>
                <p className="font-body text-sm text-foreground/80 leading-relaxed">
                  {result.reason}
                </p>
              </div>
            </AnimateOnScroll>
          )}

          <AnimateOnScroll className="mt-12">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <p className="text-sm text-foreground/80 mb-3">
                Для точного подбора комбинации камней под ваши задачи рекомендуем индивидуальную диагностику
              </p>
              <Link to="/diagnostika" className="inline-block font-body text-sm text-primary hover:underline underline-offset-4">
                Узнать о диагностике →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
};

export default Compatibility;
