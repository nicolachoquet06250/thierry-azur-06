<script setup>
const { data: meta } = await useFetch('/api/data/metadata')

const phone = computed(() => meta.value?.phone || '')
const email = computed(() => meta.value?.contactEmail || '')
const updateDate = new Date('01/02/2026').toLocaleDateString('fr-FR')

const siteUrl = computed(() => {
  if (process.client) {
    if (window.location.port !== 80 && window.location.port !== 443) {
      return window.location.hostname + ':' + window.location.port
    }
    return window.location.hostname
  }
  return '';
})
</script>

<template>
  <div :class="$style.page">
    <header :class="$style.header">
      <div :class="$style.container">
        <h1>Politique de confidentialité</h1>
        <p>Dernière mise à jour : {{ updateDate }}</p>
      </div>
    </header>

    <div :class="$style.content">
      <div :class="$style.container">
        <section :class="$style.section">
          <p>
            La présente politique de confidentialité explique comment <strong>Thierry Azur 06</strong> (« nous ») collecte, utilise et protège vos données personnelles lorsque vous utilisez le site <strong>{{ siteUrl }}</strong> (« le Site »).
          </p>
        </section>

        <section :class="$style.section">
          <h2>1) Responsable du traitement</h2>
          <p>Le responsable du traitement est :</p>
          <ul>
            <li><strong>Nom de l’entreprise :</strong> Thierry Azur 06</li>
            <li><strong>Email :</strong> {{ email }}</li>
            <li><strong>Téléphone :</strong> {{ phone }}</li>
          </ul>
        </section>

        <section :class="$style.section">
          <h2>2) Données personnelles collectées</h2>
          <p>Selon votre usage du Site, nous pouvons collecter :</p>
          
          <h3>a) Données que vous nous transmettez</h3>
          <ul>
            <li><strong>Identité et contact :</strong> nom, prénom, email, téléphone</li>
            <li><strong>Contenu :</strong> message libre (demande d’information, demande de devis)</li>
            <li><strong>Données liées à la prestation :</strong> adresse du lieu d’intervention, type de locaux, contraintes, surface approximative, fréquence souhaitée, etc.</li>
          </ul>
          <blockquote>
            <p>Conseil : évitez d’indiquer des données sensibles (santé, opinions, etc.) dans le message.</p>
          </blockquote>

          <h3>b) Données collectées automatiquement</h3>
          <ul>
            <li><strong>Données techniques :</strong> adresse IP, navigateur, appareil, pages consultées, date/heure, logs.</li>
            <li><strong>Cookies/traceurs :</strong> selon les outils utilisés (voir section Cookies).</li>
          </ul>
        </section>

        <section :class="$style.section">
          <h2>3) Finalités du traitement</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li><strong>Répondre à vos demandes</strong> via formulaire, email ou téléphone</li>
            <li><strong>Établir un devis</strong> et gérer les échanges précontractuels</li>
            <li><strong>Gérer la relation client</strong> si vous devenez client (suivi, facturation, SAV)</li>
            <li><strong>Assurer la sécurité et le bon fonctionnement</strong> du Site (logs, prévention d’abus)</li>
          </ul>
        </section>

        <section :class="$style.section">
          <h2>4) Bases légales (RGPD)</h2>
          <p>Les traitements reposent sur :</p>
          <ul>
            <li><strong>Votre consentement</strong> : lorsque vous nous contactez volontairement via formulaire.</li>
            <li><strong>Mesures précontractuelles</strong> : traitement nécessaire pour répondre à une demande de devis.</li>
            <li><strong>Exécution d’un contrat</strong> : si vous devenez client.</li>
            <li><strong>Obligation légale</strong> : conservation de factures/comptabilité.</li>
            <li><strong>Intérêt légitime</strong> : sécurité, prévention de fraude, amélioration du Site.</li>
          </ul>
        </section>

        <section :class="$style.section">
          <h2>5) Durées de conservation</h2>
          <p>Nous conservons vos données uniquement le temps nécessaire :</p>
          <ul>
            <li><strong>Demandes de contact / devis sans suite :</strong> 12 mois</li>
            <li><strong>Prospects (échanges commerciaux) :</strong> 3 ans après le dernier contact</li>
            <li><strong>Clients :</strong> durée de la relation contractuelle puis archivage légal</li>
            <li><strong>Factures / comptabilité :</strong> 10 ans (obligations légales)</li>
            <li><strong>Logs techniques :</strong> 6 à 12 mois</li>
            <li><strong>Cookies :</strong> voir section Cookies (durées variables)</li>
          </ul>
        </section>

        <section :class="$style.section">
          <h2>6) Destinataires des données</h2>
          <p>Vos données sont destinées à <strong>Thierry Azur 06</strong> uniquement.</p>
          <p>Elles peuvent être accessibles à des <strong>sous-traitants</strong> strictement nécessaires :</p>
          <ul>
            <li><strong>Hébergeur :</strong> Alwaysdata</li>
            <li><strong>Outil anti-spam / sécurité :</strong> services de validation d'email</li>
          </ul>
          <p>Nous ne vendons <strong>jamais</strong> vos données.</p>
        </section>

        <section :class="$style.section">
          <h2>7) Transferts hors Union Européenne</h2>
          <p>
            Certaines données peuvent être traitées hors UE via nos prestataires techniques. 
            Dans ce cas, nous nous assurons que des garanties appropriées existent (ex. clauses contractuelles types).
          </p>
        </section>

        <section :class="$style.section">
          <h2>8) Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données (HTTPS, sécurisation des comptes, etc.).
            Aucun système n’étant infaillible, nous ne pouvons garantir une sécurité absolue.
          </p>
        </section>

        <section :class="$style.section">
          <h2>9) Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Accès, rectification, effacement</strong> de vos données</li>
            <li><strong>Limitation et opposition</strong> au traitement</li>
            <li><strong>Portabilité</strong> de vos données</li>
            <li><strong>Retrait du consentement</strong></li>
          </ul>
          <p>
            Pour exercer vos droits, contactez : <strong>{{ email }}</strong>
          </p>
          <p>
            Vous pouvez aussi déposer une réclamation auprès de la <strong>CNIL</strong>.
          </p>
        </section>

        <section :class="$style.section">
          <h2>10) Cookies et traceurs</h2>
          <p>Le Site peut utiliser des cookies pour le fonctionnement technique indispensable.</p>
          <h3>Gestion du consentement</h3>
          <p>
            Vous pouvez paramétrer votre navigateur pour bloquer les cookies. Le refus de certains cookies peut dégrader l’expérience.
          </p>
        </section>

        <section :class="$style.section">
          <h2>11) Formulaire de contact</h2>
          <p>
            Lorsque vous utilisez le formulaire, les informations envoyées sont utilisées <strong>uniquement</strong> pour traiter votre demande.
            Champs collectés : <strong>nom, prénom, email, sujet, message</strong>.
          </p>
        </section>

        <section :class="$style.section">
          <h2>12) Liens vers des sites tiers</h2>
          <p>
            Le Site peut contenir des liens vers des sites externes. Nous ne sommes pas responsables de leurs pratiques de confidentialité.
          </p>
        </section>

        <section :class="$style.section">
          <h2>13) Modification de la politique</h2>
          <p>Nous pouvons mettre à jour cette politique à tout moment. La date de mise à jour figure en haut de page.</p>
        </section>

        <section :class="$style.section">
          <h2>14) Contact</h2>
          <p>Pour toute question sur la confidentialité et vos données :</p>
          <ul>
            <li><strong>Email :</strong> {{ email }}</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style module>
.page {
  padding-top: 80px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.header {
  background-color: #1e3a8a;
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
}

.header p {
  font-size: 1.125rem;
  opacity: 0.9;
}

.content {
  padding: 60px 0;
}

.section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.section h2 {
  color: #1e3a8a;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.section h3 {
  color: #1e3a8a;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.section p {
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1.25rem;
}

.section ul {
  list-style: disc;
  padding-left: 20px;
  margin-bottom: 1.25rem;
}

.section li {
  margin-bottom: 0.75rem;
  color: #475569;
  line-height: 1.5;
}

.section blockquote {
  border-left: 4px solid #1e3a8a;
  padding: 10px 20px;
  background: #f1f5f9;
  margin: 20px 0;
  font-style: italic;
}

.section blockquote p {
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .header h1 {
    font-size: 2rem;
  }
}
</style>
