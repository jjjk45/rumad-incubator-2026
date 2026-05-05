# Rumad Incubator 2026

Monorepo for a Rutgers-focused marketplace/chat app with an Expo frontend and an Express/Supabase backend.

## Project Structure

- `frontend/`: Expo React Native app (iOS, Android, web)
- `backend/`: Express TypeScript API for user/profile + email hook flows
- `mock backend/`: local mock services/hooks/data used for prototyping
- `my-app/`: separate experimental app scaffold

## Tech Stack

- Frontend: Expo, React Native, TypeScript
- Backend: Express, TypeScript, Supabase
- Tooling: npm workspaces, concurrently

## Prerequisites

- Node.js 18+
- npm 9+

## Install Dependencies

From repo root:

```bash
npm install
```

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SEND_EMAIL_HOOK_SECRET=...
```

### Frontend (Expo)

Set these when running Expo (or via an env file strategy you use locally):

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Notes:
- If `EXPO_PUBLIC_API_URL` is not set, frontend auto-detects host and falls back to `http://localhost:3000`.
- Backend expects Supabase send-email webhook calls at `/auth/send-email`.

## Run the App

### Start frontend + backend together

```bash
npm run dev
```

This runs:
- backend on `http://localhost:3000`
- frontend via `expo start`

### Local web flow

```bash
npm run dev:web:local
```

This runs:
- backend on `http://localhost:3000`
- frontend web on `http://localhost:3001`

### Run services individually

Backend:

```bash
npm run dev --workspace=backend
```

Frontend:

```bash
npm run start --workspace=frontend
```

## API Overview

- `GET /users`: list profiles
- `POST /users`: upsert profile and send OTP (Rutgers email restricted)
- `POST /users/verify-email`: verify authenticated user email state
- `POST /auth/send-email`: Supabase send-email hook endpoint

## Current Notes

- Root `workspaces` includes `shared`, but no `shared/` directory is currently present.
- `mock backend/` directory includes a space in its name; use quotes when scripting shell commands against it.
