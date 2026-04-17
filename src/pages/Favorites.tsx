import { Link } from "react-router-dom";
import { crystals } from "@/data/crystals";
import { useFavorites } from "@/hooks/useFavorites";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, Heart, X } from "lucide-react";

const slugify = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[ёЁ]/g, "е");

const Favorites = () => {
  const { favorites, toggle } = useFavorites();
  const favCrystals = crystals.filter((c) => favorites.includes(c.name));

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
            <p className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-6">Ваша коллекция</p>
            <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-6">
              <Heart className="inline w-8 h-8 text-primary mr-2" />
              Избранные <span className="text-gradient-gold italic">камни</span>
            </h1>
          </AnimateOnScroll>
        </div>

        <div className="max-w-5xl mx-auto">
          {favCrystals.length === 0 ? (
            <AnimateOnScroll>
              <div className="text-center py-20">
                <p className="font-display text-2xl text-muted-foreground mb-4">
                  У вас пока нет избранных камней
                </p>
                <p className="font-body text-muted-foreground mb-8">
                  Нажмите ♡ на карточке камня в каталоге, чтобы добавить его в избранное
                </p>
                <Link
                  to="/catalog"
                  className="inline-block font-body text-sm tracking-[0.15em] uppercase bg-primary text-primary-foreground px-10 py-4 rounded-full hover:bg-primary/90 transition-all"
                >
                  Перейти в каталог
                </Link>
              </div>
            </AnimateOnScroll>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favCrystals.map((crystal, i) => (
                <AnimateOnScroll key={crystal.name} delay={i * 80}>
                  <div className="group bg-card/60 border border-border/40 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-500">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={crystal.image}
                        alt={crystal.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      <h3 className="absolute bottom-4 left-6 font-display text-2xl text-foreground">{crystal.name}</h3>
                      <button
                        onClick={() => toggle(crystal.name)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/60 backdrop-blur flex items-center justify-center hover:bg-background/80 transition-colors"
                      >
                        <X className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                    <div className="p-6">
                      <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">{crystal.description}</p>
                      <Link
                        to={`/catalog/${slugify(crystal.name)}`}
                        className="font-body text-sm text-primary hover:underline underline-offset-4"
                      >
                        Подробнее →
                      </Link>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Favorites;
