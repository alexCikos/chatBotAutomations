<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // We use Skeleton's styling classes on native elements

  // Dispatcher emits the input string when a message is sent
  const dispatch = createEventDispatcher<{ send: string }>();

  let input = '';
  let textareaEl: HTMLTextAreaElement;

  // Auto resize the textarea to fit its content
  function resize() {
    textareaEl.style.height = 'auto';
    textareaEl.style.height = textareaEl.scrollHeight + 'px';
  }

  // Handle keyboard shortcuts
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
<div class="flex gap-2">
  <textarea
    class="flex-1 rounded-md p-2 border bg-background text-sm sm:text-base"
    bind:value={input}
    on:input={resize}
    on:keydown={handleKeydown}
    rows="1"
    bind:this={textareaEl}
    placeholder="Type a message"
  ></textarea>
  <button
    class="btn bg-primary text-primary-foreground px-4 py-2 rounded-md"
    on:click={send}
  >
    Send
  </button>
</div>
