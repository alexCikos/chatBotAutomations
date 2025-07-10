# Styling System Migration Guide

## Overview

This guide helps developers migrate from the old hardcoded styling approach to the new design system with CSS custom properties and standardized component classes.

## Quick Migration Checklist

- [ ] Replace all hardcoded hex colors with design tokens
- [ ] Update button styling to use component classes
- [ ] Standardize input field styling
- [ ] Migrate card and modal components
- [ ] Update layout classes
- [ ] Replace inconsistent spacing with standard scale
- [ ] Update icon sizing to use semantic classes
- [ ] Ensure all interactive states use design tokens

## Color Migrations

### Background Colors

#### Before
```html
<div class="bg-[#161616]">
<div class="bg-[#212121]">
<div class="bg-[#2E2E2E]">
<div class="bg-black">
<div class="bg-neutral-900">
<div class="bg-neutral-800">
<div class="bg-gray-700">
<div class="bg-gray-800">
<div class="bg-zinc-800">
```

#### After
```html
<div class="bg-bg-primary">
<div class="bg-bg-secondary">
<div class="bg-bg-tertiary">
<div class="bg-surface-default">
<div class="bg-bg-tertiary">
<div class="bg-bg-tertiary">
<div class="bg-state-hover">
<div class="bg-state-hover">
<div class="bg-bg-tertiary">
```

### Text Colors

#### Before
```html
<span class="text-white">
<span class="text-black">
<span class="text-gray-300">
<span class="text-gray-400">
<span class="text-red-400">
<span class="text-red-600">
<span class="text-neutral-400">
```

#### After
```html
<span class="text-text-primary">
<span class="text-text-inverse">
<span class="text-text-secondary">
<span class="text-text-muted">
<span class="text-danger-text">
<span class="text-danger">
<span class="text-text-muted">
```

### Border Colors

#### Before
```html
<div class="border-gray-700">
<div class="border-gray-800">
<div class="border-neutral-700">
```

#### After
```html
<div class="border-border-primary">
<div class="border-border-secondary">
<div class="border-border-primary">
```

## Button Migrations

### Basic Buttons

#### Before
```html
<button class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">
<button class="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600">
<button class="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-900">
```

#### After
```html
<button class="btn btn-sm btn-primary">
<button class="btn btn-sm btn-danger">
<button class="btn btn-sm btn-primary">
```

### Icon Buttons

#### Before
```html
<button class="text-gray-300 hover:text-white transition-colors">
<button class="hover:text-gray-400">
<button class="ml-2 text-red-400 hover:text-red-600 text-xs">
```

#### After
```html
<button class="icon-btn">
<button class="icon-btn">
<button class="icon-btn text-danger-text hover:text-danger">
```

## Input Migrations

### Basic Inputs

#### Before
```html
<input class="w-full px-6 py-4 bg-neutral-900 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-lg placeholder:text-neutral-400">
<input class="w-full py-6 px-5 rounded-2xl bg-[#2E2E2E] text-white text-base placeholder-gray-400 focus:outline-none font-mono pr-14">
<input class="w-full text-black border border-0 bg-white rounded px-3 py-2 font-mono">
```

#### After
```html
<input class="input input-search">
<input class="input-chat">
<input class="input input-md">
```

### Search Inputs

#### Before
```html
<input class="bg-transparent text-white placeholder-gray-400 outline-none text-base w-full">
<div class="bg-[#2E2E2E] rounded-xl px-4 py-3 flex items-center gap-3 w-full">
```

#### After
```html
<input class="input input-md">
<div class="bg-bg-tertiary rounded-xl px-4 py-3 flex items-center gap-sm w-full">
```

## Layout Migrations

### Main Layouts

#### Before
```html
<main class="flex h-[calc(100dvh-4rem)] overflow-hidden">
<main class="flex h-[100dvh] w-full overflow-hidden font-mono">
<div class="flex h-full w-full overflow-hidden font-mono">
```

#### After
```html
<main class="main-layout">
<main class="content-layout">
<div class="content-layout">
```

### Sidebar Layouts

#### Before
```html
<aside class="bg-[#161616] w-1/5 h-full flex flex-col border-r border-gray-700">
<main class="w-1/5 h-full bg-[#161616] text-white flex flex-col">
```

#### After
```html
<aside class="sidebar">
<main class="sidebar">
```

## Card and Modal Migrations

