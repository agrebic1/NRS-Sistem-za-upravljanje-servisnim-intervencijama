-- Admin audit log for user management actions
CREATE TABLE IF NOT EXISTS admin_user_audit_log (
  id         BIGSERIAL    PRIMARY KEY,
  user_id    UUID         NOT NULL,
  actor_id   UUID         NOT NULL,
  akcija     VARCHAR(100) NOT NULL,
  detalji    JSONB        NOT NULL DEFAULT '{}',
  razlog     TEXT,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_user_audit_user_id
  ON admin_user_audit_log (user_id, created_at DESC);
