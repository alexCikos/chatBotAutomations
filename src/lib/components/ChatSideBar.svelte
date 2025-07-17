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

  const { chats, loadChats, deleteChat, editChat } =
    sideBarChatsStore;

  const userId = $userStore?.id;
  let loadingError = $state<string | null>(null);

  $effect(() => {
    if (userId) {
      (async () => {
        try {
          await loadChats(userId);
          loadingError = null;
        } catch (error) {
          console.error("Failed to load chats:", error);
          loadingError = "Failed to load chats. Please refresh the page.";
        }
      })();
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
  let isDeleting = $state(false);
  let isEditing = $state(false);

  function handleDeleteClick(chatId: string) {
    const chat = $chats.find(c => c.id === chatId);
    chatToDelete = chatId;
    chatTitleToDelete = chat?.title || null;
    deleteModalOpen = true;
    activeDropdownId = null;
  }

  async function handleDeleteConfirm() {
    if (!chatToDelete || isDeleting) return;

    isDeleting = true;
    const chatTitle = chatTitleToDelete;
    const deletedChatId = chatToDelete; // Store the ID before setting to null
    
    try {
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
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toastStore.add({
        message: `Failed to delete chat${chatTitle ? ` "${chatTitle}"` : ''}. Please try again.`,
        type: 'error',
        duration: 5000
      });
    } finally {
      isDeleting = false;
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
    if (!chatToEdit || isEditing) return;

    isEditing = true;
    
    try {
      const result = await editChat(chatToEdit, newTitle, newDescription);
      
      if (result) {
        // Show success toast
        toastStore.add({
          message: `Chat updated successfully`,
          type: 'success',
          duration: 3000
        });
        
        editModalOpen = false;
        chatToEdit = null;
        chatTitleToEdit = null;
        chatDescriptionToEdit = null;
      } else {
        throw new Error('Edit operation failed');
      }
    } catch (error) {
      console.error("Failed to edit chat:", error);
      toastStore.add({
        message: `Failed to update chat. Please try again.`,
        type: 'error',
        duration: 5000
      });
    } finally {
      isEditing = false;
    }
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
    class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 max-md:top-16 max-md:h-[calc(100vh-64px)]"
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
  class="{($sidebarStore && !isMobile()) ? 'w-[60px] min-w-[60px]' : 'w-1/5 min-w-[250px] max-md:w-[280px] max-md:fixed max-md:top-16 max-md:left-0 max-md:z-40 max-md:h-[calc(100vh-64px)]'} 
         {($sidebarStore && isMobile()) ? 'max-md:-translate-x-full' : ''}
         h-full bg-neutral-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out
         md:relative md:z-auto"
>
  {#if $sidebarStore && !isMobile()}
    <!-- Collapsed State: Icon Strip (Desktop only) -->
    <div class="flex flex-col items-center py-4 gap-4">
      <!-- Expand Button -->
      <button
        class="p-3 rounded-lg bg-transparent text-gray-300 transition-all duration-150 flex items-center justify-center w-11 h-11 border-none cursor-pointer hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
        onclick={toggleSidebar}
        aria-label="Expand Sidebar"
        title="Expand Sidebar"
      >
        <Icon icon="lucide:menu" class="w-5 h-5" />
      </button>

      <!-- New Chat Icon -->
      <button
        class="p-3 rounded-lg bg-transparent text-gray-300 transition-all duration-150 flex items-center justify-center w-11 h-11 border-none cursor-pointer hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
        onclick={handleNewChatClick}
        aria-label="New Chat"
        title="New Chat"
      >
        <Icon icon="lucide:plus" class="w-5 h-5" />
      </button>

      <!-- Search Icon -->
      <button
        class="p-3 rounded-lg bg-transparent text-gray-300 transition-all duration-150 flex items-center justify-center w-11 h-11 border-none cursor-pointer hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
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
        class="inline-flex items-center justify-center font-mono font-medium transition-colors duration-150 outline-none opacity-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black text-sm py-2 px-3 rounded-lg bg-transparent text-gray-300 border border-transparent hover:bg-gray-700 gap-2"
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
    <div class="flex-1 overflow-y-auto">
      {#if loadingError}
        <div class="flex items-center gap-2 p-4 m-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm text-left">
          <Icon icon="lucide:alert-circle" class="w-4 h-4" />
          <span>{loadingError}</span>
        </div>
      {/if}
      
      {#each $chats as chat}
        <div
          class="flex items-center justify-between px-4 py-3 hover:bg-gray-800 border-b border-gray-800 group"
        >
          <a
            href={"/chat/" + chat.id}
            class="flex-1 text-gray-300 hover:text-white transition-colors duration-150 block"
            onclick={handleChatSelect}
          >
            <div class="text-sm font-medium leading-tight truncate">{chat.title}</div>
            {#if chat.description}
              <div class="text-xs text-gray-400 leading-snug mt-1 max-w-[180px] truncate group-hover:text-gray-300">{chat.description}</div>
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

