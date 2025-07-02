<script lang="ts">
  import type { Message } from '$lib/stores/messages';

  // Each message is displayed in a small card-like container

  // Message data passed from the parent component
  export let message: Message;

  // Determine alignment and colors based on the sender
  const isUser = message.role === 'user';
</script>

<!-- Wrapper aligns left or right depending on the sender -->
<div class="flex my-2" class:justify-end={isUser} class:justify-start={!isUser}>
  <div
    class="rounded-xl p-3 max-w-[80%] break-words text-sm sm:text-base"
    class:bg-primary={isUser}
    class:text-primary-foreground={isUser}
    class:bg-muted={!isUser}
    class:text-muted-foreground={!isUser}
  >
    <!-- Display the message content -->
    {message.content}
  </div>
</div>
