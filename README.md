# Avatar Animations App

A Next.js application.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file from the template:

   ```bash
   cp .env.example .env
   ```

3. Start the dev server:

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
