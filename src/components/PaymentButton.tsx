import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { buildFreekassaUrl, makeOrderId } from "@/lib/freekassa";
import { toast } from "sonner";

type PaymentButtonProps = {
  amount: number;
  orderSlug: string;
  itemName: string;
  itemType: "product" | "service";
  cta: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
};

const PaymentButton = ({ amount, orderSlug, itemName, itemType, cta, variant = "default", className }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const orderId = makeOrderId(orderSlug);
    setLoading(true);

    try {
      const { error } = await supabase.from("payment_orders").insert({
        order_id: orderId,
        item_name: itemName,
        item_type: itemType,
        amount,
        source: "site_checkout",
        page_url: window.location.pathname,
      });

      if (error) throw error;
      window.location.href = buildFreekassaUrl(amount, orderId);
    } catch {
      toast.error("Не удалось создать заказ на оплату. Попробуйте еще раз.");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} variant={variant} className={className}>
      <CreditCard className="w-4 h-4" />
      {loading ? "Переход к оплате..." : cta}
    </Button>
  );
};

export default PaymentButton;
