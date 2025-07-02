<script lang="ts">
  // Svelte helpers used for scrolling
  import { tick } from 'svelte';

  // Chat message store and helper function
  import { messages, sendMessage } from '$lib/stores/messages';

  // Child components
  import MessageItem from './MessageItem.svelte';
  import MessageInput from './MessageInput.svelte';

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

<!-- Full screen chat container -->
<div class="h-screen flex flex-col max-w-screen-md mx-auto rounded-xl shadow-md bg-background border border-border">
  <!-- Header with avatar, title and actions -->
  <div class="flex items-center justify-between px-4 py-3 border-b border-border">
    <div class="flex items-center gap-2">
      <!-- Placeholder avatar -->
      <div class="w-8 h-8 rounded-full bg-warning-500 flex items-center justify-center font-bold text-neutral-950">B</div>
      <span class="font-bold">Restaurant Bot</span>
    </div>
    <div class="flex items-center gap-2 text-muted-foreground">
      <button class="btn-icon" aria-label="Refresh">🔄</button>
      <button class="btn-icon" aria-label="Expand">⤢</button>
    </div>
  </div>

  <!-- Date label -->
  <div class="flex items-center gap-2 px-4 py-1 text-sm text-muted-foreground">
    <div class="flex-1 h-px bg-border"></div>
    <span>{new Date().toLocaleDateString()}</span>
    <div class="flex-1 h-px bg-border"></div>
  </div>

  <!-- Messages list -->
  <div class="overflow-y-auto px-4 py-2 flex-1" bind:this={listEl}>
    {#each $messages as message (message.id)}
      <MessageItem {message} />
    {/each}
  </div>

  <!-- Input and footer -->
  <div class="sticky bottom-0 z-10 bg-background px-4 py-3 space-y-2">
    <MessageInput on:send={handleSend} />
    <div class="text-center text-xs text-muted-foreground">Powered by sendbird</div>
  </div>
</div>
