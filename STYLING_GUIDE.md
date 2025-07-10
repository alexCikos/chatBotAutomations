# Chatbot Styling System Guide

## Overview

This document outlines the comprehensive styling system implemented for the chatbot application. The system provides a consistent, maintainable, and scalable approach to styling using CSS custom properties (design tokens) and Tailwind CSS.

## Architecture

The styling system is organized into several layers:

1. **Design Tokens** (`src/styles/design-tokens.css`)
2. **Component Classes** (`src/styles/components.css`)
3. **Tailwind Configuration** (`tailwind.config.js`)
4. **Global Styles** (`src/app.css`)

## Design Tokens

### Color System

The color system uses a semantic approach with CSS custom properties:

```css
/* Primary Backgrounds (Dark Theme) */
--bg-primary: #161616;       /* Darkest - sidebar, navbar */
--bg-secondary: #212121;     /* Medium - main content areas */
--bg-tertiary: #2E2E2E;      /* Lightest - inputs, cards, modals */

/* Text Colors */
--text-primary: #ffffff;     /* Primary text */
--text-secondary: #d1d5db;   /* Secondary text */
--text-muted: #9ca3af;       /* Muted text */
--text-disabled: #6b7280;    /* Disabled text */

/* Semantic Colors */
--color-danger: #ef4444;     /* Destructive actions */
--color-success: #10b981;    /* Success actions */
--color-warning: #f59e0b;    /* Warning actions */
--color-info: #3b82f6;       /* Info actions */
```

### Usage in Components

#### Tailwind Classes
```html
<!-- Using semantic color classes -->
<div class="bg-bg-primary text-text-primary">
<button class="btn btn-danger">Delete</button>
<input class="input input-md">
```

#### CSS Custom Properties
```css
.custom-component {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
}
```

## Component Classes

### Button System

```html
<!-- Base button with size -->
<button class="btn btn-sm">Small Button</button>
<button class="btn btn-md">Medium Button</button>
<button class="btn btn-lg">Large Button</button>

<!-- Button variants -->
<button class="btn btn-md btn-primary">Primary</button>
<button class="btn btn-md btn-secondary">Secondary</button>
<button class="btn btn-md btn-danger">Danger</button>
<button class="btn btn-md btn-ghost">Ghost</button>

<!-- Icon button -->
<button class="btn-icon">
  <Icon icon="lucide:settings" class="size-icon-sm" />
</button>
```

### Input System

```html
<!-- Input with size -->
<input class="input input-sm" placeholder="Small input">
<input class="input input-md" placeholder="Medium input">
<input class="input input-lg" placeholder="Large input">

<!-- Specialized inputs -->
<input class="input-search" placeholder="Search...">
<input class="input-chat" placeholder="Type message...">
```

### Card System

```html
<!-- Basic card -->
<div class="card card-md">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

<!-- Interactive card -->
<div class="card card-interactive">
  <p>Clickable card</p>
</div>

<!-- Modal card -->
<div class="card-modal">
  <p>Modal content</p>
</div>
```

### Modal System

```html
<!-- Complete modal structure -->
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Modal Title</h2>
      </div>
      <div class="modal-body">
        <p>Modal content</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm btn-secondary">Cancel</button>
        <button class="btn btn-sm btn-primary">Confirm</button>
      </div>
    </div>
  </div>
</div>
```

### Layout System

```html
<!-- Main application layout -->
<main class="main-layout">
  <div class="content-layout">
    <aside class="sidebar">...</aside>
    <div class="page-container">...</div>
  </div>
</main>

<!-- Chat-specific layouts -->
<div class="chat-container">
  <div class="messages-container">...</div>
  <div class="chat-input-container">...</div>
</div>
```

## Spacing System

### Design Tokens
```css
/* Base spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */

/* Semantic spacing */
--gap-xs: var(--space-2);
--gap-sm: var(--space-3);
--gap-md: var(--space-4);
--gap-lg: var(--space-6);
--gap-xl: var(--space-8);
```

### Usage
```html
<!-- Using gap utilities -->
<div class="flex gap-sm">
<div class="flex gap-md">
<div class="flex gap-lg">

<!-- Using spacing classes -->
<div class="space-y-3">
<div class="px-4 py-2">
```

## Typography System

### Font Sizes and Weights
```css
/* Font sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;

/* Font weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Usage
```html
<h1 class="text-2xl font-bold">Main Heading</h1>
<h2 class="text-xl font-semibold">Section Heading</h2>
<p class="text-base">Body text</p>
<small class="text-sm text-text-muted">Helper text</small>
```

## Icon System

### Icon Sizes
```css
--size-icon-xs: 1rem;     /* 16px */
--size-icon-sm: 1.25rem;  /* 20px */
--size-icon-md: 1.5rem;   /* 24px */
--size-icon-lg: 2rem;     /* 32px */
--size-icon-xl: 8rem;     /* 128px */
```

### Usage
```html
<Icon icon="lucide:settings" class="size-icon-xs" />
<Icon icon="lucide:user" class="size-icon-sm" />
<Icon icon="lucide:menu" class="size-icon-md" />
```

## Responsive Design

### Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Usage
```html
<!-- Responsive text -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">

