<script lang="ts">
  // Import the chat interface component
  import Chat from '$lib/components/chat/Chat.svelte';
</script>

<!-- Load the Inter font -->
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<!-- Wrap everything in a gradient background -->
<main
  class="font-inter bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0c1425] text-white min-h-screen"
>
  <Chat />
</main>
