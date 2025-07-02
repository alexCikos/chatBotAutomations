# agents.md

## Project Overview

This is a **AI business chatbot** app built with **SvelteKit 5 (2025)**.

It is designed for **small business users** (like tradies or personal assistants) to **automate tasks** such as generating quotes, checking schedules, or answering common questions.

## Technologies Used

- **Frontend:** SvelteKit 5
- **Backend:** SvelteKit API routes (`+server.ts` files)
- **Deployment:** Azure Static Web Apps
- **Database:** Cosmos DB
- **API Calls:** Fetch from frontend stores to `/api/*` backend endpoints
- **Component Structure:** Modular Svelte components in `lib/components/`
- **State Management:** Svelte stores in `lib/stores/`
- **Types:** Shared TypeScript types in `lib/types/`
- **Utilities:** Helper functions in `lib/utils/`
- **Libraries:** Skeleton UI, Tailwind, Zod, OpenAI API

## How It Works

- Users chat through a skeleton ui based interface
- The assistant receives input and responds using tool APIs
- Conversations and tool results are processed via SvelteKit backend routes
- The system is designed to be easily extended with new automation tools
