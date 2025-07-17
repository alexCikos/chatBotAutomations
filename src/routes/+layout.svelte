<script>
  let { children, data } = $props();
  import "../app.css";
  import { userStore } from "$lib/stores/userStore";
  import NavBar from "$lib/components/NavBar.svelte";
  import ToastContainer from "$lib/components/ToastContainer.svelte";
  import { page } from "$app/state";

  // Debug: Log the data received from server
  console.log('=== Client Layout Data ===');
  console.log('Full data object:', data);
  console.log('User data:', data.user);
  
  // Set user from server data or fallback to hardcoded for development
  if (data.user) {
    console.log('Using authenticated user:', data.user);
    userStore.set(data.user);
  } else {
    console.log('Using fallback user for development');
    // Fallback for local development
    userStore.set({
      id: "P-IDXSUYLJG5bIfblad94fBltiGayJDvvu585JMZDDg",
      name: "alex cikos",
      createdAt: "2025-07-17T12:18:32.035Z",
    });
  }

  const userName = $userStore?.name || "User";
  const isLoginPage = $derived(page.route.id === "/login");
</script>


{#if !isLoginPage}
  <NavBar businessName={userName} logoUrl="/logo.png" />
{/if}

<!-- Main layout wrapper -->
<main class="h-[100dvh] overflow-hidden {isLoginPage ? '' : 'h-[calc(100dvh-64px)] mt-16'}">
  {@render children()}
</main>

<!-- Toast notifications -->
<ToastContainer />

