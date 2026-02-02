<script setup lang="ts">
</script>

<template>
  <div :class="$style.page">
    <section :class="$style.hero">
      <div :class="$style.container">
        <h1>Devis pour Copropriétés & Immeubles</h1>
        <p>Gestionnaire de copropriété ou propriétaire d'immeuble ? Obtenez un devis personnalisé pour l'entretien.</p>
      </div>
    </section>

    <section :class="$style.content">
      <div :class="$style.container">
        <DevisForm 
          initial-subject="Demande de devis pour un immeuble"
          :allowed-subjects="['Demande de devis pour un immeuble', 'Demande de devis pour un copropriété']"
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
