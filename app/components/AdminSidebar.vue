<script setup lang="ts">
import { LayoutDashboard, Users, MessageSquare, LogOut, Database, MapPin } from 'lucide-vue-next';

const router = useRouter();
const { success: notifySuccess } = useNotify();
const { isOpen, close } = useAdminSidebar();

const logout = () => {
  close();
  localStorage.removeItem('auth_token');
  notifySuccess('Déconnexion', 'Vous avez été déconnecté avec succès');
  router.push('/admin/login');
};

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Données Site', href: '/admin/data', icon: Database },
  { name: 'Villes', href: '/admin/cities', icon: MapPin },
  { name: 'Contacts', href: '/admin/contact', icon: MessageSquare },
  { name: 'Devis', href: '/admin/devis', icon: Users },
];
</script>

<template>
    <!-- Overlay pour mobile -->
    <div 
      v-if="isOpen" 
      :class="$style.overlay" 
      @click="close"
    ></div>

    <aside :class="[$style.sidebar, isOpen && $style.sidebarOpen]">
      <div :class="$style.logoContainer">
        <div :class="$style.logoIcon">
          <NuxtLink to="/" @click="close">
            <img src="/thierry-azur-06_white_transparent.png" alt="logo" height="24" width="auto" style="height: 24px; width: auto;" />
          </NuxtLink>
        </div>
        <span :class="$style.logoText">Admin<span :class="$style.logoTextHighlight">Panel</span></span>
      </div>
      
      <nav :class="$style.nav">
        <NuxtLink 
          v-for="item in navigation" 
          :key="item.name"
          :to="item.href"
          :class="[$style.navItem, $route.path === item.href && $style.navItemActive]"
          @click="close"
        >
          <component :is="item.icon" :class="$style.icon" />
          <span>{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <div :class="$style.footer">
        <button 
          @click="logout" 
          :class="$style.logoutButton"
        >
          <LogOut :class="$style.icon" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
</template>

<style module>
.sidebar {
  width: 16rem; /* w-64 */
  background-color: var(--secondary); /* slate-900 */
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.sidebarOpen {
  transform: translateX(0);
}

.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 45;
  backdrop-filter: blur(4px);
}

@media (min-width: 768px) {
  .sidebar {
    position: sticky;
    transform: none;
    flex-shrink: 0;
  }
  .overlay {
    display: none;
  }
}

.logoContainer {
  padding: 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  border-bottom: 1px solid #1e293b; /* slate-800 */
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #60a5fa; /* blue-400 */
  cursor: pointer;
}

.logoIcon {
  border-radius: 0.5rem;
  transition: transform 0.3s;
}

.logoContainer:hover .logoIcon {
  transform: scale(1.1);
}

.logoText {
  font-size: 1.125rem;
  letter-spacing: -0.025em;
  color: #ffffff;
}

.logoTextHighlight {
  color: #3b82f6; /* blue-500 */
}

.nav {
  flex: 1;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.navItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  text-decoration: none;
  color: #94a3b8; /* slate-400 */
}

.navItem:hover {
  background-color: #1e293b; /* slate-800 */
  color: #ffffff;
}

.navItemActive {
  background-color: var(--primary); /* blue-600 */
  color: #ffffff;
}

.footer {
  padding: 1rem;
  border-top: 1px solid #1e293b; /* slate-800 */
}

.logoutButton {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  width: 100%;
  border-radius: 0.5rem;
  transition: all 0.2s;
  text-align: left;
  background: transparent;
  border: none;
  color: #94a3b8; /* slate-400 */
  cursor: pointer;
  font-size: 1rem;
}

.logoutButton:hover {
  background-color: #dc2626; /* red-600 */
  color: #ffffff;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
