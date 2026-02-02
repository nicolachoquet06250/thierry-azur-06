<template>
  <NuxtRouteAnnouncer/>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Nuxt 4 components are auto-imported if they are in app/components
// However, since we are in a transition/custom setup, let's ensure it works.
</script>

<style>
* {
  box-sizing: border-box;
}

html, body {
  padding: 0;
  margin: 0;
}
</style>

<style module>
.appContainer {
  min-height: 100vh;
  background-color: var(--bg-main);
}
</style>
