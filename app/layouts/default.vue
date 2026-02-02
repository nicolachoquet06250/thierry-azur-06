<template>
  <div :class="$style.defaultLayout">
    <Header />
    <main :class="$style.main">
      <slot />
    </main>
    <MainFooter />
  </div>
</template>

<script setup>
// Header et MainFooter sont auto-importés s'ils sont dans app/components
</script>

<style module>
.defaultLayout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.main {
  flex: 1;
  background-color: var(--bg-main);
}
</style>
