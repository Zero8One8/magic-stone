import { FormEvent, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const DeliveryCheckout = () => {
  const [params] = useSearchParams();
  const orderId = params.get("o") ?? "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [city, setCity] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [addressComment, setAddressComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    if (!name.trim() || !phone.trim() || !city.trim() || !pickupPoint.trim()) {
      toast.error("Заполните обязательные поля доставки");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const deliveryComment = [
        `Заказ: ${orderId || "не передан"}`,
        `Город: ${city.trim()}`,
        `Пункт выдачи/адрес OZON: ${pickupPoint.trim()}`,
        `Доставка: OZON, за счет получателя`,
        addressComment.trim() ? `Комментарий: ${addressComment.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const { error } = await supabase.from("contact_requests").insert({
        name: name.trim(),
        phone: phone.trim(),
        contact_method: contactMethod.trim() || null,
        service: "Оформление доставки заказа",
        comment: deliveryComment,
        source: "delivery_form",
        page_url: window.location.pathname + window.location.search,
      });

      if (error) throw error;

      void supabase.functions.invoke("notify-contact-request", {
        body: {
          name: name.trim(),
          phone: phone.trim(),
          contact_method: contactMethod.trim() || null,
          service: "Оформление доставки заказа",
          comment: deliveryComment,
          source: "delivery_form",
          page_url: window.location.pathname + window.location.search,
        },
      });

      setSent(true);
      toast.success("Данные доставки отправлены. Мы подготовим отправку через OZON.");
    } catch {
      toast.error("Не удалось отправить данные доставки. Попробуйте еще раз.");
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Назад в магазин
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Оформление доставки</h1>
              <p className="text-sm text-muted-foreground">Отправка через OZON, за счет получателя</p>
            </div>
          </div>

          {orderId && (
            <p className="text-sm text-foreground mb-4">
              Номер заказа: <span className="font-semibold">{orderId}</span>
            </p>
          )}

          {sent ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
              <h2 className="font-serif text-xl font-bold text-foreground mb-2">Доставка оформлена</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Данные получены. Мы свяжемся с вами для подтверждения отправки.
              </p>
              <Link to="/shop">
                <Button className="w-full">Вернуться в магазин</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="dc-name" className="text-sm text-foreground/80 mb-1 block">ФИО *</label>
                <Input id="dc-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label htmlFor="dc-phone" className="text-sm text-foreground/80 mb-1 block">Телефон *</label>
                <Input id="dc-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              <div>
                <label htmlFor="dc-contact" className="text-sm text-foreground/80 mb-1 block">Telegram / WhatsApp</label>
                <Input id="dc-contact" value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} />
              </div>

              <div>
                <label htmlFor="dc-city" className="text-sm text-foreground/80 mb-1 block">Город *</label>
                <Input id="dc-city" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>

              <div>
                <label htmlFor="dc-pickup" className="text-sm text-foreground/80 mb-1 block">Пункт выдачи/адрес OZON *</label>
                <Input id="dc-pickup" value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)} required />
              </div>

              <div>
                <label htmlFor="dc-comment" className="text-sm text-foreground/80 mb-1 block">Комментарий к доставке</label>
                <Textarea
                  id="dc-comment"
                  rows={3}
                  value={addressComment}
                  onChange={(e) => setAddressComment(e.target.value)}
                  placeholder="Код домофона, удобное время связи, детали для отправки"
                />
              </div>

              <div className="text-xs text-muted-foreground rounded-lg bg-secondary/50 p-3">
                Способ доставки: OZON. Отправка осуществляется за счет получателя.
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Отправка..." : "Отправить данные доставки"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default DeliveryCheckout;
