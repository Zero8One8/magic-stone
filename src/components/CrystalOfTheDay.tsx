import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { crystals } from "@/data/crystals";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Sparkles } from "lucide-react";
import { SITE_CRYSTAL_OF_DAY_DEFAULTS } from "@/content/siteDefaults";
import { useSiteContent } from "@/lib/siteContent";

const slugify = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[ёЁ]/g, "е");

const getCrystalOfTheDay = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return crystals[dayOfYear % crystals.length];
};

const findManualCrystal = (manualCrystalName?: string | null) => {
  if (!manualCrystalName) {
    return null;
  }

  const normalized = slugify(manualCrystalName);
  return crystals.find((crystal) => slugify(crystal.name) === normalized) ?? null;
};

const CrystalOfTheDay = () => {
  const crystalContent = useSiteContent("site_crystal_of_day", SITE_CRYSTAL_OF_DAY_DEFAULTS);
  const crystal = (crystalContent.mode === "manual"
    ? findManualCrystal(crystalContent.manualCrystalName)
    : null) ?? getCrystalOfTheDay();
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <AnimateOnScroll>
          <div className="flex items-center justify-center gap-3 mb-12">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-primary/60 text-sm tracking-[0.3em] uppercase">{crystalContent.label}</p>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <div
            className="grid md:grid-cols-2 gap-8 items-center bg-card/60 border border-border/40 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => navigate(`/catalog/${slugify(crystal.name)}`)}
          >
            <div className="relative h-64 md:h-full min-h-[300px]">
              <img
                src={crystal.image}
                alt={crystal.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 md:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:hidden" />
            </div>

            <div className="p-8 md:p-10">
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                {crystal.name}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {crystal.chakras.map((c) => (
                  <span key={c} className="text-xs font-body px-2 py-1 rounded-full bg-accent/20 text-accent-foreground/80">{c}</span>
                ))}
              </div>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                {crystal.description}
              </p>
              <blockquote className="border-l-2 border-primary/40 pl-4 mb-6">
                <p className="font-display text-lg italic text-primary/80">{crystal.quote}</p>
              </blockquote>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/catalog/${slugify(crystal.name)}`}
                  className="inline-block font-body text-sm tracking-[0.15em] uppercase border border-primary/30 text-primary px-8 py-3 rounded-full hover:bg-primary/10 transition-all duration-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  Узнать больше →
                </Link>
                <a
                  href={crystalContent.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-sm tracking-[0.15em] uppercase bg-primary/10 border border-primary/30 text-primary px-6 py-3 rounded-full hover:bg-primary/20 transition-all duration-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  {crystalContent.telegramButtonText}
                </a>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default CrystalOfTheDay;
