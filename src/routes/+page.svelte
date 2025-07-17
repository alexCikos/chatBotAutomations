<script lang="ts">
  import { writable, derived } from "svelte/store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Fuse from "fuse.js";
  import Icon from "@iconify/svelte";
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { userStore } from "$lib/stores/userStore";

  const input = writable("");
  let inputFocused = $state(false);
  let mounted = $state(false);

  // Helper functions for complex class combinations
  function getSearchWrapperStyles(focused: boolean) {
    const baseStyles = "relative flex items-center bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-6 transition-all duration-300 backdrop-blur-[10px] max-md:py-3.5 max-md:px-4";
    const focusedStyles = "border-blue-500 bg-blue-500/10 shadow-[0_0_32px_rgba(59,130,246,0.2)]";
    return focused ? `${baseStyles} ${focusedStyles}` : baseStyles;
  }

  function getSuggestionItemStyles(type: string) {
    const baseStyles = "flex items-center w-full py-3 px-4 bg-transparent border-none text-white cursor-pointer transition-all duration-200 text-left hover:bg-blue-500/10";
    const chatStyles = "border-l-[3px] border-l-purple-500/30 hover:border-l-purple-500/60 hover:bg-purple-500/10";
    const commandStyles = "border-l-[3px] border-l-blue-500/30 hover:border-l-blue-500/60";
    
    if (type === 'chat') {
      return `${baseStyles} ${chatStyles}`;
    } else {
      return `${baseStyles} ${commandStyles}`;
    }
  }

  function getActionCardStyles(isPrimary: boolean) {
    const baseStyles = "flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]";
    const primaryStyles = "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30";
    
    return isPrimary ? `${baseStyles} ${primaryStyles}` : baseStyles;
  }

  const { chats, loadChats } = sideBarChatsStore;
  const userId = $userStore?.id;

  const commands = [
    {
      label: "New Chat",
      description: "Start a fresh conversation",
      icon: "lucide:plus",
      match: ["new chat", "start chat", "create", "new"],
      action: () => goto("/chat/create"),
      shortcut: "⌘N",
    },
    {
      label: "Search Chats",
      description: "Find your previous conversations",
      icon: "lucide:search",
      match: ["search chats", "find", "history", "search"],
      action: () => goto("/history"),
      shortcut: "⌘F",
    },
  ];

  // Quick action buttons
  const quickActions = [
    {
      label: "New Chat",
      icon: "lucide:plus",
      action: () => goto("/chat/create"),
      primary: true,
    },
    {
      label: "Browse History",
      icon: "lucide:history",
      action: () => goto("/history"),
      primary: false,
    },
  ];

  // Setup Fuse for commands
  const commandFuse = new Fuse(commands, {
    keys: ["match"],
    threshold: 0.3,
  });

  // Setup Fuse for chats
  const chatFuse = derived(chats, ($chats) => {
    return new Fuse($chats, {
      keys: ["title", "description"],
      threshold: 0.3,
    });
  });

  const suggestions = derived([input, chatFuse], ([$input, $chatFuse]) => {
    const term = $input.trim();
    if (!term) return [];

    // Search commands
    const commandResults = commandFuse.search(term).map((result) => ({
      ...result.item,
      type: "command",
    }));

    // Search chats
    const chatResults = $chatFuse.search(term).map((result) => ({
      ...result.item,
      type: "chat",
      label: result.item.title,
      description:
        result.item.description ||
        `Created ${new Date(result.item.createdAt).toLocaleDateString()}`,
      icon: "lucide:message-circle",
      action: () => goto(`/chat/${result.item.id}`),
    }));

    // Combine and limit results
    return [...commandResults, ...chatResults].slice(0, 6);
  });

  function handleEnter(suggestions: { action: () => void }[]) {
    if (suggestions.length > 0) {
      suggestions[0].action();
    }
  }

  // Load chats and keyboard shortcuts
  onMount(() => {
    mounted = true;

    // Load chats if user is available
    if (userId) {
      loadChats(userId);
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "n") {
          e.preventDefault();
          goto("/chat/create");
        } else if (e.key === "f") {
          e.preventDefault();
          goto("/history");
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  });
</script>

<div class="relative min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 flex items-center justify-center p-8 font-mono overflow-hidden max-md:p-4">
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>

  <!-- Main Content -->
  <div class="relative z-[1] max-w-[800px] w-full transition-all duration-[600ms] ease-out {mounted ? 'opacity-100' : 'opacity-0'} max-md:max-w-full">
    <!-- Header Section -->
    <div class="text-center mb-12">
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-[20px] text-white shadow-[0_8px_32px_rgba(59,130,246,0.3)]">
          <Icon icon="lucide:message-circle" class="w-12 h-12" />
        </div>
        <h1 class="text-[clamp(2.5rem,5vw,4rem)] font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent m-0 tracking-[-0.02em] max-md:text-3xl max-[480px]:text-2xl">Speak. Search. Solve.</h1>
        <p class="text-xl text-slate-400 m-0 font-normal max-md:text-lg max-[480px]:text-base max-md:px-4">Your intelligent conversation companion</p>
      </div>
    </div>

    <!-- Search Section -->
    <div class="mb-12">
      <div class="relative max-w-[600px] mx-auto">
        <div class="{getSearchWrapperStyles(inputFocused)}">
          <input
            bind:value={$input}
            onfocus={() => (inputFocused = true)}
            onblur={() => (inputFocused = false)}
            onkeydown={(e) => e.key === "Enter" && handleEnter($suggestions)}
            placeholder="What would you like to do?"
            class="flex-1 bg-transparent border-none outline-none text-lg text-white font-inherit placeholder:text-slate-600"
          />

          <Icon icon="lucide:search" class="text-slate-400" />
        </div>

        <!-- Search Suggestions -->
        {#if $suggestions.length > 0}
          <div class="absolute bottom-[calc(100%+8px)] left-0 right-0 bg-gray-800/95 border border-white/10 rounded-xl mb-2 overflow-hidden backdrop-blur-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {#each $suggestions as item}
              <button
                type="button"
                class="{getSuggestionItemStyles(item.type)}"
                onclick={() => item.action()}
              >
                <div class="mr-3 text-blue-500">
                  <Icon icon={item.icon} class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <div class="font-medium mb-0.5">{item.label}</div>
                  <div class="text-sm text-slate-400">{item.description}</div>
                </div>
                {#if "shortcut" in item && item.shortcut}
                  <div class="text-xs text-slate-600 bg-white/5 py-0.5 px-1.5 rounded">{item.shortcut}</div>
                {:else if item.type === "chat"}
                  <div class="text-slate-600 transition-all duration-200 group-hover:text-purple-500 group-hover:translate-x-0.5">
                    <Icon icon="lucide:arrow-right" class="w-4 h-4" />
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-12 max-md:pb-8">
      <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-w-[500px] mx-auto max-md:grid-cols-1">
        {#each quickActions as action}
          <button
            class="{getActionCardStyles(action.primary)}"
            onclick={action.action}
          >
            <div class="text-white">
              <Icon icon={action.icon} class="w-6 h-6" />
            </div>
            <span class="text-white font-medium text-sm">{action.label}</span>
          </button>
        {/each}
      </div>
    </div>

  </div>
</div>

