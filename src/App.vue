<template>
  <main>
    <h1 class="app-title">Currency Transitions Demo</h1>
    <CurrencyDemo />
  </main>
</template>

<script setup>
import CurrencyDemo from './components/CurrencyDemo.vue';
</script>

<style>
body {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
  color: #343a40;
}

main {
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-title {
  margin-bottom: 2rem;
  text-align: center;
  color: #3498db;
  font-weight: 700;
  font-size: 2.5rem;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
}
</style>
