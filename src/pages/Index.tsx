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
      <ClosingSection />
      
      {/* Freekassa payment provider banner */}
      <div className="flex justify-center py-8 px-6 bg-background/50">
        <a href="https://freekassa.net" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.freekassa.net/banners/small-white-1.png" title="Прием платежей" alt="Freekassa - прием платежей" />
        </a>
      </div>
    </main>
  );
};

export default Index;
