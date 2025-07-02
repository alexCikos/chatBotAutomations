<script lang="ts">
  const { onSend } = $props<{ onSend: (message: string) => void }>();

  let input = $state('');
  let textareaEl: HTMLTextAreaElement;

  function resize() {
    textareaEl.style.height = 'auto';
    textareaEl.style.height = textareaEl.scrollHeight + 'px';
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  function send() {
    const trimmed = input.trim();
    if (trimmed) {
      onSend(trimmed); // 🔁 Use the callback instead of dispatch
      input = '';
      resize();
    }
  }
</script>

<div class="flex items-center gap-4">
  <textarea
    class="border-8 border-black px-4 py-3 w-full font-plex focus:outline-none resize-none leading-none align-middle min-h-[48px]"
    bind:value={input}
    bind:this={textareaEl}
    oninput={resize}
    onkeydown={handleKeydown}
    rows="1"
    placeholder="TYPE HERE"
  ></textarea>
  <button
    class="bg-black text-white font-bold uppercase px-6 py-3 border-8 border-black hover:bg-white hover:text-black"
    onclick={send}
  >
    SEND
  </button>
</div>
