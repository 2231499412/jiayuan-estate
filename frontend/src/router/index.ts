import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/list', component: () => import('../views/List.vue') },
  { path: '/detail/:id', component: () => import('../views/Detail.vue') },
  { path: '/about', component: () => import('../views/About.vue') },
  { path: '/admin/login', component: () => import('../views/admin/Login.vue') },
  {
    path: '/admin',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/properties',
    component: () => import('../views/admin/Properties.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return '/admin/login';
  }
});

export default router;
