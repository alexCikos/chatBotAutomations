<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { messages, sendMessage, type Message } from '$lib/stores/messages';
  import MessageItem from './MessageItem.svelte';
  import MessageInput from './MessageInput.svelte';

  // Hard coded identifiers for now
  const chatId = 'chat-001';
  const userId = 'user-abc';

  // Reference to the scrolling container
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
<div class="flex flex-col h-screen max-w-screen-md mx-auto">
  <!-- Messages list -->
  <div
    class="overflow-y-auto px-4 py-2 flex-1"
    bind:this={listEl}
  >
    {#each $messages as message (message.id)}
      <MessageItem {message} />
    {/each}
  </div>

  <!-- Input area -->
  <div class="sticky bottom-0 bg-background px-4 py-3">
    <MessageInput on:send={handleSend} />
  </div>
</div>
