#!/usr/bin/env node

/**
 * Minimal Supabase seed script (no external deps).
 */

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  Prefer: "resolution=merge-duplicates",
};

const towns = [
  {
    iris_code: "751010101",
    name: "Paris 10 — Château d'Eau",
    region: "Île-de-France",
    permits: 143,
    score: 88,
  },
  {
    iris_code: "693870504",
    name: "Lyon — Confluence",
    region: "Auvergne-Rhône-Alpes",
    permits: 97,
    score: 72,
  },
  {
    iris_code: "341720301",
    name: "Montpellier — Port Marianne",
    region: "Occitanie",
    permits: 81,
    score: 64,
  },
];

const users = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "aminata@example.com",
    name: "Aminata L.",
    balance: 1200,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "lucas@example.com",
    name: "Lucas P.",
    balance: 540,
  },
];

async function upsert(table, rows) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase error (${table}): ${text}`);
  }
}

async function main() {
  await upsert("users", users);
  await upsert("towns", towns);
  console.log("Seed OK ✔️");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
