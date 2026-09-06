# Site de l'Atelier Abdelaziz Nour

Site dynamique en Node.js/Express avec panneau d'administration intégré :
publiez et modifiez vos **projets**, vos **billets de journal**, vos
**paramètres de site** (accroche, à propos, contact, réseaux) et consultez
les **messages** reçus via le formulaire de contact — sans toucher au code.

Identité visuelle : bleu blueprint / cyanotype, cohérente avec le reste de
votre communication (Substack, Blogger).

## Structure

```
server.js              → point d'entrée Express
routes/public.js        → pages publiques (accueil, projets, journal, contact)
routes/admin.js         → panneau d'administration (CRUD + upload d'images)
db/database.js          → SQLite (better-sqlite3), création des tables au démarrage
views/                   → templates EJS
public/css/style.css    → identité visuelle
data/                    → base SQLite + images uploadées (créé automatiquement)
```

## Lancer en local

```bash
npm install
cp .env.example .env      # puis modifiez ADMIN_USER / ADMIN_PASSWORD / SESSION_SECRET
npm start
```

Le site est sur http://localhost:3000, l'administration sur
http://localhost:3000/admin.

## Déployer sur Render

### Option A — via le fichier render.yaml (recommandé)

1. Poussez ce dossier sur un dépôt GitHub (ou GitLab).
2. Sur [render.com](https://render.com), **New > Blueprint**, sélectionnez le
   dépôt. Render lira `render.yaml` et proposera de créer le service.
3. Render vous demandera les valeurs des variables marquées `sync: false` :
   - `ADMIN_USER` — votre identifiant d'administration
   - `ADMIN_PASSWORD` — un mot de passe robuste
   - `SESSION_SECRET` est généré automatiquement.
4. Validez. Render exécute `npm install` puis `npm start`.

Le `render.yaml` déclare aussi un **disque persistant** de 1 Go monté sur
`data/` : c'est essentiel, car sans lui, la base SQLite et les images
uploadées seraient effacées à chaque redéploiement (le système de fichiers
d'un Web Service Render est éphémère par défaut).

### Option B — manuellement depuis le tableau de bord Render

1. **New > Web Service**, connectez votre dépôt.
2. Render/Environnement : **Node**.
3. Build Command : `npm install`
4. Start Command : `npm start`
5. Onglet **Environment** : ajoutez `ADMIN_USER`, `ADMIN_PASSWORD`,
   `SESSION_SECRET`.
6. Onglet **Disks** : ajoutez un disque, chemin de montage
   `/opt/render/project/src/data`, taille 1 Go (ajustez le chemin si votre
   structure de dépôt diffère — il doit correspondre au dossier `data/` à la
   racine du projet une fois déployé).
7. Déployez.

### Après le déploiement

- Rendez-vous sur `https://votre-service.onrender.com/admin`, connectez-vous,
  puis dans **Paramètres** renseignez le nom du cabinet, l'accroche, le texte
  « À propos », l'e-mail de contact et vos réseaux (LinkedIn, Instagram,
  Behance).
- Dans **Projets** et **Journal**, supprimez les exemples de démonstration et
  ajoutez vos propres contenus (image de couverture, texte, statut publié).
- Pour un nom de domaine personnalisé (vous possédez déjà
  `abdelaziznour.com` via Cloudflare) : dans Render, **Settings > Custom
  Domains**, ajoutez le domaine ou sous-domaine souhaité, puis créez
  l'enregistrement CNAME indiqué par Render dans votre zone DNS Cloudflare
  (en mode DNS only le temps de la validation).

## Sécurité — à savoir

- L'authentification admin est volontairement simple (un seul identifiant en
  variable d'environnement). Suffisant pour un usage mono-utilisateur, mais
  changez `ADMIN_PASSWORD` régulièrement et ne le partagez pas.
- Le plan gratuit de Render met le service en veille après une période
  d'inactivité (la première requête après veille peut prendre quelques
  secondes) — passez à un plan payant si vous voulez une disponibilité
  continue.
