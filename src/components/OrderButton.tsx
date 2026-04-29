import { useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type OrderButtonProps = {
  amount: number;
  orderSlug: string;
  itemName: string;
  itemType: "product" | "service";
  cta: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
};

const BOT_URL_FALLBACK = "https://t.me/Themagicofstonesbot";

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32) || "item";

const makeOrderId = (slug: string) => `${normalizeSlug(slug)}-${Date.now()}`;

const OrderButton = ({
  amount,
  orderSlug,
  itemName,
  itemType,
  cta,
  variant = "default",
  className,
}: OrderButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

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

      const botUrl = (import.meta.env.VITE_BOT_URL as string | undefined)?.trim() || BOT_URL_FALLBACK;
      window.open(
        `${botUrl}?start=${encodeURIComponent(orderSlug)}`,
        "_blank",
        "noopener,noreferrer"
      );
      toast.success("Заказ создан. Напишите нам в Telegram для оплаты.");
      setLoading(false);
    } catch {
      toast.error("Не удалось создать заказ. Попробуйте ещё раз.");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} variant={variant} className={className}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
      {loading ? "Создаём заказ..." : cta}
    </Button>
  );
};

export default OrderButton;
