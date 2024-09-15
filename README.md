# Mise en place du projet

## Installation

### Prérequis

-   [Node.js](https://nodejs.org/en/)

### Installation des dépendances

```bash
npm install
```

### Lancer le projet en mode développement

```bash
npm run dev
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

-   [Svelte](https://svelte.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)

Svelte est un framework JavaScript qui permet de créer des applications web en générant du code optimisé.

Tailwind CSS est un framework CSS qui permet de créer des interfaces rapidement en utilisant des classes utilitaires.

### Backend

-   [SvelteKit](https://kit.svelte.dev/)

SvelteKit est un framework basé sur Svelte qui permet de créer des applications web avec un backend intégré.

Sert pour le rendu côté serveur, la gestion des routes, etc.

### Outils

-   [TypeScript](https://www.typescriptlang.org/)
-   [Vite](https://vitejs.dev/)
-   [ESLint](https://eslint.org/)
-   [Prettier](https://prettier.io/)

## Styler avec Tailwind CSS

Tailwind CSS est un framework CSS qui permet de créer des interfaces rapidement en utilisant des classes utilitaires.
Similaire à Bootstrap, mais plus minimaliste. Simplemement ajouter des classes aux éléments HTML pour styliser.

### Exemple

La manière la plus simple est d'ajouter les classes directement dans le code HTML. C'est aussi la méthode recommandée.

```svelte
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Button </button>
```

### Exemple avec postcss

Il est aussi possible d'utiliser les classes Tailwind CSS dans un fichier `.svelte` en utilisant le langage `postcss`.

```svelte
<button> Button </button>

<style class="postcss">
	button {
		@apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
	}
</style>
```

### Documentation

-   [Tailwind CSS](https://tailwindcss.com/docs)
