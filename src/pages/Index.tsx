import { Suspense, lazy, useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";

const ArticleSection = lazy(() => import("@/components/ArticleSection"));
const StoriesSection = lazy(() => import("@/components/StoriesSection"));
const CrystalOfTheDay = lazy(() => import("@/components/CrystalOfTheDay"));
const LeadMagnetSection = lazy(() => import("@/components/LeadMagnetSection"));
const PhilosophySection = lazy(() => import("@/components/PhilosophySection"));
const ChannelSection = lazy(() => import("@/components/ChannelSection"));
const ClosingSection = lazy(() => import("@/components/ClosingSection"));

const Index = () => {
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    const activateDeferredSections = () => setShowDeferredSections(true);

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(activateDeferredSections, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(activateDeferredSections, 150);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-hidden pt-0">
      <HeroSection />
      {showDeferredSections ? (
        <Suspense fallback={null}>
          <ArticleSection />
          <CrystalOfTheDay />
          <StoriesSection />
          <LeadMagnetSection />
          <PhilosophySection />
          <ChannelSection />
          <ClosingSection />
        </Suspense>
      ) : null}
    </main>
  );
};

export default Index;
