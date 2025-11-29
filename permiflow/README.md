# PermiFlow — Captez le pouls de la ville

PermiFlow est une PWA Next.js qui analyse les permis de construire (SITADEL) pour générer un score « hype » par quartier et permettre de miser sur la dynamique urbaine. Le dépôt fournit **tout le MVP** : frontend, API routes, scraper Python, scoring ML, worker de règlement, scripts Supabase + Stripe et CI/CD.

## Sommaire
- [Structure](#structure)
- [Installation rapide](#installation-rapide)
- [Frontend](#frontend)
- [Services Python](#services-python)
- [Supabase](#supabase)
- [Stripe](#stripe)
- [CI/CD GitHub Actions](#cicd-github-actions)
- [Scripts utilitaires](#scripts-utilitaires)

## Structure
```
permiflow/
├─ apps/web/             # Next.js 14 app router + Tailwind 4
├─ services/
│  ├─ scraper/           # scrape_sitadel.py + requirements
│  ├─ model/             # train_score.py / score_nightly.py
│  └─ worker/            # settle.py
├─ infra/supabase/       # schema.sql + seed.sql
├─ scripts/              # seed.js + health_check.sh
├─ .github/workflows/    # CI/CD pipeline
├─ .env.example          # Variables globales
└─ README.md             # Ce fichier
```

## Installation rapide
```bash
git clone <repo>
cd permiflow
cp .env.example .env.local        # adapter les clés

# Frontend
npm install --prefix apps/web
npm run dev --prefix apps/web

# Scraper / services
cd services/scraper && pip install -r requirements.txt
python3 scrape_sitadel.py --dry-run
```

### Variables d'environnement clés
| Nom | Usage |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL public Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé anonyme pour le frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | service role pour scraper / workers |
| `STRIPE_SECRET_KEY` | clé secrète Stripe |
| `STRIPE_ENDPOINT_SECRET` | signature webhook |
| `NEXT_PUBLIC_APP_URL` | URL Vercel / PWA |
| `SITADEL_DATA_URL` | override éventuel de la source CSV |

## Frontend
- **Stack** : Next.js 16 (app router), React Simple Maps, Tailwind 4, Zustand.
- **Pages** :
  - `/` : carte heatmap, KPIs, pipeline nightly, aperçu des 30 écrans.
  - `/paris` : formulaire interactif pour créer un pari.
  - `/dashboard` : wallet, historique, recap paris.
  - `/screens` + `/screens/[slug]` : galerie des 30 UI screens (demandé).
- **API routes** :
  - `api/bets` (GET/POST) : CRUD paris (Supabase + fallback mock).
  - `api/score` : scores IRIS.
  - `api/settle` : déclenchement manuel du règlement.
  - `api/payments/checkout` + `api/payments/webhook` : flux Stripe Checkout.
- **PWA** : `manifest.json`, icônes 192/512px, favicon et meta dans `layout.tsx`.

## Services Python
| Script | Description |
| --- | --- |
| `services/scraper/scrape_sitadel.py` | Télécharge SITADEL, agrège par IRIS, upsert Supabase (cron nightly). |
| `services/model/train_score.py` | Entraîne un modèle XGBoost (fichier `models/hype_score.json`). |
| `services/model/score_nightly.py` | Charge les permis Supabase, prédit et met à jour les scores. |
| `services/worker/settle.py` | Parcourt les paris expirés, applique fee 5 %, crédite les gagnants. |

Tous les scripts  utilisent Python 3.11+ et la clé service Supabase.

## Supabase
- `infra/supabase/schema.sql` : tables (`users`, `towns`, `bets`, `payments`), fonction `increment_balance`, RLS minimale.
- `infra/supabase/seed.sql` : 2 utilisateurs + 3 communes de démonstration.
- `scripts/seed.js` : seed REST basique utilisable via `node scripts/seed.js`.

## Stripe
- `api/payments/checkout` crée un checkout session (mode test).
- `api/payments/webhook` consomme `checkout.session.completed` et appelle `increment_balance`.
- Configurer `STRIPE_SECRET_KEY` + `STRIPE_ENDPOINT_SECRET`, puis `stripe listen --forward-to localhost:3000/api/payments/webhook`.

## CI/CD GitHub Actions
Workflow `/.github/workflows/permiflow.yml` :
1. **build** (push & PR) : installe les dépendances, `npm run lint`, tests scripts.
2. **nightly** (cron) : exécute scraper, scoring, worker, `scripts/health_check.sh`.
3. **deploy** : placeholder pour `vercel deploy` (token/ID à ajouter dans les secrets).

## Scripts utilitaires
- `scripts/seed.js` : upsert users + towns via REST Supabase.
- `scripts/health_check.sh` : ping `/api/score` et `/api/bets` (utilisé par le workflow).

## Licence
MIT — libre d'utilisation tant que le crédit PermiFlow est mentionné.
