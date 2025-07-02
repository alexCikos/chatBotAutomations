<script lang="ts">
  import type { Message } from '$lib/stores/messages';

  // Message data passed from the parent component
  const { message } = $props<{ message: Message }>();

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
<div class="flex mb-4" class:justify-end={isUser} class:justify-start={!isUser}>
  <div class="flex flex-col" class:items-end={isUser} class:items-start={!isUser}>
    <!-- Bubble containing the message text -->
    <div
      class="border-8 border-black p-4 max-w-[90%] sm:max-w-[600px] break-words whitespace-pre-wrap"
      class:bg-black={isUser}
      class:text-white={isUser}
      class:bg-white={!isUser}
      class:text-black={!isUser}
    >
      <!-- Actual chat content -->
      <div class="text-base leading-relaxed">{message.content}</div>
    </div>
    <!-- Timestamp below -->
    <span class="text-xs mt-1">{timeLabel(message.createdAt)}</span>
  </div>
</div>
