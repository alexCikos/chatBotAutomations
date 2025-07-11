import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { Tool } from "$lib/types";

function createToolsStore() {
  const tools = writable<Tool[]>([]);
  const loading = writable<boolean>(false);
  const error = writable<string | null>(null);

  async function loadUserTools(userId: string) {
    if (!browser) return;
    
    loading.set(true);
    error.set(null);
    
    try {
      const response = await fetch(`/api/tools/users/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tools");
      }
      
      tools.set(data.tools || []);
    } catch (err) {
      console.error("Error loading user tools:", err);
      error.set(err instanceof Error ? err.message : "Failed to load tools");
      tools.set([]);
    } finally {
      loading.set(false);
    }
  }

  function clearTools() {
    tools.set([]);
    error.set(null);
  }

  return {
    tools,
    loading,
    error,
    loadUserTools,
    clearTools,
  };
}

export const toolsStore = createToolsStore();