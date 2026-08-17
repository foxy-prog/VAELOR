# VÆLOR V2.1 — Production Data Core Deployment

## Local PostgreSQL
1. Copy `.env.example` to `.env` and set a non-default password.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Install dependencies with `npm install`.
4. Set `VAELOR_DATABASE_URL` to the PostgreSQL connection string.
5. Run `npm run build`.
6. Run `npm run migrate`.
7. Start the runtime.

## Boundary
The database is infrastructure. Models/agents never receive database credentials or raw connection strings. Only the data-core service owns the database client.

## Production warning
The included compose file is a development/local deployment aid. Production deployment must add secret management, TLS, backups, monitoring, access restrictions, patching, and tested disaster recovery before being treated as mission-critical infrastructure.
