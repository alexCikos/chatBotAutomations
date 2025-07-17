<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import type { Chat } from "$lib/types";
  import Icon from "@iconify/svelte";

  const { filteredChats, searchTerm } = sideBarChatsStore;
  let inputFocused = $state(false);
  let mounted = $state(false);

  function handleEnter(chats: Chat[]) {
    if (chats.length > 0) {
      goto(`/chat/${chats[0].id}`);
    }
  }

  onMount(() => {
    mounted = true;
  });
</script>

<div class="relative min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-8 font-mono overflow-x-hidden max-md:p-4">
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.1)_0%,transparent_50%)]"></div>

  <!-- Main Content -->
  <div class="relative z-[1] max-w-[900px] w-full transition-all duration-[600ms] ease-out {mounted ? 'opacity-100' : 'opacity-0'}">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <div class="flex items-center justify-center w-15 h-15 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl text-white mx-auto mb-4 shadow-[0_8px_32px_rgba(139,92,246,0.3)]">
        <Icon icon="lucide:search" class="w-8 h-8" />
      </div>
      <h1 class="text-[clamp(2rem,4vw,3rem)] font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent m-0 mb-2 tracking-[-0.02em]">Search your chats</h1>
      <p class="text-lg text-slate-400 m-0">Find your previous conversations</p>
    </div>

    <!-- Search Section -->
    <div class="mb-8 max-md:mb-2 max-[480px]:mb-3">
      <div class="relative flex items-center bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-6 transition-all duration-300 backdrop-blur-md {inputFocused ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_32px_rgba(139,92,246,0.2)]' : ''} max-md:py-3.5 max-md:px-4">
        <Icon icon="lucide:search" class="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Type to search your chats..."
          onfocus={() => (inputFocused = true)}
          onblur={() => (inputFocused = false)}
          onkeydown={(e) => e.key === "Enter" && handleEnter($filteredChats)}
          bind:value={$searchTerm}
          class="flex-1 bg-transparent border-none outline-none text-lg text-white font-inherit placeholder:text-slate-600"
        />
        {#if $searchTerm}
          <button
            class="bg-white/10 border-none rounded-lg p-1.5 text-slate-400 cursor-pointer transition-all duration-200 ml-2 hover:bg-white/20 hover:text-white"
            onclick={() => ($searchTerm = "")}
            aria-label="Clear search"
          >
            <Icon icon="lucide:x" class="w-4 h-4" />
          </button>
        {/if}
      </div>
    </div>

    <!-- Results Section -->
    {#if $searchTerm.trim() !== ""}
      <div class="">
        {#if $filteredChats.length > 0}
          <div class="mb-4">
            <span class="text-slate-400 text-sm font-medium"
              >{$filteredChats.length} chat{$filteredChats.length !== 1
                ? "s"
                : ""} found</span
            >
          </div>
          <div class="grid gap-3">
            {#each $filteredChats as chat}
              <a
                class="flex items-center p-4 bg-white/5 border border-white/10 rounded-xl no-underline text-white transition-all duration-300 backdrop-blur-md hover:bg-purple-500/10 hover:border-purple-500/30 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(139,92,246,0.2)] group"
                href={"/chat/" + chat.id}
                title={chat.title}
              >
                <div class="text-purple-500 mr-4 flex-shrink-0">
                  <Icon icon="lucide:message-circle" class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <div class="font-medium mb-1 text-white">{chat.title}</div>
                  {#if chat.description}
                    <div class="text-sm text-slate-300 mb-1 leading-[1.4] line-clamp-2">{chat.description}</div>
                  {/if}
                  <div class="text-sm text-slate-400">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div class="text-slate-600 ml-4 transition-all duration-200 group-hover:text-purple-500 group-hover:translate-x-1">
                  <Icon icon="lucide:arrow-right" class="w-4 h-4" />
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <div class="text-center py-12 px-4">
            <div class="text-slate-600 mb-4">
              <Icon icon="lucide:search-x" class="w-12 h-12" />
            </div>
            <h3 class="text-2xl font-semibold text-white m-0 mb-2">No chats found</h3>
            <p class="text-slate-400 m-0">
              Try adjusting your search terms or browse all chats.
            </p>
          </div>
        {/if}
      </div>
    {:else}
      <div class="text-center py-8 max-md:py-0 max-md:pb-8">
        <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mt-8 max-md:grid-cols-1">
          <div class="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm text-center backdrop-blur-md">
            <Icon icon="lucide:type" class="w-5 h-5 text-blue-400" />
            <span>Type keywords from your conversations</span>
          </div>
          <div class="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm text-center backdrop-blur-md">
            <Icon icon="lucide:calendar" class="w-5 h-5 text-green-400" />
            <span>Search by chat titles or topics</span>
          </div>
          <div class="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm text-center backdrop-blur-md">
            <Icon icon="lucide:zap" class="w-5 h-5 text-purple-400" />
            <span>Find specific discussions quickly</span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

