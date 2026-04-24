import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const services = [
  "Индивидуальная диагностика",
  "Индивидуальный подбор камней",
  "Снятие блоков и привязок",
  "Отливка воском",
  "Полная энергетическая чистка",
  "Индивидуальное сопровождение",
  "Заказ браслета",
  "Заказ чёток",
  "Заказ свечи",
  "Другое",
];

const formSchema = z.object({
  name: z.string().trim().min(2, "Имя должно быть не менее 2 символов").max(100),
  phone: z.string().trim().min(6, "Введите корректный номер телефона").max(30),
  contact_method: z.string().trim().max(100).optional(),
  service: z.string().min(1, "Выберите услугу"),
  comment: z.string().max(1000).optional(),
});

const ContactForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [service, setService] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;

    const parsed = formSchema.safeParse({ name, phone, contact_method: contactMethod, service, comment });
    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast.error(firstError || "Проверьте введённые данные");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: parsed.data.name,
        phone: parsed.data.phone,
        contact_method: parsed.data.contact_method || null,
        service: parsed.data.service,
        comment: parsed.data.comment || "",
        source: "contact_form",
        page_url: window.location.pathname,
      });

      if (error) throw error;

      void supabase.functions.invoke("notify-contact-request", {
        body: {
          name: parsed.data.name,
          phone: parsed.data.phone,
          contact_method: parsed.data.contact_method || null,
          service: parsed.data.service,
          comment: parsed.data.comment || "",
          source: "contact_form",
          page_url: window.location.pathname,
        },
      });

      setSent(true);
      toast.success("Заявка отправлена! Мы свяжемся с вами в ближайшее время.");
    } catch {
      toast.error("Не удалось отправить заявку. Попробуйте позже или напишите в Telegram.");
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-card/50 p-8 text-center max-w-lg mx-auto">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-serif text-xl font-bold text-foreground mb-2">Заявка отправлена!</h3>
        <p className="text-muted-foreground text-sm">
          Мы получили вашу заявку и свяжемся с вами в ближайшее время.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-6 md:p-8 max-w-lg mx-auto">
      <h3 className="font-serif text-xl font-bold text-foreground mb-1 text-center">
        Оставить заявку на сайте
      </h3>
      <p className="text-muted-foreground text-sm mb-6 text-center">
        Заполните форму — мы перезвоним или напишем вам
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cf-name" className="text-sm text-foreground/80 mb-1 block">Ваше имя *</label>
          <Input
            id="cf-name"
            placeholder="Как к вам обращаться"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="cf-phone" className="text-sm text-foreground/80 mb-1 block">Телефон *</label>
          <Input
            id="cf-phone"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={30}
            required
          />
        </div>

        <div>
          <label htmlFor="cf-contact" className="text-sm text-foreground/80 mb-1 block">Telegram / WhatsApp</label>
          <Input
            id="cf-contact"
            placeholder="@username или номер WhatsApp"
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
            maxLength={100}
          />
        </div>

        <div>
          <label className="text-sm text-foreground/80 mb-1 block">Услуга *</label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите услугу" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="cf-comment" className="text-sm text-foreground/80 mb-1 block">Комментарий</label>
          <Textarea
            id="cf-comment"
            placeholder="Опишите ваш запрос (необязательно)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          <Send className="w-4 h-4" />
          {loading ? "Отправка..." : "Отправить заявку"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;