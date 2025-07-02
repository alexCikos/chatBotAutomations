<script lang="ts">
  import { tick } from 'svelte';
  import { onMount } from 'svelte';
  import { messages, sendMessage } from '$lib/stores/messages';
  import MessageItem from './MessageItem.svelte';
  import MessageInput from './MessageInput.svelte';

  const chatId = 'chat-001';
  const userId = 'user-abc';

  // Container element used for scrolling
  let scrollEl: HTMLDivElement;

  // Scroll to the newest message when the component first loads
  onMount(() => {
    scrollToBottom();
  });

  // Whenever the list of messages changes, scroll to the latest entry
  $effect(() => {
    $messages; // track store updates
    scrollToBottom();
  });

  async function scrollToBottom() {
    // Wait for DOM to update before measuring height
    await tick();
    // Scroll on the next animation frame to ensure layout is ready
    requestAnimationFrame(() => {
      if (scrollEl) {
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    });
  }

  // Called when the user clicks send
  function handleSend(message: string) {
    sendMessage(message, chatId, userId);
  }
</script>

<!-- UI -->
<div class="grid grid-rows-[auto_1fr_auto] min-h-screen border-8 border-black">
  <div class="text-3xl font-bold uppercase border-b-8 border-black p-4">BRUTAL BOT</div>

  <div class="overflow-y-auto flex-1 p-4 space-y-4" bind:this={scrollEl}>
    {#each $messages as message (message.id)}
      <MessageItem {message} />
    {/each}
  </div>

  <div class="sticky bottom-0 border-t-8 border-black bg-white p-4">
    <MessageInput onSend={handleSend} />
  </div>
</div>

