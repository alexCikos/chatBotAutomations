<script lang="ts">
  // Import the chat interface component
  import Chat from '$lib/components/chat/Chat.svelte';
</script>

<!-- Load IBM Plex Mono font for the brutalist look -->
<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<!-- Brutalist white on black layout -->
<main class="min-h-screen flex flex-col bg-white text-black font-plex">
  <Chat />
</main>