### Cards

#### Before
```html
<div class="bg-[#2E2E2E] text-white rounded-lg shadow-xl p-6 w-full max-w-md">
<div class="w-full bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 cursor-pointer block">
```

#### After
```html
<div class="card card-modal">
<div class="card card-interactive">
```

### Modals

#### Before
```html
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
  <div class="bg-[#2E2E2E] text-white rounded-lg shadow-xl p-6 w-full max-w-md">
```

#### After
```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-content">
```

## Chat Component Migrations

### Chat Container

#### Before
```html
<main class="flex flex-col h-full w-full overflow-x-hidden font-mono">
<div class="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-[#212121]">
```

#### After
```html
<main class="chat-container">
<div class="messages-container">
```

### Message Bubbles

#### Before
```html
<div class="max-w-[45%] p-3 rounded-lg whitespace-pre-wrap break-words ml-auto bg-[#2E2E2E] text-white">
<div class="max-w-[45%] p-3 rounded-lg whitespace-pre-wrap break-words mr-auto bg-gray-200 text-black">
```

#### After
```html
<div class="message-bubble-user">
<div class="message-bubble-assistant">
```

### Chat Input

#### Before
```html
<form class="flex flex-col justify-center bg-[#212121] px-3 py-3 sticky bottom-0 w-full border-t border-gray-800">
<div class="relative w-full max-w-3xl mx-auto">
<input class="w-full py-6 px-5 rounded-2xl bg-[#2E2E2E] text-white text-base placeholder-gray-400 focus:outline-none font-mono pr-14">
<button class="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full hover:bg-gray-200">
```

#### After
```html
<form class="chat-input-container">
<div class="chat-input-wrapper">
<input class="chat-input">
<button class="chat-send-btn">
```

## Spacing Migrations

### Padding and Margins

#### Before
```html
<div class="px-4 py-3">
<div class="px-6 py-4">
<div class="px-3 py-2">
<div class="px-4 py-2">
<div class="px-5 py-6">
```

#### After
```html
<div class="px-4 py-3">          <!-- Keep if standard -->
<div class="px-6 py-4">          <!-- Keep if standard -->
<div class="px-3 py-2">          <!-- Keep if standard -->
<div class="px-4 py-2">          <!-- Keep if standard -->
<div class="px-5 py-6">          <!-- Keep if standard -->
```

### Gaps and Spacing

#### Before
```html
<div class="gap-2">
<div class="gap-3">
<div class="gap-4">
<div class="space-x-3">
<div class="space-y-2">
<div class="space-y-3">
<div class="space-y-4">
<div class="space-y-6">
<div class="space-y-8">
```

#### After
```html
<div class="gap-xs">
<div class="gap-sm">
<div class="gap-md">
<div class="gap-sm">
<div class="space-y-2">
<div class="space-y-3">
<div class="space-y-4">
<div class="space-y-6">
<div class="space-y-8">
```

## Icon Migrations

### Icon Sizes

#### Before
```html
<Icon class="w-4 h-4">
<Icon class="w-5 h-5">
<Icon class="w-6 h-6">
<Icon class="w-8 h-8">
<Icon class="w-32 h-32">
```

#### After
```html
<Icon class="size-icon-xs">
<Icon class="size-icon-sm">
<Icon class="size-icon-md">
<Icon class="size-icon-lg">
<Icon class="size-icon-xl">
```

## Navigation Migrations

### Navbar

#### Before
```html
<nav class="z-50 flex items-center justify-between px-6 py-4 text-white shadow-md h-16 bg-[#161616] border-b border-gray-700 font-mono">
<div class="flex items-center space-x-3">
<img class="w-32 h-32">
<img class="w-8 h-8 rounded-full border-2 border-white">
```

#### After
```html
<nav class="navbar z-fixed">
<div class="navbar-brand">
<img class="size-icon-xl">
<img class="size-icon-lg rounded-full border-2 border-text-primary">
```

### Sidebar Items

#### Before
```html
<div class="flex items-center justify-between px-4 py-2 hover:bg-gray-800 border-b border-gray-800">
<a class="truncate flex-1 hover:text-gray-400">
<button class="ml-2 text-red-400 hover:text-red-600 text-xs">
```

