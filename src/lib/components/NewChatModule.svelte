<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { userStore } from "$lib/stores/userStore";
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";

  interface Props {
    onClose?: () => void; // ✅ prop callback
  }

  let { onClose }: Props = $props();

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
    onClose?.(); // ✅ call parent callback
  }
</script>

<div
  class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
>
  <div class="bg-[#2E2E2E] text-white rounded-lg shadow-xl p-6 w-full max-w-md">
    <div class="mb-4">
      <h2 class="text-xl font-semibold tracking-wide">New Chat</h2>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4">
      <input
        type="text"
        bind:value={$content}
        placeholder="Enter chat title..."
        class="w-full text-black border border-0 bg-white rounded px-3 py-2 font-mono"
      />
      <div class="flex justify-end gap-2">
        <!-- Cancel First -->
        <button
          type="button"
          class="px-4 py-2 bg-red-500 text-white rounded text-sm flex items-center gap-2 hover:bg-red-600"
          onclick={closeModal}
        >
          <Icon icon="lucide:x" class="w-4 h-4" />
          Cancel
        </button>

        <!-- Create Second (Primary Action) -->
        <button
          type="submit"
          class="px-4 py-2 bg-black text-white rounded text-sm flex items-center gap-2 hover:bg-gray-900"
        >
          <Icon icon="lucide:plus" class="w-4 h-4" />
          Create
        </button>
      </div>
    </form>
  </div>
</div>
