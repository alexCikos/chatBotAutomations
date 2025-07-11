# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development server:**

```bash
npm run dev
```

**Build:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

**Type checking:**

```bash
npm run check
```

**Type checking with watch mode:**

```bash
npm run check:watch
```

## Architecture Overview

This is a SvelteKit chatbot application with the following key architectural components:

### Data Layer

- **LowDB** for local JSON file storage (`chats.json`, `messages.json`)
- **Zod schemas** for runtime validation and TypeScript types in `src/lib/types/index.ts`
- Core entities: `User`, `Chat`, `Message` with proper relationships

### Store Management

- **Svelte stores** for state management:
  - `chatWindowStore`: Manages chat messages and input content
  - `sideBarChatsStore`: Manages sidebar chat list
  - `userStore`: Manages user session data
- Stores handle API communication and optimistic updates

### API Routes

- RESTful API endpoints under `src/routes/api/`:
  - `/api/chats/users/[userID]` - Chat CRUD operations
  - `/api/messages/[chatID]` - Message CRUD operations
  - `/api/chats/[chatID]` - Individual chat operations

### UI Components

- **Svelte 5** with runes enabled (`compilerOptions.runes: true`)
- **TailwindCSS** for styling with custom dark theme
- **Component structure:**
  - `ChatInterface.svelte`: Main chat UI with message display and input
  - `ChatSideBar.svelte`: Chat history and navigation
  - `NavBar.svelte`: Top navigation
  - `SearchChats.svelte`: Chat search functionality using Fuse.js

### Key Features

- Real-time chat interface with optimistic updates
- Chat history with search functionality
- Responsive design with mobile-first approach
- JSON-based persistence without external database requirements

### Development Notes

- Uses Svelte 5 runes for reactive state management
- Vite ignores `messages.json` and `chats.json` for hot reload performance
- User is hardcoded as "alex-123" in the layout for demo purposes
- TypeScript throughout with strict validation via Zod schemas

### USE TAILWIND FOR STYLING