#### After
```html
<div class="flex items-center justify-between px-4 py-2 hover:bg-state-hover border-b border-border-secondary">
<a class="truncate flex-1 text-text-secondary hover:text-text-primary transition-fast">
<button class="ml-2 text-danger-text hover:text-danger text-xs transition-fast">
```

## Component-Specific Migrations

### SearchChats Component

#### Before
```html
<div class="w-full bg-[#212121] text-white flex items-center justify-center py-10">
<div class="flex flex-col items-center space-y-6 w-4/5 max-w-2xl">
<div class="bg-[#2E2E2E] rounded-xl px-4 py-3 flex items-center gap-3 w-full">
```

#### After
```html
<div class="w-full bg-bg-secondary text-text-primary flex items-center justify-center py-10">
<div class="flex flex-col items-center space-y-6 w-content max-w-2xl">
<div class="bg-bg-tertiary rounded-xl px-4 py-3 flex items-center gap-sm w-full">
```

### NewChatModule Component

#### Before
```html
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
  <div class="bg-[#2E2E2E] text-white rounded-lg shadow-xl p-6 w-full max-w-md">
    <div class="mb-4">
      <h2 class="text-xl font-semibold tracking-wide">New Chat</h2>
    </div>
    <div class="flex justify-end gap-2">
      <button class="px-4 py-2 bg-red-500 text-white rounded text-sm flex items-center gap-2 hover:bg-red-600">
      <button class="px-4 py-2 bg-black text-white rounded text-sm flex items-center gap-2 hover:bg-gray-900">
```

#### After
```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="text-xl font-semibold tracking-wide text-text-primary">New Chat</h2>
      </div>
      <div class="modal-footer">
        <button class="btn btn-sm btn-danger">
        <button class="btn btn-sm btn-primary">
```

## Testing Your Migration

### Visual Testing
1. **Compare Before/After**: Take screenshots before and after migration
2. **Check All Components**: Verify each component renders correctly
3. **Test Responsive**: Ensure responsive behavior is maintained
4. **Dark Theme**: Verify the dark theme still works properly

### Functional Testing
1. **Interactive States**: Test hover, focus, and active states
2. **Form Inputs**: Verify all inputs work correctly
3. **Modal Dialogs**: Test modal opening, closing, and interactions
4. **Navigation**: Ensure all navigation elements function

### Performance Testing
1. **Bundle Size**: Compare CSS bundle sizes before/after
2. **Load Time**: Measure page load performance
3. **Runtime Performance**: Test smooth animations and transitions

## Common Issues and Solutions

### Issue: Component classes not applying
**Solution**: Ensure `components.css` is imported after `design-tokens.css` in `app.css`

### Issue: Custom properties not working
**Solution**: Verify all design tokens are properly defined in `design-tokens.css`

### Issue: Styles not being purged
**Solution**: Update `tailwind.config.js` content paths to include all component files

### Issue: Inconsistent spacing
**Solution**: Use standardized spacing classes instead of arbitrary values

### Issue: Color inconsistencies
**Solution**: Always use design token colors instead of hardcoded values

## Rollback Plan

If issues arise during migration:

1. **Revert files**: Use git to revert to previous versions
2. **Disable new CSS**: Comment out new CSS imports in `app.css`
3. **Gradual migration**: Migrate components one at a time
4. **Test thoroughly**: Each component should be tested individually

## Post-Migration Checklist

- [ ] All hardcoded colors replaced with design tokens
- [ ] All buttons use standardized component classes
- [ ] All inputs use consistent styling
- [ ] All layout components use semantic classes
- [ ] All icon sizes use standardized classes
- [ ] All spacing uses consistent scale
- [ ] All interactive states work properly
- [ ] All components are responsive
- [ ] All accessibility features maintained
- [ ] Performance is equal or better than before
- [ ] Documentation is updated

## Future Maintenance

### Adding New Components
1. **Check existing patterns**: See if similar components already exist
2. **Use design tokens**: Always use CSS custom properties for styling
3. **Follow naming conventions**: Use semantic class names
4. **Test responsively**: Ensure components work on all screen sizes
5. **Document changes**: Update style guide and documentation

### Updating Existing Components
1. **Review impact**: Consider effects on other components
2. **Test thoroughly**: Check all usage instances
3. **Update documentation**: Keep style guide current
4. **Consider backwards compatibility**: Avoid breaking existing usage

This migration guide ensures a smooth transition from the old styling system to the new design system while maintaining functionality and improving maintainability.