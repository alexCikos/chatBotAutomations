import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { Message } from "$lib/types";

function createChatWindowStore() {
  const messages = writable<Message[]>([]);
  const content = writable("");

  async function loadMessages(chatId: string) {
    if (!browser) return;

    const res = await fetch(`/api/chat/${chatId}`);
    const data = await res.json();
    messages.set(data.messages);
  }

  async function sendMessage(chatId: string, contentValue: string) {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      chatId,
      userId: "user-abc",
      role: "user",
      content: contentValue.trim(),
      createdAt: new Date().toISOString(),
    };

    // Optimistically add to local messages
    messages.update((msgs) => [...msgs, newMessage]);

    const res = await fetch(`/api/chat/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });

    if (!res.ok) {
      // Rollback if failed
      console.error("Failed to send message");
      await loadMessages(chatId); // Fallback to reload if needed
    }

    content.set("");
  }

  return {
    messages,
    content,
    loadMessages,
    sendMessage,
  };
}

export const chatWindowStore = createChatWindowStore();
