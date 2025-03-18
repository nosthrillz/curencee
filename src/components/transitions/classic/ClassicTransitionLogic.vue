<template>
  <div class="currency-display">
    <div class="currency-symbol">$</div>
    
    <div class="digits-wrapper">
      <div 
        v-for="(digit, index) in displayedDigits" 
        :key="`digit-${index}`"
        class="digit-slot"
        :class="{ 
          'decimal-point': digit.isDecimalPoint,
          'digit-separator': digit.isSeparator,
          'compressed': isCompressed && (digit.isDecimalPoint || digit.isSeparator)
        }"
        :style="{ 
          transitionDelay: getTransitionDelay(digit, index),
          zIndex: getZIndex(digit, index)
        }"
      >
        <transition :name="getTransitionName(digit)" mode="out-in">
          <div 
            :key="`${digit.id}-${digit.value}`" 
            class="digit-value"
            :class="{ 
              'cycling': digit.cycling, 
              'sliding': digit.sliding,
              'dot-moving': digit.isDecimalPoint && digit.moving
            }"
            :style="{ 
              '--cycle-delay': getAnimationDelay(digit, index),
              '--cycling-duration': `${Math.max(300, 400 - (index * 50))}ms`,
              '--slide-direction': digit.slideDirection,
              '--dot-start-position': digit.startPosition,
              '--dot-end-position': digit.endPosition
            }"
          >
            {{ digit.value }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCurrencyStore } from '@/stores/currency';
import { storeToRefs } from 'pinia';

const store = useCurrencyStore();
const { currentValue, decimals } = storeToRefs(store);

const displayedDigits = ref([]);
const digitIdCounter = ref(0);
const isCompressed = ref(true);

const TIMINGS = {
  SLIDE_DURATION: 350,
  CYCLE_DURATION: 450,
  DOT_DURATION: 550,
  STEP_DELAY: 120
};

function getTransitionDelay(digit, index) {
  if (digit.isDecimalPoint) {
        return `${TIMINGS.SLIDE_DURATION + 50}ms`;
  } else if (digit.isSeparator) {
        return `${TIMINGS.SLIDE_DURATION + (index * 30)}ms`;
  } else if (digit.sliding) {
        return `0ms`;
  } else if (digit.cycling) {
        return `${TIMINGS.SLIDE_DURATION + TIMINGS.STEP_DELAY + (index * 50)}ms`;
  }
  return `${index * 50}ms`;
}

function getAnimationDelay(digit, index) {
  if (digit.cycling) {
    return `${index * 50}ms`;
  }
  return '0ms';
}

function getZIndex(digit, index) {
  if (digit.isDecimalPoint) {
    return 100;   }
  return displayedDigits.value.length - index;
}

function getTransitionName(digit) {
  if (digit.isDecimalPoint && digit.moving) {
    return 'decimal-arc';
  } else if (digit.sliding) {
    return digit.slideDirection === 'left' ? 'slide-left' : 'slide-right';
  }
  return 'slide-fade';
}

function updateDisplayedDigits(oldValue, newValue) {
    const formatValue = (val) => {
    const parts = val.toFixed(decimals.value).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return integerPart + (parts.length > 1 ? '.' + parts[1] : '');
  };
  
  const oldFormatted = formatValue(oldValue);
  const newFormatted = formatValue(newValue);
  const oldDigits = oldFormatted.split('');
  const newDigits = newFormatted.split('');
  
  const oldNumericCount = oldDigits.filter(d => !isNaN(parseInt(d))).length;
  const newNumericCount = newDigits.filter(d => !isNaN(parseInt(d))).length;
  
  const isIncreasing = newNumericCount > oldNumericCount;
  const isDecreasing = newNumericCount < oldNumericCount;
  
  const oldDotIndex = oldDigits.indexOf('.');
  const newDotIndex = newDigits.indexOf('.');
  const dotMoving = oldDotIndex !== newDotIndex;
  
    const result = newDigits.map((digitValue, index) => {
        const prevDigit = index < oldDigits.length ? oldDigits[index] : null;
    
        const isDecimalPoint = digitValue === '.';
    const isSeparator = digitValue === ',';
    
        let sliding = false;
    let cycling = false;
    let slideDirection = null;
    let moving = false;
    let startPosition = 0;
    let endPosition = 0;
    
    if (isDecimalPoint) {
            moving = dotMoving;
      startPosition = oldDotIndex;
      endPosition = newDotIndex;
    } else if (isSeparator) {
          } else if ((isIncreasing || isDecreasing) && index === 0) {
            sliding = true;
      slideDirection = isIncreasing ? 'right' : 'left';
    } else if (!isDecimalPoint && !isSeparator) {
            const isNumeric = !isNaN(parseInt(digitValue));
      
      if (isNumeric) {
        if (prevDigit === undefined) {
                    sliding = true;
          slideDirection = 'right';
        } else if (prevDigit !== digitValue && prevDigit !== null) {
                    const prevIsNumeric = !isNaN(parseInt(prevDigit));
          
          if (prevIsNumeric) {
            cycling = true;
          }
        }
      }
    }
    
    return {
      id: digitIdCounter.value++,
      value: digitValue,
      isDecimalPoint,
      isSeparator,
      sliding,
      cycling,
      slideDirection,
      moving,
      startPosition,
      endPosition
    };
  });
  
  displayedDigits.value = result;
}

