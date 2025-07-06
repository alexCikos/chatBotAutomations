<script>
  let { children } = $props();
  import "../app.css";
  import { userStore } from "$lib/stores/userStore";

  userStore.set({
    id: "alex-123",
    name: "Alex",
    createdAt: new Date().toISOString(),
  });
</script>

{@render children()}
