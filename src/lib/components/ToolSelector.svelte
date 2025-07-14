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
</script>

<div class="tool-selector" bind:this={dropdownRef}>
  <button
    type="button"
    class="tool-btn {selectedTool !== null ? 'active' : ''}"
    onclick={toggleDropdown}
    title="Select Tool"
  >
    <Icon icon="lucide:wrench" class="w-4 h-4" />
    {#if selectedTool}
      <span class="tool-indicator"></span>
    {/if}
  </button>

  {#if isOpen}
    <div class="tool-dropdown">
      <div class="tool-dropdown-header">
        <Icon icon="lucide:wrench" class="w-4 h-4" />
        <span>Select Tool</span>
      </div>

      <div class="tool-list">
        <!-- No Tool Option -->
        <button
          type="button"
          class="tool-option"
          onclick={() => selectTool(null)}
        >
          <div class="tool-option-content">
            <div class="tool-option-name">No Tool</div>
            <div class="tool-option-description">
              Chat without using any tool
            </div>
          </div>
        </button>

        <!-- Loading State -->
        {#if $loading}
          <div class="tool-loading">
            <span>Loading tools...</span>
          </div>
        {/if}

        <!-- Error State -->
        {#if $error}
          <div class="tool-error">
            <span>Error loading tools</span>
          </div>
        {/if}

        <!-- User Tools -->
        {#each $tools as tool}
          <button
            type="button"
            class="tool-option {selectedTool !== null && selectedTool?.toolId === tool.toolId
              ? 'selected'
              : ''}"
            onclick={() => selectTool(tool)}
          >
            <div class="tool-option-content">
              <div class="tool-option-name">{tool.toolName}</div>
              <div class="tool-option-description">{tool.toolDescription}</div>
            </div>
          </button>
        {/each}

        <!-- No Tools Available -->
        {#if !$loading && !$error && $tools.length === 0}
          <div class="tool-empty">
            <span>No tools available</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .tool-selector {
    position: relative;
    display: inline-block;
  }

  .tool-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
  }

  .tool-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .tool-btn.active {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.2),
      rgba(139, 92, 246, 0.2)
    );
    border-color: rgba(59, 130, 246, 0.3);
    color: #3b82f6;
  }

  .tool-indicator {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    border: 2px solid rgba(15, 15, 15, 0.8);
  }

  .tool-dropdown {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    min-width: 320px;
    background: linear-gradient(
      135deg,
      rgba(15, 15, 15, 0.95) 0%,
      rgba(26, 26, 26, 0.95) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(20px);
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.5),
      0 4px 6px -2px rgba(0, 0, 0, 0.1);
    z-index: 1000000;
    animation: slideIn 0.2s ease-out;
  }

  .tool-dropdown-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco,
      Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .tool-list {
    max-height: 300px;
    overflow-y: auto;
    padding: 0.5rem 0;
  }

  .tool-option {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: white;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco,
      Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .tool-option:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .tool-option.selected {
    background: rgba(59, 130, 246, 0.1);
    color: #93c5fd;
  }

  .tool-option-content {
    padding: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .tool-option-name {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: white;
  }

  .tool-option-description {
    font-size: 0.75rem;
    color: #9ca3af;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }

  .tool-loading,
  .tool-error,
  .tool-empty {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    color: #9ca3af;
    font-size: 0.875rem;
    justify-content: center;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco,
      Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .tool-error {
    color: #ef4444;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }


  :global(.animate-spin) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .tool-dropdown {
      min-width: 280px;
      left: 1rem;
      right: 1rem;
      width: calc(100vw - 2rem);
      max-width: 350px;
      margin: 0 auto;
      animation: slideIn 0.2s ease-out;
    }
  }

  @media (max-width: 480px) {
    .tool-dropdown {
      min-width: 250px;
      left: 0.75rem;
      right: 0.75rem;
      width: calc(100vw - 1.5rem);
      max-width: 300px;
      margin: 0 auto;
      animation: slideIn 0.2s ease-out;
    }
  }

  /* Scrollbar styling */
  .tool-list::-webkit-scrollbar {
    width: 6px;
  }

  .tool-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .tool-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  .tool-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
