<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import { userStore } from "$lib/stores/userStore";
  import { goto } from "$app/navigation";

  const { chats, content, loadChats, createChat, deleteChat } =
    sideBarChatsStore;
  const userId = $userStore?.id;

  $effect(() => {
    if (userId) {
      loadChats(userId);
    }
  });

  let newChatModalOpen: boolean = $state(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const value = $content.trim();
    if (!value || typeof userId !== "string") return;

    const chat = await createChat(userId, value);
    if (!chat) return;

    $content = "";
    newChatModalOpen = false;

    goto(`/chat/${chat.id}`);
  }

  async function handleDelete(chatId: string) {
    const confirmed = confirm("Delete this chat and its messages?");
    if (!confirmed) return;

    await deleteChat(chatId);
    chatWindowStore.clear();

    // Optional: if current chat was deleted, redirect to safe route
    if (window.location.pathname === `/chat/${chatId}`) {
      goto("/chat");
    }
  }
</script>

<main class="w-1/5 min-h-screen bg-gray-900 text-white flex flex-col">
  <!-- Header Section -->
  <section
    class="flex items-center justify-between px-4 py-3 border-b border-gray-700"
  >
    <button onclick={() => (newChatModalOpen = true)} aria-label="New Chat"
      >New Chat</button
    >
    <button aria-label="Close Sidebar">X</button>
  </section>

  <!-- Chats List -->
  {#each $chats as chat}
    <div
      class="flex items-center justify-between px-4 py-2 hover:bg-gray-800 border-b border-gray-800"
    >
      <a href={"/chat/" + chat.id} class="truncate flex-1">{chat.title}</a>
      <button
        onclick={() => handleDelete(chat.id)}
        class="ml-2 text-red-400 hover:text-red-600 text-xs"
        aria-label="Delete chat"
        title="Delete chat"
      >
        ✕
      </button>
    </div>
  {/each}
</main>

{#if newChatModalOpen}
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="bg-white text-black rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">New Chat</h2>
        <button
          onclick={() => (newChatModalOpen = false)}
          class="text-gray-600 hover:text-black">✕</button
        >
      </div>

      <form onsubmit={handleSubmit} class="space-y-4">
        <input
          type="text"
          bind:value={$content}
          placeholder="Enter chat title..."
          class="w-full border border-gray-300 rounded px-3 py-2"
        />
        <div class="flex justify-end gap-2">
          <button
            type="button"
            onclick={() => (newChatModalOpen = false)}
            class="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-black text-white rounded text-sm">Create</button
          >
        </div>
      </form>
    </div>
  </div>
{/if}
