<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { goto } from "$app/navigation";
  import type { Chat } from "$lib/types";

  const { filteredChats, searchTerm } = sideBarChatsStore;

  function handleEnter(chats: Chat[]) {
    if (chats.length > 0) {
      goto(`/chat/${chats[0].id}`);
    }
  }
</script>

<div class="w-full bg-black text-white flex items-center justify-center py-10">
  <div class="flex flex-col items-center space-y-6 w-4/5 max-w-2xl">
    <h1 class="text-2xl md:text-3xl font-medium">Search your chats</h1>

    <div
      class="bg-[#40414F] rounded-xl px-4 py-3 flex items-center gap-3 w-full"
    >
      <input
        type="text"
        placeholder="Find your chats..."
        onkeydown={(e) => e.key === "Enter" && handleEnter($filteredChats)}
        bind:value={$searchTerm}
        class="bg-transparent text-white placeholder-gray-400 outline-none text-base w-full"
      />
    </div>

    {#if $searchTerm.trim() !== ""}
      <ul class="w-full space-y-2">
        {#each $filteredChats as chat}
          <a
            class="w-full bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 cursor-pointer block"
            href={"/chat/" + chat.id}
            title={chat.title}
          >
            {chat.title}
          </a>
        {/each}

        {#if $filteredChats.length === 0}
          <li class="text-gray-400 text-sm mt-4 text-center">
            No chats found.
          </li>
        {/if}
      </ul>
    {/if}
  </div>
</div>
