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
    <main className="min-h-screen bg-background overflow-hidden">
      <HeroSection />
      <ArticleSection />
      <CrystalOfTheDay />
      <StoriesSection />
      <LeadMagnetSection />
      <PhilosophySection />
      <ChannelSection />
      <ClosingSection />
    </main>
  );
};

export default Index;
