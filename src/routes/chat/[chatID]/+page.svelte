<script lang="ts">
  import ChatSideBar from "$lib/components/ChatSideBar.svelte";
  import ChatInterface from "$lib/components/ChatInterface.svelte";
</script>

<div class="content-layout">
  <ChatSideBar />
  <div class="flex-1">
    <ChatInterface />
  </div>
</div>
