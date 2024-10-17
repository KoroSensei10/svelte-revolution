# Mise en place du projet

## Installation

### Prérequis

-   [Git](https://git-scm.com/) : Gestionnaire de versions
-   [Docker](https://www.docker.com/) : Conteneurisation & Déploiement
    -   [Docker Desktop](https://www.docker.com/products/docker-desktop) : Version Desktop
    -   [Docker Compose](https://docs.docker.com/compose/) : Outil de gestion de conteneurs
-   [Bun](https://bun.sh/) : Gestionnaire de packet & Runtime \
    ou
-   [Node.js](https://nodejs.org/en/) Environnement d'exécution JavaScript (version > 20)

### Installation des dépendances

Windows : `powershell -c "irm bun.sh/install.ps1 | iex"`
Mac & Linux : `curl -fsSL https://bun.sh/install | bash`

Clone du projet :
`git clone https://github.com/KoroSensei10/svelte-revolution.git`

```bash
bun install
```

### Lancer le projet en mode développement

Lancer le serveur de développement :

```bash
bun dev
```

### Tester la production

Lancer le serveur de production :

```bash
bun run build
bun run preview
```

## Structure du projet

-   `src/` : code source
    -   `lib/` : fonctions utilitaires
    -   `components/` : composants
    -   `routes/` : Toutes les routes de l'application
        -   `admin/` : pages d'administration
-   `public/` : fichiers statiques
-   `build/` : fichiers générés
-   `node_modules/` : dépendances

## Technologies utilisées

### Frontend

-   [Svelte](https://svelte.dev/) : Framework JavaScript
-   [Tailwind CSS](https://tailwindcss.com/) : Framework CSS
    -   [DaisyUI](https://daisyui.com/) : Composants Tailwind CSS

### Backend

-   [Vite](https://vitejs.dev/) : Bundler et Runner pour le développement
-   [SvelteKit](https://kit.svelte.dev/) : Meta-Framework pour Svelte
-   [Docker](https://www.docker.com/) : Conteneurisation & Déploiement
-   [PocketBase](https://pocketbase.io/) : Base de données et API auto-hébergée

### Outils

-   [TypeScript](https://www.typescriptlang.org/) : Langage de programmation apportant des types à JavaScript
-   [Prettier](https://prettier.io/) : Formateur de code
-   [ESLint](https://eslint.org/) : Linter de code

## Styler avec Tailwind CSS

Tailwind CSS est un framework CSS qui permet de créer des interfaces rapidement en utilisant des classes utilitaires.
Similaire à Bootstrap, mais plus minimaliste. Simplemement ajouter des classes aux éléments HTML pour styliser.

### Exemple

La manière la plus simple est d'ajouter les classes directement dans le code HTML. C'est aussi la méthode recommandée.

```html
<button
	class="px-4 py-2 font-bold text-white bg-blue-500
 rounded hover:bg-blue-700"
>
	Button
</button>
```

## Déploiement

#### Environnement

##### Adapter

Voir cette ligne dans ce fichier : [svelte.config.js:1](svelte.config.js:1)

##### Variables d'environnement

Variable d'envrionnement dans le fichier [.env.production](.env.production)

### Vercel

Utiliser l'adapter auto (ou vercel).

**Auto déploiement sur Vercel à chaque push.**

La branche de déploiement est `main`.\
La branche de test est `staging`.

### Docker

Utiliser l'adapter Bun.

```bash
docker-compose up --build
```

### Documentation

-   [Tailwind CSS](https://tailwindcss.com/docs)
-   [DaisyUI](https://daisyui.com/docs)
-   [Svelte](https://svelte.dev/docs)
-   [SvelteKit](https://kit.svelte.dev/docs)
-   [PocketBase](https://pocketbase.io/docs)
