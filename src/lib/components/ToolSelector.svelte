<script lang="ts">
  import { toolsStore } from "$lib/stores/toolsStore";
  import { userStore } from "$lib/stores/userStore";
  import Icon from "@iconify/svelte";
  import type { Tool } from "$lib/types";

  interface Props {
    onToolSelect: (tool: Tool | null) => void;
    selectedTool: Tool | null;
  }

  let { onToolSelect, selectedTool }: Props = $props();

  let isOpen = $state(false);
  let dropdownRef: HTMLDivElement;

  const userId = $userStore?.id;
  const { tools, loading, error } = toolsStore;

  // Load tools when component mounts
  $effect(() => {
    if (userId) {
      toolsStore.loadUserTools(userId);
    }
  });

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function selectTool(tool: Tool | null) {
    onToolSelect(tool);
    isOpen = false;
  }

  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  // Close dropdown when clicking outside
  $effect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  });

  function getToolButtonStyles(hasSelectedTool: boolean) {
    const baseStyles = "relative flex items-center justify-center w-10 h-10 bg-white/10 border border-white/20 rounded-[10px] text-slate-400 cursor-pointer transition-all duration-200 backdrop-blur-md";
    const activeStyles = "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-500";
    const hoverStyles = "hover:bg-white/20 hover:border-white/30 hover:text-white";
    
    return hasSelectedTool 
      ? `${baseStyles} ${activeStyles}` 
      : `${baseStyles} ${hoverStyles}`;
  }

  function getToolOptionStyles(isSelected: boolean) {
    const baseStyles = "flex items-center w-full py-3 px-4 bg-transparent border-none text-white text-left cursor-pointer transition-all duration-200 font-mono hover:bg-white/5";
    const selectedStyles = "bg-blue-500/10 text-blue-300";
    
    return isSelected 
      ? `${baseStyles} ${selectedStyles}` 
      : baseStyles;
  }
</script>

<div class="relative inline-block" bind:this={dropdownRef}>
  <button
    type="button"
    class="{getToolButtonStyles(selectedTool !== null)}"
    onclick={toggleDropdown}
    title="Select Tool"
  >
    <Icon icon="lucide:wrench" class="w-4 h-4" />
    {#if selectedTool}
      <span class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-gray-950/80"></span>
    {/if}
  </button>

  {#if isOpen}
    <div class="absolute bottom-[calc(100%+8px)] left-0 min-w-[320px] bg-gradient-to-br from-gray-950/95 to-gray-900/95 border border-white/10 rounded-xl backdrop-blur-[20px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_4px_6px_-2px_rgba(0,0,0,0.1)] z-[1000000] max-md:min-w-[280px] max-md:left-4 max-md:right-4 max-md:w-[calc(100vw-2rem)] max-md:max-w-[350px] max-md:mx-auto max-[480px]:min-w-[250px] max-[480px]:left-3 max-[480px]:right-3 max-[480px]:w-[calc(100vw-1.5rem)] max-[480px]:max-w-[300px]">
      <div class="flex items-center gap-2 py-3 px-4 border-b border-white/10 text-white text-sm font-medium font-mono">
        <Icon icon="lucide:wrench" class="w-4 h-4" />
        <span>Select Tool</span>
      </div>

      <div class="max-h-[300px] overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/30">
        <!-- No Tool Option -->
        <button
          type="button"
          class="{getToolOptionStyles(selectedTool === null)}"
          onclick={() => selectTool(null)}
        >
          <div class="p-3 flex-1 min-w-0">
            <div class="text-sm font-medium mb-1 text-white">No Tool</div>
            <div class="text-xs text-gray-400 leading-[1.4] overflow-hidden text-ellipsis line-clamp-2">
              Chat without using any tool
            </div>
          </div>
        </button>

        <!-- Loading State -->
        {#if $loading}
          <div class="flex items-center gap-2 p-4 text-gray-400 text-sm justify-center font-mono">
            <span>Loading tools...</span>
          </div>
        {/if}

        <!-- Error State -->
        {#if $error}
          <div class="flex items-center gap-2 p-4 text-red-500 text-sm justify-center font-mono">
            <span>Error loading tools</span>
          </div>
        {/if}

        <!-- User Tools -->
        {#each $tools as tool}
          <button
            type="button"
            class="{getToolOptionStyles(selectedTool !== null && selectedTool?.toolId === tool.toolId)}"
            onclick={() => selectTool(tool)}
          >
            <div class="p-3 flex-1 min-w-0">
              <div class="text-sm font-medium mb-1 text-white">{tool.toolName}</div>
              <div class="text-xs text-gray-400 leading-[1.4] overflow-hidden text-ellipsis line-clamp-2">{tool.toolDescription}</div>
            </div>
          </button>
        {/each}

        <!-- No Tools Available -->
        {#if !$loading && !$error && $tools.length === 0}
          <div class="flex items-center gap-2 p-4 text-gray-400 text-sm justify-center font-mono">
            <span>No tools available</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>