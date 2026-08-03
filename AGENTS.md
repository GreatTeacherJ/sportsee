# AGENTS.md

## Aperçu

SportSee : tableau de bord d'analytics sportive. Next.js 16 (App Router) + React 19 + TypeScript strict + Recharts + FontAwesome + js-cookie. Aucun framework de test.

## Commandes

- `npm run dev` — serveur dev. Utilise `next dev --webpack` : ne pas retirer le flag `--webpack`.
- `npm run lint` — ESLint (flat config dans `eslint.config.mjs`).
- `npm run build` / `npm run start` — build et serveur de production.
- `npm run create-page <route>` — génère `src/app/<route>/page.tsx` + `<route>.module.css`.
- `npm run create-composant <nom>` — génère `src/app/composant/<nom>/` (.tsx + .module.css).
- Pas de script `typecheck` ni de tests : vérifier avec `npm run lint` (le TS est contrôlé au build).

## Architecture

- Alias d'import : `@/*` → `./src/*`.
- Routes App Router dans `src/app/` : `login`, `(protected)/dashboard`, `(protected)/profil`.
- Composants réutilisables dans `src/app/composant/` (chacun a son `.tsx` + `.module.css`).
- Le contexte API (`src/contexts/context.tsx`) est alimenté par `src/app/(protected)/layout.tsx`, qui fetch toutes les données.
- Types centraux : `src/types/apiTypes.ts`.
- Appels API : `src/utils/utilsAPI.ts`.

## API backend (micro-API, repo séparé)

/

- Tourne sur `http://localhost:8000` (doc : `README-API.md`).
- Auth JWT : token stocké dans un cookie nommé `token` ; envoyer `Authorization: Bearer <token>`.
- Utilisateurs de démo : `sophiemartin/password123`, `emmaleroy/password789`, `marcdubois/password456`.
- Endpoints : `POST /api/login`, `GET /api/user-info`, `GET /api/user-activity?startWeek=&endWeek=`, `GET /images/<filename>`.
- Distances en km, durées en minutes, dates au format ISO `YYYY-MM-DD`.

## Style de réponse

- Réponds toujours en français.
- Codes en anglais.
- Explique les détails du code uniquement si le mot clé « detail » est donné.
- Ne change jamais le code existant sans avoir validé avec l'utilisateur.

## Pièges

- `proxy.ts` (middleware Next.js) **saute toute vérification d'auth en mode dev** (`NODE_ENV === "development"`) : la protection des routes ne s'applique qu'en build de production.
- `src/mock.json` et `src/AllUserActivity.json` sont des données de dev **gitignorées** : l'API est la source de vérité, ne pas s'y fier pour le code de prod.
- `README-API.md` est aussi gitignoré.
- `getApiImage()` retourne une Object URL blob : la libérer avec `URL.revokeObjectURL()` au logout, sinon fuite mémoire.
- Style des commits : conventionnel (`feat: ...`).
