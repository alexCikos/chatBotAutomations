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

  function getStatusPillStyles() {
    return "relative flex items-center justify-center bg-gradient-to-br from-gray-950/90 to-gray-800/90 border border-blue-500/30 rounded-[20px] py-2 px-3 backdrop-blur-[10px] shadow-[0_4px_12px_rgba(59,130,246,0.15),0_0_20px_rgba(59,130,246,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] font-mono max-w-full min-w-0 transition-all duration-200 cubic-bezier(0.16,1,0.3,1) hover:border-blue-500/40 hover:shadow-[0_4px_16px_rgba(59,130,246,0.2),0_0_24px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] focus:outline-none focus:border-blue-500/50 focus:shadow-[0_4px_16px_rgba(59,130,246,0.25),0_0_0_2px_rgba(59,130,246,0.2)] max-sm:py-1.5 max-sm:px-2 max-sm:rounded-2xl max-[480px]:py-1 max-[480px]:px-1.5 max-[480px]:rounded-[14px]";
  }

  function getTooltipStyles() {
    return "absolute bottom-[calc(100%+8px)] left-0 right-0 bg-black/90 text-white py-2 px-3 rounded-lg text-xs leading-[1.4] backdrop-blur-[10px] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-[25] after:content-[''] after:absolute after:top-full after:left-4 after:w-0 after:h-0 after:border-l-[4px] after:border-l-transparent after:border-r-[4px] after:border-r-transparent after:border-t-[4px] after:border-t-black/90 max-[480px]:text-[0.7rem] max-[480px]:py-1.5 max-[480px]:px-2";
  }
</script>

{#if selectedTool}
  <div class="absolute top-0 left-0 right-0 flex justify-center p-6 px-6 z-20 max-sm:p-3 max-sm:px-4 max-[480px]:p-2 max-[480px]:px-3">
    <div
      class="{getStatusPillStyles()}"
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
      role="button"
      tabindex="0"
    >
      <div class="flex items-center flex-1 min-w-0">
        <div class="flex flex-col gap-0.5 flex-1 min-w-0">
          <div class="text-sm font-semibold text-slate-200 leading-[1.2] overflow-hidden text-ellipsis whitespace-nowrap max-sm:text-[0.8rem] max-[480px]:text-xs">{selectedTool.toolName}</div>
          <div class="text-xs text-slate-400 leading-[1.3] overflow-hidden text-ellipsis line-clamp-1 max-sm:hidden">
            {selectedTool.toolDescription}
          </div>
        </div>
      </div>

      <!-- Mobile Tooltip -->
      {#if showTooltip}
        <div class="{getTooltipStyles()} sm:hidden">
          {selectedTool.toolDescription}
        </div>
      {/if}
    </div>
  </div>
{/if}

