
-- Table for telegram subscribers
CREATE TABLE public.telegram_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id BIGINT NOT NULL UNIQUE,
  first_name TEXT,
  username TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_subscribers ENABLE ROW LEVEL SECURITY;

-- Singleton table to track getUpdates offset
CREATE TABLE public.telegram_bot_state (
  id INT PRIMARY KEY CHECK (id = 1),
  update_offset BIGINT NOT NULL DEFAULT 0,
  last_crystal_index INT NOT NULL DEFAULT -1,
  last_sent_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_bot_state ENABLE ROW LEVEL SECURITY;

INSERT INTO public.telegram_bot_state (id, update_offset) VALUES (1, 0);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_telegram_subscribers_updated_at
  BEFORE UPDATE ON public.telegram_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
