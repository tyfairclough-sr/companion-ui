#!/usr/bin/env node
/**
 * Validates DATABASE_URL and DIRECT_URL before prisma migrate deploy.
 * On Vercel, localhost URLs cause P1001 — fail early with an actionable message.
 */

function isLocalhost(url) {
  return /localhost|127\.0\.0\.1/.test(url);
}

const isVercel = process.env.VERCEL === "1";
const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";

if (!isVercel) {
  process.exit(0);
}

const problems = [];

if (!databaseUrl) {
  problems.push("DATABASE_URL is not set");
} else if (isLocalhost(databaseUrl)) {
  problems.push(
    "DATABASE_URL points to localhost — use your Neon pooled connection string on Vercel (hostname includes -pooler)",
  );
}

if (!directUrl) {
  problems.push("DIRECT_URL is not set");
} else if (isLocalhost(directUrl)) {
  problems.push(
    "DIRECT_URL points to localhost — use your Neon direct connection string on Vercel (no -pooler in hostname)",
  );
}

if (problems.length > 0) {
  console.error("\nDatabase environment is misconfigured for Vercel:\n");
  for (const problem of problems) {
    console.error(`  • ${problem}`);
  }
  console.error(
    "\nDo not copy localhost values from .env. In Neon Console → Connect, copy both URLs:",
  );
  console.error("  DATABASE_URL = Pooled connection");
  console.error("  DIRECT_URL   = Direct connection");
  console.error("\nSet them in Vercel → Project → Settings → Environment Variables.");
  console.error("See README.md → Production database (Neon) → Vercel.\n");
  process.exit(1);
}
