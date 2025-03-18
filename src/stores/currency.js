import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currentValue: 0,
    decimals: 2,
    presetValues: [
      { value: 0 },
      { value: 100 },
      { value: 98 },
      { value: 999.99 },
      { value: 1234.56 },
      { value: 7 },
      { value: 42 },
    ]
  }),
  
  actions: {
    setValue(value) {
      this.currentValue = value;
    },
    
    setDecimals(decimals) {
      this.decimals = decimals;
    },
    
    formatCurrency(value) {
      const parts = value.toFixed(this.decimals).split('.');
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `$${integerPart}${parts.length > 1 ? '.' + parts[1] : ''}`;
    }
  }
}) 