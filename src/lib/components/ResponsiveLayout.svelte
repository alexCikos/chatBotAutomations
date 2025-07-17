<script lang="ts">
  import { sidebarStore } from "$lib/stores/sidebarStore";
  
  interface Props {
    children: any;
  }
  
  let { children }: Props = $props();
</script>

<div class="flex h-full w-full">
  <div 
    class="flex-1 transition-[margin-left] duration-300 ease-in-out overflow-hidden ml-0"
  >
    {@render children()}
  </div>
</div>

