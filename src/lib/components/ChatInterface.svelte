<script lang="ts">
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import { tick } from "svelte";
  import { page } from "$app/state";
  import { userStore } from "$lib/stores/userStore";
  import Icon from "@iconify/svelte";

  // Destructure store properties for reactivity and logic
  const { messages, content, loadMessages, sendMessage } = chatWindowStore;

  const userId = $userStore?.id;
  let selectedTool: string = $state("tools"); // State for selected tool

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

  function openTools() {
    // Placeholder for opening tools
    console.log("Tools button clicked");
  }

  function setSelectedTool(tool: string) {
    selectedTool = tool; // Update selected tool state
  }
</script>

<main class="flex flex-col h-full w-full overflow-x-hidden font-mono">
  <!-- Message list container -->
  <div
    bind:this={scrollEl}
    class="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-[#212121]"
  >
    {#each $messages as msg}
      <div
        class={`max-w-[45%] p-3 rounded-lg whitespace-pre-wrap break-words ${
          msg.role === "user"
            ? "ml-auto bg-[#2E2E2E] text-white" // right-aligned for user
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
    class="flex flex-col justify-center bg-[#212121] px-3 py-3 sticky bottom-0 w-full border-t border-gray-800"
  >
    <!-- 💬 Input Field -->
    <div class="relative w-full max-w-3xl mx-auto">
      <input
        bind:this={inputEl}
        bind:value={$content}
        placeholder="Type your message..."
        class="w-full py-6 px-5 rounded-2xl bg-[#2E2E2E] text-white text-base placeholder-gray-400 focus:outline-none font-mono pr-14"
      />
      <button
        type="submit"
        class="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full hover:bg-gray-200"
      >
        <Icon icon="mdi:send" class="w-5 h-5 text-black" />
      </button>
    </div>

    <!-- 🧰 Tool Row -->
    <div class="mt-4 w-full max-w-3xl mx-auto flex gap-4">
      <!-- Tool Buttons (left) -->
      <div class="flex gap-2">
        <button
          type="button"
          onclick={() => setSelectedTool("tools")}
          class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center gap-2"
        >
          <Icon icon="mdi:wrench" class="w-4 h-4" />
          Tools
        </button>

        <!-- Selected Tool Info (right) -->
        <div
          class="flex-1 bg-[#2E2E2E] px-4 py-2 rounded text-sm text-gray-300 font-mono"
        >
          {#if selectedTool === "tools"}
            Selected: Tool Panel
          {:else if selectedTool === "quote"}
            Selected: Quote Builder
          {:else}
            No tool selected
          {/if}
        </div>
      </div>
    </div>
  </form>
</main>
