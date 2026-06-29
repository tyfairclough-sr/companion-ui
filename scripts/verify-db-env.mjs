#!/usr/bin/env node
/**
 * Validates DATABASE_URL and DIRECT_URL before prisma migrate deploy.
 * On Vercel, localhost URLs cause P1001 — fail early with an actionable message.
 */
import { appendFileSync } from "node:fs";
import { join } from "node:path";

const LOG_PATH = join(process.cwd(), ".cursor/debug-13df4b.log");

function agentLog(payload) {
  const entry = {
    sessionId: "13df4b",
    timestamp: Date.now(),
    ...payload,
  };
  try {
    appendFileSync(LOG_PATH, `${JSON.stringify(entry)}\n`);
  } catch {
    // ignore when log path is unavailable (e.g. read-only CI)
  }
}

function maskUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}:${parsed.port || "5432"}${parsed.pathname}`;
  } catch {
    return "(invalid url)";
  }
}

function isLocalhost(url) {
  return /localhost|127\.0\.0\.1/.test(url);
}

const isVercel = process.env.VERCEL === "1";
const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";

// #region agent log
agentLog({
  location: "scripts/verify-db-env.mjs:entry",
  message: "verify-db-env started",
  hypothesisId: "B",
  runId: "pre-fix",
  data: {
    isVercel,
    hasDatabaseUrl: Boolean(databaseUrl),
    hasDirectUrl: Boolean(directUrl),
    databaseHost: databaseUrl ? maskUrl(databaseUrl) : null,
    directHost: directUrl ? maskUrl(directUrl) : null,
    databaseIsLocalhost: databaseUrl ? isLocalhost(databaseUrl) : null,
    directIsLocalhost: directUrl ? isLocalhost(directUrl) : null,
  },
});
// #endregion

if (!isVercel) {
  // #region agent log
  agentLog({
    location: "scripts/verify-db-env.mjs:skip",
    message: "skipped non-Vercel environment",
    hypothesisId: "B",
    runId: "pre-fix",
    data: { isVercel },
  });
  // #endregion
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
  // #region agent log
  agentLog({
    location: "scripts/verify-db-env.mjs:fail",
    message: "Vercel database env validation failed",
    hypothesisId: "B",
    runId: "pre-fix",
    data: { problems, databaseHost: maskUrl(databaseUrl), directHost: maskUrl(directUrl) },
  });
  // #endregion

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

// #region agent log
agentLog({
  location: "scripts/verify-db-env.mjs:pass",
  message: "Vercel database env validation passed",
  hypothesisId: "B",
  runId: "pre-fix",
  data: { databaseHost: maskUrl(databaseUrl), directHost: maskUrl(directUrl) },
});
// #endregion
