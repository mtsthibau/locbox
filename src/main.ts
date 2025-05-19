/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';
import { createRouter, createWebHistory } from 'vue-router';

// Composables
import { createApp } from 'vue'


// Components
import App from './App.vue'
import Root from './components/Root.vue';
import Starred from './components/pages/Starred.vue';


// Styles
import 'unfonts.css'

const routes = [
  { path: '/', component: Root },
  { path: '/starred', component: Starred },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

const app = createApp(App)

registerPlugins(app)

app.use(router).mount('#app')
