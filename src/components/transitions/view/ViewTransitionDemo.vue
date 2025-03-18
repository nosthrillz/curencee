<template>
  <div class="view-transition-demo">
    <div class="display-container">
      <ViewTransitionLogic />
    </div>
  </div>
</template>

<script setup>
import ViewTransitionLogic from './ViewTransitionLogic.vue';
</script>

<style scoped>
.view-transition-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  width: 100%;
  min-height: 40vh;
}

.display-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 3rem 0;
  position: relative;
}

@media (max-width: 768px) {
  .display-container {
    padding: 2rem 0;
  }
}
</style> 