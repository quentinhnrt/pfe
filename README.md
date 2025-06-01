This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Architecture

```bash
src
├── app                 # Définit la structure de routage et l'organisation des pages de l'application.
├── core                # Contient les éléments fondamentaux et réutilisables de l'application qui définissent son "cœur métier".
│   ├── components      # Contient des composants UI spécifiques au domaine métier.
│   ├── entities        # Définit les modèles de données fondamentaux et leurs comportements.
│   ├── services        # Gère les communications avec les sources externes (API, bases de données, etc.).
│   └── stores          # Gère l'état global et la logique métier de l'application.
├── features            # Organise le code par fonctionnalités distinctes ou domaines métier.
│   └── [feature-name]
│       ├── components
│       ├── entities
│       ├── services
│       └── stores
├── middleware.ts
├── shared              # Contient les utilitaires, composants et logiques partagés qui ne sont pas spécifiques au domaine métier.
│   ├── assets
│   ├── components
│   ├── emails
│   ├── hooks
│   └── lib
└── tests
    ├── components
    ├── pages
    └── units
```

## 🧹 Ajouter une nouvelle template

Pour qu'une nouvelle template soit reconnue dans l'application et stockée en base de données, il faut effectuer deux étapes : la déclaration dans le fichier `templates.json`, puis l'import dans le code.

### 1. Déclaration dans `/prisma/seedData/templates.json`

Ajoutez une entrée dans le fichier JSON pour définir les métadonnées de votre template. Exemple :

```json
{
  "id": 1,
  "name": "Test Template",
  "description": "This is a test template",
  "slug": "test-template"
}
```

- `id` : identifiant unique de la template (doit correspondre à celui utilisé dans le code).
- `name` : nom affiché.
- `description` : description courte.
- `slug` : identifiant utilisé dans le code et les URLs.

### 2. Déclaration dans `src/lib/template.ts`

Ensuite, importez dynamiquement les composants nécessaires :

```ts
export const templates = {
  "test-template": {
    render: await import("@/components/templates/test-template/render"),
    settings: await import("@/components/templates/test-template/settings"),
  },
};
```

- `render` : composant qui affiche la template en fonction des données du formulaire.
- `settings` : composant qui contient le formulaire de configuration de la template.

### 3. Structure du composant `settings`

Le composant `settings` doit impérativement être entouré du composant `TemplateContainer`, qui gère le schéma de validation et les requêtes associées :

```tsx
<TemplateContainer schema={templateSchema} onRequest={onRequest} templateId={1}>
  {/* Vos champs ici */}
</TemplateContainer>
```

#### Exemple de schéma à utiliser avec `zod`

```ts
const templateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  artworkSections: z
    .object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      artworks: z.number().array(),
    })
    .array(),
});
```

Tous les champs du formulaire doivent être compatibles avec les composants de formulaire de [`shadcn/ui`](https://ui.shadcn.com/docs/components/form) (par exemple : `<Input>`, `<Textarea>`, `<Select>`, etc.).

Ajouter les images manquantes dans /public/ : - og-image.jpg (1200x630px) - twitter-image.jpg (1200x600px) - icon-192.png et icon-512.png pour le PWA - apple-touch-icon.png
