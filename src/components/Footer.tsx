import { Link } from "react-router-dom";
import EmailSubscription from "@/components/EmailSubscription";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const Footer = () => {
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

            {/* Подписка */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Подписка</h4>
              <p className="text-muted-foreground text-sm mb-3">Советы про камни и практики</p>
              <EmailSubscription />
            </div>
          </div>

          {/* Разделитель */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>© 2026 Магия Камней. Все права защищены.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="https://t.me/Magic_ofstone" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Telegram
                </a>
                <a href="https://instagram.com/magic.ofstone" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  Instagram
                </a>
                <a href="https://t.me/magicstonechat" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
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
