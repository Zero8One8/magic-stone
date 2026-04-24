import { useState } from "react";
import { Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "О камнях",
    items: [
      {
        q: "Как камни могут влиять на состояние?",
        a: "Каждый минерал обладает уникальной кристаллической структурой и частотой вибрации. При контакте с телом камень взаимодействует с энергетическим полем индивида, помогая гармонизировать работу энергетических центров. Это не замена медицине — это дополнительный инструмент для работы с эмоциональным и энергетическим состоянием.",
      },
      {
        q: "Как выбрать свой первый камень?",
        a: "Начните с бесплатного квиза на сайте — он поможет определить направление. Для более точного подбора рекомендуем индивидуальную диагностику мастера. Если хотите разобраться самостоятельно — изучайте каталог, обращая внимание на описание свойств и чакр.",
      },
      {
        q: "Нужно ли очищать камни?",
        a: "Да, камни накапливают энергию и нуждаются в периодической очистке. Самые простые способы: промыть под проточной водой, положить на лунный свет на ночь, или подержать в дыму шалфея. Частота — раз в 1-2 недели при активном использовании.",
      },
      {
        q: "Можно ли носить несколько камней одновременно?",
        a: "Да, но важно учитывать совместимость. Некоторые камни усиливают друг друга, а некоторые конфликтуют. Используйте раздел «Совместимость камней» на сайте или проконсультируйтесь с мастером для подбора гармоничной комбинации.",
      },
    ],
  },
  {
    category: "О диагностике",
    items: [
      {
        q: "Что такое диагностика энергетических центров?",
        a: "Это глубинный анализ состояния вашего энергетического поля по фотографии. Мастер считывает состояние каждой чакры, выявляет блоки, привязки, деструктивные программы и даёт рекомендации по камням, подобранным индивидуально.",
      },
      {
        q: "Чем диагностика отличается от квиза?",
        a: "Квиз — это алгоритм, который подбирает камни по вашим ответам. Диагностика — это считывание реального состояния энергетики мастером. Она видит скрытые проблемы, которые невозможно определить через вопросы: блоки, привязки, сущности, деструктивные программы.",
      },
      {
        q: "Какие фотографии нужны для диагностики?",
        a: "Два фото в полный рост: спереди и сзади. Глаза смотрят в камеру. Нейтральный фон, свободная одежда, без аксессуаров и украшений. Фото должны быть чёткими, при хорошем освещении.",
      },
      {
        q: "Сколько времени занимает диагностика?",
        a: "Мастер проводит диагностику в течение 48 часов после получения фотографий. Вы получите подробный отчёт с описанием состояния каждого энергетического центра и персональными рекомендациями.",
      },
      {
        q: "Это безопасно?",
        a: "Абсолютно. Диагностика — это считывание информации, она не подразумевает вмешательства в ваше энергетическое поле. Мастер только анализирует и рекомендует. Вся дальнейшая работа — по вашему желанию.",
      },
    ],
  },
  {
    category: "Практические вопросы",
    items: [
      {
        q: "Где купить камни?",
        a: "После диагностики или подбора мастер может помочь с приобретением натуральных камней проверенного качества. Все детали — в Telegram-боте.",
      },
      {
        q: "Как записаться на диагностику?",
        a: "Через Telegram-бот @The_magic_of_stones_bot. Там же можно ознакомиться со всеми услугами, ценами и задать вопросы мастеру.",
      },
      {
        q: "Есть ли гарантии?",
        a: "Мастер работает с энергетикой много лет и несёт ответственность за качество диагностики. Однако важно понимать: работа с камнями — это процесс, результаты зависят от вашей вовлечённости и готовности к изменениям.",
      },
    ],
  },
];

const FAQ = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

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
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
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
