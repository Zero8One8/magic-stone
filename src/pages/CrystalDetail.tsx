import { useParams, Link } from "react-router-dom";
import { crystals } from "@/data/crystals";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import PageSEO from "@/components/PageSEO";

const slugify = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[ёЁ]/g, "е");

const CrystalDetail = () => {
  const { name } = useParams<{ name: string }>();
  const crystal = crystals.find((c) => slugify(c.name) === name);

  if (!crystal) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <h1 className="font-display text-3xl text-foreground">Камень не найден</h1>
        <Link to="/catalog" className="font-body text-primary underline underline-offset-4">
          Вернуться в каталог
        </Link>
      </main>
    );
  }

  const idx = crystals.indexOf(crystal);
  const prev = idx > 0 ? crystals[idx - 1] : null;
  const next = idx < crystals.length - 1 ? crystals[idx + 1] : null;

  return (
    <main className="min-h-screen bg-background">
      <PageSEO
        title={crystal.name}
        description={`${crystal.name} — свойства, чакры и значение камня. ${crystal.description ?? ''}`}
        path={`/catalog/${name}`}
      />
      <header className="border-b border-border/30 py-6">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link to="/catalog" className="font-display text-lg text-foreground hover:text-primary transition-colors">
            ← Каталог
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <AnimateOnScroll>
          <div className="relative rounded-2xl overflow-hidden mb-10 aspect-[16/9]">
            <img
              src={crystal.image}
              alt={crystal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            <h1 className="absolute bottom-8 left-8 font-display text-4xl md:text-5xl text-foreground drop-shadow-lg">
              {crystal.name}
            </h1>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <div className="flex flex-wrap gap-2 mb-8">
            {crystal.chakras.map((c) => (
              <span key={c} className="text-sm font-body px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground/80">
                {c}
              </span>
            ))}
            {crystal.problems.map((p) => (
              <span key={p} className="text-sm font-body px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                {p}
              </span>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <p className="font-body text-lg text-muted-foreground leading-relaxed mb-12">
            {crystal.description}
          </p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <AnimateOnScroll delay={300}>
            <div className="bg-card/60 border border-border/40 rounded-xl p-6">
              <h2 className="font-display text-2xl text-foreground mb-4">Что делает</h2>
              <ul className="space-y-3">
                {crystal.effects.map((e) => (
                  <li key={e} className="font-body text-muted-foreground flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400}>
            <div className="bg-card/60 border border-border/40 rounded-xl p-6">
              <h2 className="font-display text-2xl text-foreground mb-4">Как использовать</h2>
              <p className="font-body text-muted-foreground leading-relaxed">{crystal.howToUse}</p>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay={500}>
          <blockquote className="border-l-4 border-primary/40 pl-6 py-4 mb-12">
            <p className="font-display text-2xl italic text-primary/80 leading-relaxed">
              {crystal.quote}
            </p>
          </blockquote>
        </AnimateOnScroll>

        <div className="flex items-center justify-between pt-8 border-t border-border/30">
          {prev ? (
            <Link
              to={`/catalog/${slugify(prev.name)}`}
              className="font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {prev.name}
            </Link>
          ) : <span />}
          {next ? (
            <Link
              to={`/catalog/${slugify(next.name)}`}
              className="font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              {next.name} →
            </Link>
          ) : <span />}
        </div>
      </article>
    </main>
  );
};

export default CrystalDetail;
