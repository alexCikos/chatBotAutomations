// src/routes/chat/[chatID]/+page.ts
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  return {
    chatId: params.chatID,
  };
};
