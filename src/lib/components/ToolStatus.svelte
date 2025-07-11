<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { Tool } from "$lib/types";

  interface Props {
    selectedTool: Tool | null;
    onClear: () => void;
  }

  let { selectedTool, onClear }: Props = $props();
</script>

{#if selectedTool}
  <div class="tool-status">
    <div class="tool-status-content">
      <div class="tool-status-icon">
        <Icon icon="lucide:tool" class="w-4 h-4" />
      </div>
      <div class="tool-status-info">
        <span class="tool-status-name">{selectedTool.toolName}</span>
        <span class="tool-status-description">{selectedTool.toolDescription}</span>
      </div>
    </div>
    <button
      type="button"
      class="tool-status-clear"
      onclick={onClear}
      title="Clear tool selection"
    >
      <Icon icon="lucide:x" class="w-3 h-3" />
    </button>
  </div>
{/if}

<style>
  .tool-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 800px;
    margin: 0.75rem auto 0;
    padding: 0.75rem 1rem;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    animation: slideIn 0.2s ease-out;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .tool-status-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .tool-status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(59, 130, 246, 0.2);
    border-radius: 8px;
    color: #3b82f6;
    flex-shrink: 0;
  }

  .tool-status-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  .tool-status-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #93c5fd;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tool-status-description {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }

  .tool-status-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: #9ca3af;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .tool-status-clear:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
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

  /* Responsive Design */
  @media (max-width: 768px) {
    .tool-status {
      margin: 0.5rem auto 0;
      padding: 0.625rem 0.875rem;
    }

    .tool-status-name {
      font-size: 0.8rem;
    }

    .tool-status-description {
      font-size: 0.7rem;
    }

    .tool-status-icon {
      width: 28px;
      height: 28px;
    }
  }
</style>