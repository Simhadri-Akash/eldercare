# Befine Care Engine

Elderly-care web application with appointment, messaging, notification,
care-team, billing, and health-report workflows. The workspace uses React,
Vite, Express, TypeScript, and MongoDB.

## Run locally

1. Use Node.js 22+ and run `corepack pnpm install`.
2. Copy `.env.example` to `.env` and configure `MONGODB_URI`.
3. Start MongoDB locally, or set `MONGODB_URI` to your MongoDB Atlas URI.
4. Start the API: `corepack pnpm dev:backend`.
5. In another terminal start the app: `corepack pnpm dev:frontend`.
6. Open `http://localhost:4173`.

## MongoDB connection

Set `MONGODB_URI` in `.env`. For MongoDB Atlas, use the connection string from
Atlas after creating a read/write database user and allowing your IP address:

`MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/care_engine`

Also replace `AUTH_SECRET` with a long random value before deployment. The UI
uses MongoDB data whenever records exist and keeps prepared mock data as the
empty/offline fallback.

Vite proxies `/api` to `http://127.0.0.1:5000` by default. Set `API_URL` to
change that target. The API creates MongoDB collections and indexes at startup;
there are no SQL migrations.

## Verify

- `pnpm run typecheck` — TypeScript checks
- `pnpm run build` — complete workspace build
- `GET http://localhost:5000/api/healthz` — HTTP health
- `GET http://localhost:5000/api/status` — MongoDB health

## Structure

- `frontend` — primary React application
- `backend` — Express and MongoDB API
- `packages/db` — MongoDB lifecycle and index setup
- `packages/api-spec/openapi.yaml` — API source of truth
- `packages/api-client-react`, `packages/api-zod` — generated API client and validation
