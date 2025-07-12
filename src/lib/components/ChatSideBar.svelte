<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import { sidebarStore } from "$lib/stores/sidebarStore";
  import NewChatModule from "$lib/components/NewChatModule.svelte";
  import { userStore } from "$lib/stores/userStore";
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import DeleteConfirmModal from "$lib/components/DeleteConfirmModal.svelte";
  import EditChatModal from "$lib/components/EditChatModal.svelte";
  import { toastStore } from "$lib/stores/toastStore";

  const { chats, content, loadChats, createChat, deleteChat, editChat } =
    sideBarChatsStore;

  const userId = $userStore?.id;

  $effect(() => {
    if (userId) {
      loadChats(userId);
    }
  });

  let newChatModalOpen: boolean = $state(false);
  let activeDropdownId: string | null = $state(null);
  let deleteModalOpen: boolean = $state(false);
  let chatToDelete: string | null = $state(null);
  let chatTitleToDelete: string | null = $state(null);
  let editModalOpen: boolean = $state(false);
  let chatToEdit: string | null = $state(null);
  let chatTitleToEdit: string | null = $state(null);
  let chatDescriptionToEdit: string | null = $state(null);

  function handleDeleteClick(chatId: string) {
    const chat = $chats.find(c => c.id === chatId);
    chatToDelete = chatId;
    chatTitleToDelete = chat?.title || null;
    deleteModalOpen = true;
    activeDropdownId = null;
  }

  async function handleDeleteConfirm() {
    if (!chatToDelete) return;

    const chatTitle = chatTitleToDelete;
    const deletedChatId = chatToDelete; // Store the ID before setting to null
    
    await deleteChat(chatToDelete);
    chatWindowStore.clear();
    deleteModalOpen = false;
    chatToDelete = null;
    chatTitleToDelete = null;

    // Show success toast
    toastStore.add({
      message: `Chat${chatTitle ? ` "${chatTitle}"` : ''} deleted successfully`,
      type: 'success',
      duration: 3000
    });

    // Optional: if current chat was deleted, redirect to safe route
    if (window.location.pathname === `/chat/${deletedChatId}`) {
      goto("/history");
    }
  }

  function handleDeleteCancel() {
    deleteModalOpen = false;
    chatToDelete = null;
    chatTitleToDelete = null;
  }

  function handleEditClick(chatId: string) {
    const chat = $chats.find(c => c.id === chatId);
    chatToEdit = chatId;
    chatTitleToEdit = chat?.title || null;
    chatDescriptionToEdit = chat?.description || null;
    editModalOpen = true;
    activeDropdownId = null;
  }

  async function handleEditConfirm(newTitle: string, newDescription?: string) {
    if (!chatToEdit) return;

    const result = await editChat(chatToEdit, newTitle, newDescription);
    
    if (result) {
      // Show success toast
      toastStore.add({
        message: `Chat updated successfully`,
        type: 'success',
        duration: 3000
      });
    }

    editModalOpen = false;
    chatToEdit = null;
    chatTitleToEdit = null;
    chatDescriptionToEdit = null;
  }

  function handleEditCancel() {
    editModalOpen = false;
    chatToEdit = null;
    chatTitleToEdit = null;
    chatDescriptionToEdit = null;
  }

  function toggleDropdown(chatId: string) {
    activeDropdownId = activeDropdownId === chatId ? null : chatId;
  }

  function closeDropdown() {
    activeDropdownId = null;
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
      // Auto-close sidebar on mobile after opening new chat modal
      if (isMobile()) {
        sidebarStore.collapse();
      }
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
      // Auto-close sidebar on mobile after navigation
      if (isMobile()) {
        sidebarStore.collapse();
      }
    }
  }

  function toggleSidebar() {
    sidebarStore.toggle();
  }

  // Helper function to check if we're on mobile
  function isMobile() {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  // Auto-close sidebar on mobile after navigation
  function handleChatSelect() {
    if (isMobile()) {
      sidebarStore.collapse();
    }
  }
</script>

<!-- Mobile Backdrop (only show on mobile when expanded) -->
{#if !$sidebarStore}
  <div
    class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 mobile-backdrop"
    onclick={toggleSidebar}
    onkeydown={(e) => e.key === "Enter" && toggleSidebar()}
    aria-label="Close sidebar"
    role="button"
    tabindex="0"
  ></div>
{/if}

<!-- Click outside to close dropdown -->
{#if activeDropdownId}
  <div
    class="fixed inset-0 z-40"
    onclick={closeDropdown}
    aria-hidden="true"
  ></div>
{/if}

<!-- Main Sidebar Container -->
<main
  class="{($sidebarStore && !isMobile()) ? 'sidebar-collapsed' : 'sidebar-expanded'} 
         {($sidebarStore && isMobile()) ? 'mobile-hidden' : ''}
         h-full bg-neutral-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out
         md:relative md:z-auto"
>
  {#if $sidebarStore && !isMobile()}
    <!-- Collapsed State: Icon Strip (Desktop only) -->
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
  {:else if !$sidebarStore || isMobile()}
    <!-- Expanded State: Full Sidebar -->

    <!-- Header Section -->
    <section
      class="flex items-center justify-between px-4 py-3 border-b border-gray-800"
    >
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
            class="flex-1 text-gray-300 hover:text-white transition-colors duration-150 chat-link"
            onclick={handleChatSelect}
          >
            <div class="chat-title truncate">{chat.title}</div>
            {#if chat.description}
              <div class="chat-description truncate">{chat.description}</div>
            {/if}
          </a>
          <div class="relative">
            <button
              onclick={() => toggleDropdown(chat.id)}
              class="text-gray-400 hover:text-white transition-colors duration-150 p-1 w-8 h-8 flex items-center justify-center"
              aria-label="Chat options"
              title="Chat options"
            >
              <Icon icon="lucide:more-horizontal" class="w-4 h-4" />
            </button>
            {#if activeDropdownId === chat.id}
              <div class="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 min-w-[120px]">
                <button
                  onclick={() => handleEditClick(chat.id)}
                  class="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 flex items-center gap-2"
                >
                  <Icon icon="lucide:edit" class="w-4 h-4" />
                  Edit
                </button>
                <button
                  onclick={() => handleDeleteClick(chat.id)}
                  class="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-150 flex items-center gap-2"
                >
                  <Icon icon="lucide:trash-2" class="w-4 h-4" />
                  Delete
                </button>
              </div>
            {/if}
          </div>
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

{#if deleteModalOpen}
  <DeleteConfirmModal
    onConfirm={handleDeleteConfirm}
    onCancel={handleDeleteCancel}
    chatTitle={chatTitleToDelete}
  />
{/if}

{#if editModalOpen}
  <EditChatModal
    onConfirm={handleEditConfirm}
    onCancel={handleEditCancel}
    currentTitle={chatTitleToEdit || ""}
    currentDescription={chatDescriptionToEdit || undefined}
  />
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
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px rgb(23 23 23);
  }

  /* Ensure smooth transitions for width changes */
  .sidebar-expanded,
  .sidebar-collapsed {
    transition:
      width 0.3s ease-in-out,
      min-width 0.3s ease-in-out;
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
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco,
      Consolas, "Liberation Mono", "Courier New", monospace;
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
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px black;
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

  /* Mobile backdrop animation */
  .mobile-backdrop {
    animation: fadeIn 0.3s ease-in-out;
  }

  @media (max-width: 768px) {
    .mobile-backdrop {
      top: 64px; /* Start below navbar */
      height: calc(100vh - 64px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Chat item styling */
  .chat-link {
    display: block;
  }

  .chat-title {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.2;
  }

  .chat-description {
    font-size: 0.75rem;
    color: rgb(156 163 175); /* gray-400 */
    line-height: 1.3;
    margin-top: 0.25rem;
    max-width: 180px;
  }

  .chat-link:hover .chat-description {
    color: rgb(209 213 219); /* gray-300 */
  }

  /* Responsive behavior */
  @media (max-width: 768px) {
    .sidebar-expanded {
      width: 280px;
      position: fixed;
      top: 64px; /* Account for navbar height */
      left: 0;
      z-index: 40;
      height: calc(100vh - 64px); /* Subtract navbar height */
      transition: transform 0.3s ease-in-out;
    }

    /* On mobile, when sidebar is "collapsed", it should be hidden completely */
    .sidebar-expanded.mobile-hidden {
      transform: translateX(-100%);
    }

    .sidebar-collapsed {
      position: fixed;
      top: 64px; /* Account for navbar height */
      left: 0;
      z-index: 40;
      height: calc(100vh - 64px); /* Subtract navbar height */
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      /* On mobile, collapsed sidebar should be hidden completely */
      width: 0;
      min-width: 0;
      overflow: hidden;
    }

    /* Override the default transition for mobile */
    .sidebar-expanded,
    .sidebar-collapsed {
      transition: transform 0.3s ease-in-out;
    }
  }
</style>
