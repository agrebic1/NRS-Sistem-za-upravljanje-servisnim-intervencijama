-- Dodaje struktuirane kolone za kategorije kvara.
ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS category_main VARCHAR(100),
  ADD COLUMN IF NOT EXISTS category_sub VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_service_requests_category_main
  ON public.service_requests(category_main);

CREATE INDEX IF NOT EXISTS idx_service_requests_category_sub
  ON public.service_requests(category_sub);

-- Backfill za postojece redove gdje je category format "Glavna — Pod".
UPDATE public.service_requests
SET
  category_main = COALESCE(
    NULLIF(category_main, ''),
    NULLIF(split_part(category, '—', 1), ''),
    NULLIF(split_part(category, '-', 1), '')
  ),
  category_sub = COALESCE(
    NULLIF(category_sub, ''),
    NULLIF(split_part(category, '—', 2), ''),
    NULLIF(split_part(category, '-', 2), '')
  )
WHERE category IS NOT NULL
  AND (category_main IS NULL OR category_sub IS NULL);
