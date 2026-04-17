
-- Only service_role can access these tables
CREATE POLICY "Service role full access to subscribers"
  ON public.telegram_subscribers
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access to bot state"
  ON public.telegram_bot_state
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
