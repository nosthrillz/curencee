<template>
  <div class="currency-controls">
    <div class="preset-buttons">
      <button 
        v-for="presetValue in presetValues" 
        :key="presetValue.value"
        @click="handlePreset(presetValue.value)"
        class="preset-button"
        :class="{ 'active': currentValue === presetValue.value }"
      >
        {{ formatCurrency(presetValue.value) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCurrencyStore } from '@/stores/currency';
import { storeToRefs } from 'pinia';

const store = useCurrencyStore();
const { currentValue, presetValues } = storeToRefs(store);
const { formatCurrency, setValue } = store;

function handlePreset(value) {
  setValue(value);
}
</script>

<style scoped>
.currency-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  max-width: 600px;
}

.preset-button {
  padding: 0.75rem 1.25rem;
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.preset-button:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.preset-button.active {
  background-color: #3498db;
  color: white;
  border-color: #2980b9;
}
</style> 