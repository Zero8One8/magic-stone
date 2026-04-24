import { Link } from "react-router-dom";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ArrowLeft, Clock, Moon, Sun, Sunrise } from "lucide-react";
import PageSEO from "@/components/PageSEO";

const meditations = [
  {
    title: "Утреннее заземление",
    stone: "Чёрный турмалин или Гематит",
    duration: "5-7 минут",
    time: "Утро",
    icon: Sunrise,
    steps: [
      "Сядьте удобно, стопы на полу. Возьмите камень в левую руку.",
      "Закройте глаза. Три глубоких вдоха — на выдохе отпускайте всё лишнее.",
      "Представьте, как из основания позвоночника уходит корень глубоко в землю.",
      "Почувствуйте тяжесть камня. Он — якорь. Вы — здесь и сейчас.",
      "С каждым вдохом земля наполняет вас спокойной силой через корень.",
      "Завершите тремя благодарными вдохами. Положите камень у входной двери.",
    ],
    effect: "Заземление, снятие утренней тревоги, настройка на день",
  },
  {
    title: "Раскрытие сердца",
    stone: "Розовый кварц или Родонит",
    duration: "10-15 минут",
    time: "Любое время",
    icon: Sun,
    steps: [
      "Лягте на спину. Положите камень на центр груди — на сердечную чакру.",
      "Положите ладони поверх камня. Закройте глаза.",
      "Дышите медленно. На вдохе — розовый свет заполняет грудь. На выдохе — отпускайте обиду.",
      "Вспомните момент, когда вас любили безусловно. Позвольте этому чувству расшириться.",
      "Мысленно скажите: «Я заслуживаю любви. Я позволяю себе чувствовать».",
      "Полежите ещё 2-3 минуты, просто ощущая тепло камня.",
    ],
    effect: "Работа с обидами, раскрытие эмпатии, самопринятие",
  },
  {
    title: "Очищение перед сном",
    stone: "Аметист или Селенит",
    duration: "10 минут",
    time: "Вечер",
    icon: Moon,
    steps: [
      "Сядьте на край кровати. Камень — в обеих ладонях перед собой.",
      "Три вдоха. С каждым выдохом представляйте, как из тела выходит серый дым — всё, что не ваше.",
      "Поднесите камень ко лбу (третий глаз). Представьте фиолетовый свет.",
      "Мысленно пройдите по событиям дня. Без оценки — просто отпускайте каждое.",
      "Скажите: «Я отпускаю день. Я чист(а). Я в безопасности».",
      "Положите камень на тумбочку рядом с кроватью. Он будет работать, пока вы спите.",
    ],
    effect: "Очищение от дневного негатива, спокойный сон, восстановление",
  },
  {
    title: "Активация интуиции",
    stone: "Лабрадорит или Лазурит",
    duration: "10-15 минут",
    time: "Любое время",
    icon: Sun,
    steps: [
      "Сядьте в тихом месте. Камень — перед вами на уровне глаз.",
      "Смотрите на камень 1-2 минуты, не моргая (столько, сколько комфортно).",
      "Закройте глаза. Положите камень на лоб. Лягте.",
      "Представьте тёмно-синее пространство. Задайте вопрос, который вас волнует.",
      "Не ждите ответа. Просто наблюдайте — образы, чувства, цвета. Всё имеет значение.",
      "Через 10 минут откройте глаза. Запишите первое, что пришло в голову.",
    ],
    effect: "Развитие интуиции, ясность ума, доступ к внутреннему знанию",
  },
  {
    title: "Защитный кокон",
    stone: "Обсидиан или Шунгит",
    duration: "5 минут",
    time: "Перед выходом из дома",
    icon: Sunrise,
    steps: [
      "Встаньте прямо. Камень — в доминантной руке.",
      "Сожмите камень. Почувствуйте его вес и холод.",
      "Представьте, как из камня расходится чёрный блестящий щит — он окутывает вас целиком.",
      "Этот кокон пропускает свет и любовь, но не пропускает чужую агрессию и негатив.",
      "Скажите: «Моя энергия — моя. Чужое — мимо».",
      "Положите камень в карман. Он будет напоминать о защите весь день.",
    ],
    effect: "Энергетическая защита, уверенность, границы",
  },
];

const Meditations = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageSEO
        title="Медитации с камнями"
        description="Практики утренних и вечерних медитаций с кристаллами. Заземление, очищение ауры, работа с чакрами."
        path="/meditations"
      />
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2">
            На главную
          </Link>
          <Link to="/catalog" className="text-primary/70 hover:text-primary text-sm transition-colors">
            Каталог камней →
          </Link>
        </div>
      </div>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimateOnScroll>
            <p className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-6">Практики</p>
            <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-6">
              Медитации <span className="text-gradient-gold italic">с камнями</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Простые, но мощные практики для ежедневной работы с минералами
            </p>
          </AnimateOnScroll>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {meditations.map((med, i) => {
            const Icon = med.icon;
            return (
              <AnimateOnScroll key={i} delay={i * 100}>
                <div className="border border-border/50 rounded-2xl bg-card/30 overflow-hidden">
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="font-display text-2xl font-light mb-2">{med.title}</h2>
                        <p className="font-body text-sm text-primary">{med.stone}</p>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-xs font-body">
                          <Clock className="w-3.5 h-3.5" /> {med.duration}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-body">
                          <Icon className="w-3.5 h-3.5" /> {med.time}
                        </span>
                      </div>
                    </div>

                    <ol className="space-y-3 mb-6">
                      {med.steps.map((step, j) => (
                        <li key={j} className="flex gap-3 font-body text-sm text-foreground/80 leading-relaxed">
                          <span className="text-primary/50 font-display text-sm flex-shrink-0 w-5">{j + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>

                    <div className="pt-4 border-t border-border/30">
                      <p className="font-body text-xs text-muted-foreground">
                        <span className="text-primary/70">Эффект:</span> {med.effect}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll className="max-w-3xl mx-auto mt-12">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-sm text-foreground/80 mb-3">
              Для индивидуального подбора практик и камней под ваши задачи — запишитесь на диагностику
            </p>
            <Link to="/diagnostika" className="inline-block font-body text-sm text-primary hover:underline underline-offset-4">
              Узнать о диагностике →
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </main>
  );
};

export default Meditations;