function animateValueChange(oldValue, newValue) {
  if (oldValue === newValue) return;
  
    isCompressed.value = false;
  
    updateDisplayedDigits(oldValue, newValue);
  
    const dotMoveDuration = TIMINGS.SLIDE_DURATION + TIMINGS.CYCLE_DURATION + TIMINGS.STEP_DELAY * 2;
  
    setTimeout(() => { 
    isCompressed.value = true; 
  }, dotMoveDuration + 200);
}

watch(currentValue, (newValue, oldValue) => {
  if (oldValue !== undefined) {
        animateValueChange(oldValue, newValue);
  } else {
        const formattedValue = newValue.toFixed(decimals.value);
    const parts = formattedValue.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = integerPart + (parts.length > 1 ? '.' + parts[1] : '');
    
    displayedDigits.value = formatted.split('').map((value) => ({
      id: digitIdCounter.value++,
      value,
      isDecimalPoint: value === '.',
      isSeparator: value === ',',
      sliding: false,
      cycling: false,
      moving: false
    }));
    
        isCompressed.value = true;
  }
}, { immediate: true });

watch(decimals, () => {
    animateValueChange(currentValue.value, currentValue.value);
});
</script>

<style scoped>
.currency-display {
  display: flex;
  align-items: center;
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #3498db;
}

.currency-symbol {
  font-weight: 500;
  opacity: 0.9;
}

.digits-wrapper {
  display: flex;
  position: relative;
  align-items: center;
}

.digit-slot {
  position: relative;
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 0.6em;
  text-align: center;
  display: flex;
  justify-content: center;
}


.decimal-point {
  min-width: 0.6em;
  opacity: 0.9;
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}


.decimal-point.compressed {
  min-width: 0.2em;
  margin: 0 0.05em;
}

.digit-separator {
  opacity: 0.7;
  min-width: 0.4em;
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.digit-separator.compressed {
  min-width: 0.2em;
  margin: 0 0.05em;
  font-weight: 400;
}

.digit-value {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  position: relative;
  will-change: transform, opacity;
}


.digit-value.cycling {
  animation: digit-cycle 0.8s steps(10, end) both;
  animation-delay: var(--cycle-delay, 0ms);
  animation-duration: var(--cycling-duration, 400ms);
}

@keyframes digit-cycle {
  0% {
    opacity: 0.8;
    transform: translateY(0);
  }
  10% { content: "0"; }
  20% { content: "1"; }
  30% { content: "2"; }
  40% { content: "3"; }
  50% { content: "4"; }
  60% { content: "5"; }
  70% { content: "6"; }
  80% { content: "7"; }
  90% { content: "8"; }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}


.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}


.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}


.decimal-arc-enter-active,
.decimal-arc-leave-active {
  transition: all 0.55s cubic-bezier(0.5, -0.5, 0.5, 1.5);
}

.decimal-arc-enter-from {
  opacity: 0;
  transform: translate(0, -40px) scale(0.8);
}

.decimal-arc-leave-to {
  opacity: 0;
  transform: translate(0, 40px) scale(0.8);
}


.dot-moving {
  animation: dot-arc 0.55s cubic-bezier(0.5, -0.5, 0.5, 1.5) both;
  animation-delay: 0ms;
}

@keyframes dot-arc {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(30px) scale(1.2);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style> 