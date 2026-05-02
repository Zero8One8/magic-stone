import { Link } from "react-router-dom";
import heroCrystal from "@/assets/hero-crystal.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroCrystal} alt="Чёрный турмалин" className="w-full h-full object-cover opacity-40" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center" style={{ paddingTop: "72px" }}>
        <p className="text-muted-foreground font-body text-sm tracking-[0.3em] uppercase mb-8 animate-[fadeIn_1s_ease-out]">
          Когда слова бессильны
        </p>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-8 animate-[fadeIn_1.2s_ease-out]">
          <span className="text-foreground">Когда камни</span><br />
          <span className="text-gradient-gold italic font-light">говорят то,</span><br />
          <span className="text-foreground">что не может</span><br />
          <span className="text-foreground">сказать никто</span>
        </h1>

        <p className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 animate-[fadeIn_1.5s_ease-out]">
          Канал о натуральных камнях, энергии и пути к себе.<br className="hidden md:block" />
          Без эзотерического тумана. С теплом и честностью.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeIn_1.8s_ease-out]">
          <a href="#article" className="inline-block font-body text-sm tracking-[0.2em] uppercase border border-primary/30 text-primary px-10 py-4 rounded-full hover:bg-primary/10 transition-all duration-500">
            Читать
          </a>
          <Link to="/quiz" className="inline-block font-body text-sm tracking-[0.2em] uppercase bg-primary text-primary-foreground px-10 py-4 rounded-full hover:bg-primary/90 transition-all duration-500">
            Подобрать камень
          </Link>
        </div>

        <div className="absolute bottom-12 left-1/2" style={{ animation: "bounce-scroll 2s infinite" }}>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
