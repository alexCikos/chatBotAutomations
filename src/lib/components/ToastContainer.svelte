<script lang="ts">
  import { toastStore, type Toast } from "$lib/stores/toastStore";
  import Icon from "@iconify/svelte";

  let toasts: Toast[] = $state([]); 
  
  // Use $effect to subscribe to the store
  $effect(() => {
    const unsubscribe = toastStore.subscribe((value) => {
      toasts = value;
    });
    return unsubscribe;
  });

  function getIcon(type: string) {
    switch (type) {
      case 'success':
        return 'lucide:check-circle';
      case 'error':
        return 'lucide:x-circle';
      case 'warning':
        return 'lucide:alert-triangle';
      case 'info':
      default:
        return 'lucide:info';
    }
  }

  function handleClose(id: string) {
    toastStore.remove(id);
  }
</script>

<div class="toast-container">
  {#each toasts as toast (toast.id)}
    <div class="toast toast-{toast.type}" role="alert" aria-live="polite">
      <div class="toast-icon">
        <Icon icon={getIcon(toast.type)} class="w-5 h-5" />
      </div>
      
      <div class="toast-content">
        <p class="toast-message">{toast.message}</p>
      </div>
      
      <button
        class="toast-close"
        onclick={() => handleClose(toast.id)}
        aria-label="Close notification"
      >
        <Icon icon="lucide:x" class="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 400px;
    width: 100%;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 12px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 25px -5px rgba(0, 0, 0, 0.3),
      0 4px 6px -2px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
    position: relative;
    overflow: hidden;
  }

  .toast::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--toast-accent);
  }

  .toast-success {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
    --toast-accent: #10b981;
  }

  .toast-error {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
    --toast-accent: #ef4444;
  }

  .toast-warning {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
    --toast-accent: #f59e0b;
  }

  .toast-info {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
    --toast-accent: #3b82f6;
  }

  .toast-icon {
    flex-shrink: 0;
    color: var(--toast-accent);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-content {
    flex: 1;
    min-width: 0;
  }

  .toast-message {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    line-height: 1.4;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .toast-close:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .toast-close:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .toast-container {
      bottom: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
      max-width: none;
    }

    .toast {
      padding: 0.875rem;
      border-radius: 10px;
    }

    .toast-message {
      font-size: 0.8rem;
    }
  }

  /* Smooth exit animation */
  :global(.toast-exit) {
    animation: slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  /* Stacking effect */
  .toast:nth-child(1) {
    z-index: 10;
  }

  .toast:nth-child(2) {
    z-index: 9;
    transform: translateY(-2px) scale(0.98);
  }

  .toast:nth-child(3) {
    z-index: 8;
    transform: translateY(-4px) scale(0.96);
  }

  .toast:nth-child(n+4) {
    z-index: 7;
    transform: translateY(-6px) scale(0.94);
    opacity: 0.8;
  }
</style>