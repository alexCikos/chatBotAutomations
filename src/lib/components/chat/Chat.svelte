<script lang="ts">
  // Svelte helpers used for scrolling
  import { tick } from 'svelte';

  // Shared message store and helper to send a new message
  import { messages, sendMessage } from '$lib/stores/messages';

  // Child components
  import MessageItem from './MessageItem.svelte';
  import MessageInput from './MessageInput.svelte';

  // Simple icons from Lucide

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
<div class="grid grid-rows-[auto_1fr_auto] min-h-screen border-8 border-black">
  <!-- Heading bar -->
  <div class="text-3xl font-bold uppercase border-b-8 border-black p-4">BRUTAL BOT</div>

  <!-- Scrollable messages area -->
  <div class="overflow-y-auto flex-1 p-4 space-y-4" bind:this={listEl}>
    {#each $messages as message (message.id)}
      <MessageItem {message} />
    {/each}
  </div>

  <!-- Message input bar -->
  <div class="sticky bottom-0 border-t-8 border-black bg-white p-4">
    <MessageInput on:send={handleSend} />
  </div>
</div>
