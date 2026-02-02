# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Backoffice

Un backoffice est disponible à l'adresse `/admin`.
Il utilise un système d'authentification à deux facteurs (2FA) par email et des tokens JWT.

### Configuration requise

Les variables d'environnement suivantes doivent être configurées dans votre fichier `.env` :

```env
DATABASE_URL=mysql://user:pass@host:port/db
JWT_SECRET=votre_secret_jwt
SMTP_HOST=smtp.exemple.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=votre_utilisateur_smtp
SMTP_PASS=votre_mot_de_passe_smtp
SMTP_FROM="votre_email@exemple.com"
APP_NAME=Nom

VITE_SUPPORT_EMAIL=email dev
```

### Initialisation

Pour créer le premier utilisateur administrateur :

1. Assurez-vous que les variables d'environnement sont bien configurées.
2. Lancez les migrations de la base de données : `npm run db:push`
3. Rentrer manuellement en base de données le premier admin
   1. Pour le mot de passe, utilisez : https://bcrypt-generator.com/
