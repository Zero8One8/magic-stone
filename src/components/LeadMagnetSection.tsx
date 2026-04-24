import { useMemo, useState } from "react";
import { Gift, Download } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const GUIDE_FILES = [
  {
    id: "starter-pdf",
    title: "7 камней для начинающего (PDF)",
    href: "/guides/7-kamney-dlya-nachinayushchego.pdf",
  },
  {
    id: "starter-txt",
    title: "7 камней для начинающего (текстовая версия)",
    href: "/guides/7-stones-starter-guide.txt",
  },
  {
    id: "ritual-txt",
    title: "Краткий ритуал очищения (TXT)",
    href: "/guides/ritual-ochishcheniya-kamney.txt",
  },
  {
    id: "practice-txt",
    title: "Дневник практики с камнями (TXT)",
    href: "/guides/dnevnik-praktiki-s-kamnyami.txt",
  },
];

const LeadMagnetSection = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([GUIDE_FILES[0].id]);

  const selectedFiles = useMemo(
    () => GUIDE_FILES.filter((file) => selectedIds.includes(file.id)),
    [selectedIds],
  );

  const toggleFile = (id: string) => {
    setSelectedIds((prev) => (
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    ));
  };

  const downloadSelected = () => {
    for (const file of selectedFiles) {
      const anchor = document.createElement("a");
      anchor.href = file.href;
      anchor.setAttribute("download", "");
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

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
            <div className="text-left bg-background/60 rounded-lg border border-border p-4 space-y-3">
              {GUIDE_FILES.map((file) => (
                <label key={file.id} className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(file.id)}
                    onChange={() => toggleFile(file.id)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>{file.title}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={downloadSelected}
              disabled={selectedFiles.length === 0}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Скачать выбранные материалы
            </button>
            <p className="text-xs text-muted-foreground">
              Выбрано файлов: {selectedFiles.length}
            </p>
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
