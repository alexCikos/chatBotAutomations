<script lang="ts">
  import type { Tool } from "$lib/types";

  interface Props {
    selectedTool: Tool | null;
    onClear: () => void;
  }

  let { selectedTool, onClear }: Props = $props();
  let showTooltip = $state(false);
  let tooltipTimeout: ReturnType<typeof setTimeout>;

  function handleMouseEnter() {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
      showTooltip = true;
    }, 500);
  }

  function handleMouseLeave() {
    clearTimeout(tooltipTimeout);
    showTooltip = false;
  }
</script>

{#if selectedTool}
  <div class="tool-status-container">
    <div
      class="tool-status-pill"
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
      role="button"
      tabindex="0"
    >
      <div class="tool-status-content">
        <div class="tool-status-text">
          <div class="tool-status-name">{selectedTool.toolName}</div>
          <div class="tool-status-description desktop-only">
            {selectedTool.toolDescription}
          </div>
        </div>
      </div>

      <!-- Mobile Tooltip -->
      {#if showTooltip}
        <div class="tool-tooltip mobile-only">
          {selectedTool.toolDescription}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .tool-status-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 1rem 1.5rem;
    z-index: 20;
  }

  .tool-status-pill {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      rgba(15, 15, 15, 0.9) 0%,
      rgba(26, 26, 26, 0.9) 100%
    );
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 20px;
    padding: 0.5rem 0.75rem;
    backdrop-filter: blur(10px);
    box-shadow:
      0 4px 12px rgba(59, 130, 246, 0.15),
      0 0 20px rgba(59, 130, 246, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: slideInFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco,
      Consolas, "Liberation Mono", "Courier New", monospace;
    max-width: 100%;
    min-width: 0;
  }

  .tool-status-content {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .tool-status-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    flex: 1;
    min-width: 0;
  }

  .tool-status-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #e2e8f0;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tool-status-description {
    font-size: 0.75rem;
    color: #94a3b8;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-clamp: 1;
  }

  .tool-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    line-height: 1.4;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 25;
    animation: tooltipFade 0.2s ease-out;
  }

  .tool-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 1rem;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(0, 0, 0, 0.9);
  }

  @keyframes slideInFade {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes tooltipFade {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive breakpoints */
  .desktop-only {
    display: block;
  }

  .mobile-only {
    display: none;
  }

  @media (max-width: 640px) {
    .tool-status-container {
      padding: 0.75rem 1rem;
    }

    .tool-status-pill {
      padding: 0.375rem 0.5rem;
      border-radius: 16px;
    }

    .tool-status-name {
      font-size: 0.8rem;
    }

    .desktop-only {
      display: none;
    }

    .mobile-only {
      display: block;
    }
  }

  @media (max-width: 480px) {
    .tool-status-container {
      padding: 0.5rem 0.75rem;
    }

    .tool-status-pill {
      padding: 0.25rem 0.375rem;
      border-radius: 14px;
    }

    .tool-status-name {
      font-size: 0.75rem;
    }

    .tool-tooltip {
      font-size: 0.7rem;
      padding: 0.375rem 0.5rem;
    }
  }

  /* Hover effects for the pill */
  .tool-status-pill:hover {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow:
      0 4px 16px rgba(59, 130, 246, 0.2),
      0 0 24px rgba(59, 130, 246, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  /* Smooth transitions */
  .tool-status-pill {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Focus styles for accessibility */
  .tool-status-pill:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow:
      0 4px 16px rgba(59, 130, 246, 0.25),
      0 0 0 2px rgba(59, 130, 246, 0.2);
  }
</style>
