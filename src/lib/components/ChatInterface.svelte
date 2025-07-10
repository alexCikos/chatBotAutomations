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
  let inputFocused = $state(false);

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

<main class="chat-container">
  <!-- Background Elements -->
  <div class="background-grid"></div>
  <div class="background-gradient"></div>

  <!-- Message list container -->
  <div bind:this={scrollEl} class="messages-container">
    {#each $messages as msg}
      <div
        class={msg.role === "user"
          ? "message-bubble-user"
          : "message-bubble-assistant"}
      >
        {msg.content}
      </div>
    {/each}
  </div>

  <!-- Message input form -->
  <form onsubmit={handleSubmit} class="chat-input-container">
    <!-- Input Field with Tools -->
    <div class="chat-input-wrapper {inputFocused ? 'focused' : ''}">
      <!-- Tools Section -->
      <div class="tools-section">
        <button
          type="button"
          onclick={() => setSelectedTool("tools")}
          class="tool-btn {selectedTool === 'tools' ? 'active' : ''}"
          title="Toggle Tools"
        >
          <Icon icon="lucide:wrench" class="w-4 h-4" />
        </button>
      </div>

      <!-- Input -->
      <input
        bind:this={inputEl}
        bind:value={$content}
        placeholder="Type your message..."
        class="chat-input"
        onfocus={() => (inputFocused = true)}
        onblur={() => (inputFocused = false)}
      />

      <!-- Send Button -->
      <button type="submit" class="chat-send-btn" disabled={!$content.trim()}>
        <Icon icon="lucide:send" class="w-5 h-5" />
      </button>
    </div>

    <!-- Tool Status Info -->
    {#if selectedTool === "tools"}
      <div class="tool-status">
        <Icon icon="lucide:wrench" class="w-4 h-4 text-blue-400" />
        <span>Tool Panel Active</span>
      </div>
    {/if}
  </form>
</main>

<style>
  .chat-container {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    display: flex;
    flex-direction: column;
    font-family: var(--font-mono);
    overflow: hidden;
  }

  .background-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.02) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: grid-move 20s linear infinite;
    z-index: 1;
  }

  .background-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    z-index: 1;
  }

  @keyframes grid-move {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    z-index: 2;
    background: transparent;
  }

  .message-bubble-user {
    align-self: flex-end;
    max-width: 70%;
    padding: 1rem 1.5rem;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.2),
      rgba(139, 92, 246, 0.2)
    );
    border: 1px solid rgba(59, 130, 246, 0.3);
    backdrop-filter: blur(10px);
    color: white;
    font-size: 0.95rem;
    line-height: 1.6;
    word-wrap: break-word;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  }

  .message-bubble-assistant {
    align-self: flex-start;
    max-width: 70%;
    padding: 1rem 1.5rem;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    font-size: 0.95rem;
    line-height: 1.6;
    word-wrap: break-word;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .message-bubble-user:hover {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.3),
      rgba(139, 92, 246, 0.3)
    );
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  }

  .message-bubble-assistant:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
  }

  .chat-input-container {
    position: relative;
    z-index: 2;
    padding: 1.5rem;
    background: transparent;
    border-top: none;
    min-height: auto;
  }

  .chat-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1rem 1.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .chat-input-wrapper.focused {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 32px rgba(59, 130, 246, 0.2);
  }

  .chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    font-size: 1.125rem;
    color: white;
    font-family: inherit;
    line-height: 1.5;
    margin: 0 12px;
  }

  .chat-input:focus {
    outline: none;
    box-shadow: none;
    border: none;
  }

  .chat-input::placeholder {
    color: #64748b;
  }

  .chat-send-btn {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border: none;
    border-radius: 12px;
    padding: 0.75rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    height: 48px;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    flex-shrink: 0;
  }

  .chat-send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  }

  .chat-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .tools-section {
    display: flex;
    align-items: center;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
  }

  .tool-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .tool-btn.active {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.2),
      rgba(139, 92, 246, 0.2)
    );
    border-color: rgba(59, 130, 246, 0.3);
    color: #3b82f6;
  }

  .tool-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 800px;
    margin: 0.75rem auto 0;
    padding: 0.5rem 1rem;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 8px;
    color: #93c5fd;
    font-size: 0.875rem;
    font-family: inherit;
    backdrop-filter: blur(10px);
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .chat-container {
      height: 100vh;
    }

    .messages-container {
      padding: 1rem;
    }

    .chat-input-container {
      padding: 1rem;
      min-height: auto;
    }

    .message-bubble-user,
    .message-bubble-assistant {
      max-width: 85%;
    }

    .tool-status {
      margin: 0.5rem auto 0;
      font-size: 0.8rem;
    }

    .chat-input-wrapper {
      padding: 0.875rem 1rem;
    }
  }

  /* Scrollbar Styling */
  .messages-container::-webkit-scrollbar {
    width: 6px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .messages-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
