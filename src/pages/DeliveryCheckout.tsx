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
  const [email, setEmail] = useState("");
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
      toast.error("Заполните обязательные поля: имя, телефон, город и пункт выдачи");
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Укажите корректный email");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const { error } = await supabase.rpc("upsert_delivery_request", {
        p_order_id: orderId || `manual-${Date.now()}`,
        p_customer_name: name.trim(),
        p_email: email.trim() || null,
        p_phone: phone.trim(),
        p_contact_method: contactMethod.trim() || null,
        p_city: city.trim(),
        p_pickup_point: pickupPoint.trim(),
        p_delivery_comment: addressComment.trim() || null,
        p_page_url: window.location.pathname + window.location.search,
      } as never);

      if (error) throw error;

      // Уведомляем в Telegram бот
      void supabase.functions.invoke("notify-contact-request", {
        body: {
          name: name.trim(),
          phone: phone.trim(),
          contact_method: contactMethod.trim() || null,
          service: "Оформление доставки заказа",
          comment: [
            `Заказ: ${orderId || "не передан"}`,
            `Email: ${email.trim() || "не указан"}`,
            `Город: ${city.trim()}`,
            `Пункт выдачи: ${pickupPoint.trim()}`,
            addressComment.trim() ? `Комментарий: ${addressComment.trim()}` : "",
          ]
            .filter(Boolean)
            .join(" | "),
          source: "delivery_form",
          page_url: window.location.pathname + window.location.search,
        },
      });

      setSent(true);
    } catch {
      toast.error("Не удалось отправить данные. Попробуйте ещё раз.");
      isSubmittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-10 text-center shadow-lg">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Данные доставки получены
          </h1>
          <p className="text-muted-foreground mb-6">
            Мы обработаем заказ и отправим посылку через OZON. Трек-номер придёт на ваш контакт.
          </p>
          <Link to="/shop">
            <Button className="w-full">Вернуться в магазин</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-lg mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад в магазин
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-7 h-7 text-primary" />
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Оформление доставки
            </h1>
          </div>

          {orderId && (
            <p className="text-sm text-muted-foreground mb-6">
              Заказ: <span className="font-semibold text-foreground">{orderId}</span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Имя <span className="text-red-400">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email{" "}
                <span className="text-muted-foreground text-xs">(для личного кабинета)</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Укажите email и вам автоматически будет присвоён ID клиента
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Телефон <span className="text-red-400">*</span>
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Как с вами связаться
              </label>
              <Input
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                placeholder="Telegram / WhatsApp / звонок"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Город <span className="text-red-400">*</span>
              </label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Москва"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Пункт выдачи OZON <span className="text-red-400">*</span>
              </label>
              <Input
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
                placeholder="Адрес пункта выдачи или код из приложения"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Комментарий к заказу
              </label>
              <Textarea
                value={addressComment}
                onChange={(e) => setAddressComment(e.target.value)}
                placeholder="Любые дополнительные пожелания..."
                rows={3}
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Отправляем..." : "Подтвердить доставку"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DeliveryCheckout;
