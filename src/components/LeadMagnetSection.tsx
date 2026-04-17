import { useState } from "react";
import { Gift, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const LeadMagnetSection = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
        setName("");
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      setLoading(false);
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
              Бесплатное руководство + рекомендации мастера. Отправим на почту за 30 секунд.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Твоё имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    type="email"
                    placeholder="твоя почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <Button type="submit" disabled={loading} className="sm:px-8">
                  {loading ? "Отправляем..." : "Получить"}
                </Button>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground/70">
                <input type="checkbox" required className="mt-0.5" />
                <label>
                  Я согласен на отправку гайда и периодические письма про камни (можно отписаться в любой момент)
                </label>
              </div>
            </form>
          ) : (
            <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-primary font-semibold mb-1">✓ Спасибо!</p>
              <p className="text-muted-foreground text-sm">
                Гайд отправлен на почту. Проверь спам-папку, если не видишь.
              </p>
            </div>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
