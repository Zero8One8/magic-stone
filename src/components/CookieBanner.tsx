import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "cookie_consent_accepted";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с нашей{" "}
          <a href="/privacy" className="underline text-primary hover:text-primary/80">политикой конфиденциальности</a>.
        </p>
        <Button onClick={accept} size="sm" className="whitespace-nowrap">
          Принять
        </Button>
      </div>
    </div>
  );
};

export default CookieBanner;
