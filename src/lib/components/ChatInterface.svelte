<script lang="ts">
  import { chatWindowStore } from "$lib/stores/chatWindowStore";
  import { tick } from "svelte";
  import { page } from "$app/state";
  import { userStore } from "$lib/stores/userStore";
  import Icon from "@iconify/svelte";
  import ToolSelector from "$lib/components/ToolSelector.svelte";
  import ToolStatus from "$lib/components/ToolStatus.svelte";
  import type { Tool } from "$lib/types";

  // Destructure store properties for reactivity and logic
  const { messages, content, loadMessages, sendMessage } = chatWindowStore;

  const userId = $userStore?.id;
  let selectedTool: Tool | null = $state(null); // State for selected tool
  let inputFocused = $state(false);
  let isSubmitting = $state(false); // Track submission state
  let errorMessage = $state<string | null>(null); // Track errors

  // References to DOM elements
  let scrollEl: HTMLDivElement;
  let inputEl: HTMLTextAreaElement;

  // Load existing messages when the component is first mounted
  $effect.pre(() => {
    (async () => {
      try {
        await loadMessages(page.params.chatID);
        errorMessage = null; // Clear any previous errors
      } catch (error) {
        console.error("Failed to load messages:", error);
        errorMessage = "Failed to load chat messages. Please refresh the page.";
      }
    })();
  });

  // Auto-scroll to bottom whenever messages change
  $effect(() => {
    $messages;
    (async () => {
      try {
        await tick();
        if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
      } catch (error) {
        console.error("Failed to scroll to bottom:", error);
        // Non-critical error, don't show to user
      }
    })();
  });

  // Handle new message submission
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const value = $content.trim();
    if (!value || isSubmitting) return; // prevent empty messages and double submission

    isSubmitting = true;
    errorMessage = null; // Clear any previous errors

    try {
      await sendMessage(page.params.chatID, value, userId ?? "", selectedTool);
      $content = ""; // clear input
      selectedTool = null; // clear tool selection after sending
      inputEl?.focus(); // focus back on input
    } catch (error) {
      console.error("Failed to send message:", error);
      errorMessage = "Failed to send message. Please try again.";
      // Don't clear the input so user can retry
    } finally {
      isSubmitting = false;
    }
  }

  function handleToolSelect(tool: Tool | null) {
    selectedTool = tool;
  }

  function clearToolSelection() {
    selectedTool = null;
  }

  // Auto-resize textarea function
  function handleTextareaResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto";

    // Calculate the new height based on scroll height
    const newHeight = Math.min(textarea.scrollHeight, 120); // max height of 120px
    textarea.style.height = newHeight + "px";
  }

  // Handle Enter key submission and Shift+Enter for new lines
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const form = inputEl?.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  }
</script>

<main class="relative h-full bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col font-mono overflow-hidden">
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px] z-[1]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)] z-[1]"></div>

  <!-- Tool Status Info -->
  <ToolStatus {selectedTool} onClear={clearToolSelection} />

  <!-- Error Message Display -->
  {#if errorMessage}
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3 bg-gradient-to-br from-red-500/90 to-red-600/90 border border-red-500/30 rounded-xl p-3 px-4 text-white text-sm font-medium backdrop-blur-md shadow-[0_8px_32px_rgba(239,68,68,0.3)] max-w-[calc(100vw-2rem)]" role="alert">
      <Icon icon="lucide:alert-circle" class="w-5 h-5" />
      <span>{errorMessage}</span>
      <button
        onclick={() => (errorMessage = null)}
        class="bg-transparent border-none text-white cursor-pointer p-1 rounded flex items-center justify-center transition-colors duration-200 hover:bg-white/20 flex-shrink-0"
        aria-label="Close error message"
      >
        <Icon icon="lucide:x" class="w-4 h-4" />
      </button>
    </div>
  {/if}

  <!-- Message list container -->
  <div bind:this={scrollEl} class="flex-1 overflow-y-auto p-8 pt-20 flex flex-col gap-4 relative z-[2] bg-transparent [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/30 md:p-8 md:pt-20 max-md:p-4 max-md:pt-16 max-[480px]:p-3 max-[480px]:pt-14">
    {#each $messages as msg}
      <div
        class={msg.role === "user"
          ? "self-end max-w-[75%] p-4 px-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-md text-white text-[0.95rem] leading-relaxed break-words hyphens-auto transition-all duration-300 shadow-[0_4px_16px_rgba(59,130,246,0.2)] hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-500/40 hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)] max-md:max-w-[90%] max-md:p-3.5 max-md:px-5 max-md:text-[0.9rem] max-[480px]:max-w-[95%] max-[480px]:p-3 max-[480px]:px-4 max-[480px]:text-sm"
          : "self-start max-w-[75%] p-4 px-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white text-[0.95rem] leading-relaxed break-words hyphens-auto transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] max-md:max-w-[90%] max-md:p-3.5 max-md:px-5 max-md:text-[0.9rem] max-[480px]:max-w-[95%] max-[480px]:p-3 max-[480px]:px-4 max-[480px]:text-sm"}
      >
        {msg.content}
      </div>
    {/each}
  </div>

  <!-- Message input form -->
  <form onsubmit={handleSubmit} class="relative z-[2] p-6 bg-transparent border-t-0 min-h-auto max-md:p-4 max-[480px]:p-3">
    <!-- Input Field with Tools -->
    <div class="relative flex items-center max-w-[800px] mx-auto bg-white/5 border-2 border-white/10 rounded-2xl p-4 px-6 transition-all duration-300 backdrop-blur-md {inputFocused ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_32px_rgba(59,130,246,0.2)]' : ''} max-md:p-3.5 max-md:px-4 max-[480px]:p-3 max-[480px]:px-3.5">
      <!-- Tools Section -->
      <div class="flex items-center mr-3 flex-shrink-0">
        <ToolSelector onToolSelect={handleToolSelect} {selectedTool} />
      </div>

      <!-- Input -->
      <textarea
        bind:this={inputEl}
        bind:value={$content}
        placeholder="Type your message..."
        class="flex-1 bg-transparent border-none outline-none shadow-none text-lg text-white font-inherit leading-6 mx-3 resize-none min-h-[24px] max-h-[120px] overflow-y-auto transition-[height] duration-200 focus:outline-none focus:shadow-none focus:border-none placeholder:text-slate-500"
        rows="1"
        onfocus={() => (inputFocused = true)}
        onblur={() => (inputFocused = false)}
        oninput={handleTextareaResize}
        onkeydown={handleKeyDown}
      ></textarea>

      <!-- Send Button -->
      <button
        type="submit"
        class="bg-gradient-to-br from-blue-500 to-purple-500 border-none rounded-xl p-3 text-white cursor-pointer transition-all duration-300 flex items-center justify-center min-w-[48px] h-12 shadow-[0_4px_16px_rgba(59,130,246,0.3)] flex-shrink-0 hover:not(:disabled):-translate-y-0.5 hover:not(:disabled):shadow-[0_8px_32px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={!$content.trim() || isSubmitting}
        title={isSubmitting ? "Sending..." : "Send message"}
      >
        {#if isSubmitting}
          <Icon icon="lucide:loader-2" class="w-5 h-5 animate-spin" />
        {:else}
          <Icon icon="lucide:send" class="w-5 h-5" />
        {/if}
      </button>
    </div>
  </form>
</main>

