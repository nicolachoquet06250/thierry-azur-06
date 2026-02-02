<template>
  <div :class="$style.layout">
    <AdminSidebar />
    <div :class="$style.mainContent">
      <AdminHeader />
      <main :class="[$style.scrollArea, $route.path === '/admin/change-password' ? $style.changePassword : '']">
        <div :class="$style.container">
          <slot />
        </div>
      </main>
    </div>
    <ConfirmModal />
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '~/components/AdminHeader.vue';
import AdminSidebar from '~/components/AdminSidebar.vue';
import ConfirmModal from '~/components/ConfirmModal.vue';
</script>

<style module>
.layout {
  display: flex;
  background-color: var(--bg-main); /* slate-50 */
  min-height: 100vh;
  isolation: isolate;
}

.mainContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.scrollArea {
  flex: 1;
  overflow-y: auto;

  &:not(&.changePassword) {
    padding: 1rem;
  }
}

.container {
  max-width: 80rem; /* max-w-7xl */
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .scrollArea {
    /*&:not(&.changePassword) {
      padding: 2rem;
    }*/
  }
}
</style>
