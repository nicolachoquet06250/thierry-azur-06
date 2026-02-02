export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return;

  const token = localStorage.getItem('auth_token');

  if (to.path.startsWith('/admin') && to.path !== '/admin/login' && to.path !== '/admin/verify') {
    if (!token) {
      return navigateTo('/admin/login');
    }
  }
});
