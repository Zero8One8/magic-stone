import { useState } from "react";
import { Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { SITE_FAQ_DEFAULTS } from "@/content/siteDefaults";
import { useSiteContent } from "@/lib/siteContent";
import PageSEO from "@/components/PageSEO";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const faqs = useSiteContent("site_faq", SITE_FAQ_DEFAULTS);

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageSEO
        title="Частые вопросы"
        description="Ответы на вопросы о камнях, их свойствах, очищении, ношении и работе с энергетикой минералов."
        path="/faq"
      />
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2">
            На главную
          </Link>
          <Link to="/diagnostika" className="text-primary/70 hover:text-primary text-sm transition-colors">
            Диагностика мастера →
          </Link>
        </div>
      </div>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimateOnScroll>
            <p className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-6">Ответы на вопросы</p>
            <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-6">
              Частые <span className="text-gradient-gold italic">вопросы</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Всё, что нужно знать о камнях, диагностике и работе с энергетикой
            </p>
          </AnimateOnScroll>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((section) => (
            <AnimateOnScroll key={section.category}>
              <h2 className="font-display text-2xl mb-6 font-light text-foreground">
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.items.map((item, i) => {
                  const id = `${section.category}-${i}`;
                  const isOpen = openItems.has(id);
                  return (
                    <div
                      key={id}
                      className="border border-border/50 rounded-xl overflow-hidden bg-card/30"
                    >
                      <button
                        onClick={() => toggle(id)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-card/60 transition-colors"
                      >
                        <span className="font-body text-sm text-foreground/90 pr-4">{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="font-body text-sm text-muted-foreground leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FAQ;
