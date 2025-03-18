<template>
  <div class="currency-display">
    <div class="currency-symbol">$</div>
    
    <div class="digits-container">
      <template v-for="(char, index) in displayedDigits" :key="index">
        <span 
          v-if="char === '.'" 
          class="decimal-point" 
          :class="{ 'view-transition-digit': transitionsEnabled }" 
          :style="{ viewTransitionName: `currency-decimal-${index}` }"
        >
          {{ char }}
        </span>
        <span 
          v-else-if="char === ','" 
          class="digit-separator" 
          :class="{ 'view-transition-digit': transitionsEnabled }" 
          :style="{ viewTransitionName: `currency-separator-${index}` }"
        >
          {{ char }}
        </span>
        <span 
          v-else 
          class="digit" 
          :class="{ 'view-transition-digit': transitionsEnabled }" 
          :style="{ viewTransitionName: `currency-digit-${index}` }"
        >
          {{ char }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useCurrencyStore } from '@/stores/currency';
import { storeToRefs } from 'pinia';

const store = useCurrencyStore();
const { currentValue, decimals } = storeToRefs(store);

const displayedDigits = ref([]);
const transitionsEnabled = ref(false);

const formattedValue = computed(() => {
  const parts = currentValue.value.toFixed(decimals.value).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return integerPart + (parts.length > 1 ? '.' + parts[1] : '');
});

function initializeDisplay() {
  displayedDigits.value = formattedValue.value.split('');
}

function updateDisplayWithFallback(newValue) {
  const parts = newValue.toFixed(decimals.value).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = integerPart + (parts.length > 1 ? '.' + parts[1] : '');
  displayedDigits.value = formatted.split('');
}

function updateDisplayWithTransition(newValue) {
    if (!document.startViewTransition) {
    updateDisplayWithFallback(newValue);
    return;
  }

    const parts = newValue.toFixed(decimals.value).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const newValueFormatted = integerPart + (parts.length > 1 ? '.' + parts[1] : '');
  
    const oldValue = displayedDigits.value.join('');
  
    if (oldValue === newValueFormatted) return;
  
    const transition = document.startViewTransition(() => {
    displayedDigits.value = newValueFormatted.split('');
  });
  
    transition.ready.catch(error => {
    console.warn('View transition ready promise rejected:', error);
  });
  
  transition.finished.catch(error => {
    console.warn('View transition finished promise rejected:', error);
  });
}

watch(currentValue, (newValue) => {
  updateDisplayWithTransition(newValue);
});

watch(decimals, () => {
  updateDisplayWithTransition(currentValue.value);
});

onMounted(() => {
  setTimeout(() => {
    transitionsEnabled.value = true;
  }, 100);
});

initializeDisplay();
</script>

<style scoped>
.currency-display {
  display: flex;
  align-items: center;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 7rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #3498db;
}

.currency-symbol {
  font-weight: 500;
  opacity: 0.9;
}

.digits-container {
  display: flex;
  align-items: center;
}

.digit, .decimal-point, .digit-separator {
  position: relative;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: #3498db;
}

.decimal-point, .digit-separator {
  opacity: 0.9;
}

.view-transition-digit {
  view-transition-name: var(--view-transition-name, none);
}

@media (max-width: 768px) {
  .currency-display {
    font-size: 5rem;
  }
}
</style>

<style>

@keyframes currency-digit-slide-in {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes currency-digit-slide-out {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
}


::view-transition-old(currency-digit-*),
::view-transition-new(currency-digit-*) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
}

::view-transition-old(currency-decimal-*),
::view-transition-new(currency-decimal-*),
::view-transition-old(currency-separator-*),
::view-transition-new(currency-separator-*) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
  animation-delay: 0.1s;
}

::view-transition-old(currency-digit-*) {
  animation-name: currency-digit-slide-out;
}

::view-transition-new(currency-digit-*) {
  animation-name: currency-digit-slide-in;
}
</style> 