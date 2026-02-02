<script setup>
import { Check } from 'lucide-vue-next'

const { data: metadata } = await useFetch('/api/data/metadata')

const handleCall = () => {
  const phone = metadata.value?.phone || import.meta.env.VITE_PHONE
  window.location.href = `tel:${phone}`
}

const heroImage = computed(() => {
  return metadata.value?.imageHeroContent || '/img/hero_background.png'
})
</script>

<template>
  <section id="accueil" :class="$style.hero">
    <!-- Background Image -->
    <div :class="$style.backgroundWrapper">
      <img :src="heroImage" alt="Nettoyage professionnel" :class="$style.backgroundImage" />
      <div :class="$style.overlay"></div> <!-- Overlay for better text readability -->
    </div>
    
    <div :class="$style.container">
      <div :class="$style.contentWrapper">
        <!-- Text Content -->
        <div :class="$style.content">
          <h1 :class="$style.title">
            Ménage pro & particulier.<br/>
            <span :class="$style.titleAccent">Finitions impeccables.</span>
          </h1>
          <p :class="$style.description">
            Pour particuliers, professionnels, immeubles, copropriétés...<br/>
            Un seul interlocuteur : Thierry.
          </p>
          
          <div :class="$style.buttonGroup">
            <NuxtLink custom to="/devis" :class="$style.primaryButton">
              <template #default="{navigate}">
                <button @click="navigate">
                  Demander un devis gratuit
                </button>
              </template>
            </NuxtLink>
            <button :class="$style.secondaryButton" @click="handleCall">
              Appeler Thierry
            </button>
          </div>
          
          <div :class="$style.features">
            <div :class="$style.featureItem">
              <div :class="$style.checkIcon">
                <Check :class="$style.icon" />
              </div>
              Particuliers - Pros - Immeubles - Copropriétés
            </div>
            <div :class="$style.featureItem">
              <div :class="$style.checkIcon">
                <Check :class="$style.icon" />
              </div>
              Devis rapide & réponse sous 24h
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style module>
.hero {
  position: relative;
  min-height: 700px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.backgroundWrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.backgroundImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(30, 58, 138, 0.4); /* bg-blue-900/40 */
}

.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 8rem; /* Increased to account for fixed header */
  position: relative;
  z-index: 10;
}

.contentWrapper {
  max-width: 48rem; /* max-w-3xl */
}

.content {
  z-index: 10;
  color: white;
}

.title {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 1.5rem;
}

.titleAccent {
  color: #93c5fd; /* text-blue-300 */
}

.description {
  font-size: 1.25rem; /* text-xl */
  margin-bottom: 2.5rem;
  max-width: 42rem; /* max-w-2xl */
  color: #f0f9ff; /* text-blue-50 */
  font-weight: 500;
}

.buttonGroup {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.primaryButton {
  background-color: #3b82f6;
  color: white;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: pointer;
}

.primaryButton:hover {
  background-color: #2563eb;
  transform: translateY(-0.25rem);
}

.secondaryButton {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: white;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;
}

.secondaryButton:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-0.25rem);
}

.features {
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  row-gap: 1rem;
  margin-bottom: 50px;
}

.featureItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  justify-content: center;
}

.checkIcon {
  background-color: #3b82f6;
  border-radius: 9999px;
  min-width: 30px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 1rem;
  height: 1rem;
  color: white;
}

@media (min-width: 768px) {
  .backgroundImage {
    object-position: center;
  }
  .title {
    font-size: 3rem; /* text-5xl */
  }
  .description {
    font-size: 1.5rem; /* text-2xl */
  }
}

@media (min-width: 1024px) {
  .title {
    font-size: 4.5rem; /* text-7xl */
  }
}
</style>
