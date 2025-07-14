import { writable, derived, get } from "svelte/store";
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
        keys: ["title", "description"],
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

  async function createChat(userID: string, titleValue: string, description?: string) {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      userId: userID,
      title: titleValue.trim(),
      description: description?.trim() || undefined,
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
    // Get the current chat list to find the userId
    const currentChatList = get(chats);
    const chatToDelete = currentChatList.find((chat) => chat.id === chatId);
    
    if (!chatToDelete) {
      console.error("Chat not found in store");
      return;
    }

    const res = await fetch(`/api/chats/${chatId}?userId=${chatToDelete.userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Failed to delete chat");
      return;
    }

    chats.update((chatList) => chatList.filter((chat) => chat.id !== chatId));
  }

  async function editChat(chatId: string, newTitle: string, newDescription?: string) {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return null;

    const trimmedDescription = newDescription?.trim();

    // Get current chat list to find the userId if needed
    const currentChatList = get(chats);

    // Optimistically update the UI
    chats.update((chatList) =>
      chatList.map((chat) =>
        chat.id === chatId 
          ? { 
              ...chat, 
              title: trimmedTitle,
              description: trimmedDescription || undefined
            } 
          : chat
      )
    );

    const updateData: { title: string; description?: string } = { 
      title: trimmedTitle 
    };
    
    if (trimmedDescription !== undefined) {
      updateData.description = trimmedDescription || undefined;
    }

    const res = await fetch(`/api/chats/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      console.error("Failed to edit chat");
      // Revert the optimistic update by reloading chats
      const currentChat = currentChatList.find((chat) => chat.id === chatId);
      if (currentChat) {
        loadChats(currentChat.userId);
      }
      return null;
    }

    const data = await res.json();
    return data.chat as Chat;
  }

  return {
    chats,
    content,
    searchTerm,
    filteredChats,
    loadChats,
    createChat,
    deleteChat,
    editChat,
  };
}

export const sideBarChatsStore = createSideBarStore();
