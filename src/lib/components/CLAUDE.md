# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev` (runs on http://localhost:5176)
- **Build for production**: `pnpm build`
- **Run tests**: `pnpm test` (Playwright e2e tests)
- **Run unit tests**: `pnpm test:unit` (Vitest)
- **Lint and format**: `pnpm lint` (runs prettier + eslint)
- **Format code**: `pnpm format`
- **Type checking**: `pnpm check`

## Architecture Overview

This is a personal website built with **SvelteKit + TypeScript + PocketBase** that serves as both a blog and portfolio.

### Key Technologies
- **Framework**: SvelteKit with Svelte 5 Runes
- **Backend**: PocketBase (headless CMS/database)
- **Authentication**: PocketBase auth with Security class wrapper
- **Styling**: CSS with Open Props
- **Testing**: Playwright (e2e) + Vitest (unit)
- **Deployment**: CapRover via Docker

### Core Architecture

**Authentication & Security**:
- PocketBase handles all auth (sign in/up, verification, password reset)
- `Security` class in `src/lib/pocketbase.svelte.ts` provides `isAuthenticated()` and `isAdmin()` guards
- Auth state managed via `hooks.server.ts` and shared through `locals.user`
- Typed PocketBase client with collection-specific interfaces

**Data Layer**:
- PocketBase collections: `adam` (posts), `adam_comments`, `quotes_public`, `users`, `image_sets`
- Custom types in `src/lib/types.ts` define all PocketBase record structures
- `PostType` is the main content entity with support for different formats (note, article, photo, etc.)

**Route Structure**:
- `/` - Homepage with recent posts
- `/[...post]` - Dynamic post pages (handles all post slugs)
- `/admin/*` - Admin interface (requires admin role)
- `/auth/*` - Authentication pages (sign in/up, verify, reset)
- Specialized routes: `/calendar/*`, `/emojivore/*`, `/quotes/*`

**Component Architecture**:
- Reusable components in `src/lib/components/`
- `Post.svelte` handles rendering different post types
- `PostsIndex.svelte` for listing/filtering posts
- `SEO.svelte` for meta tags and social sharing

**Realtime Features**:
- PocketBase realtime subscriptions for live comments
- CSR-only PocketBase client (`pb` state) for realtime functionality

### Development Notes

- Uses `pnpm` as package manager
- Svelte 5 with runes enabled
- TypeScript strict mode
- All PocketBase interactions are typed via `TypedPocketBase` interface
- Error handling via custom `pbError()` function
- Security guards should be called in server load functions for protected routes