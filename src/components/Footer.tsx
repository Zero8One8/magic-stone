import { Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { SITE_LINKS_DEFAULTS } from "@/content/siteDefaults";
import { useSiteContent } from "@/lib/siteContent";

const Footer = () => {
  const siteLinks = useSiteContent("site_links", SITE_LINKS_DEFAULTS);

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Бренд */}
            <div>
              <h3 className="font-serif text-lg font-bold mb-3">Магия Камней</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Натуральные камни, практики и путь к себе. Без эзотерического тумана.
              </p>
            </div>

            {/* Навигация */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Навигация</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">Каталог</Link></li>
                <li><Link to="/quiz" className="text-muted-foreground hover:text-primary transition-colors">Квиз подбора</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">О проекте</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Услуги */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Услуги</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/diagnostika" className="text-muted-foreground hover:text-primary transition-colors">Диагностика</Link></li>
                <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Консультация</Link></li>
                <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Магазин</Link></li>
              </ul>
            </div>

            {/* Telegram-канал */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Telegram-канал</h4>
              <p className="text-muted-foreground text-sm mb-3">Советы про камни, практики и разборы — выходят в нашем канале</p>
              <a
                href={siteLinks.telegramChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Подписаться на канал
              </a>
            </div>
          </div>

          {/* Разделитель */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>© 2026 Магия Камней. Все права защищены.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href={siteLinks.telegramChannelUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Telegram
                </a>
                <a href={siteLinks.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Instagram
                </a>
                <a href={siteLinks.telegramChatUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Контакты
                </a>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </footer>
  );
};

export default Footer;
