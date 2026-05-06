BEGIN;

ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_terms_accepted BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS premium_priority_override_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_service_requests_is_premium
  ON public.service_requests(is_premium DESC, created_at ASC);

CREATE TABLE IF NOT EXISTS public.dispatcher_alerts (
  id BIGSERIAL PRIMARY KEY,
  recipient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_request_id INTEGER NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_dispatcher_alerts_recipient_created
  ON public.dispatcher_alerts(recipient_user_id, created_at DESC);

ALTER TABLE public.dispatcher_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS dispatcher_alerts_select_own ON public.dispatcher_alerts;
CREATE POLICY dispatcher_alerts_select_own
ON public.dispatcher_alerts
FOR SELECT
TO authenticated
USING (recipient_user_id = auth.uid());

COMMIT;
