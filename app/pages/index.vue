<script setup lang="ts">
const { data: metadata } = await useFetch('/api/data/metadata')
const description = computed(() => metadata.value?.description)

useSeoMeta({
  twitterCard: 'summary',
  twitterTitle: 'Thierry Azur 06',
  twitterDescription: description,
  twitterImage: '/logo.png',
  ogTitle: 'Thierry Azur 06',
  ogDescription: description,
  ogImage: '/thierry-azur-06.png',
  description: description
})
</script>

<template>
  <Head>
    <Title>Thierry Azur 06</Title>
  </Head>

  <div>
    <Hero />
    <Services />
    <Zones />
    <FooterSection />
  </div>
</template>
