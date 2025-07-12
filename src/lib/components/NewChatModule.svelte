<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { userStore } from "$lib/stores/userStore";
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import { toastStore } from "$lib/stores/toastStore";

  interface Props {
    onClose?: () => void; // ✅ prop callback
    isAtHome?: boolean; // ✅ prop to check if at home
  }

  let { onClose, isAtHome }: Props = $props();

  const { content, createChat } = sideBarChatsStore;
  const userId = $userStore?.id;
  let description = $state("");

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const value = $content.trim();
    if (!value || typeof userId !== "string") return;

    const chat = await createChat(userId, value, description.trim() || undefined);
    if (!chat) return;

    $content = "";
    description = "";

    // Show success toast
    toastStore.add({
      message: `Chat "${chat.title}" created successfully`,
      type: 'success',
      duration: 3000
    });

    onClose?.(); // ✅ call parent callback
    goto(`/chat/${chat.id}`);
  }

  function closeModal() {
    if (isAtHome) {
      goto("/"); // ✅ redirect to home if at home
    } else {
      onClose?.(); // ✅ call parent callback
    }
  }
</script>

<div
  class="modal-backdrop"
  onclick={closeModal}
  onkeydown={(e) => e.key === "Escape" && closeModal()}
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
        <h2 class="modal-title">New Chat</h2>
      </div>

      <form onsubmit={handleSubmit} class="modal-form">
        <div class="modal-body">
          <input
            type="text"
            bind:value={$content}
            placeholder="Enter chat title..."
            class="modal-input"
          />
          <textarea
            bind:value={description}
            placeholder="Enter a short description (optional)..."
            class="modal-input modal-textarea"
            rows="2"
          ></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick={closeModal}>
            <Icon icon="lucide:x" class="w-4 h-4" />
            Cancel
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            disabled={!$content.trim()}
          >
            <Icon icon="lucide:plus" class="w-4 h-4" />
            Create
          </button>
        </div>
      </form>
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
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
  }

  .modal-header {
    margin-bottom: 2rem;
    text-align: center;
    position: relative;
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

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .modal-input {
    width: 100%;
    padding: 1rem 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    color: white;
    font-size: 1.125rem;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    transition: all 0.3s ease;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
  }

  .modal-input:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: rgba(59, 130, 246, 0.05);
    box-shadow: 
      0 0 0 1px rgba(59, 130, 246, 0.3),
      0 8px 32px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  .modal-input::placeholder {
    color: #64748b;
    font-weight: 400;
  }

  .modal-textarea {
    resize: none;
    min-height: 60px;
    font-family: inherit;
    line-height: 1.5;
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

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    border: 1px solid rgba(59, 130, 246, 0.3);
    box-shadow: 
      0 4px 16px rgba(59, 130, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 32px rgba(59, 130, 246, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .btn-primary:active {
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

    .modal-input {
      font-size: 1rem;
      padding: 0.875rem 1rem;
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
