-- ============================================================
-- customers — база клиентов (регистрация по email)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_number BIGINT GENERATED ALWAYS AS IDENTITY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'order',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view customers"
  ON public.customers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update customers"
  ON public.customers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete customers"
  ON public.customers FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- payment_orders — заказы с сайта (статус pending/paid)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('product', 'service')),
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  source TEXT NOT NULL DEFAULT 'site_checkout',
  page_url TEXT DEFAULT '/',
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create payment orders"
  ON public.payment_orders FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view payment orders"
  ON public.payment_orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update payment orders"
  ON public.payment_orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payment orders"
  ON public.payment_orders FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_payment_orders_updated_at
  BEFORE UPDATE ON public.payment_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- delivery_requests — заявки на доставку заказа
-- ============================================================
CREATE TABLE IF NOT EXISTS public.delivery_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  contact_method TEXT,
  city TEXT NOT NULL,
  pickup_point TEXT NOT NULL,
  delivery_comment TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'delivery_form',
  page_url TEXT DEFAULT '/',
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create delivery requests"
  ON public.delivery_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view delivery requests"
  ON public.delivery_requests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update delivery requests"
  ON public.delivery_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete delivery requests"
  ON public.delivery_requests FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_delivery_requests_updated_at
  BEFORE UPDATE ON public.delivery_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RPC: upsert_customer — регистрация клиента по email
-- ============================================================
CREATE OR REPLACE FUNCTION public.upsert_customer(
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'order'
)
RETURNS TABLE(customer_id UUID, customer_number BIGINT, is_new BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_num BIGINT;
  v_is_new BOOLEAN := false;
BEGIN
  SELECT id, customer_number INTO v_id, v_num
  FROM public.customers
  WHERE email = lower(trim(p_email));

  IF v_id IS NULL THEN
    INSERT INTO public.customers (email, name, phone, source)
    VALUES (lower(trim(p_email)), p_name, p_phone, p_source)
    RETURNING id, customer_number INTO v_id, v_num;
    v_is_new := true;
  ELSE
    -- обновляем имя/телефон если были пустыми
    UPDATE public.customers
    SET
      name = COALESCE(NULLIF(name, ''), p_name),
      phone = COALESCE(NULLIF(phone, ''), p_phone),
      updated_at = now()
    WHERE id = v_id;
  END IF;

  RETURN QUERY SELECT v_id, v_num, v_is_new;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_customer(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- ============================================================
-- RPC: get_payment_order_summary — получить сводку по заказу
-- ============================================================
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

-- ============================================================
-- RPC: mark_payment_order_paid — отметить заказ оплаченным
-- ============================================================
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

-- ============================================================
-- RPC: upsert_delivery_request — сохранить / обновить доставку
-- ============================================================
CREATE OR REPLACE FUNCTION public.upsert_delivery_request(
  p_order_id TEXT,
  p_customer_name TEXT,
  p_email TEXT,
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
DECLARE
  v_customer_id UUID;
BEGIN
  -- регистрируем клиента по email
  IF p_email IS NOT NULL AND trim(p_email) <> '' THEN
    SELECT customer_id INTO v_customer_id
    FROM public.upsert_customer(p_email, p_customer_name, p_phone, 'delivery_form');
  END IF;

  INSERT INTO public.delivery_requests (
    order_id, customer_name, email, phone, contact_method,
    city, pickup_point, delivery_comment, page_url, customer_id
  ) VALUES (
    p_order_id,
    p_customer_name,
    NULLIF(trim(COALESCE(p_email, '')), ''),
    p_phone,
    NULLIF(trim(COALESCE(p_contact_method, '')), ''),
    p_city,
    p_pickup_point,
    COALESCE(p_delivery_comment, ''),
    COALESCE(p_page_url, '/'),
    v_customer_id
  )
  ON CONFLICT (order_id) DO UPDATE SET
    customer_name = EXCLUDED.customer_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    contact_method = EXCLUDED.contact_method,
    city = EXCLUDED.city,
    pickup_point = EXCLUDED.pickup_point,
    delivery_comment = EXCLUDED.delivery_comment,
    page_url = EXCLUDED.page_url,
    customer_id = COALESCE(EXCLUDED.customer_id, delivery_requests.customer_id),
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_delivery_request(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
