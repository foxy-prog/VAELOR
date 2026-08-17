-- VÆLOR V2.1 Consistency + Recovery Gate
-- Serializes canonical commits, adds optimistic versioning, and makes commit intent idempotent.
CREATE TABLE IF NOT EXISTS vaelor_runtime_head (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  version BIGINT NOT NULL CHECK (version >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO vaelor_runtime_head(id, version)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE vaelor_runtime_events
  ADD COLUMN IF NOT EXISTS commit_key TEXT;
ALTER TABLE vaelor_runtime_events
  ADD COLUMN IF NOT EXISTS state_version BIGINT;
CREATE UNIQUE INDEX IF NOT EXISTS uq_vaelor_runtime_events_commit_key
  ON vaelor_runtime_events(commit_key)
  WHERE commit_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vaelor_runtime_events_state_version
  ON vaelor_runtime_events(state_version);

CREATE TABLE IF NOT EXISTS vaelor_runtime_checkpoints (
  checkpoint_id TEXT PRIMARY KEY,
  state_version BIGINT NOT NULL,
  checksum TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_runtime_checkpoints_version
  ON vaelor_runtime_checkpoints(state_version DESC);
