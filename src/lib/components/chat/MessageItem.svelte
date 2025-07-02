<script lang="ts">
  import type { Message } from '$lib/stores/messages';

  // Message data passed from the parent component
  export let message: Message;

  // Check if the sender is the user or the assistant
  const isUser = message.role === 'user';

  // Format timestamp for display
  function timeLabel(date: string) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
</script>

<!-- Wrapper aligns left or right depending on the sender -->
<div class="flex my-2" class:justify-end={isUser} class:justify-start={!isUser}>
  <div class="flex items-end" class:flex-row-reverse={isUser}>
    <!-- Bubble -->
    <div
      class="px-4 py-2 rounded-full max-w-[80%] break-words text-sm sm:text-base shadow"
      class:bg-neutral-800={isUser}
      class:text-neutral-50={isUser}
      class:bg-warning-200={!isUser}
      class:text-neutral-900={!isUser}
    >
      {message.content}
    </div>
    <!-- Timestamp -->
    <span class="px-2 text-xs text-neutral-500">{timeLabel(message.createdAt)}</span>
  </div>
</div>
