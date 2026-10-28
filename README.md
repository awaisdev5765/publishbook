# SmartBook Publishing

SmartBook Publishing is a full-stack book publishing platform with a public marketing site, author/user accounts, book catalog management, order handling, blog/content management, and an admin dashboard. It is organized as a Node.js monorepo so the web app, API, and shared types can evolve together.

## Live deployment

- Existing API deployment: [publishbook-api.vercel.app](https://publishbook-api.vercel.app)
- The repository’s Render/Vercel configuration is included for deploying the web frontend and NestJS API separately.

If the deployment is unavailable, run the services locally using the setup below.

## Features

- Next.js marketing site with landing, about, blog, contact, and book pages
- User registration, login, JWT authentication, refresh tokens, and profile management
- Book catalog with status, metadata, and admin management screens
- Order creation and order status workflows
- Admin dashboard for users, books, orders, blog posts, site content, and contacts
- Blog publishing and public post pages
- Contact form with API-backed persistence
- Prisma ORM with PostgreSQL migrations and seed support
- NestJS REST API with modular auth, users, books, orders, blog, about, and contact modules
- Shared TypeScript package for reusable cross-application types
- Render blueprint and Vercel adapter configuration for deployment

## Architecture

```text
apps/web        Next.js frontend and admin dashboard
      │
      └── REST API calls
              │
apps/api        NestJS API, auth, business modules, Prisma
              │
packages/shared Shared TypeScript types and utilities
              │
          PostgreSQL
```

## Technology

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, JWT, class-validator
- **Database:** PostgreSQL with Prisma ORM and migrations
- **Deployment:** Render blueprint and Vercel-compatible API adapter
- **Tooling:** npm workspaces, ESLint, TypeScript

## Repository layout

```text
apps/web/              Next.js website and dashboard
apps/api/              NestJS API and Prisma schema/migrations
packages/shared/       Shared types and package exports
apps/api/prisma/       Database schema, migrations, and seed
render.yaml            Render API, web, and PostgreSQL blueprint
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- PostgreSQL 14 or newer (local or hosted)

## Local setup

```bash
git clone https://github.com/awaisdev5765/publishbook.git
cd publishbook
npm ci
```

Create environment files from the examples used by each service. Never commit `.env`, `.env.local`, database URLs, JWT secrets, or production credentials.

### Database and API

```bash
cd apps/api
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

The API uses `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, and the normal NestJS `PORT` setting. For local schema development, use `npx prisma migrate dev` instead of `migrate deploy`.

### Web frontend

In a second terminal:

```bash
npm run dev --workspace=apps/web
```

Set `NEXT_PUBLIC_API_URL` to the API base URL. The web app will normally be available at `http://localhost:3000`.

### Run from the workspace root

```bash
npm run dev       # Starts web and API through concurrently
npm run build     # Builds shared package, web, and API
npm run lint      # Lints web and API workspaces
npm run db:migrate
npm run db:studio
```

## API areas

The API is grouped into NestJS modules:

- `/api/auth` — registration, login, refresh, and authentication
- `/api/users` — profiles, roles, and user administration
- `/api/books` — book catalog and publishing status
- `/api/orders` — order creation and status updates
- `/api/blog` — blog post management and public queries
- `/api/about` — editable about/site content
- `/api/contact` — contact submissions

Swagger/OpenAPI is available from the API when enabled by the current environment configuration.

## Deployment

### Render

`render.yaml` defines the web service, NestJS API, and PostgreSQL database. Connect the repository to Render and set the `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` values after the first services are created.

### Vercel

The API includes a Vercel adapter under `apps/api/api/index.ts` and `apps/api/vercel.json`. Configure the API project’s build/output settings and all production environment variables in Vercel’s secret manager.

## Security notes

- Use strong, unique JWT and refresh-token secrets in production.
- Restrict CORS with an explicit `FRONTEND_URL`.
- Never commit `.env` files, database dumps, or generated credentials.
- Run Prisma migrations deliberately and back up production data before schema changes.
- Keep admin routes protected by authentication and role guards.

## License

No open-source license has been published yet. All rights are reserved unless a license file is added to this repository.
