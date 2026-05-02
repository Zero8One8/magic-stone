import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Shield, Heart, Eye, Star, Zap, BookOpen, Users, Flame, Moon, Wind, Droplets } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ContactForm from "@/components/ContactForm";

const services = [
  {
    icon: Eye,
    title: "Индивидуальная диагностика",
    price: "5 000 ₽",
    badge: "Популярное",
    description: "Глубокий энергоинформационный анализ вашего состояния по двум фотографиям (спереди и сзади в полный рост). Вы получите полную картину состояния всех энергетических центров, информацию о блоках, привязках, деструктивных программах и сущностях. По результатам диагностики формируется детальный отчёт с рекомендациями.",
    includes: [
      "Анализ всех семи энергетических центров",
      "Выявление блоков и привязок",
      "Обнаружение деструктивных программ и сущностей",
      "Детальный письменный отчёт",
      "Персональные рекомендации по камням и практикам",
    ],
    cta: "Записаться на диагностику",
    link: "https://t.me/Themagicofstonesbot?start=diagnostika",
    featured: true,
  },
  {
    icon: Sparkles,
    title: "Подбор камней",
    price: "2 500 ₽",
    badge: null,
    description: "Индивидуальный подбор минералов на основе вашей диагностики и конкретных запросов. Каждый набор камней формируется с учётом совместимости минералов между собой и с вашей уникальной энергетикой. Вы получаете не просто камни — а рабочий инструмент для решения конкретных жизненных задач.",
    includes: [
      "Подбор камней под ваши запросы и задачи",
      "Проверка совместимости минералов между собой",
      "Инструкция по использованию и активации",
      "Рекомендации по уходу за камнями",
    ],
    cta: "Узнать подробнее",
    link: "https://t.me/The_magic_of_stones_bot?start=podbor",
    featured: false,
  },
  {
    icon: Shield,
    title: "Снятие блоков и привязок",
    price: "от 5 000 ₽",
    badge: null,
    description: "Целенаправленная работа по устранению энергетических блоков, привязок и деструктивных программ, выявленных в ходе диагностики. Работа проводится дистанционно и включает несколько сеансов в зависимости от сложности ситуации. После каждого сеанса — обратная связь о проделанной работе.",
    includes: [
      "Предварительная диагностика состояния",
      "Работа с выявленными блоками",
      "Снятие энергетических привязок",
      "Обратная связь после каждого сеанса",
      "Контрольная диагностика по завершении",
    ],
    cta: "Записаться",
    link: "https://t.me/magicstonechat",
    featured: false,
  },
  {
    icon: Flame,
    title: "Агнихотра и ягья",
    price: "по запросу",
    badge: "Новое",
    description: "Агнихотра — ведическое огненное очищение, проводимое строго на восходе и закате солнца. Ягья — расширенный огненный ритуал с мантрами, направленный на конкретное намерение: здоровье, процветание, защита рода, исцеление отношений. Проводится лично или дистанционно через удерживаемое намерение с передачей фото- и видеоотчёта.",
    includes: [
      "Подготовка к ритуалу: выбор благоприятного времени",
      "Проведение агнихотры / ягьи мастером лично",
      "Чтение ведических мантр для вашего намерения",
      "Фото- и видеоотчёт о проведении",
      "Рекомендации по поддержанию результата",
    ],
    cta: "Узнать подробнее",
    link: "https://t.me/SvetozarAdidev",
    featured: false,
  },
  {
    icon: Moon,
    title: "Подношение предкам",
    price: "по запросу",
    badge: "Новое",
    description: "Ритуальное подношение духам рода — один из наиболее мощных инструментов работы с родовыми программами. Помогает исцелить незакрытые долги, получить поддержку Рода, снять родовые проклятия и восстановить родовой поток силы. Проводится мастером с индивидуальной настройкой на вашу родовую линию.",
    includes: [
      "Диагностика состояния родовой линии",
      "Индивидуальная подготовка ритуала",
      "Проведение подношения мастером",
      "Работа с конкретным запросом: здоровье, деньги, отношения, потомки",
      "Рекомендации по дальнейшей работе с Родом",
    ],
    cta: "Написать мастеру",
    link: "https://t.me/SvetozarAdidev",
    featured: false,
  },
  {
    icon: Heart,
    title: "Индивидуальное сопровождение",
    price: "30 000 ₽ / мес",
    badge: null,
    description: "Комплексная программа трансформации с регулярными диагностиками, подбором камней и персональной поддержкой. Включает еженедельные сессии обратной связи, корректировку практик и полное сопровождение на протяжении всего процесса. Идеально для тех, кто готов к глубокой системной работе над собой.",
    includes: [
      "Очищение того, что препятствует внутренней ясности",
      "Восстановление утраченного ресурса и внутренней опоры",
      "Гармонизация связи с Родом, пространством и жизненным Потоком",
      "Сопровождение к более осознанной и устойчивой Реализации",
      "Индивидуальные медитативные практики",
      "Регулярные сессии обратной связи",
    ],
    cta: "Обсудить программу",
    link: "https://t.me/SvetozarAdidev",
    featured: false,
  },
  {
    icon: BookOpen,
    title: "Консультация по камням",
    price: "1 500 ₽",
    badge: null,
    description: "Консультация проходит в формате голосового звонка по заранее подготовленным ответам на ваши вопросы, продолжительность 25 минут.",
    includes: [
      "Ответы на ваши вопросы о камнях",
      "Анализ вашей коллекции минералов",
      "Проверка совместимости камней",
      "Рекомендации по использованию",
    ],
    cta: "Записаться на консультацию",
    link: "https://t.me/magicstonechat",
    featured: false,
  },
  {
    icon: Wind,
    title: "Энергетическая чистка",
    price: "от 3 000 ₽",
    badge: null,
    description: "Очищение ауры, личного пространства или конкретного предмета от негативных энергий, программ и чужеродных влияний. Проводится дистанционно или лично с применением кристаллов, мантр и огненных практик. После чистки — ощущение лёгкости, прояснение сознания, восстановление внутреннего ресурса.",
    includes: [
      "Предварительная диагностика объекта очистки",
      "Очищение ауры и энергетического поля",
      "Работа с пространством (дом, рабочее место)",
      "Применение кристаллов и ведических практик",
      "Рекомендации по поддержанию чистоты пространства",
    ],
    cta: "Записаться на чистку",
    link: "https://t.me/SvetozarAdidev",
    featured: false,
  },
  {
    icon: Droplets,
    title: "Отливка воском",
    price: "2 500 ₽",
    badge: null,
    description: "Народная диагностическая практика выявления страхов, деструктивных программ, негативных влияний и скрытых причин жизненных трудностей. Воск заливается в воду на определённые точки тела с чтением очищающих заговоров. По форме отлитой фигуры мастер читает информацию о вашей ситуации и даёт развёрнутую интерпретацию.",
    includes: [
      "Диагностика через форму воскового отлива",
      "Чтение программ, страхов, блоков",
      "Очищающий ритуал с заговорами",
      "Развёрнутая интерпретация результата",
      "Рекомендации по закреплению эффекта",
    ],
    cta: "Записаться на отливку",
    link: "https://t.me/SvetozarAdidev",
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

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center">
        <AnimateOnScroll>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-6 flex items-center justify-center">
            <Star className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Услуги мастера
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            От энергетической диагностики до священных ведических ритуалов — выберите формат работы,
            который подходит именно вам. Все услуги доступны дистанционно.
            Запись через Telegram.
          </p>
        </AnimateOnScroll>
      </section>

      {/* Master bio */}
      <section className="container mx-auto px-4 pb-12">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/20 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-700/40 to-primary/40 flex items-center justify-center shrink-0 text-3xl select-none">
                🧘
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary mb-1">О мастере</p>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Светозар Адидев</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  Мастер энергоинформационной диагностики и работы с камнями. Практикует ведические ритуалы — агнихотру и ягью, проводит работу с родовыми программами и подношение предкам. Более 7 лет в практике глубинной трансформации.
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Каждый человек — это уникальная система. Задача мастера — увидеть, что мешает потоку, и помочь убрать это с пути. Камни, огонь, работа с Родом — инструменты разные, цель одна: ваша внутренняя свобода и реализация.
                </p>
                <div className="mt-4">
                  <a
                    href="https://t.me/SvetozarAdidev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary text-sm hover:underline font-medium"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.34 13.803l-2.94-.916c-.64-.203-.654-.64.135-.954l11.566-4.458c.537-.194 1.006.131.793.746z"/>
                    </svg>
                    @SvetozarAdidev
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Services list */}
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        service.featured ? "bg-primary/20" : "bg-secondary"
                      }`}>
                        <service.icon className={`w-5 h-5 ${service.featured ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-serif text-xl font-bold text-foreground">{service.title}</h2>
                        <span className="text-primary font-medium text-sm">{service.price}</span>
                      </div>
                      {service.badge && (
                        <span className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium ${
                          service.badge === "Новое"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-primary/20 text-primary"
                        }`}>
                          {service.badge}
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
                    <a href={service.link} target="_blank" rel="noopener noreferrer">
                      <Button
                        className="w-full"
                        variant={service.featured ? "default" : "outline"}
                        size="lg"
                      >
                        {service.cta}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Не знаете, с чего начать? Пройдите бесплатный квиз — он поможет определить
            ваши текущие потребности и подскажет оптимальный формат работы.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Link to="/quiz">
              <Button variant="outline">Пройти квиз</Button>
            </Link>
            <a href="https://t.me/SvetozarAdidev" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">Написать мастеру</Button>
            </a>
          </div>

          <div className="mt-12">
            <p className="text-muted-foreground/60 text-xs text-center mb-4">
              Или оставьте заявку — мы свяжемся с вами сами
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
