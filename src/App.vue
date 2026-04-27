<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default { name: 'App' }
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --primary: #2563eb; --primary-dark: #1d4ed8; --primary-light: #eff6ff;
  --danger: #dc2626; --danger-light: #fef2f2;
  --gray-50: #f9fafb; --gray-100: #f3f4f6; --gray-200: #e5e7eb;
  --gray-300: #d1d5db; --gray-400: #9ca3af; --gray-500: #6b7280;
  --gray-600: #4b5563; --gray-700: #374151; --gray-800: #1f2937; --gray-900: #111827;
  --radius: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--gray-50); color: var(--gray-800); line-height: 1.6; }
a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; }
input, textarea { font-family: inherit; }
</style>
