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
  class="fixed inset-0 bg-black/80 backdrop-blur-[20px] z-[9999] flex items-center justify-center p-8 max-md:p-4"
  onclick={handleCancel}
  onkeydown={handleEscape}
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
    <div class="bg-gradient-to-br from-gray-950/95 to-gray-900/95 border border-white/10 rounded-[20px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] max-w-[420px] w-full relative overflow-hidden max-md:p-6 max-md:rounded-2xl max-md:max-w-full before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-red-500/50 before:to-transparent">
      <div class="mb-6 text-center relative">
        <div class="flex items-center justify-center mb-4 text-amber-500">
          <Icon icon="lucide:alert-triangle" class="w-8 h-8" />
        </div>
        <h2 class="text-2xl font-semibold m-0 font-mono bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent max-md:text-xl">Delete Chat</h2>
      </div>

      <div class="mb-8">
        <p class="text-gray-300 text-base leading-relaxed m-0 text-center font-mono max-md:text-sm">
          Are you sure you want to delete this chat{chatTitle
            ? ` "${chatTitle}"`
            : ""}? This action cannot be undone and all messages will be
          permanently removed.
        </p>
      </div>

      <div class="flex gap-4 justify-center max-md:flex-col max-md:gap-3">
        <button type="button" class="inline-flex items-center justify-center font-mono font-medium transition-all duration-300 ease-in-out outline-none cursor-pointer gap-2 py-3 px-6 rounded-xl text-sm border relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/5 text-slate-300 border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] active:translate-y-0 max-md:justify-center max-md:w-full" onclick={handleCancel}>
          <Icon icon="lucide:x" class="w-4 h-4" />
          Cancel
        </button>

        <button type="button" class="inline-flex items-center justify-center font-mono font-medium transition-all duration-300 ease-in-out outline-none cursor-pointer gap-2 py-3 px-6 rounded-xl text-sm border relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gradient-to-br from-red-500 to-red-600 text-white border-red-500/30 shadow-[0_4px_16px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:not(:disabled):-translate-y-0.5 hover:not(:disabled):shadow-[0_8px_32px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-0 max-md:justify-center max-md:w-full" onclick={handleConfirm}>
          <Icon icon="lucide:trash-2" class="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  </div>
</div>

