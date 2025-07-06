<script lang="ts">
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import { tick } from "svelte";
  import { page } from "$app/state";
  import { userStore } from "$lib/stores/userStore";

  // Destructure store properties for reactivity and logic
  const { messages, content, loadMessages, sendMessage } = chatWindowStore;

  const userId = $userStore?.id;

  // References to DOM elements
  let scrollEl: HTMLDivElement;
  let inputEl: HTMLInputElement;

  // Load existing messages when the component is first mounted
  $effect.pre(() => {
    loadMessages(page.params.chatID);
  });

  // Auto-scroll to bottom whenever messages change
  $effect(() => {
    $messages;
    tick().then(() => {
      if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
    });
  });

  // Handle new message submission
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const value = $content.trim();
    if (!value) return; // prevent empty messages

    await sendMessage(page.params.chatID, value, userId ?? ""); // send message via store
    $content = ""; // clear input
    inputEl?.focus(); // focus back on input
  }
</script>

<main class="flex flex-col h-[100dvh] w-full overflow-x-hidden font-mono">
  <!-- Message list container -->
  <div
    bind:this={scrollEl}
    class="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-[#f9f9f9]"
  >
    {#each $messages as msg}
      <div
        class={`max-w-[45%] p-3 rounded-lg whitespace-pre-wrap break-words ${
          msg.role === "user"
            ? "ml-auto bg-black text-white" // right-aligned for user
            : "mr-auto bg-gray-200 text-black" // left-aligned for assistant
        }`}
      >
        {msg.content}
      </div>
    {/each}
  </div>

  <!-- Message input form -->
  <form
    onsubmit={handleSubmit}
    class="bg-black border-t p-4 flex gap-3 sticky bottom-0"
  >
    <input
      bind:this={inputEl}
      bind:value={$content}
      placeholder="Type your message..."
      class="flex-1 border px-4 py-2 rounded-md bg-gray-50 focus:outline-none text-black"
    />
    <button type="submit" class="bg-white text-black px-5 py-2 rounded-md">
      Send
    </button>
  </form>
</main>
