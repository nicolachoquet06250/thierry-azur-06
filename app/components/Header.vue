<template>
<span/>
<header :class="[$style.header, {
  [$style.scrolled]: isDarkPage ? true : isScrolled
}]">
    <nav :class="$style.nav">
      <div :class="$style.logoWrapper">
        <NuxtLink to="/" :class="$style.logoLink">
          <div :class="$style.logoText">
            <img v-if="isDarkPage ? true : isScrolled" src="/thierry-azur-06.png" alt="logo" style="width: 150px;" />
            <img v-else src="/thierry-azur-06_white_transparent.png" alt="logo" style="width: 150px;" />
          </div>
        </NuxtLink>
      </div>
      
      <div :class="$style.desktopNav">
        <NuxtLink to="/" :class="$style.navLink">Accueil</NuxtLink>
        <NuxtLink to="/#services" :class="$style.navLink">Services</NuxtLink>
        <NuxtLink to="/#zones" :class="$style.navLink">Zones</NuxtLink>
        <NuxtLink to="/#avis" :class="$style.navLink">Avis</NuxtLink>
        <NuxtLink to="/a-propos" :class="$style.navLink">À propos</NuxtLink>
        <NuxtLink to="/devis" :class="$style.navLink">Devis</NuxtLink>
        <NuxtLink to="/contact" :class="$style.navLink">Contact</NuxtLink>
        <NuxtLink to="/devis" :class="$style.ctaButton">
          Devis gratuit
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button :class="$style.mobileMenuButton" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile Navigation -->
    <div v-if="isMobileMenuOpen" :class="$style.mobileNav">
      <NuxtLink to="/" :class="$style.mobileNavLink" @click="isMobileMenuOpen = false">Accueil</NuxtLink>
      <NuxtLink to="/#services" :class="$style.mobileNavLink" @click="isMobileMenuOpen = false">Services</NuxtLink>
      <NuxtLink to="/#zones" :class="$style.mobileNavLink" @click="isMobileMenuOpen = false">Zones</NuxtLink>
      <NuxtLink to="/#avis" :class="$style.mobileNavLink" @click="isMobileMenuOpen = false">Avis</NuxtLink>
      <NuxtLink to="/a-propos" :class="$style.mobileNavLink" @click="isMobileMenuOpen = false">À propos</NuxtLink>
      <NuxtLink to="/devis" :class="$style.mobileNavLink" @click="isMobileMenuOpen = false">Devis</NuxtLink>
      <NuxtLink to="/contact" :class="$style.mobileNavLink" @click="isMobileMenuOpen = false">Contact</NuxtLink>
      <NuxtLink to="/devis" :class="$style.mobileCtaButton" @click="isMobileMenuOpen = false">
        Devis gratuit
      </NuxtLink>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const isDarkPage = computed(() => {
  return route.path === '/a-propos' || 
         route.path === '/contact' || 
         route.path.startsWith('/devis') ||
         route.path === '/mentions-legales' ||
         route.path === '/confidentialite'
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style module>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  background-color: transparent;
}

.scrolled {
  background-color: light-dark(rgba(255, 255, 255, 0.8), rgba(15, 23, 42, 0.8));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.nav {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: padding 0.3s ease;
}

.scrolled .nav {
  padding: 0.75rem 1.5rem;
}

.logoLink {
  text-decoration: none;
  display: block;
}

.logoText {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.desktopNav {
  display: none;
  align-items: center;
  gap: 2.5rem;
}

.navLink {
  font-weight: 600;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9375rem;
}

.scrolled .navLink {
  color: var(--text-main);
}

.navLink:hover {
  color: light-dark(#60a5fa, #93c5fd) !important;
}

.ctaButton {
  background-color: var(--primary);
  color: white;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px -1px rgba(59, 130, 246, 0.4);
}

.ctaButton:hover {
  background-color: var(--secondary);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -1px rgba(59, 130, 246, 0.5);
}

.mobileMenuButton {
  display: block;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;

  > svg {
    width: 20px;
  }
}

.scrolled .mobileMenuButton {
  color: var(--primary);
}

.mobileNav {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: light-dark(rgba(255, 255, 255, 0.8), rgba(15, 23, 42, 0.8));
  -webkit-backdrop-filter: blur(12px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15);
  border-top: 1px solid var(--border-color);
}

.scrolled .mobileNav {
  backdrop-filter: blur(12px);
}

.mobileNavLink {
  font-weight: 600;
  color: var(--text-main);
  text-decoration: none;
  font-size: 1.125rem;
}

.mobileCtaButton {
  background-color: var(--primary);
  color: white;
  padding: 0.875rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
}

@media (min-width: 768px) {
  .desktopNav {
    display: flex;
  }

  .mobileMenuButton {
    display: none;
  }
}
</style>
