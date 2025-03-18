<template>
  <div class="currency-demo">
    <TabSystem>
      <template #view>
        <ViewTransitionDemo />
      </template>
      
      <template #classic>
        <ClassicTransitionDemo />
      </template>
    </TabSystem>
    
    <CurrencyControls />
  </div>
</template>

<script setup>
import TabSystem from './shared/TabSystem.vue';
import CurrencyControls from './shared/CurrencyControls.vue';
import ViewTransitionDemo from './transitions/view/ViewTransitionDemo.vue';
import ClassicTransitionDemo from './transitions/classic/ClassicTransitionDemo.vue';
</script>

<style scoped>
.currency-demo {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

@media (max-width: 768px) {
  .currency-demo {
    padding: 1rem;
    gap: 2rem;
  }
}
</style> 