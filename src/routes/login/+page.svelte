<script lang="ts">
  import { enhance } from "$app/forms";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import type { ActionData } from "./$types";

  interface Props {
    form?: ActionData;
  }

  let { form }: Props = $props();
  let mounted = $state(false);
  let isLoading = $state(false);
  let email = $state(form?.email || "");
  let password = $state("");

  const isFormValid = $derived(email.trim() !== "" && password.trim() !== "");

  onMount(() => {
    mounted = true;
  });
</script>

<div class="login-container">
  <!-- Background Elements -->
  <div class="background-grid"></div>
  <div class="background-gradient"></div>

  <!-- Main Content -->
  <div class="content-wrapper {mounted ? 'animate-in' : 'opacity-0'}">
    <!-- Header Section -->
    <div class="header-section">
      <div class="logo-section">
        <div class="logo-icon">
          <Icon icon="lucide:shield-check" class="w-12 h-12" />
        </div>
        <h1 class="main-title">Welcome Back</h1>
        <p class="subtitle">Sign in to your account</p>
      </div>
    </div>

    <!-- Login Form -->
    <div class="form-section">
      <div class="form-container">
        {#if form?.error}
          <div class="error-message">
            <Icon icon="lucide:alert-circle" class="w-5 h-5" />
            <span>{form.error}</span>
          </div>
        {/if}

        <form
          method="POST"
          use:enhance={() => {
            isLoading = true;
            return async ({ result }) => {
              isLoading = false;
            };
          }}
        >
          <div class="form-group">
            <div class="input-wrapper">
              <Icon icon="lucide:mail" class="input-icon mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                class="form-input"
                placeholder="Email"
                bind:value={email}
                required
              />
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <Icon icon="lucide:lock" class="input-icon mr-2" />
              <input
                type="password"
                id="password"
                name="password"
                class="form-input"
                placeholder="Password"
                bind:value={password}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="submit-btn"
            disabled={isLoading || !isFormValid}
          >
            {#if isLoading}
              <Icon icon="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            {:else}
              <Icon icon="lucide:log-in" class="w-5 h-5" />
              <span>Sign In</span>
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  .login-container {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: var(--font-mono);
    overflow: hidden;
  }

  .background-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.02) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: grid-move 20s linear infinite;
  }

  .background-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    );
  }

  @keyframes grid-move {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 1;
    max-width: 400px;
    width: 100%;
    transition: all 0.6s ease-out;
  }

  .animate-in {
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header-section {
    text-align: center;
    margin-bottom: 3rem;
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 20px;
    color: white;
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .main-title {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff, #94a3b8);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 1.125rem;
    color: #94a3b8;
    margin: 0;
    font-weight: 400;
  }

  .form-section {
    margin-bottom: 2rem;
  }

  .form-container {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .form-input {
    width: 100%;
    padding: 0.875rem 2.75rem 0.875rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    line-height: 1.5;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-input::placeholder {
    color: #64748b;
  }

  .submit-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .login-container {
      padding: 1rem;
    }

    .content-wrapper {
      max-width: 100%;
    }

    .form-container {
      padding: 1.5rem;
    }

    .main-title {
      font-size: 2rem;
    }
  }
</style>
