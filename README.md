# ClearDesk — Support Ticket Dashboard

A responsive support inbox for creating, finding, and updating customer tickets.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, REST API
- **Database:** PostgreSQL with Prisma ORM and migrations
- **Tests:** Vitest and Supertest

## Project structure

```text
backend/
  prisma/                 # PostgreSQL schema, migrations, and seed script
  src/
    config/               # Database and environment setup
    controllers/          # HTTP request/response handling
    middleware/           # Shared Express middleware and error handling
    routes/               # REST route registration
    services/             # Ticket business logic and Prisma queries
    types/                # Domain types and database enum mapping
    utils/                # API response serialization/helpers
    validators/           # Request schemas and validation
  tests/                  # Supertest API tests
frontend/
  src/
    features/tickets/     # Ticket page, components, types, and constants
    services/             # HTTP API client
    styles.css            # Global and responsive styles
```

## Requirements

- Node.js 18+
- npm
- PostgreSQL 14+

## Run locally

1. Create a PostgreSQL database named `support_tickets` and a database user with permission to connect to it.
2. Configure and migrate the API:

   ```bash
   npm install
   cp backend/.env.example backend/.env
   ```

   Edit `DATABASE_URL` in `backend/.env` to match your PostgreSQL username, password, host, and database.

   ```bash
   npm run db:migrate
   npm run db:seed
   npm run dev:api
   ```

3. In a second terminal, start the frontend:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite (usually http://localhost:5173). The Vite development server proxies `/api` requests to `http://localhost:5002`.

## Deploy

The frontend is hosted on Vercel and the REST API on Render. The frontend defaults to `https://support-ticket-dashboard-x4je.onrender.com` for production API requests; set `VITE_API_BASE_URL` in Vercel if the API host changes. On Render, configure `DATABASE_URL` and set `CORS_ORIGINS` to include the exact Vercel origin, such as `https://support-ticket-dashboard-ashen.vercel.app`.

Run the Prisma migration and seed against the PostgreSQL database configured for Render:

```bash
DATABASE_URL='your-production-postgres-url' npm run db:migrate
DATABASE_URL='your-production-postgres-url' npm run db:seed
```

The optional `api/[...path].ts` Vercel function remains available for a single-provider deployment; in that configuration, set the Vercel Root Directory to the repository root and configure `DATABASE_URL` in Vercel. Migrations and seeding must be run explicitly; they are never run during API requests.

If `/api/health` succeeds but `/api/tickets` or `/api/summary` returns `500`, the API is running but cannot complete its database query. Check Render logs and verify `DATABASE_URL` points to the migrated PostgreSQL database. If the browser reports a CORS error, verify `CORS_ORIGINS` on Render includes the exact deployed Vercel origin.

When debugging a deployment, compare its **Source** commit with the latest GitHub `main` commit. Redeploying an old failed deployment repeats that source; trigger a deployment from the current branch head instead.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/support_tickets?schema=public`. |
| `PORT` | No | Express API port; defaults to `5002`. |
| `CORS_ORIGINS` | No | Comma-separated browser origins allowed to call the API. Defaults to local Vite and the deployed Vercel app. |
| `VITE_API_BASE_URL` | No | Frontend API origin for production builds. Defaults to the configured Render service URL; local Vite development uses its `/api` proxy. |

## Seed data

`npm run db:seed` adds 30 realistic example tickets with varied customer emails, priorities, statuses, descriptions, and creation dates. It skips seeding if the database already contains tickets. To reset sample data, clear the `tickets` table and run the seed command again.

## REST API

- `GET /api/health` — health check.
- `GET /api/summary` — total and status counts across all tickets.
- `GET /api/tickets?page=1&perPage=10` — paginated tickets. Supports `search` (title/email), `status`, `priority`, and `sort=newest|oldest`.
- `POST /api/tickets` — create a ticket; status defaults to `Open`.
- `GET /api/tickets/:id` — fetch full ticket details.
- `PATCH /api/tickets/:id` — update status and/or priority.

Errors use `{ "error": { "code": "...", "message": "...", "details": {} } }`; validation details are included when applicable. Search, filters, ordering, and pagination execute in the API/database.

## Tests and production builds

The API tests use a mocked Prisma delegate, so they run without a PostgreSQL service:

```bash
npm test
npm run build --workspace backend
```

```bash
npm run build --workspace frontend
```

## Assumptions and limitations

- This is an unauthenticated, single-workspace demo; access control and multi-tenant isolation are out of scope.
- Search uses PostgreSQL case-insensitive substring matching, appropriate for this small assignment dataset.
- The demo workspace identity and avatars are presentation-only; customer records are not stored separately.
- No deployment pipeline or production hosting configuration is included.
- **Time spent:** approximately 4 hours on the initial implementation, plus the stack migration.
- **AI use:** Copilot assisted with scaffolding, implementation iteration, and test/documentation drafting. Code was reviewed and locally validated; the author should be prepared to explain and modify it.

## Screenshots

![Ticket dashboard](./screenshots/dashboard.png)

![Ticket details](./screenshots/ticket-detail.png)
