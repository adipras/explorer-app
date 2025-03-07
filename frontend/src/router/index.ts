import { createRouter, createWebHistory } from 'vue-router';
import ExplorerView from '../views/ExplorerView.vue';

const routes = [
  {
    path: '/',
    name: 'ExplorerView',
    component: ExplorerView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;