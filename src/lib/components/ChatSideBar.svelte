<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import NewChatModule from "$lib/components/NewChatModule.svelte";
  import { userStore } from "$lib/stores/userStore";
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";

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

<main class="w-1/5 h-full bg-[#161616] text-white flex flex-col">
  <!-- Header Section -->
  <section
    class="flex items-center justify-between px-4 py-3 border-b border-gray-700"
  >
    <button
      class="hover:text-gray-400 flex items-center gap-2"
      onclick={() => (newChatModalOpen = true)}
      aria-label="New Chat"
    >
      <Icon icon="lucide:plus" class="w-4 h-4" />
      New Chat
    </button>

    <button aria-label="Close Sidebar" class="hover:text-gray-400">
      <Icon icon="lucide:chevron-left" class="w-5 h-5" />
    </button>
  </section>

  <!-- Main content area with chat list -->
  <div class="flex-1 overflow-y-auto">
    {#each $chats as chat}
      <div
        class="flex items-center justify-between px-4 py-2 hover:bg-gray-800 border-b border-gray-800"
      >
        <a
          href={"/chat/" + chat.id}
          class="truncate flex-1 hover:text-gray-400"
        >
          {chat.title}
        </a>
        <button
          onclick={() => handleDelete(chat.id)}
          class="ml-2 text-red-400 hover:text-red-600 text-xs"
          aria-label="Delete chat"
          title="Delete chat"
        >
          <Icon icon="lucide:trash-2" class="w-4 h-4" />
        </button>
      </div>
    {/each}
  </div>

  <!-- Footer pinned to bottom -->
  <section class="px-4 py-3 border-t border-gray-700 hover:bg-gray-800">
    <a
      href="/history"
      class="flex items-center gap-2 text-sm text-gray-300 hover:text-gray-400 cursor-pointer"
    >
      <Icon icon="lucide:search" class="w-4 h-4 text-gray-400" />
      Search Chats
    </a>
  </section>
</main>

{#if newChatModalOpen}
  <NewChatModule onClose={() => (newChatModalOpen = false)} />
{/if}
