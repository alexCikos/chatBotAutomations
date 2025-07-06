import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { Message } from "$lib/types";

/**
 * Store for managing the state of the chat window, including messages and input content.
 */
function createChatWindowStore() {
  // Reactive store for chat messages
  const messages = writable<Message[]>([]);

  // Reactive store for the message input content
  const content = writable("");

  /**
   * Loads messages from the backend for the given chat ID.
   * Skips execution during SSR (server-side rendering).
   */
  async function loadMessages(chatId: string) {
    if (!browser) return;

    const res = await fetch(`/api/messages/${chatId}`);
    const data = await res.json();
    messages.set(data.messages);
  }

  /**
   * Sends a new message to the backend and updates the store.
   * Optimistically updates local state before confirmation.
   */
  async function sendMessage(
    chatId: string,
    contentValue: string,
    userID: string
  ) {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      chatId,
      userId: userID,
      role: "user",
      content: contentValue.trim(),
      createdAt: new Date().toISOString(),
    };

    messages.update((msgs) => [...msgs, newMessage]);

    const res = await fetch(`/api/messages/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });

    if (!res.ok) {
      console.error("Failed to send message");
      await loadMessages(chatId);
    }

    content.set("");
  }

  function clear() {
    messages.set([]);
    content.set("");
  }

  return {
    messages,
    content,
    loadMessages,
    sendMessage,
    clear,
  };
}

// Export the singleton store instance
export const chatWindowStore = createChatWindowStore();
