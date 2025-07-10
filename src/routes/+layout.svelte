<script>
  let { children } = $props();
  import "../app.css";
  import { userStore } from "$lib/stores/userStore";
  import NavBar from "$lib/components/NavBar.svelte";

  userStore.set({
    id: "alex-123",
    name: "Alex",
    createdAt: new Date().toISOString(),
  });

  const userName = $userStore?.name || "User";
</script>

<NavBar businessName={userName} logoUrl="/logo.png" />

<!-- Main layout wrapper -->
<main class="main-layout">
  {@render children()}
</main>

<style>
  .main-layout {
    height: calc(100dvh - 4rem);
    overflow: hidden;
  }
</style>
