# PermiFlow — Captez le pouls de la ville

PermiFlow est une plateforme web qui permet de parier sur l'évolution immobilière locale à partir des permis de construire (SITADEL) et autres données publiques. Ce guide explique comment configurer, lancer, automatiser et déployer l'application de bout en bout.

## 1. Prérequis
- Node.js ≥ 20
- npm ou yarn
- Python 3.11+ (scraping, scoring, worker)
- Compte Supabase
- Compte Stripe (mode test)
- Git
- Compte Vercel

## 2. Installation locale
```bash
git clone https://github.com/<votre-user>/permiflow.git
cd permiflow/apps/web
npm install      # ou yarn install
```

Créer ensuite `apps/web/.env.local` :
```
NEXT_PUBLIC_SUPABASE_URL=<votre_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<votre_service_role_key>
STRIPE_SECRET_KEY=<votre_stripe_secret_key>
STRIPE_PUBLISHABLE_KEY=<votre_stripe_publishable_key>
```

## 3. Configuration Supabase
1. Créer un projet Supabase.
2. Exécuter les scripts SQL :
```bash
psql -h <host> -U <user> -d <db> -f infra/supabase/schema.sql
psql -h <host> -U <user> -d <db> -f infra/supabase/seed.sql
```
3. Vérifier les tables `users`, `bets`, `towns` et les règles RLS.

## 4. Configuration Stripe
1. Créer un compte Stripe en mode test.
2. Créer un produit « PermiFlow Credits » ou « Abonnement Pro ».
3. Copier les clés API dans `.env.local`.
4. S'assurer que les webhooks pointent vers `/api/payments/webhook`.

## 5. Lancer l'application localement
```bash
npm run dev  # ou yarn dev
```
- Frontend : http://localhost:3000
- API routes clés :
  - `/api/bets/route.ts` — créer/lire les paris
  - `/api/score/route.ts` — score en temps réel
  - `/api/settle/route.ts` — clôture des paris
  - `/api/payments/checkout/route.ts` — paiement
  - `/api/payments/webhook/route.ts` — webhook Stripe

## 6. Scraping et scoring nocturne
1. **Scraping SITADEL**
```bash
cd worker/scraper
python scrape_sitadel.py
```
   - Génère un CSV/JSON par IRIS
   - Met à jour Supabase (`towns`)

2. **Score nocturne**
```bash
cd worker/model
python score_nightly.py
```
   - Réentraîne le modèle XGBoost
   - Met à jour les scores hype-factor (0-100) par IRIS

3. Option : ajouter un cron job (Linux/macOS) ou planificateur Windows pour exécution quotidienne.

## 7. Déploiement sur Vercel
1. Créer un projet Vercel et connecter le repo GitHub.
2. Configurer les variables d'environnement (Supabase, Stripe, URLs).
3. Déployer (`vercel --prod` ou dashboard).
4. Vérifier le build et les routes `/api/*`.

## 8. Structure du projet
```
permiflow/
├─ apps/web/                  # Frontend Next.js
│  ├─ app/
│  ├─ components/
│  ├─ pages/
│  ├─ styles/
│  └─ public/
├─ worker/
│  ├─ scraper/                # Scraper SITADEL
│  └─ model/                  # Scoring XGBoost
├─ infra/supabase/            # SQL schema + seed
├─ scripts/                   # Scripts utilitaires
├─ services/                  # Librairies Stripe / Supabase
├─ .github/workflows/         # CI/CD
└─ README.md
```

## 9. Commandes utiles
| Commande | Description |
| --- | --- |
| `npm run dev` | Lancer frontend + API local |
| `npm run build` | Builder Next.js pour prod |
| `npm run start` | Lancer le build prod local |
| `python worker/scraper/scrape_sitadel.py` | Mettre à jour la DB avec les permis |
| `python worker/model/score_nightly.py` | Calculer les scores hype-factor |
| `vercel --prod` | Déployer sur Vercel |

## 10. Check-list Cursor
1. Cloner le repo.
2. Installer les dépendances npm.
3. Générer `.env.local` (Supabase + Stripe).
4. Vérifier `schema.sql` + `seed.sql`.
5. Lancer API + frontend avec `npm run dev`.
6. Lancer `scrape_sitadel.py` puis `score_nightly.py`.
7. Tester le flux pari/wallet avec Stripe (mode test).
8. Déployer sur Vercel.

## 11. Notes
- MVP serverless PWA, pas d'app native.
- Limites free tier (Supabase, Vercel) ≈ 1 000 utilisateurs.
- Code généré via Manus/Cursor → prévoir revue sécurité + tests.
- Les paris respectent la limite légale (< 1 850 €/personne/an) pour rester en « pari mutuel ».
