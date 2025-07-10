<script lang="ts">
  import ChatSideBar from "$lib/components/ChatSideBar.svelte";
  import SearchChats from "$lib/components/SearchChats.svelte";
</script>

<main class="content-layout">
  <ChatSideBar />
  <div class="flex-1">
    <SearchChats />
  </div>
</main>
