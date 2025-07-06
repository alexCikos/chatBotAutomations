<script lang="ts">
  import ChatInterface from "./components/ChatInterface.svelte";
  import ChatSideBar from "./components/ChatSideBar.svelte";
</script>

<main class="flex h-[100dvh] w-full overflow-hidden font-mono">
  <ChatSideBar />
  <ChatInterface />
</main>
