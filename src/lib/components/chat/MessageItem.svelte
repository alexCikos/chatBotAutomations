<script lang="ts">
  import type { Message } from '$lib/stores/messages';

  // Message data passed from the parent component
  export let message: Message;

  // Check if the sender is the user or the assistant
  const isUser = message.role === 'user';

  // Format timestamp for display
  function timeLabel(date: string) {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<!-- Wrapper aligns left or right depending on the sender -->
<div class="flex my-2" class:justify-end={isUser} class:justify-start={!isUser}>
  <div class="max-w-[75%] flex flex-col" class:items-end={isUser} class:items-start={!isUser}>
    <!-- Bubble showing the message content -->
    <div
      class="px-4 py-2 rounded-xl border border-white/10 backdrop-blur-lg break-words"
      class:bg-slate-800={isUser}
      class:text-white={isUser}
      class:bg-yellow-400={!isUser}
      class:text-black={!isUser}
    >
      {message.content}
    </div>
    <!-- Optional time label -->
    <span class="mt-1 text-xs text-white/40">{timeLabel(message.createdAt)}</span>
  </div>
</div>
