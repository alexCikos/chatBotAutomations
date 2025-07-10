<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";

  interface Props {
    businessName: string;
    logoUrl?: string;
  }

  let { businessName }: Props = $props();
  let logoUrl: string = "/logo.png"; // fallback
</script>

<nav class="navbar">
  <!-- Background Elements -->
  <div class="navbar-background"></div>

  <!-- Content -->
  <div class="navbar-content">
    <!-- Left: Logo and Brand -->
    <a href="/" class="navbar-brand">
      <img src={logoUrl} alt="Logo" class="brand-logo" />
    </a>

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
