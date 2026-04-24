import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Shield, Heart, Eye, Star, Zap, CreditCard, Droplets } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ContactForm from "@/components/ContactForm";
import PaymentButton from "@/components/PaymentButton";
import { SITE_SERVICES_DEFAULTS, type SiteService } from "@/content/siteDefaults";
import { useSiteContent } from "@/lib/siteContent";

const serviceIcons = {
  Eye,
  Sparkles,
  Shield,
  Heart,
  Droplets,
} satisfies Record<SiteService["icon"], React.ElementType>;

const Services = () => {
  const services = useSiteContent("site_services", SITE_SERVICES_DEFAULTS);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </div>

      <section className="container mx-auto px-4 py-12 text-center">
        <AnimateOnScroll>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-6 flex items-center justify-center">
            <Star className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Услуги мастера
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            От диагностики до полного сопровождения — выберите формат работы,
            который подходит именно вам. Все услуги доступны дистанционно.
            Оплата доступна на сайте, после оплаты вы получите форму для оформления доставки/сопровождения.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {services.map((service) => (
            <AnimateOnScroll key={service.title}>
              {(() => {
                const Icon = serviceIcons[service.icon] ?? Sparkles;

                return (
              <div
                className={`bg-card rounded-2xl border p-6 md:p-8 transition-colors ${
                  service.featured
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : "border-border"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        service.featured ? "bg-primary/20" : "bg-secondary"
                      }`}>
                        <Icon className={`w-5 h-5 ${service.featured ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h2 className="font-serif text-xl font-bold text-foreground">{service.title}</h2>
                        <span className="text-primary font-medium text-sm">{service.price}</span>
                      </div>
                      {service.featured && (
                        <span className="ml-auto bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-medium">
                          Популярное
                        </span>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Что входит:</h4>
                      <ul className="grid sm:grid-cols-2 gap-1.5">
                        {service.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Zap className="w-3 h-3 text-primary mt-1 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="md:w-48 shrink-0 space-y-3">
                    {typeof service.priceRub === "number" ? (
                      <PaymentButton
                        amount={service.priceRub}
                        orderSlug={service.orderSlug!}
                        itemName={service.title}
                        itemType="service"
                        cta={service.cta}
                        variant={service.featured ? "default" : "outline"}
                        className="w-full gap-2"
                      />
                    ) : (
                      <a href={service.link!} target="_blank" rel="noopener noreferrer">
                        <Button
                          className="w-full"
                          variant={service.featured ? "default" : "outline"}
                          size="lg"
                        >
                          {service.cta}
                        </Button>
                      </a>
                    )}
                    {service.secondaryLink && service.secondaryCta && (
                      <a href={service.secondaryLink} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full" variant="ghost" size="lg">
                          {service.secondaryCta}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
                );
              })()}
            </AnimateOnScroll>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Не знаете, какая услуга вам подходит? Пройдите бесплатный квиз — он поможет
            определить ваши текущие потребности и подскажет оптимальный формат работы.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Link to="/quiz">
              <Button variant="outline">Пройти квиз</Button>
            </Link>
            <Link to="/diagnostika">
              <Button variant="outline">Подробнее о диагностике</Button>
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-muted-foreground/60 text-xs text-center mb-4">
              Или оставьте заявку на сайте — мы сами свяжемся с вами
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
