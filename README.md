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

3. Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
4. Après le workflow vert, la keynote est en ligne à :

`https://VOTRE_ORG.github.io/actionable-ai/`

(Remplacez `actionable-ai` par le nom exact du dépôt.)

## Navigation

- `→` / `Espace` : slide suivante  
- `←` : précédente  
- `Home` / `End` : première / dernière  
- `F` : plein écran  

## Structure

- `src/components/deck/` — slides, 3D, audio intro/outro  
- `public/` — modèle GLB, images Plexy, bande-son  
- `vite.config.github.ts` — build statique pour Pages  
