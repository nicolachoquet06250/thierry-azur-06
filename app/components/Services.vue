<script setup>
import { Check, Home, Building2, Building } from 'lucide-vue-next'

const { data: about } = await useFetch('/api/data/about')

const subtitle = computed(() => about.value?.subtitle)

const services = [
  {
    title: 'Particuliers',
    icon: Home,
    items: ['Entretien courant', 'Cuisine / salle de bain', 'Remise en ordre'],
    buttonText: 'Demander un devis',
    link: '/devis/particuliers'
  },
  {
    title: 'Professionnels',
    icon: Building2,
    items: ['Bureaux / locaux', 'Sanitaires', 'Points de contact'],
    buttonText: 'Demander un devis',
    link: '/devis/professionnels'
  },
  {
    title: 'Immeubles & Copropriétés',
    icon: Building,
    items: ['Parties communes', 'Halls / escaliers', 'Paliers / entrées'],
    buttonText: 'Demander un devis',
    link: '/devis/copros-&-immeubles'
  }
]
</script>

<template>
  <section id="services" :class="$style.services">
    <div :class="$style.container">
      <div :class="$style.header">
        <h2 :class="$style.title">Services</h2>
        <p :class="$style.subtitle">{{ subtitle }}</p>
        <div :class="$style.divider"></div>
      </div>

      <div :class="$style.grid">
        <div v-for="service in services" :key="service.title" 
             :class="[$style.card, 'glass-card']">
          <div :class="$style.iconWrapper">
            <component :is="service.icon" :class="$style.icon" />
          </div>
          
          <h3 :class="$style.cardTitle">{{ service.title }}</h3>
          
          <ul :class="$style.itemList">
            <li v-for="item in service.items" :key="item" :class="$style.item">
              <Check :class="$style.checkIcon" />
              <span>{{ item }}</span>
            </li>
          </ul>
          
          <NuxtLink :to="service.link" :class="$style.button">
            {{ service.buttonText }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style module>
.services {
  padding-top: 6rem; /* py-24 */
  padding-bottom: 6rem;
  background-color: var(--bg-main);
}

.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.header {
  text-align: center;
  margin-bottom: 4rem; /* mb-16 */
}

.title {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700;
  color: var(--primary); /* text-blue-900 */
  margin-bottom: 1rem;
}

.subtitle {
  color: var(--text-main); /* text-gray-500 */
  opacity: 0.8;
}

.divider {
  width: 6rem; /* w-24 */
  height: 0.25rem; /* h-1 */
  background-color: var(--accent); /* bg-blue-100 */
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.5rem;
}

.grid {
  display: grid;
  gap: 2rem;
}

.card {
  /* glass-card is in main.css */
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s;
}

.card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: translateY(-0.5rem);
}

.iconWrapper {
  width: 4rem;
  height: 4rem;
  background-color: var(--accent);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  color: var(--primary);
}

.cardTitle {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1.5rem;
}

.itemList {
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem 0;
  width: 100%;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-main);
}

.checkIcon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary);
  flex-shrink: 0;
}

.button {
  margin-top: auto;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.button:hover {
  background-color: var(--secondary);
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
