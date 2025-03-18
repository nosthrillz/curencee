import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

if (!document.startViewTransition) {
  document.startViewTransition = (callback) => {
    callback();
    return {
      finished: Promise.resolve(),
      ready: Promise.resolve(),
      updateCallbackDone: Promise.resolve()
    };
  };
}

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
