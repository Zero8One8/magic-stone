import { Link, useSearchParams } from "react-router-dom";
import { XCircle, ShoppingBag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentFail = () => {
  const [params] = useSearchParams();
  const orderId = params.get("o");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-10 text-center shadow-lg">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Оплата не прошла
        </h1>
        <p className="text-muted-foreground mb-6">
          К сожалению, платёж не был завершён. Попробуйте ещё раз или свяжитесь с нами.
        </p>
        {orderId && (
          <p className="text-sm text-muted-foreground mb-6">
            Номер заказа: <span className="font-semibold text-foreground">{orderId}</span>
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Link to="/shop">
            <Button className="gap-2 w-full">
              <RefreshCw className="w-4 h-4" />
              Попробовать снова
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="gap-2 w-full">
              <ShoppingBag className="w-4 h-4" />
              Вернуться в магазин
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentFail;
