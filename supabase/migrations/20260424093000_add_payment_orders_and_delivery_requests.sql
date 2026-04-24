CREATE OR REPLACE FUNCTION public.get_payment_order_summary(p_order_id TEXT)
RETURNS TABLE(order_id TEXT, item_name TEXT, item_type TEXT, status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT po.order_id, po.item_name, po.item_type, po.status
  FROM public.payment_orders po
  WHERE po.order_id = p_order_id
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_payment_order_summary(TEXT) TO anon, authenticated;
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT NOT NULL DEFAULT 'site_checkout',
  page_url TEXT DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create payment orders"
ON public.payment_orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view payment orders"
ON public.payment_orders
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update payment orders"
ON public.payment_orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payment orders"
ON public.payment_orders
FOR DELETE
TO authenticated
USING (true);

CREATE TABLE IF NOT EXISTS public.delivery_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_method TEXT,
  city TEXT NOT NULL,
  pickup_point TEXT NOT NULL,
  delivery_comment TEXT DEFAULT '',
  shipping_method TEXT NOT NULL DEFAULT 'OZON: за счет получателя',
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'delivery_form',
  page_url TEXT DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT delivery_requests_order_id_key UNIQUE(order_id)
);

ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create delivery requests"
ON public.delivery_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view delivery requests"
ON public.delivery_requests
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update delivery requests"
ON public.delivery_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete delivery requests"
ON public.delivery_requests
FOR DELETE
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.mark_payment_order_paid(p_order_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.payment_orders
  SET status = 'paid', updated_at = now()
  WHERE order_id = p_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_payment_order_paid(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.upsert_delivery_request(
  p_order_id TEXT,
  p_customer_name TEXT,
  p_phone TEXT,
  p_contact_method TEXT,
  p_city TEXT,
  p_pickup_point TEXT,
  p_delivery_comment TEXT,
  p_page_url TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.delivery_requests (
    order_id,
    customer_name,
    phone,
    contact_method,
    city,
    pickup_point,
    delivery_comment,
    page_url
  ) VALUES (
    p_order_id,
    p_customer_name,
    p_phone,
    p_contact_method,
    p_city,
    p_pickup_point,
    COALESCE(p_delivery_comment, ''),
    COALESCE(p_page_url, '/')
  )
  ON CONFLICT (order_id)
  DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    phone = EXCLUDED.phone,
    contact_method = EXCLUDED.contact_method,
    city = EXCLUDED.city,
    pickup_point = EXCLUDED.pickup_point,
    delivery_comment = EXCLUDED.delivery_comment,
    page_url = EXCLUDED.page_url,
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_delivery_request(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

CREATE TRIGGER update_payment_orders_updated_at
BEFORE UPDATE ON public.payment_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_requests_updated_at
BEFORE UPDATE ON public.delivery_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
