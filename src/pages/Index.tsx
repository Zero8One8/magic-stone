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
      <div className="flex justify-center items-center py-8 px-6">
        <a href="https://freekassa.net" target="_blank" rel="noopener noreferrer"><img src="https://freekassa.net/img/logo/freekassa.png" alt="Freekassa - прием платежей" border="0" title="Freekassa" /></a>
      </div>
      
      <ClosingSection />
    </main>
  );
};

export default Index;
