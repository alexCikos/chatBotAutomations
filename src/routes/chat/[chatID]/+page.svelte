<script lang="ts">
  import ChatSideBar from "$lib/components/ChatSideBar.svelte";
  import ChatInterface from "$lib/components/ChatInterface.svelte";
</script>

<div class="flex h-full max-md:relative max-md:overflow-hidden">
  <ChatSideBar />
  <div class="flex-1 flex flex-col overflow-hidden max-md:w-full max-md:h-full">
    <ChatInterface />
  </div>
</div>

