# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run web version
```

No lint or test scripts are configured yet.

## Architecture

**Stack:** React Native + Expo SDK 54, TypeScript (strict), Expo Router, Supabase, Zustand, TanStack Query v5, NativeWind (Tailwind).

**Routing:** File-based via Expo Router.
- `app/(auth)/` — Unauthenticated screens (login, cadastro)
- `app/(tabs)/` — Authenticated main app with bottom tab nav; layout redirects to login if no session
- `app/index.tsx` — Root redirect based on auth state

**Feature structure (`src/features/<feature>/`):** Each feature has:
1. `*Service.ts` — Direct Supabase calls, returns typed data or throws
2. `use*.ts` — React Query hooks (`useQuery`/`useMutation`) wrapping the service
3. Components consume hooks only, never call services directly

**State:** Auth session and loading state live in a Zustand store (`src/features/auth/`). Server data is cached via React Query (5min staleTime, configured in `src/lib/queryClient.ts`).

**Supabase client:** `src/lib/supabase.ts` — initialized with AsyncStorage for session persistence. Env vars: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

**Database types:** `src/types/database.types.ts` — auto-generated from Supabase. Regenerate with:
```bash
npx supabase gen types typescript --project-id <id> > src/types/database.types.ts
```

**Path aliases** (from `tsconfig.json`): `@/*`, `@features/*`, `@lib/*`, `@store/*`, `@types/*`.

## Database Schema

- `profiles` — User profiles (cpf, nome, data_nascimento, tipo: `"atleta" | "personal"`)
- `exercicios` — Exercise library (nome, grupo_muscular, equipamento, instrucoes, publico, criado_por)
- `rotinas` — Workout routines (nome, objetivo, ativa, usuario_id)
- `rotina_dias` — Days within a routine (ordem, rotina_id)
- `rotina_exercicios` — Exercises in a day (series, repeticoes, carga_sugerida, descanso_segundos)
