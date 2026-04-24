import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Eye, Shield, Star, ArrowLeft } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const About = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Навигация */}
      <div className="container mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>
      </div>

      {/* Герой */}
      <section className="container mx-auto px-4 py-16 text-center">
        <AnimateOnScroll>
          <div className="max-w-3xl mx-auto">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mx-auto mb-8 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              О мастере
            </h1>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-2 text-left md:text-center">
              <p>Проводник Высших Сил Светозаръ-Адидэв.</p>
              <p>Внутреннее восстановление, гармонизации и Духовные практики.</p>
              <p>Практик работы с Энергетическими, Родовыми и Кармическими аспектами жизненных процессов.</p>
              <p>Проводник медитативно-молитвенных практик очищения, восстановления и укрепления внутренней опоры.</p>
              <p>Сопровождает в вопросах энергетического очищения, работы с Родом, пространством и внутренним состоянием.</p>
              <p>Индивидуальный подбор минералов для восстановления баланса, снятия блоков, гармонизации жизненных процессов и привлечения изобилия.</p>
              <p>Практики индивидуального энергетического очищения и гармонизации жизненного Пути.</p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Философия */}
      <section className="container mx-auto px-4 py-12">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-8 md:p-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 text-center">Философия работы</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Каждый — это уникальная энергетическая система. Камни не являются волшебной
                таблеткой, но они служат мощным инструментом, который при правильном подборе и
                осознанном использовании способен запустить глубинные процессы трансформации. Минералы
                хранят в себе миллионы лет геологической истории Земли, и эта первозданная энергия
                при правильном взаимодействии помогает вернуться к своему естественному
                состоянию гармонии.
              </p>
              <p>
                Моя задача — не просто подобрать камень по справочнику, а провести глубокую
                диагностику энергетического состояния, выявить первопричины дисбаланса и
                подобрать минералы, которые будут работать именно с вашими задачами. Каждый набор
                камней формируется индивидуально, с учётом взаимодействия минералов между собой
                и с энергетикой конкретного индивида.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Принципы работы */}
      <section className="container mx-auto px-4 py-12">
        <AnimateOnScroll>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10 text-center">Принципы работы</h2>
        </AnimateOnScroll>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Eye,
              title: "Глубокая диагностика",
              text: "Каждая консультация начинается с детального анализа энергетического состояния. Это позволяет увидеть корневые причины проблем, а не бороться с симптомами. Диагностика проводится по фотографиям и включает анализ всех энергетических центров, выявление блоков, привязок и деструктивных программ.",
            },
            {
              icon: Heart,
              title: "Индивидуальный подход",
              text: "Нет универсальных рецептов. То, что помогает одному, может быть бесполезно для другого. Поэтому каждый набор камней формируется исключительно под конкретного индивида, с учётом его текущего состояния, задач и особенностей энергетики.",
            },
            {
              icon: Shield,
              title: "Экологичность и безопасность",
              text: "Работа ведётся исключительно экологичными методами, без вмешательства в свободную волю. Все практики направлены на восстановление естественного баланса и раскрытие собственного потенциала, а не на создание зависимости от внешних инструментов.",
            },
            {
              icon: Star,
              title: "Сопровождение и поддержка",
              text: "Работа не заканчивается на подборе камней. Каждый клиент получает подробные рекомендации по использованию минералов, а также возможность обратной связи и корректировки практик по мере прохождения процессов трансформации.",
            },
          ].map((item) => (
            <AnimateOnScroll key={item.title}>
              <div className="bg-card rounded-xl border border-border p-6 h-full">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.text}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Опыт */}
      <section className="container mx-auto px-4 py-12">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-8 md:p-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6 text-center">Направления работы</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">Диагностика и анализ</h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Полная диагностика энергетических центров по фотографиям
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Выявление энергетических блоков и привязок
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Анализ деструктивных программ и сущностей
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Оценка общего состояния энергетики
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">Практическая работа</h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Индивидуальный подбор минералов под задачи
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Составление персональных программ работы с камнями
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Снятие блоков и восстановление энергетического баланса
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    Сопровождение в процессе трансформации
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Призыв к действию */}
      <section className="container mx-auto px-4 py-16 text-center">
        <AnimateOnScroll>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
              Готовы узнать своё энергетическое состояние?
            </h2>
            <p className="text-muted-foreground mb-8">
              Запишитесь на индивидуальную диагностику и получите полную картину вашей энергетики
              с персональными рекомендациями по подбору камней.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/diagnostika">
                <Button size="lg" className="w-full sm:w-auto">Записаться на диагностику</Button>
              </Link>
              <Link to="/quiz">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">Пройти мини-диагностику</Button>
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </main>
  );
};

export default About;