<!-- Responsive spacing -->
<div class="px-4 md:px-6 lg:px-8">

<!-- Responsive visibility -->
<span class="hidden sm:inline">Welcome, User</span>
<div class="block sm:hidden">Mobile only</div>
```

## State Management

### Interactive States
```css
/* Hover states */
.btn:hover { background-color: var(--state-hover); }

/* Focus states */
.focus-visible {
  outline: none;
  ring: 2px solid var(--state-focus);
}

/* Active states */
.btn:active { background-color: var(--state-active); }
```

### Usage
```html
<!-- Automatic state handling -->
<button class="btn btn-primary">Auto hover/focus</button>
<input class="input input-md">Auto focus ring</input>

<!-- Manual state classes -->
<div class="hover:bg-state-hover">
<button class="focus-visible">
```

## Accessibility

### Focus Management
```css
/* Focus visible utility */
.focus-visible {
  outline: none;
  ring: 2px solid var(--state-focus);
  ring-offset: 2px;
  ring-offset-color: var(--bg-primary);
}
```

### Screen Reader Support
```html
<!-- Screen reader only content -->
<span class="sr-only">Screen reader only text</span>

<!-- Proper ARIA labels -->
<button aria-label="Close modal" class="btn-icon">
  <Icon icon="lucide:x" class="size-icon-sm" />
</button>
```

## Performance Considerations

### CSS Custom Properties
- All design tokens are defined as CSS custom properties
- Enables runtime theming without JavaScript
- Reduces CSS bundle size through token reuse

### Tailwind Optimization
- Purges unused styles in production
- JIT (Just-In-Time) compilation for faster builds
- Custom utility classes reduce repetitive code

### Component Classes
- Reusable component classes reduce HTML bloat
- Consistent styling reduces maintenance overhead
- Semantic naming improves code readability

## Migration Guide

### From Hardcoded Values
```html
<!-- Before -->
<div class="bg-[#161616] text-white px-4 py-2">

<!-- After -->
<div class="bg-bg-primary text-text-primary px-4 py-2">
```

### From Inconsistent Patterns
```html
<!-- Before -->
<button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded">

<!-- After -->
<button class="btn btn-sm btn-primary">
```

### Component Refactoring
```html
<!-- Before -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div class="bg-[#2E2E2E] p-6 rounded-lg">

<!-- After -->
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-content">
```

## Best Practices

### 1. Use Semantic Classes
```html
<!-- Good -->
<button class="btn btn-danger">Delete</button>

<!-- Avoid -->
<button class="bg-red-500 text-white px-4 py-2">Delete</button>
```

### 2. Leverage Design Tokens
```css
/* Good */
.custom-component {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Avoid */
.custom-component {
  background-color: #2E2E2E;
  color: #ffffff;
}
```

### 3. Use Component Classes
```html
<!-- Good -->
<div class="card card-interactive">

<!-- Avoid -->
<div class="bg-bg-tertiary border border-border-secondary rounded-xl shadow-card transition-fast hover:bg-state-hover cursor-pointer">
```

### 4. Maintain Consistency
```html
<!-- Good - consistent button usage -->
<button class="btn btn-sm btn-primary">Save</button>
<button class="btn btn-sm btn-secondary">Cancel</button>

<!-- Avoid - inconsistent styling -->
<button class="bg-blue-500 px-3 py-1 text-white rounded">Save</button>
<button class="border border-gray-300 px-4 py-2 rounded-lg">Cancel</button>
```

## Development Workflow

1. **Check Design Tokens**: Always check if a design token exists before using hardcoded values
2. **Use Component Classes**: Prefer component classes over utility combinations
3. **Test Responsive**: Verify designs work across all breakpoints
4. **Validate Accessibility**: Ensure proper focus management and ARIA labels
5. **Review Performance**: Monitor CSS bundle size and runtime performance

## Troubleshooting

### Common Issues

1. **CSS Custom Properties Not Working**
   - Ensure `design-tokens.css` is imported in `app.css`
   - Check that Tailwind config references the custom properties

2. **Component Classes Not Applied**
   - Verify `components.css` is imported after `design-tokens.css`
   - Check for CSS specificity conflicts

3. **Responsive Design Issues**
   - Use mobile-first approach with min-width media queries
   - Test on actual devices or browser dev tools

4. **Performance Problems**
   - Enable Tailwind's JIT mode for faster builds
   - Use CSS custom properties for theming instead of multiple CSS files

## Future Enhancements

1. **Dark/Light Mode**: Easy theme switching using CSS custom properties
2. **Animation System**: Consistent animation tokens and utilities
3. **Component Variants**: More button, input, and card variants
4. **Layout Grid**: CSS Grid-based layout system
5. **Print Styles**: Optimized styles for printing

This styling system provides a solid foundation for consistent, maintainable, and scalable UI development in the chatbot application.