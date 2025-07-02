<script lang="ts">
  // Svelte helpers
  import { tick } from 'svelte';

  // Chat message store and helper function
  import { messages, sendMessage } from '$lib/stores/messages';

  // Child components
  import MessageItem from './MessageItem.svelte';
  import MessageInput from './MessageInput.svelte';

  // Skeleton does not ship a container component, but we apply
  // its container classes to a regular div

  // Hard coded identifiers for now. In a real app these
  // would come from the router or a store.
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
<div class="container flex flex-col h-screen max-w-screen-md mx-auto">
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
  <div class="sticky bottom-0 z-10 bg-background px-4 py-3">
    <MessageInput on:send={handleSend} />
  </div>
</div>
