import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("o") ?? "-";
  const [itemType, setItemType] = useState<"product" | "service" | null>(null);

  useEffect(() => {
    if (!orderId || orderId === "-") return;

    // Отмечаем заказ оплаченным
    void supabase.rpc("mark_payment_order_paid", { p_order_id: orderId } as never);

    // Получаем тип товара/услуги чтобы показать правильные кнопки
    supabase
      .rpc("get_payment_order_summary", { p_order_id: orderId } as never)
      .then(({ data }) => {
        const rows = data as Array<{ item_type: string }> | null;
        const type = rows?.[0]?.item_type;
        if (type === "product" || type === "service") {
          setItemType(type);
        }
      })
      .catch(() => setItemType(null));
  }, [orderId]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-10 text-center shadow-lg">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Оплата прошла успешно
        </h1>
        <p className="text-muted-foreground mb-1">Спасибо за покупку в Magic Stone.</p>

        {orderId !== "-" && (
          <p className="text-sm text-muted-foreground mb-6">
            Номер заказа:{" "}
            <span className="font-semibold text-foreground">{orderId}</span>
          </p>
        )}

        {itemType === null ? (
          <p className="text-sm text-muted-foreground mb-6">Подтверждаем детали заказа...</p>
        ) : itemType === "product" ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Заполните данные доставки, чтобы мы отправили заказ через OZON.
            </p>
            <div className="flex flex-col gap-3">
              <Link to={`/delivery?o=${encodeURIComponent(orderId)}`}>
                <Button className="gap-2 w-full">
                  <Truck className="w-4 h-4" />
                  Оформить доставку
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" className="gap-2 w-full">
                  <ShoppingBag className="w-4 h-4" />
                  Вернуться в магазин
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Платёж зафиксирован. Мы свяжемся с вами по услуге в ближайшее время.
            </p>
            <Link to="/services">
              <Button className="gap-2 w-full">
                <ShoppingBag className="w-4 h-4" />
                Вернуться к услугам
              </Button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
};

export default PaymentSuccess;
