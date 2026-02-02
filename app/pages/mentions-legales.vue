<script setup>
const { data: meta } = await useFetch('/api/data/metadata')

const phone = computed(() => meta.value?.phone || '')
const email = computed(() => meta.value?.contactEmail || '')
</script>

<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <div :class="$style.container">
        <h1>Mentions Légales</h1>
        <p>Informations obligatoires concernant l'éditeur et l'hébergeur du site.</p>
      </div>
    </header>

    <div :class="$style.content">
      <div :class="$style.container">
        <section :class="$style.section">
          <h2>1) Éditeur du site</h2>
          <p>Le présent site est édité par :</p>
          <ul>
            <li><strong>Nom / Raison sociale :</strong> Nicolas Choquet</li>
            <li><strong>Statut :</strong> Micro-entreprise</li>
            <li><strong>Email :</strong> contact@nicolas-choquet.fr</li>
            <li><strong>SIRET :</strong> 98876402300012</li>
            <li><strong>RCS / RM :</strong> Dispensé d’immatriculation</li>
            <li><strong>TVA intracommunautaire :</strong> TVA non applicable, art. 293 B du CGI</li>
          </ul>
        </section>

        <section :class="$style.section">
          <h2>2) Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul>
            <li><strong>Hébergeur :</strong> Alwaysdata</li>
            <li><strong>Adresse :</strong> 91 rue du Faubourg Saint Honoré - 75008 Paris</li>
            <li><strong>Téléphone :</strong> +33 1 84 16 23 40</li>
            <li><strong>Site web :</strong> https://alwaysdata.com</li>
          </ul>
        </section>

        <section :class="$style.section">
          <h2>3) Activité</h2>
          <p>
            Le site a pour objet la présentation de prestations de <strong>ménage / nettoyage</strong> destinées aux 
            <strong>particuliers</strong>, <strong>professionnels</strong>, <strong>immeubles</strong> et <strong>copropriétés</strong>, 
            ainsi que la prise de contact et/ou la demande de devis.
          </p>
        </section>

        <section :class="$style.section">
          <h2>4) Propriété intellectuelle</h2>
          <p>
            L’ensemble du contenu présent sur ce site (textes, images, logos, éléments graphiques, structure, etc.) est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive de l’éditeur, sauf mention contraire.
            Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section :class="$style.section">
          <h2>5) Responsabilité</h2>
          <p>
            L’éditeur s’efforce d’assurer au mieux l’exactitude et la mise à jour des informations diffusées sur le site. Toutefois, l’éditeur ne saurait garantir l’exactitude, la précision ou l’exhaustivité des informations mises à disposition.
            L’utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
          </p>
          <p>
            Le site peut contenir des liens vers des sites tiers. L’éditeur ne peut être tenu responsable du contenu de ces sites externes.
          </p>
        </section>

        <section :class="$style.section">
          <h2>6) Données personnelles (RGPD)</h2>
          <p>
            Le site peut collecter des données personnelles via ses formulaires de contact (ex. : nom, email, téléphone, message) afin de répondre aux demandes d’informations et/ou de devis.
          </p>
          <ul>
            <li><strong>Responsable de traitement :</strong> Thierry Azur 06</li>
            <li><strong>Finalités :</strong> répondre aux demandes, gestion de la relation commerciale, établissement de devis.</li>
            <li><strong>Base légale :</strong> intérêt légitime (réponse aux sollicitations) et/ou mesures précontractuelles.</li>
            <li><strong>Durée de conservation :</strong> 12 mois pour les demandes sans suite / 3 ans pour les prospects / durée légale si client</li>
            <li><strong>Destinataires :</strong> le propriétaire du site uniquement.</li>
            <li><strong>Droits :</strong> accès, rectification, effacement, limitation, opposition, portabilité (selon cas).</li>
          </ul>
          <p>
            Pour exercer vos droits, contactez : <strong>{{ email }}</strong>.<br>
            En cas de désaccord, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong>.
          </p>
        </section>

        <section :class="$style.section">
          <h2>7) Cookies</h2>
          <p>Le site peut utiliser des cookies et/ou traceurs pour :</p>
          <ul>
            <li>assurer le bon fonctionnement du site,</li>
            <li>mesurer l’audience (statistiques),</li>
            <li>améliorer l’expérience utilisateur.</li>
          </ul>
          <p>
            Vous pouvez configurer votre navigateur pour refuser les cookies ou être informé de leur dépôt.
            <em>(Si tu utilises Google Analytics / Matomo / Pixel etc., il faut le préciser ici + prévoir un bandeau de consentement si nécessaire.)</em>
          </p>
        </section>

        <section :class="$style.section">
          <h2>8) Contact</h2>
          <p>Pour toute question, vous pouvez contacter le propriétaire du site :</p>
          <ul>
            <li><strong>Email :</strong> {{ email }}</li>
            <li><strong>Téléphone :</strong> {{ phone }}</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style module>
.page {
  padding-top: 80px;
  background-color: var(--bg-main);
  min-height: 100vh;
}

.header {
  background-color: var(--primary);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
}

.header p {
  font-size: 1.125rem;
  opacity: 0.9;
  color: white;
}

.content {
  padding: 60px 0;
}

.section {
  background: var(--bg-card);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
  color: var(--text-main);
}

.section h2 {
  color: var(--primary);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid var(--accent);
  padding-bottom: 0.75rem;
}

.section p {
  line-height: 1.7;
  color: var(--text-main);
  margin-bottom: 1.25rem;
  opacity: 0.9;
}

.section ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1.25rem;
}

.section li {
  margin-bottom: 0.75rem;
  color: var(--text-main);
  line-height: 1.5;
}

.section li strong {
  color: var(--primary);
  min-width: 180px;
  display: inline-block;
}

@media (max-width: 640px) {
  .section li strong {
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}
</style>
