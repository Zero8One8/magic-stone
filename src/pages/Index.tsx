import HeroSection from "@/components/HeroSection";
import ArticleSection from "@/components/ArticleSection";
import StoriesSection from "@/components/StoriesSection";
import CrystalOfTheDay from "@/components/CrystalOfTheDay";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import PhilosophySection from "@/components/PhilosophySection";
import ChannelSection from "@/components/ChannelSection";
import ClosingSection from "@/components/ClosingSection";
import PageSEO from "@/components/PageSEO";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-hidden pt-0">
      <PageSEO
        title="Магия камней — энергетические украшения и диагностика"
        description="Браслеты, чётки и свечи из натуральных камней. Индивидуальная диагностика и подбор камней по чакрам, знаку зодиака и запросу. Мастер Световар."
        path="/"
      />
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
