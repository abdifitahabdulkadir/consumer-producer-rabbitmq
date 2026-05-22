# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Start Postgres (required before running the app)
docker compose up -d

# Development (builds first, then watches)
pnpm run start:dev

# Build
pnpm build

# Push schema changes to DB (no migration files)
pnpm run db:push

# Regenerate Prisma client after schema changes
pnpm run db:generate

# Lint (auto-fixes)
pnpm run lint

# Tests
pnpm test                # unit tests
pnpm run test:watch      # watch mode
pnpm run test:cov        # coverage
pnpm run test:e2e        # e2e tests
```

## Environment

Two required env vars (validated on startup via Zod in `AppModule`):
- `JWT_SERCRET_KEY` — JWT signing secret (note: intentional typo in the codebase)
- `DATABASE_URL` — PostgreSQL connection string, e.g. `postgresql://root:admin@localhost:5432/auth-db`

## Architecture

This is a **NestJS ESM project** (`"type": "module"` in package.json). All imports must use `.js` extensions even for `.ts` source files — this is a TypeScript/ESM interop requirement already followed throughout the codebase.

### Module structure

- **AppModule** (`src/app.module.ts`) — root module; registers `JwtModule` as global and `ConfigModule` with Zod env validation
- **AuthModule** (`src/auth/`) — all authentication logic; depends on `DatabaseModule` and `EmailModule`
- **DatabaseModule** (`src/database/`) — provides `DatabseService` (note typo), which extends `PrismaClient` using `@prisma/adapter-pg` (the Prisma driver adapter for raw `pg` connections, not the default ORM adapter)
- **EmailModule** (`src/email/`) — Nodemailer service using Ethereal (dev-only SMTP sandbox)

### Prisma setup

The Prisma client is **generated into `prisma/generated/`**, not the default `node_modules/.prisma`. Import it as `@prisma/generated/client.js` (mapped in `jest` config and available via the generated output path). After any schema change, run `db:generate` then `db:push`.

The `tsc-alias` tool runs after `nest build` to rewrite path aliases in the compiled output — this is why `build` and `start:dev` run `tsc-alias` in parallel/sequence.

### Request validation pattern

All request bodies are validated inline at the controller using `ZodValidationPipe` — instantiated per-route with a specific Zod schema:

```ts
@Post('signup')
async signUp(@Body(new ZodValidationPipe(SignUpSchema)) user: SignUpDto) { ... }
```

Schemas live in `auth.dto.ts` alongside their inferred TypeScript types. There are no NestJS class-validator DTOs.

### Auth guard

`AuthGuard` (`src/guards/guards.guard.ts`) reads `Authorization: Bearer <token>`, verifies the JWT, and injects `userId` into `request.body` for use by the handler. It is applied per-route with `@UseGuards(AuthGuard)`.

### Password reset flow

1. `POST /api/auth/reset` — creates a `ResetToken` (UUID v6, 1h expiry) and emails a link to the user
2. `PUT /api/auth/reset-password?token=<token>` — validates the token against `expirationDate > now`, then updates the password

The refresh token model and `generateRefereshToken()` method exist but no route exposes them yet.
