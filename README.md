# 🏯 La Chasse au Parchemin Interdit

Jeu de piste Naruto avec 7 étapes, leaderboard et vérification des réponses côté serveur via Supabase.

## 🚀 Setup rapide

### 1. Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Va dans **SQL Editor** et colle le contenu de `supabase/migration.sql`
3. Exécute le script
4. Va dans **Settings → API** et copie ton `URL` et ta `anon key`

### 2. Projet local

```bash
# Installe les dépendances
npm install

# Crée ton fichier .env
cp .env.example .env
```

Remplis le `.env` avec tes valeurs Supabase :
```
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Lance le dev server

```bash
npm run dev
```

Le site sera dispo sur `http://localhost:5173`

### 4. Build pour la prod

```bash
npm run build
```

Le dossier `dist/` est prêt à être déployé (Vercel, Netlify, etc.)

---

## 🔧 Personnalisation

### Modifier les étapes et réponses

- **Données d'affichage** (titres, descriptions, indices) → `src/config.ts`
- **Réponses** → table `stages` dans Supabase (SQL Editor)

### Modifier la config du jeu

- **Heure d'ouverture / points** → table `game_config` dans Supabase
- **Ou** via le panel admin in-game (bouton ⚙ en bas à droite, code : `hokage-admin-777`)

### Modifier le code admin

→ `src/config.ts` → constante `ADMIN_CODE`

---

## 📁 Structure

```
src/
├── config.ts              ← Config client (textes, pas de réponses)
├── App.tsx                ← Logique principale
├── main.tsx               ← Entry point
├── env.d.ts               ← Types Vite
├── lib/supabase.ts        ← Client Supabase
├── types/index.ts         ← Types TypeScript
├── utils/
│   ├── api.ts             ← Appels RPC Supabase
│   └── helpers.ts         ← Fonctions utilitaires
├── styles/index.css       ← Styles globaux
├── components/
│   ├── LandingPage.tsx    ← Inscription
│   ├── HubPage.tsx        ← Hub des étapes
│   ├── StagePage.tsx      ← Wrapper d'étape + vérif serveur
│   ├── CompletionPage.tsx ← Écran de victoire
│   ├── LeaderboardPage.tsx
│   ├── AdminAccess.tsx    ← Panel admin
│   └── Embers.tsx         ← Particules déco
└── stages/
    ├── HintButton.tsx     ← Bouton indice réutilisable
    ├── CodeStage.tsx      ← Saisie de code
    ├── CipherStage.tsx    ← Déchiffrage César
    ├── MemoryStage.tsx    ← Séquence de mudras
    ├── PuzzleStage.tsx    ← Taquin kanji
    ├── RiddleStage.tsx    ← Énigme texte
    └── FinalStage.tsx     ← Code final combiné
```
