import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Store for managing sidebar collapse/expand state
 */
function createSidebarStore() {
  // Try to get initial state from localStorage, default to expanded
  const initialState = browser ? localStorage.getItem('sidebar-collapsed') === 'true' : false;
  
  const { subscribe, set, update } = writable<boolean>(initialState);

  return {
    subscribe,
    toggle: () => update(collapsed => {
      const newState = !collapsed;
      if (browser) {
        localStorage.setItem('sidebar-collapsed', newState.toString());
      }
      return newState;
    }),
    expand: () => {
      set(false);
      if (browser) {
        localStorage.setItem('sidebar-collapsed', 'false');
      }
    },
    collapse: () => {
      set(true);
      if (browser) {
        localStorage.setItem('sidebar-collapsed', 'true');
      }
    },
    set: (value: boolean) => {
      set(value);
      if (browser) {
        localStorage.setItem('sidebar-collapsed', value.toString());
      }
    }
  };
}

export const sidebarStore = createSidebarStore();

// Keyboard shortcut handler
if (browser) {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + B to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      sidebarStore.toggle();
    }
    
    // Escape to collapse sidebar on mobile
    if (e.key === 'Escape' && window.innerWidth < 768) {
      sidebarStore.collapse();
    }
  });
}