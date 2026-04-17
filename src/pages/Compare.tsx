import { useState } from "react";
import { Link } from "react-router-dom";
import { crystals } from "@/data/crystals";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, Plus, X } from "lucide-react";

const slugify = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[ёЁ]/g, "е");

const Compare = () => {
  const [selected, setSelected] = useState<string[]>([""]);

  const addSlot = () => {
    if (selected.length < 3) setSelected([...selected, ""]);
  };

  const removeSlot = (i: number) => {
    if (selected.length > 1) setSelected(selected.filter((_, idx) => idx !== i));
  };

  const setStone = (i: number, name: string) => {
    const next = [...selected];
    next[i] = name;
    setSelected(next);
  };

  const selectedCrystals = selected.map((name) => crystals.find((c) => c.name === name)).filter(Boolean) as typeof crystals;
  const usedNames = selected.filter(Boolean);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
          <Link to="/catalog" className="text-primary/70 hover:text-primary text-sm transition-colors">
            Каталог камней →
          </Link>
        </div>
      </div>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <AnimateOnScroll>
            <p className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-6">Инструмент</p>
            <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-6">
              Сравнение <span className="text-gradient-gold italic">камней</span>
            </h1>
          </AnimateOnScroll>
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <div className="flex flex-wrap gap-4 mb-8 items-end">
              {selected.map((name, i) => (
                <div key={i} className="flex-1 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-body text-sm text-muted-foreground">Камень {i + 1}</label>
                    {selected.length > 1 && (
                      <button onClick={() => removeSlot(i)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <select
                    value={name}
                    onChange={(e) => setStone(i, e.target.value)}
                    className="w-full bg-card/60 border border-border/50 rounded-xl px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="">Выберите</option>
                    {crystals
                      .filter((c) => !usedNames.includes(c.name) || c.name === name)
                      .map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                  </select>
                </div>
              ))}
              {selected.length < 3 && (
                <button
                  onClick={addSlot}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors font-body text-sm"
                >
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              )}
            </div>
          </AnimateOnScroll>

          {selectedCrystals.length >= 2 && (
            <AnimateOnScroll>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 text-left font-body text-sm text-muted-foreground border-b border-border/30 w-36" />
                      {selectedCrystals.map((c) => (
                        <th key={c.name} className="p-4 border-b border-border/30">
                          <div className="flex flex-col items-center gap-3">
                            <img src={c.image} alt={c.name} className="w-20 h-20 rounded-full object-cover border-2 border-border/30" />
                            <Link to={`/catalog/${slugify(c.name)}`} className="font-display text-lg text-foreground hover:text-primary transition-colors">
                              {c.name}
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 font-body text-sm text-muted-foreground border-b border-border/20">Чакры</td>
                      {selectedCrystals.map((c) => (
                        <td key={c.name} className="p-4 border-b border-border/20 text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {c.chakras.map((ch) => (
                              <span key={ch} className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground/80">{ch}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-body text-sm text-muted-foreground border-b border-border/20">Помогает при</td>
                      {selectedCrystals.map((c) => (
                        <td key={c.name} className="p-4 border-b border-border/20 text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {c.problems.map((p) => (
                              <span key={p} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{p}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-body text-sm text-muted-foreground border-b border-border/20">Описание</td>
                      {selectedCrystals.map((c) => (
                        <td key={c.name} className="p-4 border-b border-border/20">
                          <p className="font-body text-sm text-foreground/80 leading-relaxed text-center">{c.description}</p>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-body text-sm text-muted-foreground border-b border-border/20">Эффекты</td>
                      {selectedCrystals.map((c) => (
                        <td key={c.name} className="p-4 border-b border-border/20">
                          <ul className="space-y-1 text-center">
                            {c.effects.map((e) => (
                              <li key={e} className="font-body text-xs text-muted-foreground">• {e}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-body text-sm text-muted-foreground">Как использовать</td>
                      {selectedCrystals.map((c) => (
                        <td key={c.name} className="p-4">
                          <p className="font-body text-xs text-muted-foreground text-center leading-relaxed">{c.howToUse}</p>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>
          )}

          {selectedCrystals.length < 2 && (
            <div className="text-center py-16 text-muted-foreground font-body text-sm">
              Выберите минимум 2 камня для сравнения
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Compare;
