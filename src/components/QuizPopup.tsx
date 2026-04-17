import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "quizPopupShownAt";

const QuizPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastShown = window.localStorage.getItem(STORAGE_KEY);

    if (lastShown === today) {
      setIsShown(true);
      return;
    }

    const openPopup = () => {
      if (!isShown) {
        setIsOpen(true);
        setIsShown(true);
        window.localStorage.setItem(STORAGE_KEY, today);
      }
    };

    const timer = window.setTimeout(openPopup, 30000);

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        openPopup();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isShown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-primary/20 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-6 mx-auto">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>

        <h2 className="font-serif text-2xl font-bold text-center mb-3">
          Подбери свой камень?
        </h2>

        <p className="text-muted-foreground text-center text-sm mb-6">
          Пройди мини-диагностику в 5 вопросов и узнай, какой камень подойдёт именно тебе.
        </p>

        <div className="space-y-3">
          <Link to="/quiz" onClick={() => setIsOpen(false)}>
            <Button className="w-full">
              Начать диагностику
            </Button>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Позже
          </button>
        </div>

        <p className="text-xs text-muted-foreground/60 text-center mt-4">
          Это займёт 2-3 минуты
        </p>
      </div>
    </div>
  );
};

export default QuizPopup;
