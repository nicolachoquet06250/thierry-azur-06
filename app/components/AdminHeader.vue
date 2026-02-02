<template>
  <header :class="$style.header">
    <div :class="$style.container">
      <div :class="$style.mobileMenuBtn">
        <button @click="openSidebar" :class="$style.iconBtn">
          <img src="/thierry-azur-06.png" alt="logo" :class="$style.logoImage" />
        </button>
      </div>

      <div :class="$style.mobileLogo">
        <NuxtLink to="/" style="display: block;">
          <img src="/thierry-azur-06.png" alt="logo" :class="$style.logoImage" />
        </NuxtLink>
      </div>
      
      <div :class="$style.desktopMenu">
      </div>

      <div :class="$style.actions">
        <div :class="$style.userInfo" v-if="user">
          <span :class="$style.userName">{{ user.firstName }} {{ user.lastName }}</span>
          <span :class="$style.userRole">{{ user.email }}</span>
        </div>
        <div :class="$style.avatar" @click="openSidebar" style="cursor: pointer;">
          <User :size="20" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { User } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

const user = ref<{ firstName: string; lastName: string; email: string } | null>(null);
const { open: openSidebar } = useAdminSidebar();

onMounted(async () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    try {
      const data = await $fetch('/api/admin/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      user.value = data as { firstName: string; lastName: string; email: string };
    } catch (error: any) {
      console.error('Failed to fetch user info:', error);
      if (error.statusCode === 401) {
        localStorage.removeItem('auth_token');
        navigateTo('/admin/login');
      }
    }
  }
});
</script>

<style module>
.header {
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color); /* slate-200 */
  height: 4rem; /* h-16 */
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 40;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .header {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.container {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 80rem; /* max-w-7xl */
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.mobileLogo {
  display: block;
}

.mobileMenuBtn {
  display: none;
}

@media (max-width: 767px) {
  .mobileLogo {
    display: none;
  }
  .mobileMenuBtn {
    display: block;
  }
}

.iconBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .mobileLogo {
    display: none;
  }
}

.desktopMenu {
  display: none;
}

@media (min-width: 768px) {
  .desktopMenu {
    display: block;
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.userInfo {
  display: none;
  flex-direction: column;
  align-items: flex-end;
}

@media (min-width: 640px) {
  .userInfo {
    display: flex;
  }
}

.userName {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main); /* slate-900 */
  line-height: 1;
}

.userRole {
  font-size: 0.75rem;
  color: var(--text-main); /* slate-500 */
  opacity: 0.7;
  margin-top: 0.25rem;
}

.avatar {
  width: 2.5rem; /* w-10 */
  height: 2.5rem; /* h-10 */
  border-radius: 9999px;
  background-color: var(--bg-main); /* slate-100 */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color); /* slate-200 */
  color: var(--text-main); /* slate-600 */
}

.logoImage {
  height: 2rem; /* h-8 */
  width: auto;
}
</style>
