-- VÆLOR V2.1 Production Data Core — PostgreSQL
-- Transactional canonical state + durable runtime event record.
CREATE TABLE IF NOT EXISTS vaelor_missions (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  state TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  authority_ceiling SMALLINT NOT NULL CHECK (authority_ceiling BETWEEN 0 AND 3),
  risk TEXT NOT NULL,
  parent_id TEXT NULL REFERENCES vaelor_missions(id) DEFERRABLE INITIALLY DEFERRED,
  deadline TIMESTAMPTZ NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_missions_state ON vaelor_missions(state);
CREATE INDEX IF NOT EXISTS idx_vaelor_missions_parent ON vaelor_missions(parent_id);

CREATE TABLE IF NOT EXISTS vaelor_mission_transitions (
  transition_id BIGSERIAL PRIMARY KEY,
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  reason TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_mission_transitions_time ON vaelor_mission_transitions(occurred_at);

CREATE TABLE IF NOT EXISTS vaelor_memory (
  id TEXT PRIMARY KEY,
  layer TEXT NOT NULL,
  verification TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  updated_at TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NULL,
  payload JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_memory_layer ON vaelor_memory(layer);
CREATE INDEX IF NOT EXISTS idx_vaelor_memory_valid_until ON vaelor_memory(valid_until);

CREATE TABLE IF NOT EXISTS vaelor_world_entities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  observed_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_world_entities_type ON vaelor_world_entities(type);

CREATE TABLE IF NOT EXISTS vaelor_world_relations (
  id TEXT PRIMARY KEY,
  from_entity TEXT NOT NULL,
  relation TEXT NOT NULL,
  to_entity TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  observed_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_world_relations_from ON vaelor_world_relations(from_entity);
CREATE INDEX IF NOT EXISTS idx_vaelor_world_relations_to ON vaelor_world_relations(to_entity);

CREATE TABLE IF NOT EXISTS vaelor_traces (
  trace_id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NULL,
  status TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_traces_run ON vaelor_traces(run_id);

CREATE TABLE IF NOT EXISTS vaelor_trace_events (
  event_id TEXT PRIMARY KEY,
  trace_id TEXT NOT NULL REFERENCES vaelor_traces(trace_id) ON DELETE CASCADE,
  run_id TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  actor TEXT NOT NULL,
  component TEXT NOT NULL,
  payload JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_trace_events_trace_time ON vaelor_trace_events(trace_id, occurred_at);

CREATE TABLE IF NOT EXISTS vaelor_runtime_events (
  event_id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  run_id TEXT NULL,
  trace_id TEXT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vaelor_runtime_events_trace ON vaelor_runtime_events(trace_id);
CREATE INDEX IF NOT EXISTS idx_vaelor_runtime_events_time ON vaelor_runtime_events(occurred_at);
