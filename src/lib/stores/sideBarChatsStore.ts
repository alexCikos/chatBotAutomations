import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import type { Chat } from "$lib/types";
import Fuse from "fuse.js";

function createSideBarStore() {
  const chats = writable<Chat[]>([]);
  const content = writable("");
  const searchTerm = writable("");

  // Fuse setup will be regenerated when chats change
  const fuse = writable<Fuse<Chat> | null>(null);

  chats.subscribe(($chats) => {
    fuse.set(
      new Fuse($chats, {
        keys: ["title"],
        threshold: 0.3,
      })
    );
  });

  const filteredChats = derived([fuse, searchTerm], ([$fuse, $searchTerm]) => {
    const term = $searchTerm.trim();
    if (!$fuse || !term) return [];

    return $fuse.search(term).map((result) => result.item);
  });

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
    searchTerm,
    filteredChats,
    loadChats,
    createChat,
    deleteChat,
  };
}

export const sideBarChatsStore = createSideBarStore();
