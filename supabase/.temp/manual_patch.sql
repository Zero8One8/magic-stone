ALTER TABLE public.contact_requests
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'site_form',
ADD COLUMN IF NOT EXISTS page_url TEXT DEFAULT '/';

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_requests' AND policyname = 'Anyone can submit a contact request'
  ) THEN
    CREATE POLICY "Anyone can submit a contact request"
    ON public.contact_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_requests' AND policyname = 'Authenticated users can view contact requests'
  ) THEN
    CREATE POLICY "Authenticated users can view contact requests"
    ON public.contact_requests
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_requests' AND policyname = 'Authenticated users can update contact requests'
  ) THEN
    CREATE POLICY "Authenticated users can update contact requests"
    ON public.contact_requests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_requests' AND policyname = 'Authenticated users can delete contact requests'
  ) THEN
    CREATE POLICY "Authenticated users can delete contact requests"
    ON public.contact_requests
    FOR DELETE
    TO authenticated
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_contact_requests_updated_at'
      AND tgrelid = 'public.contact_requests'::regclass
  ) THEN
    CREATE TRIGGER update_contact_requests_updated_at
    BEFORE UPDATE ON public.contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lead_captures' AND policyname = 'Anyone can submit a lead capture'
  ) THEN
    CREATE POLICY "Anyone can submit a lead capture"
    ON public.lead_captures
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lead_captures' AND policyname = 'Authenticated users can view lead captures'
  ) THEN
    CREATE POLICY "Authenticated users can view lead captures"
    ON public.lead_captures
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lead_captures' AND policyname = 'Authenticated users can update lead captures'
  ) THEN
    CREATE POLICY "Authenticated users can update lead captures"
    ON public.lead_captures
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'lead_captures' AND policyname = 'Authenticated users can delete lead captures'
  ) THEN
    CREATE POLICY "Authenticated users can delete lead captures"
    ON public.lead_captures
    FOR DELETE
    TO authenticated
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_lead_captures_updated_at'
      AND tgrelid = 'public.lead_captures'::regclass
  ) THEN
    CREATE TRIGGER update_lead_captures_updated_at
    BEFORE UPDATE ON public.lead_captures
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
