<template>
  <div :class="$style.authLayout">
    <slot />
  </div>
</template>

<style module>
.authLayout {
  min-height: 100vh;
  background-color: #f3f4f6;
}
</style>
