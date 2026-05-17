-- Extend notifikacije table for multi-role support
ALTER TABLE notifikacije
  ADD COLUMN IF NOT EXISTS uloga_korisnika       text NULL,
  ADD COLUMN IF NOT EXISTS povezani_entitet_tip  text NULL,
  ADD COLUMN IF NOT EXISTS povezani_entitet_id   text NULL;
