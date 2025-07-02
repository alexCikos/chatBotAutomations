<script lang="ts">
  import { tick } from 'svelte';
  import { messages, sendMessage } from '$lib/stores/messages';
  import MessageItem from './MessageItem.svelte';
  import MessageInput from './MessageInput.svelte';

  const chatId = 'chat-001';
  const userId = 'user-abc';

  let scrollEl: HTMLDivElement;

  // Reactive effect: scroll to bottom when $messages updates
  $: if (scrollEl) {
    scrollToBottom();
  }

  async function scrollToBottom() {
    await tick();
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  function handleSend(event: CustomEvent<string>) {
    sendMessage(event.detail, chatId, userId);
  }
</script>


<!-- Outer container for the chat -->
<div class="grid grid-rows-[auto_1fr_auto] min-h-screen border-8 border-black">
  <!-- Heading bar -->
  <div class="text-3xl font-bold uppercase border-b-8 border-black p-4">BRUTAL BOT</div>

  <!-- Scrollable messages area -->
  <div class="overflow-y-auto flex-1 p-4 space-y-4" bind:this={scrollEl}>
    {#each $messages as message (message.id)}
      <MessageItem {message} />
    {/each}
  </div>

  <!-- Message input bar -->
  <div class="sticky bottom-0 border-t-8 border-black bg-white p-4">
    <MessageInput on:send={handleSend} />
  </div>
</div>
