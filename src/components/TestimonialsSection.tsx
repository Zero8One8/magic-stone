import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Анна",
    text: "После диагностики мастер подобрал мне камни точно под мои проблемы. Через месяц работы с ними я впервые за годы перестала просыпаться с тревогой. Это не магия — это точная работа.",
    result: "Ушла хроническая тревожность",
  },
  {
    name: "Дмитрий",
    text: "Скептически относился к энергетике, но решил попробовать. Мастер описал мои блоки так точно, что я был в шоке — совпало с тем, что говорил мне психотерапевт. Камни стали дополнением к терапии.",
    result: "Точная диагностика блоков",
  },
  {
    name: "Елена",
    text: "Квиз дал хорошую отправную точку, но диагностика — это совсем другой уровень. Мастер увидел проблему, о которой я даже не подозревала. После работы с подобранными камнями стало легче.",
    result: "Обнаружена скрытая проблематика",
  },
  {
    name: "Марина",
    text: "Заказывала диагностику для мамы — она переживала тяжёлый период. Мастер подробно всё описал, подобрал камни. Мама говорит, что впервые за полгода чувствует опору. Благодарна бесконечно.",
    result: "Помощь в кризисный период",
  },
];

const TestimonialsSection = () => {
  return (
    <div className="max-w-3xl mx-auto mb-20">
      <AnimateOnScroll>
        <h2 className="font-display text-2xl md:text-3xl text-center mb-4 font-light">
          Отзывы
        </h2>
        <p className="text-muted-foreground text-sm text-center mb-12 max-w-md mx-auto">
          Реальные истории людей, прошедших диагностику
        </p>
      </AnimateOnScroll>

      <div className="grid sm:grid-cols-2 gap-4">
        {testimonials.map((t, i) => (
          <AnimateOnScroll key={i} delay={i * 100}>
            <div className="p-6 rounded-xl border border-border/50 bg-card/30 flex flex-col h-full">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-4 flex-1">
                «{t.text}»
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <span className="font-display text-foreground text-sm">{t.name}</span>
                <span className="text-xs text-primary/70 font-body">{t.result}</span>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
