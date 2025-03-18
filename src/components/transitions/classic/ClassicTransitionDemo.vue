<template>
  <div class="classic-transition-demo">
    <div class="display-container">
      <ClassicTransitionLogic />
    </div>
  </div>
</template>

<script setup>
import ClassicTransitionLogic from './ClassicTransitionLogic.vue';
</script>

<style scoped>
.classic-transition-demo {
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
  font-size: 7rem;
}

@media (max-width: 768px) {
  .display-container {
    font-size: 5rem;
    padding: 2rem 0;
  }
}
</style> 