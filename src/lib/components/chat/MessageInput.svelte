<script lang="ts">
  import { createEventDispatcher } from 'svelte';

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
<!-- Flex keeps textarea and button vertically centered -->
<div class="flex items-center gap-4">
  <textarea
    class="border-8 border-black px-4 py-3 w-full font-plex focus:outline-none resize-none leading-none align-middle min-h-[48px]"
    bind:value={input}
    bind:this={textareaEl}
    on:input={resize}
    on:keydown={handleKeydown}
    rows="1"
    placeholder="TYPE HERE"
  ></textarea>
  <button
    class="bg-black text-white font-bold uppercase px-6 py-3 border-8 border-black hover:bg-white hover:text-black"
    on:click={send}
  >
    SEND
  </button>
</div>
