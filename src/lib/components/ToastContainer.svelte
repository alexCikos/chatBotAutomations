<script lang="ts">
  import { toastStore, type Toast } from "$lib/stores/toastStore";
  import Icon from "@iconify/svelte";

  let toasts: Toast[] = $state([]); 
  
  // Use $effect to subscribe to the store
  $effect(() => {
    const unsubscribe = toastStore.subscribe((value) => {
      toasts = value;
    });
    return unsubscribe;
  });

  function getIcon(type: string) {
    switch (type) {
      case 'success':
        return 'lucide:check-circle';
      case 'error':
        return 'lucide:x-circle';
      case 'warning':
        return 'lucide:alert-triangle';
      case 'info':
      default:
        return 'lucide:info';
    }
  }

  function handleClose(id: string) {
    toastStore.remove(id);
  }

  function getToastStyles(type: string) {
    const baseStyles = "flex items-center gap-3 p-4 rounded-xl backdrop-blur-[20px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_4px_6px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.1)] border border-white/10 pointer-events-auto relative overflow-hidden max-md:p-3.5 max-md:rounded-[10px]";
    
    const typeStyles: Record<string, string> = {
      success: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-emerald-500",
      error: "bg-gradient-to-br from-red-500/10 to-red-600/10 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-red-500",
      warning: "bg-gradient-to-br from-amber-500/10 to-amber-600/10 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-amber-500",
      info: "bg-gradient-to-br from-blue-500/10 to-blue-600/10 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-blue-500"
    };
    
    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  }

  function getStackingStyles(index: number) {
    const stackingStyles: Record<number, string> = {
      0: "z-10",
      1: "z-[9] -translate-y-0.5 scale-[0.98]",
      2: "z-[8] -translate-y-1 scale-[0.96]"
    };
    
    return stackingStyles[index] || "z-[7] -translate-y-1.5 scale-[0.94] opacity-80";
  }

  function getIconStyles(type: string) {
    const iconStyles: Record<string, string> = {
      success: "text-emerald-500",
      error: "text-red-500", 
      warning: "text-amber-500",
      info: "text-blue-500"
    };
    
    return `flex-shrink-0 flex items-center justify-center ${iconStyles[type] || iconStyles.info}`;
  }
</script>

<div class="fixed bottom-4 right-4 z-[10000] flex flex-col gap-3 max-w-[400px] w-full pointer-events-none max-md:bottom-2 max-md:right-2 max-md:left-2 max-md:max-w-none">
  {#each toasts as toast, index (toast.id)}
    <div class="{getToastStyles(toast.type)} {getStackingStyles(index)}" role="alert" aria-live="polite">
      <div class="{getIconStyles(toast.type)}">
        <Icon icon={getIcon(toast.type)} class="w-5 h-5" />
      </div>
      
      <div class="flex-1 min-w-0">
        <p class="m-0 text-sm font-medium text-white leading-[1.4] font-mono max-md:text-xs">{toast.message}</p>
      </div>
      
      <button
        class="flex-shrink-0 bg-none border-none text-white/60 cursor-pointer p-1 rounded-md flex items-center justify-center transition-all duration-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        onclick={() => handleClose(toast.id)}
        aria-label="Close notification"
      >
        <Icon icon="lucide:x" class="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>

