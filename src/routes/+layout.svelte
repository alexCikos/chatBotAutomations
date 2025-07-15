<script>
  let { children, data } = $props();
  import "../app.css";
  import { userStore } from "$lib/stores/userStore";
  import NavBar from "$lib/components/NavBar.svelte";
  import ToastContainer from "$lib/components/ToastContainer.svelte";
  import { page } from "$app/state";

  // Set user from server data or fallback to hardcoded for development
  if (data.user) {
    userStore.set(data.user);
  } else {
    // Fallback for local development
    userStore.set({
      id: "alex-123",
      name: "Alex",
      createdAt: new Date().toISOString(),
    });
  }

  const userName = $userStore?.name || "User";
  const isLoginPage = $derived(page.route.id === "/login");
</script>


{#if !isLoginPage}
  <NavBar businessName={userName} logoUrl="/logo.png" />
{/if}

<!-- Main layout wrapper -->
<main class="main-layout" class:login-page={isLoginPage}>
  {@render children()}
</main>

<!-- Toast notifications -->
<ToastContainer />

<style>
  .main-layout {
    height: 100dvh;
    overflow: hidden;
  }
  
  /* When navbar is present, account for navbar height */
  .main-layout:not(.login-page) {
    height: calc(100dvh - 64px);
    margin-top: 64px;
  }
</style>
