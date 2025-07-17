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
  let isSubmitting = $state(false);
  let errorMessage = $state<string | null>(null);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const value = $content.trim();
    if (!value || typeof userId !== "string" || isSubmitting) return;

    isSubmitting = true;
    errorMessage = null;

    try {
      const chat = await createChat(userId, value, description.trim() || undefined);
      if (!chat) {
        throw new Error('Failed to create chat');
      }

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
    } catch (error) {
      console.error("Failed to create chat:", error);
      errorMessage = "Failed to create chat. Please try again.";
      toastStore.add({
        message: "Failed to create chat. Please try again.",
        type: 'error',
        duration: 5000
      });
    } finally {
      isSubmitting = false;
    }
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
  class="fixed inset-0 bg-black/80 backdrop-blur-[20px] z-[9999] flex items-center justify-center p-8 max-md:p-4"
  onclick={closeModal}
  onkeydown={(e) => e.key === "Escape" && closeModal()}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div
    class=""
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
    role="document"
  >
    <div class="bg-gradient-to-br from-gray-950/95 to-gray-900/95 border border-white/10 rounded-[20px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] max-w-[420px] w-full relative overflow-hidden max-md:p-6 max-md:rounded-2xl max-md:max-w-full before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-500/50 before:to-transparent">
      <div class="mb-8 text-center relative">
        <h2 class="text-2xl font-semibold m-0 font-mono bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent max-md:text-xl">New Chat</h2>
      </div>

      <form onsubmit={handleSubmit} class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          {#if errorMessage}
            <div class="flex items-center gap-2 py-3 px-4 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm" role="alert">
              <Icon icon="lucide:alert-circle" class="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          {/if}
          
          <input
            type="text"
            bind:value={$content}
            placeholder="Enter chat title..."
            class="w-full p-4 px-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-lg font-mono transition-all duration-300 box-border backdrop-blur-md focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_8px_32px_rgba(59,130,246,0.1)] focus:-translate-y-px placeholder:text-slate-500 placeholder:font-normal max-md:text-base max-md:py-3.5 max-md:px-4"
            disabled={isSubmitting}
          />
          <textarea
            bind:value={description}
            placeholder="Enter a short description (optional)..."
            class="w-full p-4 px-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-lg font-mono transition-all duration-300 box-border backdrop-blur-md focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_0_1px_rgba(59,130,246,0.3),0_8px_32px_rgba(59,130,246,0.1)] focus:-translate-y-px placeholder:text-slate-500 placeholder:font-normal resize-none min-h-[60px] font-inherit leading-6 max-md:text-base max-md:py-3.5 max-md:px-4"
            rows="2"
            disabled={isSubmitting}
          ></textarea>
        </div>

        <div class="flex gap-4 justify-end max-md:flex-col max-md:gap-3">
          <button 
            type="button" 
            class="inline-flex items-center justify-center font-mono font-medium transition-all duration-300 ease-in-out outline-none cursor-pointer gap-2 py-3 px-6 rounded-xl text-sm border relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/5 text-slate-300 border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] active:translate-y-0 max-md:justify-center max-md:w-full" 
            onclick={closeModal}
            disabled={isSubmitting}
          >
            <Icon icon="lucide:x" class="w-4 h-4" />
            Cancel
          </button>

          <button
            type="submit"
            class="inline-flex items-center justify-center font-mono font-medium transition-all duration-300 ease-in-out outline-none cursor-pointer gap-2 py-3 px-6 rounded-xl text-sm border relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gradient-to-br from-blue-500 to-purple-500 text-white border-blue-500/30 shadow-[0_4px_16px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:not(:disabled):-translate-y-0.5 hover:not(:disabled):shadow-[0_8px_32px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-0 max-md:justify-center max-md:w-full"
            disabled={!$content.trim() || isSubmitting}
          >
            {#if isSubmitting}
              <Icon icon="lucide:loader-2" class="w-4 h-4 animate-spin" />
              Creating...
            {:else}
              <Icon icon="lucide:plus" class="w-4 h-4" />
              Create
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

