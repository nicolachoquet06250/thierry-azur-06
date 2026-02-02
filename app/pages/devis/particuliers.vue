<script setup lang="ts">
const { data: metadata } = await useFetch('/api/data/metadata')
const defaultDesc = 'Demandez un devis pour les particuliers.'
const description = computed(() => metadata.value?.description || defaultDesc)

useSeoMeta({
  twitterCard: 'summary',
  twitterTitle: 'Thierry Azur 06 | Demande de devis pour les particuliers',
  twitterDescription: description,
  twitterImage: '/logo.png',
  ogTitle: 'Thierry Azur 06 | Demande de devis pour les particuliers',
  ogDescription: description,
  ogImage: '/thierry-azur-06.png',
  description: description
})
</script>

<template>
  <div :class="$style.page">
    <section :class="$style.hero">
      <div :class="$style.container">
        <h1>Devis pour Particuliers</h1>
        <p>Vous êtes un particulier et vous avez un projet de nettoyage ? Demandez votre devis gratuit.</p>
      </div>
    </section>

    <section :class="$style.content">
      <div :class="$style.container">
        <DevisForm
            initial-subject="Demande de devis pour Particulier"
            :allowed-subjects="['Demande de devis pour Particulier']"
        />
      </div>
    </section>
  </div>
</template>

<style module>
.page {
  padding-top: 80px;
}

.hero {
  background-color: var(--primary);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: white;
}

.hero p {
  color: white;
  opacity: 0.9;
}

.content {
  padding: 60px 0;
  background-color: var(--bg-main);
}
</style>
