import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { chakraBySlug, chakraArticles } from "@/data/chakraArticles";

const TELEGRAM_BOT = "https://t.me/The_magic_of_stones_bot?start=diagnostika";

const ChakraDetail = () => {
  const { slug = "" } = useParams();
  const chakra = chakraBySlug(slug);

  if (!chakra) {
    return (
      <main className="min-h-screen bg-background text-foreground px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-3xl font-bold mb-3">Чакра не найдена</h1>
          <p className="text-muted-foreground mb-6">
            Возможно, ссылка устарела. Перейдите к карте чакр или диагностике.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/chakras" className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground">
              Карта чакр
            </Link>
            <Link to="/diagnostika" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
              Диагностика
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const related = chakraArticles.filter((item) => item.slug !== chakra.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 pt-6">
        <Link to="/diagnostika" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          К диагностике
        </Link>
      </div>

      <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-[1.1fr_1fr] items-start">
          <AnimateOnScroll>
            <div className="rounded-2xl overflow-hidden border border-border/60 bg-card/40">
              <img src={chakra.image} alt={chakra.name} className="w-full h-[320px] md:h-[420px] object-cover" />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-3">Чакра {chakra.number}</p>
            <h1 className="font-display text-4xl md:text-5xl font-light mb-2">{chakra.name}</h1>
            <p className="text-muted-foreground text-sm mb-4">{chakra.sanskrit} - {chakra.location}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs rounded-full bg-secondary px-3 py-1">Цвет: {chakra.color}</span>
              <span className="text-xs rounded-full bg-secondary px-3 py-1">Элемент: {chakra.element}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{chakra.intro}</p>
            <a
              href={TELEGRAM_BOT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Получить персональную диагностику
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          <AnimateOnScroll>
            <div className="rounded-xl border border-border/50 bg-card/40 p-6 h-full">
              <h2 className="font-display text-2xl font-light mb-3">Признаки дисбаланса</h2>
              <p className="text-muted-foreground leading-relaxed">{chakra.signs}</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="rounded-xl border border-border/50 bg-card/40 p-6 h-full">
              <h2 className="font-display text-2xl font-light mb-3">Камни поддержки</h2>
              <ul className="space-y-2 text-muted-foreground">
                {chakra.stones.map((stone) => (
                  <li key={stone} className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                    <span>{stone}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14">
        <div className="max-w-4xl mx-auto rounded-xl border border-border/50 bg-card/40 p-6">
          <h2 className="font-display text-2xl font-light mb-4">Практики для гармонизации</h2>
          <ul className="space-y-2 text-muted-foreground">
            {chakra.practices.map((practice) => (
              <li key={practice}>- {practice}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-display text-2xl font-light mb-4">Другие чакры</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to={`/chakras/${item.slug}`}
                className="rounded-lg border border-border/50 bg-card/40 px-4 py-3 hover:border-primary/50 transition-colors"
              >
                <p className="text-xs text-primary/70 mb-1">Чакра {item.number}</p>
                <p className="text-sm text-foreground">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChakraDetail;