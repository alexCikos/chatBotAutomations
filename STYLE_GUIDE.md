# Chatbot Style Guide

## Visual Design System

This style guide provides visual examples of the design components and patterns used in the chatbot application.

## Color Palette

### Background Colors
```
Primary Background (#161616)   - Sidebar, Navbar
Secondary Background (#212121) - Main content areas
Tertiary Background (#2E2E2E)  - Inputs, Cards, Modals
```

### Text Colors
```
Primary Text (#ffffff)    - Main text content
Secondary Text (#d1d5db)  - Supporting text
Muted Text (#9ca3af)      - Placeholder, helper text
Disabled Text (#6b7280)   - Disabled states
```

### Semantic Colors
```
Danger (#ef4444)    - Destructive actions, errors
Success (#10b981)   - Success messages, confirmations
Warning (#f59e0b)   - Warning messages, alerts
Info (#3b82f6)      - Information messages, links
```

## Typography

### Font Family
- **Primary**: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

### Font Sizes
- **Extra Small**: 0.75rem (12px)
- **Small**: 0.875rem (14px)
- **Base**: 1rem (16px)
- **Large**: 1.125rem (18px)
- **Extra Large**: 1.25rem (20px)
- **2XL**: 1.5rem (24px)
- **3XL**: 1.875rem (30px)
- **4XL**: 2.25rem (36px)
- **5XL**: 3rem (48px)

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Usage Examples
```html
<!-- Headings -->
<h1 class="text-4xl md:text-5xl font-bold">Main Page Title</h1>
<h2 class="text-2xl md:text-3xl font-semibold">Section Title</h2>
<h3 class="text-xl font-medium">Component Title</h3>

<!-- Body Text -->
<p class="text-base">Regular body text content</p>
<p class="text-sm text-text-muted">Helper or supporting text</p>

<!-- Labels -->
<label class="text-sm font-medium">Form Label</label>
<span class="text-xs text-text-disabled">Disabled text</span>
```

## Spacing System

### Base Scale
- **0.25rem (4px)**: Extra tight spacing
- **0.5rem (8px)**: Tight spacing
- **0.75rem (12px)**: Small spacing
- **1rem (16px)**: Base spacing
- **1.5rem (24px)**: Medium spacing
- **2rem (32px)**: Large spacing
- **3rem (48px)**: Extra large spacing

### Semantic Spacing
- **Gap XS**: 8px - Small element gaps
- **Gap SM**: 12px - Form element gaps
- **Gap MD**: 16px - Component gaps
- **Gap LG**: 24px - Section gaps
- **Gap XL**: 32px - Large section gaps

## Components

### Buttons

#### Button Sizes
```html
<!-- Small Button -->
<button class="btn btn-sm">Small Button</button>

<!-- Medium Button (Default) -->
<button class="btn btn-md">Medium Button</button>

<!-- Large Button -->
<button class="btn btn-lg">Large Button</button>
```

#### Button Variants
```html
<!-- Primary Button -->
<button class="btn btn-md btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn btn-md btn-secondary">Secondary Action</button>

<!-- Danger Button -->
<button class="btn btn-md btn-danger">Delete</button>

<!-- Ghost Button -->
<button class="btn btn-md btn-ghost">Ghost Button</button>

<!-- Icon Button -->
<button class="btn-icon">
  <Icon icon="lucide:settings" class="size-icon-sm" />
</button>
```

### Inputs

#### Input Sizes
```html
<!-- Small Input -->
<input class="input input-sm" placeholder="Small input">

<!-- Medium Input (Default) -->
<input class="input input-md" placeholder="Medium input">

<!-- Large Input -->
<input class="input input-lg" placeholder="Large input">

<!-- Extra Large Input -->
<input class="input input-xl" placeholder="Extra large input">
```

#### Specialized Inputs
```html
<!-- Search Input -->
<input class="input-search" placeholder="Search...">

<!-- Chat Input -->
<input class="input-chat" placeholder="Type your message...">
```

### Cards

#### Basic Cards
```html
<!-- Small Card -->
<div class="card card-sm">
  <h3 class="font-medium">Card Title</h3>
  <p class="text-sm text-text-muted">Card content</p>
</div>

<!-- Medium Card -->
<div class="card card-md">
  <h3 class="font-medium">Card Title</h3>
  <p class="text-sm text-text-muted">Card content</p>
</div>

<!-- Large Card -->
<div class="card card-lg">
  <h3 class="font-medium">Card Title</h3>
  <p class="text-sm text-text-muted">Card content</p>
</div>
```

#### Interactive Cards
```html
<!-- Clickable Card -->
<div class="card card-interactive">
  <h3 class="font-medium">Clickable Card</h3>
  <p class="text-sm text-text-muted">This card has hover effects</p>
</div>
```

### Layout Components

#### Sidebar
```html
<aside class="sidebar">
  <div class="sidebar-header">
    <h2 class="text-xl font-bold">Sidebar Title</h2>
  </div>
  <div class="sidebar-content">
    <div class="sidebar-item">Menu Item 1</div>
    <div class="sidebar-item-active">Active Item</div>
    <div class="sidebar-item">Menu Item 3</div>
  </div>
</aside>
```

#### Navigation Bar
```html
<nav class="navbar">
  <div class="navbar-brand">
    <img src="/logo.png" alt="Logo" class="navbar-logo">
    <h1 class="navbar-title">App Name</h1>
  </div>
  <div class="flex items-center gap-sm">
    <button class="icon-btn">
      <Icon icon="lucide:settings" class="size-icon-sm" />
    </button>
  </div>
</nav>
```

### Chat Components

#### Chat Container
```html
<div class="chat-container">
  <!-- Messages Area -->
  <div class="messages-container">
    <div class="message-bubble-user">User message</div>
    <div class="message-bubble-assistant">Assistant response</div>
  </div>
  
  <!-- Input Area -->
  <div class="chat-input-container">
    <div class="chat-input-wrapper">
      <input class="chat-input" placeholder="Type your message...">
      <button class="chat-send-btn">
        <Icon icon="mdi:send" class="size-icon-sm" />
      </button>
    </div>
  </div>
</div>
```

### Modal Components

#### Complete Modal
```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="text-xl font-semibold">Modal Title</h2>
      </div>
      <div class="modal-body">
        <p>Modal content goes here</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm btn-secondary">Cancel</button>
        <button class="btn btn-sm btn-primary">Confirm</button>
      </div>
    </div>
  </div>
</div>
```

## Icons

### Icon Sizes
```html
<!-- Extra Small (16px) -->
<Icon icon="lucide:settings" class="size-icon-xs" />

<!-- Small (20px) -->
<Icon icon="lucide:user" class="size-icon-sm" />

<!-- Medium (24px) -->
<Icon icon="lucide:menu" class="size-icon-md" />

<!-- Large (32px) -->
<Icon icon="lucide:home" class="size-icon-lg" />

<!-- Extra Large (128px) -->
<Icon icon="lucide:logo" class="size-icon-xl" />
```

### Common Icons
- **Navigation**: `lucide:menu`, `lucide:chevron-left`, `lucide:chevron-right`
- **Actions**: `lucide:plus`, `lucide:edit`, `lucide:trash-2`, `lucide:save`
- **Communication**: `mdi:send`, `lucide:message-circle`, `lucide:mail`
- **Interface**: `lucide:settings`, `lucide:user`, `lucide:search`, `lucide:x`

## States and Interactions

### Hover States
```html
<!-- Button Hover -->
<button class="btn btn-primary hover:bg-state-hover">Hover me</button>

<!-- Link Hover -->
<a href="#" class="text-text-secondary hover:text-text-primary">Hover link</a>

<!-- Card Hover -->
<div class="card card-interactive hover:bg-state-hover">Hover card</div>
```

### Focus States
```html
<!-- Input Focus -->
<input class="input input-md focus:ring-2 focus:ring-state-focus">

<!-- Button Focus -->
<button class="btn btn-primary focus-visible">Focus me</button>
```

### Active States
```html
<!-- Active Menu Item -->
<div class="sidebar-item-active">Active Item</div>

<!-- Active Button -->
<button class="btn btn-primary active:bg-state-active">Press me</button>
```

### Disabled States
```html
<!-- Disabled Button -->
<button class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled>
  Disabled
</button>

<!-- Disabled Input -->
<input class="input input-md disabled:opacity-50" disabled placeholder="Disabled input">
```

## Responsive Design

### Breakpoints
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

### Responsive Examples
```html
<!-- Responsive Text -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">Responsive Heading</h1>

<!-- Responsive Spacing -->
<div class="px-4 md:px-6 lg:px-8">Responsive Padding</div>

<!-- Responsive Layout -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>

<!-- Responsive Visibility -->
<span class="hidden md:inline">Hidden on mobile</span>
<span class="block md:hidden">Mobile only</span>
```

## Layout Patterns

### Full Screen Layout
```html
<div class="h-screen flex flex-col">
  <nav class="navbar">...</nav>
  <main class="flex-1 overflow-hidden">
    <div class="content-layout">
      <aside class="sidebar">...</aside>
      <div class="page-container">...</div>
    </div>
  </main>
</div>
```

### Centered Content
```html
<div class="flex items-center justify-center min-h-screen">
  <div class="max-w-md w-full space-y-6">
    <h1 class="text-center text-2xl font-bold">Centered Content</h1>
    <div class="card card-md">...</div>
  </div>
</div>
```

### Two Column Layout
```html
<div class="content-layout">
  <aside class="sidebar">Left Sidebar</aside>
  <main class="flex-1">Main Content</main>
</div>
```

## Accessibility Guidelines

### Focus Management
- All interactive elements must have visible focus indicators
- Use `focus-visible` class for custom focus styles
- Ensure logical tab order throughout the application

### Color Contrast
- Text on backgrounds must meet WCAG AA contrast ratios
- Use semantic colors for consistent meaning
- Provide alternative indicators beyond color alone

### Screen Reader Support
- Use semantic HTML elements when possible
- Provide `aria-label` for icon buttons
- Use `sr-only` class for screen reader only content

### Keyboard Navigation
- All functionality must be accessible via keyboard
- Provide keyboard shortcuts for common actions
- Ensure modal dialogs trap focus appropriately

## Animation and Transitions

### Transition Classes
```html
<!-- Fast transition (150ms) -->
<div class="transition-fast">

<!-- Normal transition (250ms) -->
<div class="transition-normal">

<!-- Slow transition (350ms) -->
<div class="transition-slow">
```

### Common Animations
```html
<!-- Fade in/out -->
<div class="transition-opacity duration-300">

<!-- Slide animations -->
<div class="transform transition-transform duration-300">

<!-- Scale animations -->
<div class="transform transition-transform hover:scale-105">

<!-- Loading spinner -->
<div class="spinner"></div>
```

## Best Practices Summary

### Design Consistency
1. Always use design tokens instead of hardcoded values
2. Stick to the established color palette and typography scale
3. Use consistent spacing throughout the application
4. Follow the established component patterns

### Performance
1. Leverage Tailwind's JIT compilation for optimal bundle size
2. Use CSS custom properties for theming and customization
3. Minimize the use of custom CSS in favor of utility classes
4. Optimize for mobile-first responsive design

### Accessibility
1. Ensure all interactive elements are keyboard accessible
2. Provide proper ARIA labels and semantic HTML
3. Maintain sufficient color contrast ratios
4. Test with screen readers and keyboard navigation

### Maintainability
1. Document any custom styling decisions
2. Use semantic component classes over utility combinations
3. Keep styling logic in CSS files rather than inline
4. Regularly review and refactor styling patterns

This style guide serves as the single source of truth for all visual design decisions in the chatbot application.