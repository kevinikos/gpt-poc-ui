import { createRouter, createWebHistory } from 'vue-router';
import AppArticles from '@/pages/AppArticles.vue';
import AppMap from '@/pages/AppMap.vue';

const routes = [
  { path: '/', component: AppMap },
  { path: '/articles', component: AppArticles },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default {};
