import AnimateOnScroll from "@/components/AnimateOnScroll";

const topics = [
  { emoji: "🪨", text: "Какой камень подходит именно тебе — по состоянию, запросу, чакре" },
  { emoji: "🫁", text: "Как камни влияют на здоровье — сон, давление, головные боли" },
  { emoji: "🧠", text: "Как работать с камнями при тревожности, апатии, выгорании" },
  { emoji: "💔", text: "Как отпускать обиды и закрывать старые раны" },
  { emoji: "🔥", text: "Как вернуть мотивацию, желание и вкус к жизни" },
  { emoji: "🧘", text: "Простые практики с камнями — без ритуалов, для обычной жизни" },
];

const ChannelSection = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-mystical opacity-60" />
      <div className="relative max-w-3xl mx-auto px-6">
        <AnimateOnScroll className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-6 leading-tight">
            Это пространство — <span className="text-gradient-gold">для тех, кто готов</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Для тех, кто готов <span className="text-primary">попробовать</span>. Мягко. Бережно. В своём темпе.
          </p>
        </AnimateOnScroll>

        <div className="space-y-4 mb-16">
          {topics.map((topic, i) => (
            <AnimateOnScroll key={i} delay={i * 80}>
              <div className="flex items-start gap-4 bg-card/40 border border-border/30 rounded-lg p-5 hover:border-primary/20 transition-colors duration-500">
                <span className="text-xl">{topic.emoji}</span>
                <p className="font-body text-foreground/85 leading-relaxed">{topic.text}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll>
          <p className="font-body text-center text-muted-foreground italic text-lg">
            Каждый пост — не просто информация. Это разговор. Честный. Тёплый.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ChannelSection;
