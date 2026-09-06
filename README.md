# Atelier Abdelaziz Nour — Gestion de projets (version Python/Flask)

Réécriture fonctionnellement identique à la version Node.js/Express :
même base SQLite, mêmes routes, même identité visuelle, mêmes gabarits HTML
(convertis d'EJS vers Jinja2). Testée de bout en bout dans le bac à sable
(connexion, création de projet, ajout de document, upload de fichier,
génération de partage, signature de visite, consultation) avant livraison.

- **`/app`** — Espace interne (protégé par mot de passe) : projets par phase
  (Esquisse → APS → APD), fichiers/rapports/notes, génération de partages.
- **`/portail`** — Portail client (public) : code d'accès → signature de
  visite (nom + signature dessinée, horodatée) → consultation en lecture
  seule jusqu'à expiration.

## Différences techniques avec la version Node

- Serveur : **Flask** au lieu d'Express ; **gunicorn** en production au lieu
  du serveur Node intégré.
- Templates : **Jinja2** (`.html`) au lieu d'EJS.
- Sessions : cookie signé Flask natif (pas de table `sessions` en base).
- Génération des codes de partage : module `secrets` de la bibliothèque
  standard (pas de dépendance `nanoid`).
- Mêmes limites qu'annoncées pour la version Node : l'espace interne et le
  portail client tournent sur le même serveur (protégé par mot de passe,
  mais pas isolé réseau) ; le « sans téléchargement » reste une dissuasion,
  pas une garantie absolue ; l'app est une PWA installable, pas une app
  native de store (voir plus bas).

## Lancer en local

```bash
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # renseignez ADMIN_USER / ADMIN_PASSWORD / SESSION_SECRET
python app.py
```

- Espace interne : http://localhost:3000/app
- Portail client : http://localhost:3000/portail

En production, `gunicorn app:app` (déjà configuré dans `Procfile` et
`render.yaml`) plutôt que `python app.py`.

## Déployer sur Render

1. Poussez ce dossier sur un dépôt GitHub.
2. Sur render.com : **New → Blueprint**, sélectionnez le dépôt — Render
   détecte `render.yaml` (environnement Python, build `pip install -r
   requirements.txt`, démarrage `gunicorn app:app`, disque persistant pour
   la base et les fichiers uploadés).
3. Renseignez `ADMIN_USER` et `ADMIN_PASSWORD` quand demandé.

## Vers une app de store (App Store / Play Store)

Toujours via [Capacitor](https://capacitorjs.com/), qui empaquette une web
app en projet natif :
1. `npm install @capacitor/core @capacitor/cli` (nécessite Node, même si le
   backend est en Python — Capacitor est l'outil d'empaquetage, pas le
   serveur).
2. Pointez Capacitor vers l'URL de votre app Flask déployée sur Render.
3. Ouvrez le projet généré dans Xcode / Android Studio, ajoutez icône et
   écran de démarrage.
4. Comptes développeur Apple (99 $/an) et Google Play (25 $ unique) requis
   pour la soumission — étape que je ne peux pas réaliser à votre place
   (accès réseau et comptes personnels nécessaires).

Les icônes PWA (`static/icons/icon-192.png`, `icon-512.png`) restent à
fournir : le manifeste fonctionne sans, avec l'icône par défaut du
navigateur en attendant.
