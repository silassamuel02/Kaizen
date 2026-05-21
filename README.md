# KAIZEN

Minimal KAIZEN application skeleton with React, Vite, TailwindCSS, React Router, Supabase, and placeholder AI systems.

## Setup

1. Copy `.env.example` to `.env`
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Run:
   ```bash
   npm install
   npm run dev
   ```

## Project structure

- `src/contexts` - authentication context and providers
- `src/pages` - page routes for auth, dashboard, workspace, notes, AI, settings, and profile
- `src/components` - reusable UI and layout components
- `src/services` - backend service wrappers
- `src/supabase` - Supabase client configuration
- `supabase/schema.sql` - database schema planning for profiles, workspaces, notes, activities, memberships, and AI logs

## Core systems

- Authentication with Supabase
- Protected routes using React Router
- Notes CRUD
- Workspace creation/join flow
- AI placeholder insights
- Realtime subscription scaffold

## Notes

This phase is intentionally minimal and functional. Visual polish is kept low for stability and architectural clarity.
