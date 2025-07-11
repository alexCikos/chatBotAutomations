<script lang="ts">
  import ChatSideBar from "$lib/components/ChatSideBar.svelte";
  import ChatInterface from "$lib/components/ChatInterface.svelte";
</script>

<div class="content-layout">
  <ChatSideBar />
  <div class="chat-content">
    <ChatInterface />
  </div>
</div>

<style>
  .content-layout {
    display: flex;
    height: 100%;
  }

  .chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .content-layout {
      position: relative;
      overflow: hidden;
    }
    
    .chat-content {
      width: 100%;
      height: 100%;
    }
  }
</style>
