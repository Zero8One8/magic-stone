import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { crystals, allChakras, allProblems, type Crystal } from "@/data/crystals";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart } from "lucide-react";

const slugify = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[ёЁ]/g, "е");

const Catalog = () => {
  const [selectedChakra, setSelectedChakra] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const { toggle, isFavorite, count } = useFavorites();
  const navigate = useNavigate();

  const filtered = crystals.filter((c) => {
    if (selectedChakra && !c.chakras.includes(selectedChakra)) return false;
    if (selectedProblem && !c.problems.includes(selectedProblem)) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-background pt-16">
      <header className="border-b border-border/30 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl text-foreground hover:text-primary transition-colors">
            ← На главную
          </Link>
          <div />
          <Link to="/favorites" className="relative text-muted-foreground hover:text-primary transition-colors">
            <Heart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <AnimateOnScroll className="mb-12">
          <div className="mb-8">
            <h3 className="font-display text-xl text-foreground mb-4">По чакре</h3>
            <div className="flex flex-wrap gap-2">
              {allChakras.map((chakra) => (
                <button
                  key={chakra}
                  onClick={() => setSelectedChakra(selectedChakra === chakra ? null : chakra)}
                  className={`font-body text-sm px-4 py-2 rounded-full border transition-all duration-300 ${
                    selectedChakra === chakra
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {chakra}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl text-foreground mb-4">По запросу</h3>
            <div className="flex flex-wrap gap-2">
              {allProblems.map((problem) => (
                <button
                  key={problem}
                  onClick={() => setSelectedProblem(selectedProblem === problem ? null : problem)}
                  className={`font-body text-sm px-4 py-2 rounded-full border transition-all duration-300 ${
                    selectedProblem === problem
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {problem}
                </button>
              ))}
            </div>
          </div>

          {(selectedChakra || selectedProblem) && (
            <button
              onClick={() => { setSelectedChakra(null); setSelectedProblem(null); }}
              className="mt-4 font-body text-sm text-primary underline underline-offset-4 hover:opacity-80"
            >
              Сбросить фильтры
            </button>
          )}
        </AnimateOnScroll>

        <p className="font-body text-muted-foreground mb-8">
          {filtered.length === crystals.length ? `Все камни (${crystals.length})` : `Найдено: ${filtered.length}`}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((crystal, i) => (
            <AnimateOnScroll key={crystal.name} delay={i * 80}>
              <div
                className="group bg-card/60 border rounded-xl overflow-hidden transition-all duration-500 cursor-pointer border-border/40 hover:border-primary/20"
                onClick={() => navigate(`/catalog/${slugify(crystal.name)}`)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={crystal.image}
                    alt={crystal.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width={800}
                    height={800}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 font-display text-2xl text-foreground">{crystal.name}</h3>
                  <Link
                    to={`/catalog/${slugify(crystal.name)}`}
                    className="absolute top-4 right-12 font-body text-xs px-3 py-1.5 rounded-full bg-primary/80 text-primary-foreground hover:bg-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Подробнее →
                  </Link>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(crystal.name); }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/80 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(crystal.name) ? "fill-primary text-primary" : "text-foreground/60"}`} />
                  </button>
                </div>

                <div className="px-6 pt-4 flex flex-wrap gap-2">
                  {crystal.chakras.map((c) => (
                    <span key={c} className="text-xs font-body px-2 py-1 rounded-full bg-accent/20 text-accent-foreground/80">{c}</span>
                  ))}
                  {crystal.problems.map((p) => (
                    <span key={p} className="text-xs font-body px-2 py-1 rounded-full bg-primary/10 text-primary">{p}</span>
                  ))}
                </div>

                <div className="p-6">
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{crystal.description}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-muted-foreground mb-4">Камни не найдены</p>
            <p className="font-body text-muted-foreground">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Catalog;
