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
   - **Source** : choisissez **GitHub Actions** (pas « Deploy from a branch »).
   - GitHub affiche alors des **modèles de workflow** : **ignorez-les** — le fichier `.github/workflows/deploy-pages.yml` est déjà dans le dépôt. Fermez la fenêtre ou cliquez sur *Skip* s’il y en a un.

4. Lancez le déploiement une première fois :
   - Onglet **Actions** → workflow **« Deploy keynote to GitHub Pages »**
   - Bouton **Run workflow** → **Run workflow** (branche `main`).

5. Si GitHub demande d’**approuver l’environnement** `github-pages`, validez la demande (bouton *Review deployments* / *Approve*).

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
