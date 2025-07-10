<script lang="ts">
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import type { Chat } from "$lib/types";
  import Icon from "@iconify/svelte";

  const { filteredChats, searchTerm } = sideBarChatsStore;
  let inputFocused = $state(false);
  let mounted = $state(false);

  function handleEnter(chats: Chat[]) {
    if (chats.length > 0) {
      goto(`/chat/${chats[0].id}`);
    }
  }

  onMount(() => {
    mounted = true;
  });
</script>

<div class="search-page-container">
  <!-- Background Elements -->
  <div class="background-grid"></div>
  <div class="background-gradient"></div>
  
  <!-- Main Content -->
  <div class="search-content {mounted ? 'animate-in' : 'opacity-0'}">
    <!-- Header Section -->
    <div class="search-header">
      <div class="header-icon">
        <Icon icon="lucide:search" class="w-8 h-8" />
      </div>
      <h1 class="search-title">
        Search your chats
      </h1>
      <p class="search-subtitle">
        Find your previous conversations
      </p>
    </div>

    <!-- Search Section -->
    <div class="search-input-section">
      <div class="search-input-wrapper {inputFocused ? 'focused' : ''}">
        <Icon icon="lucide:search" class="w-5 h-5 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Type to search your chats..."
          onfocus={() => inputFocused = true}
          onblur={() => inputFocused = false}
          onkeydown={(e) => e.key === "Enter" && handleEnter($filteredChats)}
          bind:value={$searchTerm}
          class="search-input-field"
        />
        {#if $searchTerm}
          <button 
            class="clear-search-btn"
            onclick={() => $searchTerm = ''}
            aria-label="Clear search"
          >
            <Icon icon="lucide:x" class="w-4 h-4" />
          </button>
        {/if}
      </div>
    </div>

    <!-- Results Section -->
    {#if $searchTerm.trim() !== ""}
      <div class="results-section">
        {#if $filteredChats.length > 0}
          <div class="results-header">
            <span class="results-count">{$filteredChats.length} chat{$filteredChats.length !== 1 ? 's' : ''} found</span>
          </div>
          <div class="results-grid">
            {#each $filteredChats as chat}
              <a
                class="chat-result-card"
                href={"/chat/" + chat.id}
                title={chat.title}
              >
                <div class="chat-result-icon">
                  <Icon icon="lucide:message-circle" class="w-5 h-5" />
                </div>
                <div class="chat-result-content">
                  <div class="chat-result-title">{chat.title}</div>
                  <div class="chat-result-date">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div class="chat-result-arrow">
                  <Icon icon="lucide:arrow-right" class="w-4 h-4" />
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <div class="no-results">
            <div class="no-results-icon">
              <Icon icon="lucide:search-x" class="w-12 h-12" />
            </div>
            <h3 class="no-results-title">No chats found</h3>
            <p class="no-results-text">Try adjusting your search terms or browse all chats.</p>
          </div>
        {/if}
      </div>
    {:else}
      <div class="search-tips">
        <div class="tips-grid">
          <div class="tip-item">
            <Icon icon="lucide:type" class="w-5 h-5 text-blue-400" />
            <span>Type keywords from your conversations</span>
          </div>
          <div class="tip-item">
            <Icon icon="lucide:calendar" class="w-5 h-5 text-green-400" />
            <span>Search by chat titles or topics</span>
          </div>
          <div class="tip-item">
            <Icon icon="lucide:zap" class="w-5 h-5 text-purple-400" />
            <span>Find specific discussions quickly</span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .search-page-container {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: var(--font-mono);
    overflow-x: hidden;
  }

  .background-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: grid-move 20s linear infinite;
  }

  .background-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  }

  @keyframes grid-move {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }

  .search-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
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

  .search-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    border-radius: 16px;
    color: white;
    margin: 0 auto 1rem;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
  }

  .search-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff, #94a3b8);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
  }

  .search-subtitle {
    font-size: 1.125rem;
    color: #94a3b8;
    margin: 0;
  }

  .search-input-section {
    margin-bottom: 2rem;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1rem 1.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .search-input-wrapper.focused {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.1);
    box-shadow: 0 0 32px rgba(139, 92, 246, 0.2);
  }


  .search-input-field {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1.125rem;
    color: white;
    font-family: inherit;
  }

  .search-input-field::placeholder {
    color: #64748b;
  }

  .clear-search-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    padding: 6px;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 8px;
  }

  .clear-search-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .results-section {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .results-header {
    margin-bottom: 1rem;
  }

  .results-count {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .results-grid {
    display: grid;
    gap: 0.75rem;
  }

  .chat-result-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .chat-result-card:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
  }

  .chat-result-icon {
    color: #8b5cf6;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .chat-result-content {
    flex: 1;
  }

  .chat-result-title {
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: white;
  }

  .chat-result-date {
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .chat-result-arrow {
    color: #64748b;
    margin-left: 1rem;
    transition: all 0.2s ease;
  }

  .chat-result-card:hover .chat-result-arrow {
    color: #8b5cf6;
    transform: translateX(4px);
  }

  .no-results {
    text-align: center;
    padding: 3rem 1rem;
  }

  .no-results-icon {
    color: #64748b;
    margin-bottom: 1rem;
  }

  .no-results-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin: 0 0 0.5rem 0;
  }

  .no-results-text {
    color: #94a3b8;
    margin: 0;
  }

  .search-tips {
    text-align: center;
    padding: 2rem 0;
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .tip-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #94a3b8;
    font-size: 0.875rem;
    text-align: center;
    backdrop-filter: blur(10px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .search-page-container {
      padding: 1rem;
    }

    .tips-grid {
      grid-template-columns: 1fr;
    }

    .search-input-wrapper {
      padding: 0.875rem 1rem;
    }
  }
</style>
