# Du génératif à l'agentique — Keynote

Présentation fullscreen (React + Three.js) pour la plaidoirie Proxima Nexus.

## Lancer en local

```bash
npm install
npm run dev
```

Build statique (identique à GitHub Pages) :

```bash
npm run build:pages
npm run preview:pages
```

## Publier sur GitHub Pages

1. Créez un dépôt GitHub (ex. `actionable-ai`) — **public** pour Pages gratuit.
2. Poussez ce dossier :

```bash
git init
git add .
git commit -m "Keynote: déploiement GitHub Pages"
git branch -M main
git remote add origin https://github.com/VOTRE_ORG/actionable-ai.git
git push -u origin main
```

3. **Settings → Pages → Build and deployment**
   - **Source** : **Deploy from a branch**
   - **Branch** : `gh-pages` / `/ (root)`
   - (Ne pas laisser « main » : sinon GitHub affiche le README en Jekyll au lieu de la keynote.)

4. Après le premier push sur `main`, le workflow crée la branche `gh-pages` automatiquement. Sinon : **Actions** → **Deploy keynote to GitHub Pages** → **Run workflow**.

6. Quand le job est vert ✅, la keynote est en ligne :

**https://plexusia.github.io/actionable-ai/**

(Format : `https://COMPTE.github.io/NOM_DU_REPO/`)

## Navigation

- `→` / `Espace` : slide suivante  
- `←` : précédente  
- `Home` / `End` : première / dernière  
- `F` : plein écran  

## Structure

- `src/components/deck/` — slides, 3D, audio intro/outro  
- `public/` — modèle GLB, images Plexy, bande-son  
- `vite.config.github.ts` — build statique pour Pages  
