ALTER TABLE public.contact_requests
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'site_form',
ADD COLUMN IF NOT EXISTS page_url TEXT DEFAULT '/';

CREATE TABLE IF NOT EXISTS public.lead_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'unknown',
  page_url TEXT DEFAULT '/',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead capture"
ON public.lead_captures
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view lead captures"
ON public.lead_captures
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update lead captures"
ON public.lead_captures
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete lead captures"
ON public.lead_captures
FOR DELETE
TO authenticated
USING (true);

CREATE TRIGGER update_lead_captures_updated_at
BEFORE UPDATE ON public.lead_captures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();