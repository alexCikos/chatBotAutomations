<script lang="ts">
  // Svelte helpers used for scrolling
  import { tick } from 'svelte';

  // Shared message store and helper to send a new message
  import { messages, sendMessage } from '$lib/stores/messages';

  // Child components
  import MessageItem from './MessageItem.svelte';
  import MessageInput from './MessageInput.svelte';

  // Simple icons from Lucide
  import { Menu, RefreshCw } from 'lucide-svelte';

  // Hard coded identifiers for now. In a real app
  // these would come from the router or a store.
  const chatId = 'chat-001';
  const userId = 'user-abc';

  // Reference to the scrolling container so we can
  // keep the newest messages in view
  let listEl: HTMLDivElement;

  // Scroll to the bottom whenever messages change
  $: scrollToBottom();
  async function scrollToBottom() {
    await tick();
    listEl?.scrollTo({ top: listEl.scrollHeight, behavior: 'smooth' });
  }

  // Forward sent messages to the store
  function handleSend(event: CustomEvent<string>) {
    sendMessage(event.detail, chatId, userId);
  }
</script>

<!-- Outer container for the chat -->
<div class="h-screen flex flex-col max-w-screen-md mx-auto">
  <!-- Top bar with simple actions -->
  <div class="flex items-center justify-between px-4 py-3 backdrop-blur-lg bg-white/5 border-b border-white/10">
    <button aria-label="Menu" class="p-2 text-white/60 hover:text-white">
      <Menu class="w-5 h-5" />
    </button>
    <button aria-label="Refresh" class="p-2 text-white/60 hover:text-white">
      <RefreshCw class="w-5 h-5" />
    </button>
  </div>

  <!-- Scrollable messages area -->
  <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4" bind:this={listEl}>
    {#each $messages as message (message.id)}
      <MessageItem {message} />
    {/each}
  </div>

  <!-- Message input bar -->
  <div class="sticky bottom-0 z-10 backdrop-blur-lg bg-white/5 px-4 py-4">
    <MessageInput on:send={handleSend} />
  </div>
</div>
