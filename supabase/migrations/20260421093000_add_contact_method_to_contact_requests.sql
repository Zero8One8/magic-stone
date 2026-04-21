ALTER TABLE public.contact_requests
ADD COLUMN IF NOT EXISTS contact_method text;
