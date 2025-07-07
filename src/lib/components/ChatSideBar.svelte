<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import NewChatModule from "$lib/components/NewChatModule.svelte";
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
      goto("/history");
    }
  }
</script>

<main class="w-1/5 min-h-screen bg-gray-900 text-white flex flex-col">
  <!-- Header Section -->
  <section
    class="flex items-center justify-between px-4 py-3 border-b border-gray-700"
  >
    <button
      class="hover:text-gray-400"
      onclick={() => (newChatModalOpen = true)}
      aria-label="New Chat"
    >
      New Chat
    </button>
    <button aria-label="Close Sidebar">X</button>
  </section>

  <!-- Main content area with chat list -->
  <div class="flex-1 overflow-y-auto">
    {#each $chats as chat}
      <div
        class="flex items-center justify-between px-4 py-2 hover:bg-gray-800 border-b border-gray-800"
      >
        <a href={"/chat/" + chat.id} class="truncate flex-1 hover:text-gray-400"
          >{chat.title}</a
        >
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
  </div>

  <!-- Footer pinned to bottom -->
  <section class="px-4 py-3 border-t border-gray-700 hover:bg-gray-800">
    <a
      href="/history"
      class="block text-sm text-gray-300 hover:text-gray-400 cursor-pointer"
    >
      Search Chats
    </a>
  </section>
</main>

{#if newChatModalOpen}
  <NewChatModule onClose={() => (newChatModalOpen = false)} />
{/if}
