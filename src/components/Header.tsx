import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Menu, Gem } from "lucide-react";

const navLinks = [
  { to: "/catalog", label: "Каталог" },
  { to: "/quiz", label: "Подбор камня" },
  { to: "/meditations", label: "Медитации" },
  { to: "/services", label: "Услуги" },
  { to: "/shop", label: "Магазин" },
  { to: "/blog", label: "Блог" },
  { to: "/about", label: "О проекте" },
  { to: "/faq", label: "FAQ" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // закрыть меню при навигации
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // блокировать скролл при открытом меню
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Логотип */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-lg font-semibold text-foreground hover:text-primary transition-colors"
          >
            <Gem className="w-5 h-5 text-primary" />
            <span className="text-gradient-gold">Магия Камней</span>
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-body transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Кнопки справа */}
          <div className="flex items-center gap-3">
            <Link
              to="/diagnostika"
              className="hidden sm:inline-block text-xs font-body tracking-wider uppercase border border-primary/40 text-primary px-4 py-2 rounded-full hover:bg-primary/10 transition-all duration-300"
            >
              Диагностика
            </Link>

            {/* Кнопка гамбургер */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent/50 transition-colors text-foreground"
              aria-label="Открыть меню"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню — оверлей */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Мобильное меню — drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-background border-l border-border z-50 lg:hidden flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Шапка drawer */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
          <span className="font-display text-lg text-gradient-gold">Магия Камней</span>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent/50 transition-colors"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ссылки */}
        <nav className="flex flex-col px-4 py-6 gap-1 overflow-y-auto flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-3 rounded-lg text-base font-body transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA внизу */}
        <div className="px-6 py-6 border-t border-border/50">
          <Link
            to="/diagnostika"
            className="block text-center font-body text-sm tracking-wider uppercase bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-all duration-300"
          >
            Диагностика
          </Link>
          <a
            href="https://t.me/Magic_ofstone"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center font-body text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Telegram-канал
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
