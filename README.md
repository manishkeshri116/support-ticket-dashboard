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

## Deploy to Vercel

The repository is configured as a single Vercel project: the Vite app is built into `frontend/dist`, and `api/[...path].ts` exposes the Express REST API as a Vercel Node.js Function. Set the Vercel project's **Root Directory** to the repository root (not `frontend` or `backend`), then add `DATABASE_URL` under Project Settings → Environment Variables for the Production environment. Use a hosted PostgreSQL connection string from your database provider. Prisma Client is a production dependency at the repository root for the serverless API; the Prisma CLI is a production dependency of the backend workspace, and Vercel generates the client explicitly during the build. Deploy once, then apply the Prisma migration to that same database:

```bash
DATABASE_URL='your-production-postgres-url' npm run db:migrate
DATABASE_URL='your-production-postgres-url' npm run db:seed
```

The Vercel function does not run migrations or seed data during requests. If `/api/summary` responds with an error, check the Vercel Function logs and confirm `DATABASE_URL` is configured and the database is reachable from Vercel.

If a Vercel deployment starts from an older commit, compare its **Source** commit with the latest commit on GitHub `main`. Redeploying an old failed deployment repeats that old source; trigger a deployment from the current branch head instead. If Vercel continues selecting an older commit after a new push, reconnect the Git repository in Vercel Project Settings → Git and verify the Production Branch is `main`.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/support_tickets?schema=public`. |
| `PORT` | No | Express API port; defaults to `5002`. |

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
