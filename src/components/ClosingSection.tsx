import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Link } from "react-router-dom";

const ClosingSection = () => {
  return (
    <section className="relative py-24 md:py-40">
      <div className="absolute inset-0 bg-crystal-glow" />
      <div className="relative max-w-3xl mx-auto px-6">
        <AnimateOnScroll className="mb-16">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8 leading-tight text-center">
            Камни <span className="text-gradient-gold italic">помнят</span>
          </h2>
          <p className="font-body text-lg leading-relaxed text-foreground/80 text-center">
            Бабушка помнит: этот гранат помог ей пережить войну. Этот лунный камень лежал у подушки,
            когда она ждала ребёнка. Этот обсидиан — всё, что осталось от деда, который молчал о своей боли.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll className="text-center mb-16">
          <p className="font-display text-2xl md:text-4xl italic text-foreground/90 leading-relaxed mb-6">
            Просто возьми камень в руку. Закрой глаза. И послушай.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll className="text-center">
          <div className="inline-block bg-card/60 backdrop-blur-sm border border-primary/20 rounded-2xl p-10 md:p-14">
            <p className="font-display text-2xl md:text-3xl text-foreground mb-4">Исследуй</p>
            <p className="font-body text-muted-foreground mb-8 max-w-md">
              Для той версии себя, которая заслуживает наконец — <span className="text-primary">выдохнуть</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/diagnostika" className="inline-block font-body text-sm tracking-[0.2em] uppercase bg-primary text-primary-foreground px-12 py-4 rounded-full hover:opacity-90 transition-all duration-500">
                Диагностика мастера
              </Link>
              <Link to="/catalog" className="inline-block font-body text-sm tracking-[0.2em] uppercase border border-primary/30 text-primary px-12 py-4 rounded-full hover:bg-primary/10 transition-all duration-500">
                Каталог камней
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-body">
              <Link to="/compatibility" className="text-muted-foreground hover:text-primary transition-colors">Совместимость</Link>
              <span className="text-border">·</span>
              <Link to="/meditations" className="text-muted-foreground hover:text-primary transition-colors">Медитации</Link>
              <span className="text-border">·</span>
              <Link to="/compare" className="text-muted-foreground hover:text-primary transition-colors">Сравнение</Link>
              <span className="text-border">·</span>
              <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Статьи</Link>
              <span className="text-border">·</span>
              <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              <span className="text-border">·</span>
              <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Магазин</Link>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll className="mt-20 text-center">
          <div className="w-16 h-px bg-primary/30 mx-auto mb-8" />
          <p className="font-body text-muted-foreground italic leading-relaxed">
            Перешли это тому, кто сейчас нуждается в тишине и опоре.<br />
            Иногда камень приходит к человеку через чужие руки.
          </p>
          <p className="text-3xl mt-6">💎</p>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ClosingSection;
