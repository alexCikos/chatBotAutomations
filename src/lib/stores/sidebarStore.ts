import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Store for managing sidebar collapse/expand state
 */
function createSidebarStore() {
  // Try to get initial state from localStorage, default to expanded on desktop, collapsed on mobile
  const getInitialState = () => {
    if (!browser) return false;
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) return stored === 'true';
    // Default: collapsed on mobile, expanded on desktop
    return window.innerWidth < 768;
  };
  
  const initialState = getInitialState();
  
  // Track screen width for responsive behavior
  const screenWidth = writable<number>(browser ? window.innerWidth : 1024);
  
  // Track user preference
  const userPreference = writable<boolean>(initialState);
  
  // Main sidebar state - just use user preference, allow full control
  const sidebarState = derived(
    [userPreference],
    ([$userPreference]) => {
      return $userPreference;
    }
  );

  return {
    subscribe: sidebarState.subscribe,
    toggle: () => {
      userPreference.update(collapsed => {
        const newState = !collapsed;
        if (browser) {
          localStorage.setItem('sidebar-collapsed', newState.toString());
        }
        return newState;
      });
    },
    expand: () => {
      userPreference.set(false);
      if (browser) {
        localStorage.setItem('sidebar-collapsed', 'false');
      }
    },
    collapse: () => {
      userPreference.set(true);
      if (browser) {
        localStorage.setItem('sidebar-collapsed', 'true');
      }
    },
    set: (value: boolean) => {
      userPreference.set(value);
      if (browser) {
        localStorage.setItem('sidebar-collapsed', value.toString());
      }
    },
    // Expose screen width for components that need it
    updateScreenWidth: (width: number) => screenWidth.set(width)
  };
}

export const sidebarStore = createSidebarStore();

// Keyboard shortcut handler and resize listener
if (browser) {
  let previousWidth = window.innerWidth;
  
  // Update screen width on resize and handle responsive behavior
  const handleResize = () => {
    const currentWidth = window.innerWidth;
    sidebarStore.updateScreenWidth(currentWidth);
    
    // Auto-collapse when switching from desktop to mobile
    if (previousWidth >= 768 && currentWidth < 768) {
      sidebarStore.collapse();
    }
    
    previousWidth = currentWidth;
  };
  
  window.addEventListener('resize', handleResize);
  
  // Keyboard shortcuts
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