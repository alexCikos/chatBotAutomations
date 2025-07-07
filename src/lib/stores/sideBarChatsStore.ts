import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import type { Chat } from "$lib/types";

function createSideBarStore() {
  const chats = writable<Chat[]>([]);
  const content = writable("");
  const searchTerm = writable("");

  const filteredChats = derived(
    [chats, searchTerm],
    ([$chats, $searchTerm]) => {
      const term = $searchTerm.trim().toLowerCase();
      if (!term) return [];

      return $chats.filter((chat) => chat.title.toLowerCase().startsWith(term));
    }
  );

  async function loadChats(userID: string) {
    if (!browser) return;
    const res = await fetch(`/api/chats/users/${userID}`);
    const data = await res.json();
    chats.set(data.chats);
  }

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
      await loadChats(userID);
    }

    const data = await res.json();
    const createdChat = data.chat as Chat;
    return createdChat;
  }

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
    searchTerm, // ✅ exposed
    filteredChats, // ✅ exposed
    loadChats,
    createChat,
    deleteChat,
  };
}

export const sideBarChatsStore = createSideBarStore();
