<script lang="ts">
  import { goto } from "$app/navigation";
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
</script>

<nav class="navbar">
  <!-- Background Elements -->
  <div class="navbar-background"></div>

  <!-- Content -->
  <div class="navbar-content">
    <!-- Left: Mobile Menu Button and Logo -->
    <div class="navbar-left">
      <button
        class="mobile-menu-btn"
        onclick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Icon icon="lucide:menu" class="w-5 h-5" />
      </button>
      <a href="/" class="navbar-brand">
        <img src={logoUrl} alt="Logo" class="brand-logo" />
      </a>
    </div>

    <!-- Right: Welcome and Avatar -->
    <div class="navbar-user">
      <span class="welcome-text">Welcome, {businessName}</span>
      <img src={logoUrl} alt="Business Avatar" class="user-avatar-img" />
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    height: 64px;
    background: rgba(15, 15, 15, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    font-family: var(--font-mono);
  }

  .navbar-background {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.1) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
    opacity: 0.5;
  }

  .navbar-content {
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-menu-btn {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: none; /* Hidden by default */
    align-items: center;
    justify-content: center;
  }

  .mobile-menu-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .brand-logo {
    width: 90px;
    height: 90px;
  }

  .navbar-user {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .welcome-text {
    font-size: 0.875rem;
    color: #94a3b8;
    font-weight: 500;
  }

  .user-avatar-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .user-avatar-img:hover {
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .navbar-content {
      padding: 0 1rem;
    }

    .mobile-menu-btn {
      display: flex; /* Show on mobile */
    }

    .welcome-text {
      display: none;
    }

    .navbar-user {
      gap: 0.5rem;
    }
  }

  /* Ensure content doesn't overlap navbar */
  :global(body) {
    padding-top: 64px;
  }
</style>
