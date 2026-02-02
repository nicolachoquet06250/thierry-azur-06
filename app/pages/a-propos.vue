<script setup lang="ts">
const { data: about } = await useFetch('/api/data/about')
const { data: values } = await useFetch('/api/data/about-values')

const subtitle = computed(() => about.value?.subtitle || "Votre partenaire de confiance pour le nettoyage sur la Côte d'Azur.")
const historyTitle = computed(() => about.value?.historySectionTitle || "Notre Histoire")
const historyContent = computed(() => about.value?.historySectionContent.split('\n') || ["Thierry Azur 06 est une entreprise spécialisée dans le nettoyage professionnel..."])
const valuesTitle = computed(() => about.value?.valuesSectionTitle || "Nos Valeurs")
const aboutImage = computed(() => about.value?.imageContent || "https://placehold.co/485x300.png")
</script>

<template>
  <div :class="$style.page">
    <section :class="$style.hero">
      <div :class="$style.container">
        <h1>À propos de Thierry Azur 06</h1>
        <p>{{ subtitle }}</p>
      </div>
    </section>

    <section :class="$style.content">
      <div :class="$style.container">
        <div :class="$style.grid">
          <div :class="$style.textContent">
            <h2>{{ historyTitle }}</h2>
            <div :class="$style.historyContent">
              <p v-for="line in historyContent">
                {{line}}
              </p>
            </div>
            
            <h2>{{ valuesTitle }}</h2>
            <ul>
              <li v-for="value in values" :key="value.id">
                <strong>{{ value.title }} :</strong> {{ value.description }}
              </li>
            </ul>
          </div>
          <div :class="$style.imagePlaceholder">
            <img :src="aboutImage" alt="À propos" style="border-radius: 12px; max-width: 485px;">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style module>
.page {
  padding-top: 80px; /* Espace pour le header fixe */
}

.hero {
  background-color: var(--secondary);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: white;
}

.hero p {
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto;
  color: white;
  opacity: 0.9;
}

.content {
  padding: 80px 0;
  background-color: var(--bg-main);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.textContent {
  max-width: 100vw;
}

.imagePlaceholder {
  max-width: 100vw;

  > img {
    max-width: calc(100vw - 40px);
  }
}

.textContent h2 {
  color: var(--primary);
  margin-top: 40px;
  margin-bottom: 20px;
}

.textContent h2:first-child {
  margin-top: 0;
}

.textContent p, .historyContent {
  line-height: 1.6;
  color: var(--text-main);
  margin-bottom: 20px;
}

.textContent ul {
  list-style: none;
  padding: 0;
}

.textContent li {
  margin-bottom: 15px;
  color: var(--text-main);
}

.textContent li strong {
  color: var(--primary);
}

.imagePlaceholder {
  display: flex;
  justify-content: center;
}
</style>
