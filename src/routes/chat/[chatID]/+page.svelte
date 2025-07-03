<script lang="ts">
	let { data } = $props();
	import { chatWindowStore } from '$lib/stores/chatWindowStore';
	import { tick } from 'svelte';

	const { messages, content, loadMessages, sendMessage } = chatWindowStore;

	let scrollEl: HTMLDivElement;
	let inputEl: HTMLInputElement;

	// Run once on mount
	$effect.pre(() => {
		loadMessages(data.chatId);
	});

	// Auto-scroll when messages change
	$effect(() => {
		$messages;
		tick().then(() => {
			if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
		});
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const value = $content.trim();
		if (!value) return;
		await sendMessage(data.chatId, value);
		inputEl.focus();
	}
</script>



<main class="flex flex-col h-[100dvh] font-mono">
	<!-- Message container -->
	<div bind:this={scrollEl} class="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-[#f9f9f9]">
		{#each $messages as msg}
			<div
				class={`max-w-[45%] p-3 rounded-lg whitespace-pre-wrap ${
					msg.role === 'user'
						? 'ml-auto bg-black text-white'
						: 'mr-auto bg-gray-200 text-black'
				}`}
			>
				{msg.content}
			</div>
		{/each}
	</div>

	<!-- Input form fixed at the bottom -->
	<form
		onsubmit={handleSubmit}
		class="bg-black border-t p-4 flex gap-3 sticky bottom-0"
	>
		<input
			bind:this={inputEl}
			bind:value={$content}
			placeholder="Type your message..."
			class="flex-1 border px-4 py-2 rounded-md bg-gray-50 focus:outline-none text-black"
		/>
		<button type="submit" class="bg-white text-black px-5 py-2 rounded-md">
			Send
		</button>
	</form>
</main>
