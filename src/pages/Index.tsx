import HeroSection from "@/components/HeroSection";
import ArticleSection from "@/components/ArticleSection";
import StoriesSection from "@/components/StoriesSection";
import CrystalOfTheDay from "@/components/CrystalOfTheDay";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import PhilosophySection from "@/components/PhilosophySection";
import ChannelSection from "@/components/ChannelSection";
import ClosingSection from "@/components/ClosingSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-hidden pt-0">
      <HeroSection />
      <ArticleSection />
      <CrystalOfTheDay />
      <StoriesSection />
      <LeadMagnetSection />
      <PhilosophySection />
      <ChannelSection />
      
      {/* Freekassa payment provider */}
      <section className="py-8 px-6 bg-gradient-to-r from-primary/20 to-primary/10 border-t-2 border-primary/40">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-3">Безопасный прием платежей</p>
          <a href="https://freekassa.net" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Freekassa — Платежная система
          </a>
        </div>
      </section>
      
      <ClosingSection />
    </main>
  );
};

export default Index;
