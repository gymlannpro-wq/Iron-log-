# Iron Log — installer ton app

Ce dossier contient une vraie version autonome de ton app, qui fonctionne
en dehors de Claude. Tes données sont sauvegardées directement sur ton
appareil (dans le navigateur), donc elles sont indépendantes de Claude et
resteront stables même si je modifie encore le code plus tard.

## Étape 1 — Mettre l'app en ligne (gratuit, ~5 minutes, aucune compétence technique)

La méthode la plus simple, sans rien installer sur ton ordinateur :

1. Va sur **https://stackblitz.com** et clique sur "Create" puis choisis un
   projet "Vite + React".
2. Supprime les fichiers du projet créé par défaut, puis glisse-dépose
   TOUS les fichiers de ce dossier (`package.json`, `vite.config.js`,
   `index.html`, le dossier `src`, le dossier `public`) dedans.
3. StackBlitz installe tout automatiquement et te donne une **URL en
   direct** (quelque chose comme `https://xxxxx.stackblitz.io`).
4. Ouvre cette URL sur ton téléphone (Safari sur iPhone, Chrome sur
   Android).

## Étape 2 — "Installer" l'app sur ton téléphone

**Sur iPhone (Safari) :**
Ouvre l'URL → bouton Partager (carré avec une flèche) → "Sur l'écran
d'accueil". Une icône apparaît comme une vraie app.

**Sur Android (Chrome) :**
Ouvre l'URL → menu (3 points) → "Installer l'application" ou "Ajouter à
l'écran d'accueil".

À partir de là, tu as une icône sur ton téléphone, en plein écran, sans
barre de navigateur — comme une app normale.

## Pour un lien permanent (au lieu d'un lien StackBlitz temporaire)

Si tu veux un vrai nom de domaine stable :
1. Crée un compte gratuit sur **https://vercel.com** ou
   **https://netlify.com**.
2. Dépose ce dossier (glisser-déposer, ils proposent tous les deux un
   "drag and drop deploy").
3. Tu obtiens une URL fixe (ex. `iron-log.vercel.app`) que tu peux garder
   et réinstaller sur ton téléphone comme à l'étape 2.

## Important à savoir

- Cette version sauvegarde tes données **uniquement sur l'appareil/le
  navigateur que tu utilises**. Si tu changes de téléphone ou vides le
  cache du navigateur, tu perds les données (sauf si tu utilises la
  fonction Export/Import déjà présente dans l'app, dans le menu Compte).
- Pour que plusieurs utilisateurs aient chacun leur compte synchronisé
  entre appareils (nécessaire si tu veux la vendre), il faut ajouter un
  vrai serveur/base de données — ce n'est pas encore le cas ici.
