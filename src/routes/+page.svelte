<script lang="ts">
  import { writable, derived } from "svelte/store";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Fuse from "fuse.js";
  import Icon from "@iconify/svelte";
  import { sideBarChatsStore } from "$lib/stores/sideBarChatsStore";
  import { userStore } from "$lib/stores/userStore";
  import type { Chat } from "$lib/types";

  const input = writable("");
  let inputFocused = $state(false);
  let mounted = $state(false);

  const { chats, loadChats } = sideBarChatsStore;
  const userId = $userStore?.id;

  const commands = [
    {
      label: "New Chat",
      description: "Start a fresh conversation",
      icon: "lucide:plus",
      match: ["new chat", "start chat", "create", "new"],
      action: () => goto("/chat/create"),
      shortcut: "⌘N",
    },
    {
      label: "Search Chats",
      description: "Find your previous conversations",
      icon: "lucide:search",
      match: ["search chats", "find", "history", "search"],
      action: () => goto("/history"),
      shortcut: "⌘F",
    },
  ];

  // Quick action buttons
  const quickActions = [
    {
      label: "New Chat",
      icon: "lucide:plus",
      action: () => goto("/chat/create"),
      primary: true,
    },
    {
      label: "Browse History",
      icon: "lucide:history",
      action: () => goto("/history"),
      primary: false,
    },
  ];

  // Setup Fuse for commands
  const commandFuse = new Fuse(commands, {
    keys: ["match"],
    threshold: 0.3,
  });

  // Setup Fuse for chats
  const chatFuse = derived(chats, ($chats) => {
    return new Fuse($chats, {
      keys: ["title", "description"],
      threshold: 0.3,
    });
  });

  const suggestions = derived([input, chatFuse], ([$input, $chatFuse]) => {
    const term = $input.trim();
    if (!term) return [];
    
    // Search commands
    const commandResults = commandFuse.search(term).map((result) => ({
      ...result.item,
      type: "command"
    }));
    
    // Search chats
    const chatResults = $chatFuse.search(term).map((result) => ({
      ...result.item,
      type: "chat",
      label: result.item.title,
      description: result.item.description || `Created ${new Date(result.item.createdAt).toLocaleDateString()}`,
      icon: "lucide:message-circle",
      action: () => goto(`/chat/${result.item.id}`)
    }));
    
    // Combine and limit results
    return [...commandResults, ...chatResults].slice(0, 6);
  });

  function handleEnter(suggestions: { action: () => void }[]) {
    if (suggestions.length > 0) {
      suggestions[0].action();
    }
  }

  // Load chats and keyboard shortcuts
  onMount(() => {
    mounted = true;
    
    // Load chats if user is available
    if (userId) {
      loadChats(userId);
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "n") {
          e.preventDefault();
          goto("/chat/create");
        } else if (e.key === "f") {
          e.preventDefault();
          goto("/history");
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  });
</script>

<div class="home-container">
  <!-- Background Elements -->
  <div class="background-grid"></div>
  <div class="background-gradient"></div>

  <!-- Main Content -->
  <div class="content-wrapper {mounted ? 'animate-in' : 'opacity-0'}">
    <!-- Header Section -->
    <div class="header-section">
      <div class="logo-section">
        <div class="logo-icon">
          <Icon icon="lucide:message-circle" class="w-12 h-12" />
        </div>
        <h1 class="main-title">Speak. Search. Solve.</h1>
        <p class="subtitle">Your intelligent conversation companion</p>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-wrapper {inputFocused ? 'focused' : ''}">
          <input
            bind:value={$input}
            onfocus={() => (inputFocused = true)}
            onblur={() => (inputFocused = false)}
            onkeydown={(e) => e.key === "Enter" && handleEnter($suggestions)}
            placeholder="What would you like to do?"
            class="search-input"
          />

          <Icon icon="lucide:search" class="search-icon" />
        </div>

        <!-- Search Suggestions -->
        {#if $suggestions.length > 0}
          <div class="suggestions-dropdown">
            {#each $suggestions as item}
              <button
                type="button"
                class="suggestion-item {item.type === 'chat' ? 'suggestion-chat' : 'suggestion-command'}"
                onclick={() => item.action()}
              >
                <div class="suggestion-icon">
                  <Icon icon={item.icon} class="w-5 h-5" />
                </div>
                <div class="suggestion-content">
                  <div class="suggestion-label">{item.label}</div>
                  <div class="suggestion-desc">{item.description}</div>
                </div>
                {#if 'shortcut' in item && item.shortcut}
                  <div class="suggestion-shortcut">{item.shortcut}</div>
                {:else if item.type === 'chat'}
                  <div class="suggestion-meta">
                    <Icon icon="lucide:arrow-right" class="w-4 h-4" />
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="actions-section">
      <div class="actions-grid">
        {#each quickActions as action}
          <button
            class="action-card {action.primary ? 'primary' : 'secondary'}"
            onclick={action.action}
          >
            <div class="action-icon">
              <Icon icon={action.icon} class="w-6 h-6" />
            </div>
            <span class="action-label">{action.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Feature Hints -->
    <div class="hints-section">
      <div class="hints-grid">
        <div class="hint-item">
          <Icon icon="lucide:zap" class="w-4 h-4 text-blue-400" />
          <span>Quick commands</span>
        </div>
        <div class="hint-item">
          <Icon icon="lucide:keyboard" class="w-4 h-4 text-green-400" />
          <span>Keyboard shortcuts</span>
        </div>
        <div class="hint-item">
          <Icon icon="lucide:clock" class="w-4 h-4 text-purple-400" />
          <span>Chat history</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .home-container {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: var(--font-mono);
    overflow: hidden;
  }

  .background-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.02) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: grid-move 20s linear infinite;
  }

  .background-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    );
  }

  @keyframes grid-move {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 1;
    max-width: 800px;
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

  .header-section {
    text-align: center;
    margin-bottom: 3rem;
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 20px;
    color: white;
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .main-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff, #94a3b8);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #94a3b8;
    margin: 0;
    font-weight: 400;
  }

  .search-section {
    margin-bottom: 3rem;
  }

  .search-container {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
  }

  .search-wrapper {
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

  .search-wrapper.focused {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    box-shadow: 0 0 32px rgba(59, 130, 246, 0.2);
  }

  .search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1.125rem;
    color: white;
    font-family: inherit;
  }

  .search-input::placeholder {
    color: #64748b;
  }

  .suggestions-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    margin-bottom: 8px;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.2s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .suggestion-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
    text-align: left;
  }

  .suggestion-item:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  .suggestion-icon {
    margin-right: 12px;
    color: #3b82f6;
  }

  .suggestion-content {
    flex: 1;
  }

  .suggestion-label {
    font-weight: 500;
    margin-bottom: 2px;
  }

  .suggestion-desc {
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .suggestion-shortcut {
    font-size: 0.75rem;
    color: #64748b;
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .suggestion-meta {
    color: #64748b;
    transition: all 0.2s ease;
  }

  .suggestion-chat {
    border-left: 3px solid rgba(139, 92, 246, 0.3);
  }

  .suggestion-chat:hover {
    border-left-color: rgba(139, 92, 246, 0.6);
    background: rgba(139, 92, 246, 0.1);
  }

  .suggestion-chat:hover .suggestion-meta {
    color: #8b5cf6;
    transform: translateX(2px);
  }

  .suggestion-command {
    border-left: 3px solid rgba(59, 130, 246, 0.3);
  }

  .suggestion-command:hover {
    border-left-color: rgba(59, 130, 246, 0.6);
  }

  .actions-section {
    margin-bottom: 3rem;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .action-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .action-card.primary {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.2),
      rgba(139, 92, 246, 0.2)
    );
    border-color: rgba(59, 130, 246, 0.3);
  }

  .action-card.primary:hover {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.3),
      rgba(139, 92, 246, 0.3)
    );
  }

  .action-icon {
    color: white;
  }

  .action-label {
    color: white;
    font-weight: 500;
    font-size: 0.875rem;
  }

  .hints-section {
    text-align: center;
  }

  .hints-grid {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .hint-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #94a3b8;
    font-size: 0.875rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .home-container {
      padding: 1rem;
    }

    .content-wrapper {
      max-width: 100%;
    }

    .actions-grid {
      grid-template-columns: 1fr;
    }

    .hints-grid {
      flex-direction: column;
      gap: 1rem;
    }

    .search-wrapper {
      padding: 0.875rem 1rem;
    }
  }
</style>
