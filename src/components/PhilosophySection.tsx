import AnimateOnScroll from "@/components/AnimateOnScroll";

const PhilosophySection = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <AnimateOnScroll className="mb-20">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8 leading-tight">
            Почему это <span className="text-gradient-gold">не «плацебо»</span>
          </h2>
          <p className="font-body text-lg leading-relaxed text-foreground/80 mb-6">
            Камень не решит твои проблемы. Но он станет <span className="text-primary">якорем</span>.
            Точкой опоры. Напоминанием, что ты решил что-то изменить.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll className="mb-20">
          <blockquote className="border-l-2 border-primary/40 pl-8 py-4">
            <p className="font-display text-2xl md:text-3xl italic text-foreground/90 leading-relaxed">
              Когда ты осознанно выбираешь камень — ты говоришь: «Я замечаю свою боль. Я выбираю путь к себе.»
            </p>
            <p className="font-body text-primary mt-4 text-lg">И это уже — начало исцеления.</p>
          </blockquote>
        </AnimateOnScroll>

        <AnimateOnScroll className="mb-20">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-8 leading-tight">
            Камень не кричит. <span className="text-gradient-gold italic">Он ждёт</span>
          </h2>
          <p className="font-body text-lg leading-relaxed text-foreground/90">
            И однажды ты замечаешь: обида стала тише. Тревога отступила. Голос стал увереннее. Спина — прямее. Глаза — яснее.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default PhilosophySection;
