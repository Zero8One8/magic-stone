import { Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import TestimonialsSection from "@/components/TestimonialsSection";
import { ArrowLeft, Eye, Shield, Zap, Heart, MessageCircle, CheckCircle2 } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { SITE_LINKS_DEFAULTS } from "@/content/siteDefaults";
import { useSiteContent } from "@/lib/siteContent";
import PageSEO from "@/components/PageSEO";

const chakras = [
  {
    num: "1",
    name: "Муладхара",
    sanskrit: "Mūlādhāra",
    location: "Основание позвоночника",
    color: "#FF4B4B",
    element: "🌍 Земля",
    mantra: "ЛАМ",
    keywords: "Безопасность, стабильность, выживание, опора",
    signs: "Хроническая тревога, страхи, нестабильность, проблемы с деньгами и жильём, болезни ног, позвоночника, прямой кишки.",
    stones: "Чёрный турмалин, гематит, обсидиан, красный яшма, гранат",
    meditation: "Сядьте, ощутите вес тела на земле. Повторяйте ЛАМ 7 раз, представляя красный свет в основании позвоночника.",
    affirmation: "Я в безопасности. Земля поддерживает меня. У меня есть всё, что нужно.",
  },
  {
    num: "2",
    name: "Свадхистана",
    sanskrit: "Svādhiṣṭhāna",
    location: "Область крестца, ниже пупка",
    color: "#FF8C00",
    element: "💧 Вода",
    mantra: "ВАМ",
    keywords: "Эмоции, сексуальность, творчество, удовольствие",
    signs: "Подавленные эмоции, творческий блок, сексуальные проблемы, зависимости, болезни почек, мочевого пузыря, репродуктивной системы.",
    stones: "Карнелиан, оранжевый кальцит, лунный камень, перламутр",
    meditation: "Лягте, положите руки на живот ниже пупка. Повторяйте ВАМ, чувствуя, как оранжевый свет разливается волной тепла.",
    affirmation: "Я разрешаю себе чувствовать. Мои эмоции — это моя сила, а не слабость.",
  },
  {
    num: "3",
    name: "Манипура",
    sanskrit: "Maṇipūra",
    location: "Солнечное сплетение",
    color: "#FFD700",
    element: "🔥 Огонь",
    mantra: "РАМ",
    keywords: "Воля, сила, уверенность, самооценка",
    signs: "Неуверенность в себе, зависимость от чужого мнения, прокрастинация, потеря воли, проблемы с желудком, поджелудочной, печенью.",
    stones: "Цитрин, тигровый глаз, жёлтый яспис, пирит, янтарь",
    meditation: "Дышите животом. На выдохе произносите РАМ и представляйте яркое жёлтое пламя в солнечном сплетении, сжигающее сомнения.",
    affirmation: "Я обладаю силой действовать. Моя воля чиста и направлена на благо.",
  },
  {
    num: "4",
    name: "Анахата",
    sanskrit: "Anāhata",
    location: "Центр груди",
    color: "#3CB371",
    element: "🌬️ Воздух",
    mantra: "ЙАМ",
    keywords: "Любовь, сострадание, принятие, исцеление",
    signs: "Закрытость, недоверие, старые обиды, страх близости, горе, болезни сердца, лёгких, верхней части спины.",
    stones: "Розовый кварц, родонит, малахит, зелёный авантюрин, изумруд",
    meditation: "Положите руку на грудь. На вдохе — любовь к себе, на выдохе — ЙАМ. Зелёный свет обволакивает сердце теплом.",
    affirmation: "Я достоин любви. Я открываю сердце и принимаю себя таким, какой я есть.",
  },
  {
    num: "5",
    name: "Вишудха",
    sanskrit: "Viśuddha",
    location: "Область горла",
    color: "#4169E1",
    element: "🌌 Пространство (эфир)",
    mantra: "ХАМ",
    keywords: "Общение, самовыражение, честность, творчество",
    signs: "Страх говорить правду, трудности с самовыражением, ложь себе, болезни горла, щитовидной железы, шеи.",
    stones: "Голубой топаз, аквамарин, лазурит, бирюза, ангелит",
    meditation: "Опустите подбородок к груди, затем медленно поднимите. Произносите ХАМ с вибрацией в горле. Голубой свет очищает.",
    affirmation: "Мой голос важен. Я говорю свою правду ясно, честно и с любовью.",
  },
  {
    num: "6",
    name: "Аджна",
    sanskrit: "Ājñā",
    location: "Область третьего глаза (лоб)",
    color: "#6A0DAD",
    element: "✨ Свет",
    mantra: "АУМ",
    keywords: "Интуиция, ясновидение, мудрость, внутреннее знание",
    signs: "Спутанность мыслей, игнорирование интуиции, головные боли, нарушения сна, проблемы со зрением и гормонами.",
    stones: "Лабрадорит, лазурит, аметист, флюорит, иолит",
    meditation: "Прикройте глаза, направьте взгляд в точку между бровями. Медленно произносите ОМ. Индиго-свет пульсирует в центре лба.",
    affirmation: "Я доверяю своей интуиции. Моё внутреннее знание ведёт меня верным путём.",
  },
  {
    num: "7",
    name: "Сахасрара",
    sanskrit: "Sahasrāra",
    location: "Макушка головы",
    color: "#9B59B6",
    element: "🌀 Мысль/сознание",
    mantra: "ОМ",
    keywords: "Связь с высшим, осознанность, духовность, просветление",
    signs: "Духовная пустота, ощущение бессмысленности, отрезанность от мира, депрессии, хронические боли без причины.",
    stones: "Аметист, горный хрусталь, селенит, лепидолит, белый топаз",
    meditation: "Сядьте в тишине. Представьте тысячелепестковый лотос на макушке, раскрывающийся в поток фиолетово-белого света сверху.",
    affirmation: "Я связан с Высшим. Я часть бесконечного потока жизни и мудрости.",
  },
];

const steps = [
  {
    num: "01",
    title: "Отправьте 2 фотографии",
    desc: "Фото спереди и сзади в полный рост, глаза смотрят в камеру. Нейтральный фон, свободная одежда, без аксессуаров.",
  },
  {
    num: "02",
    title: "Мастер проводит диагностику",
    desc: "Полный анализ энергетических центров, блоков, привязок, наличия программ и деструктивных влияний. Срок — до 48 часов.",
  },
  {
    num: "03",
    title: "Получите персональный отчёт",
    desc: "Подробное описание состояния каждой чакры, выявленных проблем и рекомендации по камням, подобранным индивидуально под вас.",
  },
];

const includes = [
  { icon: Eye, text: "Диагностика 7 основных энергетических центров" },
  { icon: Shield, text: "Выявление блоков, привязок и деструктивных программ" },
  { icon: Zap, text: "Оценка общего энергетического состояния" },
  { icon: Heart, text: "Индивидуальный подбор камней под ваш запрос" },
];

const Diagnostika = () => {
  const siteLinks = useSiteContent("site_links", SITE_LINKS_DEFAULTS);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageSEO
        title="Индивидуальная диагностика"
        description="Глубокий разбор энергетики и подбор камней для ваших задач. Диагностика по чакрам, знаку зодиака, намерению."
        path="/diagnostika"
      />
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
          <Link to="/quiz" className="text-primary/70 hover:text-primary text-sm transition-colors">
            Бесплатная мини-диагностика →
          </Link>
        </div>
      </div>

      <div className="pt-24 pb-20 px-6">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <AnimateOnScroll>
            <p className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-6">
              Индивидуальная работа
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8">
              <span className="text-foreground">Диагностика</span><br />
              <span className="text-gradient-gold italic">энергетических центров</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light mb-4">
              Глубинный анализ вашего энергетического поля по фото. Не гадание — 
              а точная диагностика состояния чакр, блоков и деструктивных программ.
            </p>
            <p className="text-muted-foreground/50 text-sm max-w-md mx-auto">
              Проводит практикующий мастер с многолетним опытом работы с энергетикой и натуральными минералами
            </p>
          </AnimateOnScroll>
        </div>

        {/* What you get */}
        <div className="max-w-3xl mx-auto mb-20">
          <AnimateOnScroll>
            <h2 className="font-display text-2xl md:text-3xl text-center mb-12 font-light">
              Что входит в диагностику
            </h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-4">
            {includes.map(({ icon: Icon, text }, i) => (
              <AnimateOnScroll key={i} delay={i * 100}>
                <div className="flex items-start gap-4 p-5 rounded-xl border border-border/50 bg-card/30">
                  <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/80 text-sm leading-relaxed">{text}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-3xl mx-auto mb-20">
          <AnimateOnScroll>
            <h2 className="font-display text-2xl md:text-3xl text-center mb-12 font-light">
              Как это работает
            </h2>
          </AnimateOnScroll>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <AnimateOnScroll key={i} delay={i * 120}>
                <div className="flex gap-6 p-6 rounded-xl border border-border/50 bg-card/30">
                  <span className="text-primary/40 font-display text-3xl font-light flex-shrink-0 leading-none pt-1">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-display text-xl mb-2 font-light">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Chakras Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <AnimateOnScroll>
            <h2 className="font-display text-2xl md:text-3xl text-center mb-4 font-light">
              7 энергетических центров
            </h2>
            <p className="text-muted-foreground text-sm text-center max-w-xl mx-auto mb-12">
              Диагностика охватывает все семь чакр. Каждый центр отвечает за определённую сферу жизни — физическую, эмоциональную и духовную.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {chakras.map((chakra) => (
                <div key={`quick-${chakra.num}`} className="rounded-lg border border-border/50 bg-card/30 px-3 py-2.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: chakra.color }}
                    >
                      {chakra.num}
                    </span>
                    <p className="text-xs font-medium text-foreground truncate">{chakra.name}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{chakra.keywords}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground/70 mb-8">
              Нужна ещё более детальная расшифровка по каждой чакре? Ниже полный разбор каждого центра.
            </p>
          </AnimateOnScroll>

          <div className="space-y-4">
            {chakras.map((chakra, i) => (
              <AnimateOnScroll key={i} delay={i * 80}>
                <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    {/* Цветной маркер + номер */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                      style={{ backgroundColor: chakra.color }}
                    >
                      {chakra.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <h3 className="font-display text-lg font-light">{chakra.name}</h3>
                        <span className="text-muted-foreground/50 text-xs italic">{chakra.sanskrit}</span>
                        <span className="text-xs text-muted-foreground/40">· {chakra.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-2">
                        <span className="text-xs text-muted-foreground/60">{chakra.element}</span>
                        <span className="text-xs font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded">мантра: {chakra.mantra}</span>
                      </div>
                      <p className="text-primary/70 text-xs mb-3">{chakra.keywords}</p>
                      <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground/80 mb-3">
                        <div>
                          <span className="text-foreground/60 font-medium">Признаки блока: </span>
                          {chakra.signs}
                        </div>
                        <div>
                          <span className="text-foreground/60 font-medium">Камни: </span>
                          {chakra.stones}
                        </div>
                      </div>
                      <div className="border-t border-border/30 pt-2 mt-1 space-y-1">
                        <p className="text-xs text-muted-foreground/70">
                          <span className="text-foreground/50 font-medium">Медитация: </span>
                          {chakra.meditation}
                        </p>
                        <p className="text-xs text-primary/60 italic">✦ {chakra.affirmation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* Why not just a quiz */}
        <div className="max-w-3xl mx-auto mb-20">
          <AnimateOnScroll>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-12">
              <h2 className="font-display text-2xl md:text-3xl mb-6 font-light text-center">
                Чем отличается от бесплатного квиза?
              </h2>
              <div className="space-y-4 text-sm text-foreground/80 leading-relaxed max-w-xl mx-auto">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Квиз</strong> — алгоритм подбирает камни по вашим ответам. Это хорошая отправная точка, но она не видит глубинных процессов.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Диагностика мастера</strong> — считывание реального состояния энергетического поля. Видны скрытые блоки, привязки, деструктивные программы и сущности, которые невозможно определить через вопросы.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p><strong className="text-foreground">Подбор камней</strong> после диагностики — точечный, под конкретные задачи и проблематику, с учётом индивидуальной энергетики.</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA */}
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <div className="rounded-2xl border border-border/50 bg-card/50 p-8 md:p-14">
              <h2 className="font-display text-3xl md:text-4xl mb-4 font-light">
                Готовы узнать <span className="text-gradient-gold italic">правду</span>?
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                Запись на диагностику — через Telegram-бот. Там же вы сможете ознакомиться со всеми услугами и задать вопросы мастеру.
              </p>
              <a
                href={`${siteLinks.botUrl}?start=diagnostika`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                Записаться на диагностику
              </a>
              <p className="text-muted-foreground/40 text-xs mt-4">
                Ответ в течение 24 часов
              </p>
            </div>
          </AnimateOnScroll>

          {/* Резервная форма заявки */}
          <AnimateOnScroll className="mt-12">
            <div className="max-w-lg mx-auto">
              <p className="text-muted-foreground/60 text-xs text-center mb-4">
                Или оставьте заявку прямо на сайте — мы сами свяжемся с вами
              </p>
              <ContactForm />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="mt-12">
            <p className="text-muted-foreground/50 text-xs leading-relaxed max-w-sm mx-auto">
              Диагностика не является медицинской услугой и не заменяет обращение к врачу. 
              Работа с энергетикой — это дополнительный инструмент самопознания.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
};

export default Diagnostika;
