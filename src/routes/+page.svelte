<script lang="ts">
  import { writable, derived } from "svelte/store";
  import { goto } from "$app/navigation";
  import Fuse from "fuse.js";

  const input = writable("");

  const commands = [
    {
      label: "New Chat",
      match: ["new chat", "start chat"],
      action: () => goto("/chat/create"),
    },
    {
      label: "Dashboard",
      match: ["dashboard"],
      action: () => goto("/dashboard"),
    },
    {
      label: "Search Chats",
      match: ["search chats"],
      action: () => goto("/history"),
    },
  ];

  // Setup Fuse
  const fuse = new Fuse(commands, {
    keys: ["match"],
    threshold: 0.3, // 0 = exact match, 1 = everything matches
  });

  const suggestions = derived(input, ($input) => {
    const term = $input.trim();
    if (!term) return [];

    return fuse.search(term).map((result) => result.item);
  });

  function handleEnter(suggestions: { action: () => void }[]) {
    if (suggestions.length > 0) {
      suggestions[0].action();
    }
  }
</script>

<div
  class="flex items-center justify-center h-screen bg-black text-white px-4 font-mono"
>
  <div class="max-w-xl w-full text-center space-y-8">
    <h1
      class="text-4xl md:text-5xl font-mono font-bold uppercase tracking-wide"
    >
      Speak. Search. Solve.
    </h1>

    <div class="relative">
      <input
        bind:value={$input}
        onkeydown={(e) => e.key === "Enter" && handleEnter($suggestions)}
        placeholder="What would you like to do?"
        class="w-full px-6 py-4 bg-neutral-900 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-lg placeholder:text-neutral-400 transition duration-150"
      />

      {#if $suggestions.length > 0}
        <ul
          class="absolute w-full mt-2 bg-neutral-800 border border-neutral-700 rounded-lg text-left z-10"
        >
          {#each $suggestions as cmd}
            <li>
              <button
                type="button"
                class="w-full text-left px-4 py-2 hover:bg-neutral-700 cursor-pointer bg-transparent text-white"
                onclick={() => cmd.action()}
              >
                {cmd.label}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
