import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("o") ?? "—";

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-10 text-center shadow-lg">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Оплата прошла успешно!
        </h1>
        <p className="text-muted-foreground mb-1">Спасибо за покупку в Magic Stone!</p>
        {orderId !== "—" && (
          <p className="text-sm text-muted-foreground mb-6">
            Номер заказа: <span className="font-semibold text-foreground">{orderId}</span>
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-6">
          Мастер свяжется с вами в ближайшее время через Telegram для подтверждения заказа.
        </p>
        <Link to="/shop">
          <Button className="gap-2 w-full">
            <ShoppingBag className="w-4 h-4" />
            Вернуться в магазин
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default PaymentSuccess;
