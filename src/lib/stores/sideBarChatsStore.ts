import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { Chat } from "$lib/types";

/**
 * Store for managing the state of the chat window, including messages and input content.
 */
function createSideBarStore() {
  const chats = writable<Chat[]>([]);
  const content = writable("");

  /**
   * Loads all chats for the given user ID.
   */
  async function loadChats(userID: string) {
    if (!browser) return;

    const res = await fetch(`/api/chats/users/${userID}`);
    const data = await res.json();
    chats.set(data.chats);
  }

  /**
   * Creates a new chat for a user.
   */
  async function createChat(userID: string, titleValue: string) {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      userId: userID,
      title: titleValue.trim(),
      createdAt: new Date().toISOString(),
    };

    chats.update((chatList) => [...chatList, newChat]);

    const res = await fetch(`/api/chats/users/${userID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChat),
    });

    if (!res.ok) {
      console.error("Failed to create chat");
      await loadChats(userID); // fallback reload
    }

    const data = await res.json();
    const createdChat = data.chat as Chat;
    return createdChat;
  }

  /**
   * Deletes a chat by ID from the backend and updates the local store.
   */
  async function deleteChat(chatId: string) {
    const res = await fetch(`/api/chats/${chatId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Failed to delete chat");
      return;
    }

    chats.update((chatList) => chatList.filter((chat) => chat.id !== chatId));
  }

  return {
    chats,
    content,
    loadChats,
    createChat,
    deleteChat, // ✅ added
  };
}

export const sideBarChatsStore = createSideBarStore();
