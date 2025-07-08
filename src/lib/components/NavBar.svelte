<script lang="ts">
  import { goto } from "$app/navigation";
  interface Props {
    businessName: string;
    logoUrl?: string;
  }

  let { businessName }: Props = $props();
  let logoUrl: string = "/logo.png"; // fallback
</script>

<nav
  class="z-50 flex items-center justify-between px-6 py-4 bg-black text-white shadow-md h-16"
>
  <!-- Left: Logo -->
  <a
    href="/"
    class="flex items-center space-x-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white rounded"
  >
    <img src={logoUrl} alt="Logo" class="w-32 h-32" />
  </a>

  <!-- Right: Welcome -->
  <div class="flex items-center space-x-3">
    <span class="text-sm sm:text-base hidden sm:inline"
      >Welcome, {businessName}</span
    >
    <img
      src={logoUrl}
      alt="Business Avatar"
      class="w-8 h-8 rounded-full border-2 border-white"
    />
  </div>
</nav>
