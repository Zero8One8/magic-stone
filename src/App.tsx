import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy load all page components
const Index = lazy(() => import("./pages/Index.tsx"));
const Catalog = lazy(() => import("./pages/Catalog.tsx"));
const CrystalDetail = lazy(() => import("./pages/CrystalDetail.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Quiz = lazy(() => import("./pages/Quiz.tsx"));
const Diagnostika = lazy(() => import("./pages/Diagnostika.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Compatibility = lazy(() => import("./pages/Compatibility.tsx"));
const Meditations = lazy(() => import("./pages/Meditations.tsx"));
const Compare = lazy(() => import("./pages/Compare.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogArticle = lazy(() => import("./pages/BlogArticle.tsx"));
const Favorites = lazy(() => import("./pages/Favorites.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const BirthstoneCalculator = lazy(() => import("./pages/BirthstoneCalculator.tsx"));
const ChakraMap = lazy(() => import("./pages/ChakraMap.tsx"));
const MoonCalendar = lazy(() => import("./pages/MoonCalendar.tsx"));
const Services = lazy(() => import("./pages/Services.tsx"));
const Shop = lazy(() => import("./pages/Shop.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword.tsx"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess.tsx"));
const PaymentFail = lazy(() => import("./pages/PaymentFail.tsx"));
const DeliveryCheckout = lazy(() => import("./pages/DeliveryCheckout.tsx"));

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

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
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
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
