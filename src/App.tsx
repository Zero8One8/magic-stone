import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Component, Suspense, lazy, type ReactNode } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index";

const LAZY_RELOAD_KEY = "app-lazy-reload-attempted";

const lazyWithRetry = <T extends { default: React.ComponentType<unknown> }>(
  importer: () => Promise<T>
) =>
  lazy(async () => {
    const timeout = new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error("Chunk load timeout")), 15000);
    });

    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(LAZY_RELOAD_KEY);
      }

      return await Promise.race([importer(), timeout]);
    } catch (error) {
      if (typeof window !== "undefined") {
        const hasRetried = window.sessionStorage.getItem(LAZY_RELOAD_KEY) === "1";
        if (!hasRetried) {
          window.sessionStorage.setItem(LAZY_RELOAD_KEY, "1");
          window.location.reload();
          return new Promise<never>(() => {
            // Wait for page reload.
          });
        }
      }

      throw error;
    }
  });

// Lazy load non-critical routes; keep homepage eager to avoid initial black screen.
const Catalog = lazyWithRetry(() => import("./pages/Catalog.tsx"));
const CrystalDetail = lazyWithRetry(() => import("./pages/CrystalDetail.tsx"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound.tsx"));
const Quiz = lazyWithRetry(() => import("./pages/Quiz.tsx"));
const Diagnostika = lazyWithRetry(() => import("./pages/Diagnostika.tsx"));
const FAQ = lazyWithRetry(() => import("./pages/FAQ.tsx"));
const Compatibility = lazyWithRetry(() => import("./pages/Compatibility.tsx"));
const Meditations = lazyWithRetry(() => import("./pages/Meditations.tsx"));
const Compare = lazyWithRetry(() => import("./pages/Compare.tsx"));
const Blog = lazyWithRetry(() => import("./pages/Blog.tsx"));
const BlogArticle = lazyWithRetry(() => import("./pages/BlogArticle.tsx"));
const Favorites = lazyWithRetry(() => import("./pages/Favorites.tsx"));
const About = lazyWithRetry(() => import("./pages/About.tsx"));
const BirthstoneCalculator = lazyWithRetry(() => import("./pages/BirthstoneCalculator.tsx"));
const ChakraMap = lazyWithRetry(() => import("./pages/ChakraMap.tsx"));
const MoonCalendar = lazyWithRetry(() => import("./pages/MoonCalendar.tsx"));
const Services = lazyWithRetry(() => import("./pages/Services.tsx"));
const Shop = lazyWithRetry(() => import("./pages/Shop.tsx"));
const Admin = lazyWithRetry(() => import("./pages/Admin.tsx"));
const AdminLogin = lazyWithRetry(() => import("./pages/AdminLogin.tsx"));
const PaymentSuccess = lazyWithRetry(() => import("./pages/PaymentSuccess.tsx"));
const PaymentFail = lazyWithRetry(() => import("./pages/PaymentFail.tsx"));
const DeliveryCheckout = lazyWithRetry(() => import("./pages/DeliveryCheckout.tsx"));

import CookieBanner from "./components/CookieBanner";
import QuizPopup from "./components/QuizPopup";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";

// Loading component for lazy boundaries
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-lg text-muted-foreground">Загрузка...</div>
  </div>
);

type AppErrorBoundaryState = {
  hasError: boolean;
};

class AppErrorBoundary extends Component<{ children: ReactNode }, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[App] Runtime render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="max-w-lg w-full border border-border rounded-2xl bg-card p-8 text-center">
            <h1 className="font-serif text-2xl text-foreground mb-3">Не удалось загрузить страницу</h1>
            <p className="text-muted-foreground mb-6">
              Обычно это связано с устаревшим кешем браузера после обновления сайта.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Обновить страницу
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:name" element={<CrystalDetail />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/diagnostika" element={<Diagnostika />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/compatibility" element={<Compatibility />} />
              <Route path="/meditations" element={<Meditations />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="/birthstone" element={<BirthstoneCalculator />} />
              <Route path="/chakras" element={<ChakraMap />} />
              <Route path="/moon" element={<MoonCalendar />} />
              <Route path="/services" element={<Services />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/fail" element={<PaymentFail />} />
              <Route path="/delivery" element={<DeliveryCheckout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          <CookieBanner />
          <QuizPopup />
          <ChatWidget />
        </BrowserRouter>
      </AppErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
