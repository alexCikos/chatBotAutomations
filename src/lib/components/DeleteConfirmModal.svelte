<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Props {
    onConfirm: () => void;
    onCancel: () => void;
    chatTitle?: string | null;
  }

  let { onConfirm, onCancel, chatTitle }: Props = $props();

  function handleConfirm() {
    onConfirm();
  }

  function handleCancel() {
    onCancel();
  }

  function handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      handleCancel();
    }
  }
</script>

<div
  class="modal-backdrop"
  onclick={handleCancel}
  onkeydown={handleEscape}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div
    class="modal"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
    role="document"
  >
    <div class="modal-content">
      <div class="modal-header">
        <div class="warning-icon">
          <Icon icon="lucide:alert-triangle" class="w-8 h-8" />
        </div>
        <h2 class="modal-title">Delete Chat</h2>
      </div>

      <div class="modal-body">
        <p class="modal-text">
          Are you sure you want to delete this chat{chatTitle ? ` "${chatTitle}"` : ''}? This action cannot be undone and all messages will be permanently removed.
        </p>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick={handleCancel}>
          <Icon icon="lucide:x" class="w-4 h-4" />
          Cancel
        </button>

        <button type="button" class="btn btn-danger" onclick={handleConfirm}>
          <Icon icon="lucide:trash-2" class="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(20px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .modal-content {
    background: linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    max-width: 420px;
    width: 100%;
    animation: slideIn 0.3s ease-out 0.1s both;
    position: relative;
    overflow: hidden;
  }

  .modal-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent);
  }

  .modal-header {
    margin-bottom: 1.5rem;
    text-align: center;
    position: relative;
  }

  .warning-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: #f59e0b;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin: 0;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .modal-body {
    margin-bottom: 2rem;
  }

  .modal-text {
    color: #d1d5db;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
    text-align: center;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  /* Button Components */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-weight: 500;
    transition: all 0.3s ease;
    outline: none;
    cursor: pointer;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-size: 0.875rem;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .btn-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: 1px solid rgba(239, 68, 68, 0.3);
    box-shadow: 
      0 4px 16px rgba(239, 68, 68, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-danger:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 32px rgba(239, 68, 68, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-danger:active {
    transform: translateY(0);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .btn-secondary:active {
    transform: translateY(0);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 1rem;
    }

    .modal-content {
      padding: 1.5rem;
      border-radius: 16px;
      max-width: 100%;
    }

    .modal-title {
      font-size: 1.25rem;
    }

    .modal-text {
      font-size: 0.9rem;
    }

    .modal-footer {
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn {
      justify-content: center;
      width: 100%;
    }
  }

  /* Enhanced visual effects */
  @media (prefers-reduced-motion: no-preference) {
    .modal-content {
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .btn {
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }
</style>