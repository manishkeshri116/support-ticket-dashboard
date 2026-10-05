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
   cd backend
   npm install
   cp .env.example .env
   ```

   Edit `DATABASE_URL` in `backend/.env` to match your PostgreSQL username, password, host, and database.

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

3. In a second terminal, start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually http://localhost:5173). The Vite development server proxies `/api` requests to `http://localhost:5002`.

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
cd backend
npm test
npm run build
```

```bash
cd frontend
npm run build
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
