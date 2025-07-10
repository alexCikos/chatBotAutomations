<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { userStore } from "$lib/stores/userStore";
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";

  interface Props {
    onClose?: () => void; // ✅ prop callback
    isAtHome?: boolean; // ✅ prop to check if at home
  }

  let { onClose, isAtHome }: Props = $props();

  const { content, createChat } = sideBarChatsStore;
  const userId = $userStore?.id;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const value = $content.trim();
    if (!value || typeof userId !== "string") return;

    const chat = await createChat(userId, value);
    if (!chat) return;

    $content = "";

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
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.2s ease-out;
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
      transform: translateY(10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .modal-content {
    padding: 1.5rem;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  }

  .modal-header {
    margin-bottom: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    margin: 0;
    text-align: center;
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
  }

  .modal-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .modal-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .modal-input::placeholder {
    color: #94a3b8;
  }

  .modal-footer {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }


  /* Responsive Design */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 1rem;
    }

    .modal-footer {
      flex-direction: column;
      gap: 0.5rem;
    }

  }
</style>
