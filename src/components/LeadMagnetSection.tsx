import { Gift, Download } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
const LeadMagnetSection = () => {

  return (
    <section className="py-16 px-6 bg-primary/5 border-y border-primary/10">
      <div className="max-w-2xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-4 mx-auto">
              <Gift className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
              Гайд "7 камней для начинающего"
            </h2>
            <p className="text-muted-foreground text-lg">
              Бесплатное руководство + рекомендации мастера. Выдача полностью автоматическая: скачайте сразу.
            </p>
          </div>

          <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20 space-y-4">
            <a
              href="/guides/7-stones-starter-guide.txt"
              download
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Скачать гайд
            </a>
            <p className="text-muted-foreground text-sm">
              Нужен разбор под ваш запрос? Напишите в Telegram.
            </p>
            <a
              href="https://t.me/magicstonechat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-background text-foreground border border-border px-4 py-2 rounded-lg text-sm font-medium hover:border-primary/40 transition-colors"
            >
              Написать в Telegram
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
