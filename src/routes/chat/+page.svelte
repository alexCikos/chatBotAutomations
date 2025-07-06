<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { userStore } from "$lib/stores/userStore";
  import { goto } from "$app/navigation";

  const { content, createChat } = sideBarChatsStore;
  const userId = $userStore?.id;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const value = $content.trim();
    if (!value || typeof userId !== "string") return;

    const chat = await createChat(userId, value);
    if (!chat) return;

    $content = "";

    goto(`/chat/${chat.id}`);
  }
</script>

<div
  class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
>
  <div class="bg-white text-black rounded-lg shadow-xl p-6 w-full max-w-md">
    <div class="mb-4">
      <h2 class="text-xl font-semibold">New Chat</h2>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4">
      <input
        type="text"
        bind:value={$content}
        placeholder="Enter chat title..."
        class="w-full border border-gray-300 rounded px-3 py-2"
      />
      <div class="flex justify-end gap-2">
        <button
          type="submit"
          class="px-4 py-2 bg-black text-white rounded text-sm"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</div>
