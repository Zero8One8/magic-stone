import AnimateOnScroll from "@/components/AnimateOnScroll";

const ArticleSection = () => {
  return (
    <section id="article" className="relative py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <AnimateOnScroll className="mb-20">
          <p className="font-body text-lg md:text-xl leading-relaxed text-foreground/90">
            Бывает так, что ты просыпаешься утром — и уже устал. Не от работы. Не от людей.
            <span className="text-primary italic"> От себя.</span> От того, что внутри что-то сжалось так давно,
            что ты уже забыл, как это — дышать полной грудью.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll className="mb-20" delay={100}>
          <p className="font-body text-lg leading-relaxed text-foreground/80 mb-6">
            Ты улыбаешься, отвечаешь «всё нормально», несёшь на себе чужие ожидания, свои страхи,
            старые обиды, которые вроде бы отпустил — но они никуда не ушли. Они осели. В теле.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed italic">
            В горле, которое перехватывает перед важным разговором. В груди, которая ноет без причины.
            В животе, который сводит от тревоги. В плечах, которые ты не можешь расслабить даже во сне.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll className="mb-24" delay={100}>
          <blockquote className="border-l-2 border-primary/40 pl-8 py-4">
            <p className="font-display text-2xl md:text-3xl italic text-foreground/90 leading-relaxed">
              «Может, это просто усталость. Может, пройдёт.»
            </p>
            <p className="font-body text-primary mt-4 text-lg">Не пройдёт. Пока не отпустишь.</p>
          </blockquote>
        </AnimateOnScroll>

        <AnimateOnScroll className="mb-16">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8 leading-tight">
            Мы забыли, что тело — <span className="text-gradient-gold">не просто оболочка</span>
          </h2>
          <p className="font-body text-lg leading-relaxed text-foreground/80">
            Древние знали то, что мы разучились чувствовать: тело хранит всё. Каждую невыплаканную слезу.
            Каждое проглоченное «нет». Каждое «я потерплю».
          </p>
        </AnimateOnScroll>

        {/* Chakras */}
        <div className="space-y-8 mb-24">
          {[
            { name: "Сахасрара — Коронная чакра", color: "hsl(270 50% 55%)", text: "И ты чувствуешь пустоту. Жизнь потеряла смысл. Ты делаешь всё правильно, но внутри — тишина без глубины. Отключение от чего-то большего, чем ты сам." },
            { name: "Аджна — Третий глаз", color: "hsl(240 50% 50%)", text: "И ты перестал доверять себе. Интуиция молчит. Решения даются через боль. Ты видишь только поверхность, а глубина закрыта." },
            { name: "Вишуддха — Горловая чакра", color: "hsl(200 60% 50%)", text: "И ты годами не можешь сказать то, что чувствуешь. Ком в горле. Частые ангины. Тихий голос, даже когда внутри крик." },
            { name: "Анахата — Сердечная чакра", color: "hsl(140 45% 45%)", text: "И ты закрылся. После предательства, после потери. Ты функционируешь. Но не живёшь." },
            { name: "Манипура — Солнечное сплетение", color: "hsl(45 80% 55%)", text: "И ты потерял себя. Не знаешь, чего хочешь. Каждое утро — как бой, в который ты идёшь без оружия." },
            { name: "Свадхистана — Сакральная чакра", color: "hsl(25 80% 50%)", text: "И радость ушла. Творчество иссякло. Тело стало чужим. Ты забыл, когда последний раз чувствовал удовольствие от жизни без чувства вины." },
            { name: "Муладхара — Корневая чакра", color: "hsl(0 60% 45%)", text: "И земля уходит из-под ног. Тревога. Страх будущего. Ощущение, что ты нигде не дома." },
          ].map((chakra, i) => (
            <AnimateOnScroll key={chakra.name} delay={i * 100}>
              <div className="bg-card/50 border border-border/50 rounded-lg p-6 md:p-8 hover:border-primary/20 transition-colors duration-500">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full mt-2 shrink-0" style={{ backgroundColor: chakra.color, animation: "pulse-glow 4s ease-in-out infinite" }} />
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-foreground mb-2">{chakra.name}</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">{chakra.text}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="mb-24">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8 leading-tight">
            А потом кто-то вкладывает тебе <span className="text-gradient-gold">в руку камень</span>
          </h2>
          <p className="font-body text-lg leading-relaxed text-foreground/80 mb-6">
            И происходит странная вещь. Ты держишь в руке кусочек чёрного турмалина — и вдруг понимаешь,
            что выдохнул. Впервые за долгое время.
          </p>
          <p className="font-body text-primary/80 text-lg italic">
            Словно кто-то сказал: «Можно. Здесь безопасно. Я держу.»
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ArticleSection;
