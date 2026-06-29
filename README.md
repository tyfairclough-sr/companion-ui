# Avatar Animations App

A Next.js application.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start local Postgres (optional if you already have a DB):

   ```bash
   docker compose up -d
   ```

3. Create your local environment file from the template:

   ```bash
   cp .env.example .env
   ```

4. Apply migrations and seed (first time only):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   The app runs at **http://localhost:4000**.

## Local port

The local dev server port is controlled by the `PORT` environment variable and
defaults to **4000**.

- **Default**: `PORT=4000` is set in `.env` (and `.env.example`), so `npm run dev`
  serves the app at http://localhost:4000.
- **Change it permanently**: edit `PORT` in your local `.env` file.
- **Change it for a single run**: `PORT=5000 npm run dev`.
- **If `PORT` is unset**: the `dev` script falls back to `4000`.

Because Next.js starts its HTTP server before `.env` files are loaded, the `dev`
script in `package.json` sources `.env` and passes the port to Next.js explicitly
via `-p`:

```jsonc
"dev": "[ -f .env ] && set -a && . ./.env && set +a; next dev --turbopack -p ${PORT:-4000}"
```

> Note: This `dev` script uses POSIX shell features, so it works on macOS/Linux.
> Production (`npm run build` / `npm start`) is unaffected and uses the platform's
> own `PORT` (e.g. the one Render injects).

## Production database (Neon)

Production uses [Neon](https://neon.tech) serverless Postgres. The app is already
configured for two connection strings:

| Variable | Purpose | Neon type |
|----------|---------|-----------|
| `DATABASE_URL` | App runtime queries | **Pooled** (`-pooler` in hostname) |
| `DIRECT_URL` | `prisma migrate deploy` and seed during build | **Direct** (no `-pooler`) |

Prisma reads both from `prisma/schema.prisma` (`url` + `directUrl`).

### 1. Create a Neon project

1. Sign up at [console.neon.tech](https://console.neon.tech).
2. **New project** — pick a region close to your host (e.g. `eu-west-1` if on Render EU).
3. Open the project → **Connect**.
4. Copy **both** connection strings:
   - **Pooled connection** → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`
5. Ensure each URL includes `?sslmode=require`.

Example (replace with your values):

```bash
DATABASE_URL="postgresql://neondb_owner:****@ep-xxxx-pooler.eu-west-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:****@ep-xxxx.eu-west-1.aws.neon.tech/neondb?sslmode=require"
```

### 2. Set env vars on your host (Render)

In the Render dashboard for your web service:

1. **Environment** → add or update:
   - `DATABASE_URL` = Neon **pooled** URL
   - `DIRECT_URL` = Neon **direct** URL
2. Save and trigger a **manual deploy** (or push to `main`).

The build script runs migrations and seed against Neon automatically:

```json
"build": "prisma generate && prisma migrate deploy && prisma db seed && next build"
```

`migrate deploy` uses `DIRECT_URL`; the running app uses `DATABASE_URL`.

### 3. Verify from your machine (optional)

Point at production once to confirm connectivity:

```bash
DIRECT_URL="postgresql://..." npm run db:migrate
```

You should see pending migrations applied (or “No pending migrations”).

### Local vs production

| Environment | Database | Config |
|-------------|----------|--------|
| Local | Docker Postgres (`docker compose up -d`) | `.env` with localhost URLs |
| Production | Neon | Render env vars (pooled + direct) |

Do **not** commit real Neon credentials; only `.env.example` is tracked in git.
