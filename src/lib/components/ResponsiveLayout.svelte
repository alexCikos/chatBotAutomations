<script lang="ts">
  import { sidebarStore } from "$lib/stores/sidebarStore";
  
  interface Props {
    children: any;
  }
  
  let { children }: Props = $props();
</script>

<div class="layout-container">
  <div 
    class="main-content {$sidebarStore ? 'content-expanded' : 'content-with-sidebar'}"
  >
    {@render children()}
  </div>
</div>

<style>
  .layout-container {
    display: flex;
    height: 100%;
    width: 100%;
  }

  .main-content {
    flex: 1;
    transition: margin-left 0.3s ease-in-out;
    overflow: hidden;
  }

  .content-with-sidebar {
    /* Sidebar takes its own space in flexbox */
    margin-left: 0;
  }

  .content-expanded {
    /* Collapsed sidebar is narrow, no margin adjustment needed */
    margin-left: 0;
  }

  /* Responsive behavior */
  @media (max-width: 768px) {
    .content-with-sidebar {
      margin-left: 0; /* Sidebar becomes overlay on mobile */
    }
  }
</style>