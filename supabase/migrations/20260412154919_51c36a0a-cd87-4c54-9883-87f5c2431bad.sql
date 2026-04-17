
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  comment TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form, no auth required)
CREATE POLICY "Anyone can submit a contact request"
ON public.contact_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only service_role can read/update/delete
CREATE POLICY "Service role full access to contact requests"
ON public.contact_requests
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Auto-update updated_at
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
