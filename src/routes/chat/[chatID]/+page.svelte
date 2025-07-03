<script lang="ts">
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import { tick } from "svelte";
  import { page } from "$app/state";

  const { messages, content, loadMessages, sendMessage } = chatWindowStore;

  let scrollEl: HTMLDivElement;
  let inputEl: HTMLInputElement;

  // Load messages once when component mounts
  $effect.pre(() => {
    loadMessages(page.params.chatID);
  });

  // Scroll to bottom when messages change
  $effect(() => {
    $messages;
    tick().then(() => {
      if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
    });
  });

  // Handle form submit
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const value = $content.trim();
    if (!value) return;
    await sendMessage(page.params.chatID, value);
    $content = "";
    inputEl?.focus();
  }
</script>

<main class="flex flex-col h-[100dvh] w-full overflow-x-hidden font-mono">
  <!-- Message container -->
  <div
    bind:this={scrollEl}
    class="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-[#f9f9f9]"
  >
    {#each $messages as msg}
      <div
        class={`max-w-[45%] p-3 rounded-lg whitespace-pre-wrap break-words ${
          msg.role === "user"
            ? "ml-auto bg-black text-white"
            : "mr-auto bg-gray-200 text-black"
        }`}
      >
        {msg.content}
      </div>
    {/each}
  </div>

  <!-- Input form -->
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
