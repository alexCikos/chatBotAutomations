<script lang="ts">
  import { page } from "$app/state";
  import Icon from "@iconify/svelte";
  import { sidebarStore } from "$lib/stores/sidebarStore";

  interface Props {
    businessName: string;
    logoUrl?: string;
  }

  let { businessName }: Props = $props();
  let logoUrl: string = "/logo.png"; // fallback

  function toggleSidebar() {
    sidebarStore.toggle();
  }

  function logout() {
    // Azure App Service logout URL
    window.location.href = "/.auth/logout";
  }
</script>

<nav class="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-950/80 border-b border-white/10 backdrop-blur-[20px] font-mono">
  <!-- Background Elements -->
  <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50"></div>

  <!-- Content -->
  <div class="relative z-[1] h-full w-full flex items-center justify-between px-8 max-md:px-4">
    <!-- Left: Mobile Menu Button and Logo -->
    <div class="flex items-center gap-4">
      {#if page.route.id !== "/"}
        <button
          class="p-2 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer transition-all duration-200 hidden items-center justify-center hover:bg-white/20 hover:border-white/30 max-md:flex"
          onclick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Icon icon="lucide:menu" class="w-5 h-5" />
        </button>
      {/if}
      <a href="/" class="">
        <img src={logoUrl} alt="Logo" class="w-[90px] h-[90px]" />
      </a>
    </div>

    <!-- Right: Welcome, Avatar, and Logout -->
    <div class="flex items-center gap-4 max-md:gap-2">
      <span class="text-sm text-slate-400 font-medium max-md:hidden">Welcome, {businessName}</span>
      <img src={logoUrl} alt="Business Avatar" class="w-9 h-9 rounded-full object-cover border-2 border-white/20 transition-all duration-300 cursor-pointer hover:border-white/40 hover:scale-105" />
      <button class="p-2 bg-white/10 border border-white/20 rounded-lg text-slate-400 cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-500 max-md:p-1.5" onclick={logout} aria-label="Logout">
        <Icon icon="lucide:log-out" class="w-4 h-4" />
      </button>
    </div>
  </div>
</nav>

