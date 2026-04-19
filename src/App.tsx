import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Catalog from "./pages/Catalog.tsx";
import CrystalDetail from "./pages/CrystalDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import Quiz from "./pages/Quiz.tsx";
import Diagnostika from "./pages/Diagnostika.tsx";
import FAQ from "./pages/FAQ.tsx";
import Compatibility from "./pages/Compatibility.tsx";
import Meditations from "./pages/Meditations.tsx";
import Compare from "./pages/Compare.tsx";
import Blog from "./pages/Blog.tsx";
import BlogArticle from "./pages/BlogArticle.tsx";
import Favorites from "./pages/Favorites.tsx";
import About from "./pages/About.tsx";
import BirthstoneCalculator from "./pages/BirthstoneCalculator.tsx";
import ChakraMap from "./pages/ChakraMap.tsx";
import MoonCalendar from "./pages/MoonCalendar.tsx";
import Services from "./pages/Services.tsx";
import Shop from "./pages/Shop.tsx";
import Admin from "./pages/Admin.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import CookieBanner from "./components/CookieBanner";
import QuizPopup from "./components/QuizPopup";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <CookieBanner />
        <QuizPopup />
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
