import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Shield, Heart, Eye, Star, Zap, BookOpen, Users, CreditCard } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { buildFreekassaUrl, makeOrderId } from "@/lib/freekassa";
import ContactForm from "@/components/ContactForm";

const services = [
  {
    icon: Eye,
    title: "Индивидуальная диагностика",
    price: "5 000 ₽",
    priceRub: 5000,
    orderSlug: "diagnostika",
    description: "Глубокий энергоинформационный анализ вашего состояния по двум фотографиям (спереди и сзади в полный рост). Вы получите полную картину состояния всех энергетических центров, информацию о блоках, привязках, деструктивных программах и сущностях. По результатам диагностики формируется детальный отчёт с рекомендациями.",
    includes: [
      "Анализ всех семи энергетических центров",
      "Выявление блоков и привязок",
      "Обнаружение деструктивных программ",
      "Детальный письменный отчёт",
      "Персональные рекомендации",
    ],
    cta: "Оплатить и записаться",
    link: null,
    featured: true,
  },
  {
    icon: Sparkles,
    title: "Подбор камней",
    price: "2 500 ₽",
    priceRub: 2500,
    orderSlug: "podbor_kamney",
    description: "Индивидуальный подбор минералов на основе вашей диагностики и конкретных запросов. Каждый набор камней формируется с учётом совместимости минералов между собой и с вашей уникальной энергетикой. Вы получаете не просто камни, а рабочий инструмент для решения конкретных жизненных задач.",
    includes: [
      "Подбор камней под ваши задачи",
      "Проверка совместимости минералов",
      "Инструкция по использованию",
      "Рекомендации по уходу за камнями",
    ],
    cta: "Оплатить",
    link: null,
    featured: false,
  },
  {
    icon: Shield,
    title: "Снятие блоков и привязок",
    price: "от 5 000 ₽",
    priceRub: null,
    orderSlug: null,
    description: "Целенаправленная работа по устранению энергетических блоков, привязок и деструктивных программ, выявленных в ходе диагностики. Работа проводится дистанционно и включает несколько сеансов в зависимости от сложности ситуации. После каждого сеанса предоставляется обратная связь о проделанной работе.",
    includes: [
      "Предварительная диагностика",
      "Работа с выявленными блоками",
      "Снятие энергетических привязок",
      "Обратная связь после каждого сеанса",
      "Контрольная диагностика после завершения",
    ],
    cta: "Записаться",
    link: "https://t.me/magicstonechat",
    featured: false,
  },
  {
    icon: Heart,
    title: "Индивидуальное сопровождение",
    price: "30 000 ₽ в месяц",
    priceRub: 30000,
    orderSlug: "soprovozhdenie",
    description: "Комплексная программа трансформации с регулярными диагностиками, подбором камней и персональной поддержкой. Включает еженедельные сессии обратной связи, корректировку практик и полное сопровождение на протяжении всего процесса. Идеально для тех, кто готов к глубокой системной работе над собой.",
    includes: [
      "Очищение того, что препятствует внутренней ясности",
      "Восстановление утраченного ресурса и внутренней опоры",
      "Гармонизация связи с Родом, пространством и жизненным Потоком",
      "Сопровождение к более осознанной и устойчивой Реализации",
      "Индивидуальные медитативные практики",
      "Регулярные сессии обратной связи",
    ],
    cta: "Оплатить программу",
    link: null,
    featured: false,
  },
  {
    icon: BookOpen,
    title: "Консультация по камням",
    price: "1 500 ₽",
    priceRub: 1500,
    orderSlug: "konsultaciya",
    description: "Консультация проходит в формате голосового звонка по заранее подготовленным ответам на ваши вопросы, продолжительность 25 минут.",
    includes: [
      "Ответы на ваши вопросы о камнях",
      "Анализ вашей коллекции минералов",
      "Проверка совместимости камней",
      "Рекомендации по использованию",
    ],
    cta: "Оплатить",
    link: null,
    featured: false,
  },
  {
    icon: Users,
    title: "Медитация с камнями",
    price: "500 ₽",
    priceRub: 500,
    orderSlug: "meditaciya",
    description: "Каждая медитация посвящена определённой теме: заземление, раскрытие сердца, активация интуиции, привлечение изобилия. Что входит: Инструкция по подготовке камней; Гайд по практике; Запись медитации.",
    includes: [
      "Инструкция по подготовке камней",
      "Гайд по практике",
      "Запись медитации",
    ],
    cta: "Оплатить",
    link: null,
    featured: false,
  },
];

const Services = () => {
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
            Запись и оплата через Telegram-бота.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {services.map((service) => (
            <AnimateOnScroll key={service.title}>
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
                        <service.icon className={`w-5 h-5 ${service.featured ? "text-primary" : "text-muted-foreground"}`} />
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

                  <div className="md:w-48 shrink-0">
                    {service.priceRub ? (
                      <a
                        href={buildFreekassaUrl(service.priceRub, makeOrderId(service.orderSlug!))}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          className="w-full gap-2"
                          variant={service.featured ? "default" : "outline"}
                          size="lg"
                        >
                          <CreditCard className="w-4 h-4" />
                          {service.cta}
                        </Button>
                      </a>
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
                  </div>
                </div>
              </div>
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
