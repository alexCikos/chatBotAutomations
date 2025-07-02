<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Send } from 'lucide-svelte';

  // Dispatcher emits the input string when a message is sent
  const dispatch = createEventDispatcher<{ send: string }>();

  let input = '';
  let textareaEl: HTMLTextAreaElement;

  // Auto resize the textarea to fit its content
  function resize() {
    textareaEl.style.height = 'auto';
    textareaEl.style.height = textareaEl.scrollHeight + 'px';
  }

  // Handle Enter to send and Shift+Enter for newline
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  // Send the current input value
  function send() {
    const trimmed = input.trim();
    if (trimmed) {
      dispatch('send', trimmed);
      input = '';
      resize();
    }
  }
</script>

<!-- Input area with textarea and send button -->
<div class="flex items-end gap-2">
  <textarea
    class="flex-1 resize-none rounded-full bg-slate-800 border border-white/10 text-sm text-white px-4 py-2 placeholder-white/40 focus:outline-none"
    bind:value={input}
    on:input={resize}
    on:keydown={handleKeydown}
    rows="1"
    bind:this={textareaEl}
    placeholder="Type your message"
  ></textarea>
  <button
    class="p-2 text-white hover:text-yellow-400"
    aria-label="Send"
    on:click={send}
  >
    <Send class="w-5 h-5" />
  </button>
</div>
