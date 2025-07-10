<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import { sidebarStore } from "$lib/stores/sidebarStore";
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

  function handleNewChatClick() {
    if ($sidebarStore) {
      // If collapsed, expand sidebar and then open modal
      sidebarStore.expand();
      setTimeout(() => {
        newChatModalOpen = true;
      }, 150); // Wait for transition
    } else {
      newChatModalOpen = true;
    }
  }

  function handleSearchClick() {
    if ($sidebarStore) {
      // If collapsed, expand sidebar and navigate to search
      sidebarStore.expand();
      setTimeout(() => {
        goto("/history");
      }, 150); // Wait for transition
    } else {
      goto("/history");
    }
  }

  function toggleSidebar() {
    sidebarStore.toggle();
  }
</script>

<!-- Mobile Backdrop (only show on mobile when expanded) -->
{#if !$sidebarStore}
  <button
    class="md:hidden fixed inset-0 bg-black/50 z-30 border-none cursor-default"
    onclick={toggleSidebar}
    onkeydown={(e) => e.key === 'Enter' && toggleSidebar()}
    aria-label="Close sidebar"
    type="button"
  ></button>
{/if}

<!-- Main Sidebar Container -->
<main 
  class="{$sidebarStore ? 'sidebar-collapsed' : 'sidebar-expanded'} 
         h-full bg-neutral-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out
         {!$sidebarStore ? 'md:relative md:z-auto z-40' : ''}"
>
  {#if $sidebarStore}
    <!-- Collapsed State: Icon Strip -->
    <div class="collapsed-sidebar">
      <!-- Expand Button -->
      <button
        class="icon-btn-collapsed"
        onclick={toggleSidebar}
        aria-label="Expand Sidebar"
        title="Expand Sidebar"
      >
        <Icon icon="lucide:menu" class="w-5 h-5" />
      </button>

      <!-- New Chat Icon -->
      <button
        class="icon-btn-collapsed"
        onclick={handleNewChatClick}
        aria-label="New Chat"
        title="New Chat"
      >
        <Icon icon="lucide:plus" class="w-5 h-5" />
      </button>

      <!-- Search Icon -->
      <button
        class="icon-btn-collapsed"
        onclick={handleSearchClick}
        aria-label="Search Chats"
        title="Search Chats"
      >
        <Icon icon="lucide:search" class="w-5 h-5" />
      </button>
    </div>
  {:else}
    <!-- Expanded State: Full Sidebar -->
    
    <!-- Header Section -->
    <section class="flex items-center justify-between px-4 py-3 border-b border-gray-800">
      <button
        class="btn btn-sm btn-ghost flex items-center gap-2"
        onclick={handleNewChatClick}
        aria-label="New Chat"
      >
        <Icon icon="lucide:plus" class="w-4 h-4" />
        New Chat
      </button>

      <button 
        aria-label="Collapse Sidebar" 
        class="text-gray-300 hover:text-white transition-colors duration-150 p-1 w-8 h-8 flex items-center justify-center"
        onclick={toggleSidebar}
        title="Collapse Sidebar"
      >
        <Icon icon="lucide:chevron-left" class="w-4 h-4" />
      </button>
    </section>

    <!-- Main content area with chat list -->
    <div class="sidebar-content flex-1 overflow-y-auto">
      {#each $chats as chat}
        <div
          class="flex items-center justify-between px-4 py-3 hover:bg-gray-800 border-b border-gray-800"
        >
          <a
            href={"/chat/" + chat.id}
            class="truncate flex-1 text-gray-300 hover:text-white transition-colors duration-150"
          >
            {chat.title}
          </a>
          <button
            onclick={() => handleDelete(chat.id)}
            class="text-red-400 hover:text-red-600 transition-colors duration-150 p-1 w-8 h-8 flex items-center justify-center"
            aria-label="Delete chat"
            title="Delete chat"
          >
            <Icon icon="lucide:trash-2" class="w-4 h-4" />
          </button>
        </div>
      {/each}
    </div>

    <!-- Footer pinned to bottom -->
    <section class="px-4 py-3 border-t border-gray-800 hover:bg-gray-800">
      <button
        onclick={handleSearchClick}
        class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 cursor-pointer transition-colors duration-150 w-full text-left"
        aria-label="Search Chats"
      >
        <Icon icon="lucide:search" class="w-4 h-4 text-gray-400" />
        Search Chats
      </button>
    </section>
  {/if}
</main>

{#if newChatModalOpen}
  <NewChatModule onClose={() => (newChatModalOpen = false)} />
{/if}

<style>
  .sidebar-expanded {
    width: 20%; /* Same as w-1/5 */
    min-width: 250px;
  }

  .sidebar-collapsed {
    width: 60px;
    min-width: 60px;
  }

  .collapsed-sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;
    gap: 1rem;
  }

  .icon-btn-collapsed {
    padding: 0.75rem;
    border-radius: 0.5rem;
    background-color: transparent;
    color: rgb(209 213 219);
    transition: all 150ms;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    cursor: pointer;
  }

  .icon-btn-collapsed:hover {
    background-color: rgb(31 41 55);
    color: white;
  }

  .icon-btn-collapsed:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px rgb(23 23 23);
  }

  /* Ensure smooth transitions for width changes */
  .sidebar-expanded,
  .sidebar-collapsed {
    transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out;
  }

  /* Hide scrollbar in collapsed state */
  .sidebar-collapsed {
    overflow: hidden;
  }

  /* Button Components */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-weight: 500;
    transition: colors 150ms;
    outline: none;
    opacity: 1;
    cursor: pointer;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px black;
  }

  .btn-sm {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
  }


  .btn-ghost {
    background: transparent;
    color: rgb(209 213 219);
    border: 1px solid transparent;
  }

  .btn-ghost:hover {
    background: rgb(55 65 81);
  }

  .btn-ghost:focus {
    box-shadow: 0 0 0 2px white;
  }

  /* Responsive behavior */
  @media (max-width: 768px) {
    .sidebar-expanded {
      width: 280px;
      position: absolute;
      z-index: 30;
      height: 100%;
    }
    
    .sidebar-collapsed {
      width: 60px;
    }
  }
</style>
