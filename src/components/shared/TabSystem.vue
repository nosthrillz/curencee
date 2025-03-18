<template>
  <div class="tab-system">
    <div class="tab-navigation">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="selectTab(tab.id)"
        class="tab-button"
        :class="{ 'active': activeTab === tab.id }"
      >
        {{ tab.title }}
      </button>
    </div>
    
    <div class="tab-content">
      <slot :name="activeTab"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  initialTab: {
    type: String,
    default: 'view'
  },
  tabs: {
    type: Array,
    default: () => [
      { id: 'view', title: 'View Transitions' },
      { id: 'classic', title: 'Classic Transitions' }
    ]
  }
});

const activeTab = ref(props.initialTab);

function selectTab(tabId) {
  activeTab.value = tabId;
}
</script>

<style scoped>
.tab-system {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tab-navigation {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.tab-button.active {
  background-color: #3498db;
  color: white;
}

.tab-content {
  flex: 1;
  padding: 1rem;
}
</style> 