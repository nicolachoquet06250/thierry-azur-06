<script setup lang="ts">
const form = ref({
  nom: '',
  prenom: '',
  email: '',
  objet: '',
  message: ''
})

const code = ref('')
const step = ref(1) // 1: Formulaire, 2: Code de confirmation
const loading = ref(false)
const error = ref('')
const success = ref(false)

const sendCode = async () => {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/send-code', {
      method: 'POST',
      body: { email: form.value.email }
    })
    step.value = 2
  } catch (e: any) {
    error.value = e.data?.statusMessage || "Erreur lors de l'envoi du code"
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...form.value, code: code.value }
    })
    success.value = true
  } catch (e: any) {
    error.value = e.data?.statusMessage || "Code invalide ou erreur lors de l'envoi"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="$style.page">
    <section :class="$style.hero">
      <div :class="$style.container">
        <h1>Me contacter</h1>
        <p>Une question ? Un devis ? N'hésitez pas à nous envoyer un message.</p>
      </div>
    </section>

    <section :class="$style.content">
      <div :class="$style.container">
        <div :class="$style.formCard">
          <div v-if="success" :class="$style.successMessage">
            <h2>Merci !</h2>
            <p>Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</p>
            <button @click="success = false; step = 1; form = { nom: '', prenom: '', email: '', objet: '', message: '' }" :class="$style.button">
              Envoyer un autre message
            </button>
          </div>

          <template v-else>
            <!-- Étape 1 : Formulaire -->
            <form v-if="step === 1" @submit.prevent="sendCode" :class="$style.form">
              <div :class="$style.row">
                <div :class="$style.field">
                  <label for="prenom">Prénom</label>
                  <input type="text" id="prenom" v-model="form.prenom" required placeholder="Votre prénom">
                </div>
                <div :class="$style.field">
                  <label for="nom">Nom</label>
                  <input type="text" id="nom" v-model="form.nom" required placeholder="Votre nom">
                </div>
              </div>

              <div :class="$style.field">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="form.email" required placeholder="votre@email.com">
              </div>

              <div :class="$style.field">
                <label for="objet">Objet</label>
                <input type="text" id="objet" v-model="form.objet" required placeholder="Sujet de votre message">
              </div>

              <div :class="$style.field">
                <label for="message">Message</label>
                <textarea id="message" v-model="form.message" required placeholder="Votre message..." rows="5"></textarea>
              </div>

              <div v-if="error" :class="$style.error">{{ error }}</div>

              <button type="submit" :disabled="loading" :class="$style.button">
                {{ loading ? 'Envoi en cours...' : 'Envoyer le code de confirmation' }}
              </button>
            </form>

            <!-- Étape 2 : Vérification du code -->
            <div v-else :class="$style.verification">
              <h2>Vérification de l'email</h2>
              <p>Un code de confirmation a été envoyé à <strong>{{ form.email }}</strong>. Veuillez le saisir ci-dessous.</p>
              
              <div :class="$style.field">
                <label for="code">Code de confirmation</label>
                <input type="text" id="code" v-model="code" required placeholder="123456" maxlength="6" :class="$style.codeInput">
              </div>

              <div v-if="error" :class="$style.error">{{ error }}</div>

              <div :class="$style.actions">
                <button @click="submitForm" :disabled="loading || code.length < 6" :class="$style.button">
                  {{ loading ? 'Validation...' : 'Confirmer et envoyer' }}
                </button>
                <button @click="step = 1" :class="[$style.button, $style.secondary]">
                  Retour
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<style module>
.page {
  padding-top: 80px;
}

.hero {
  background-color: var(--secondary);
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

.formCard {
  background: var(--bg-card);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-weight: 600;
  color: var(--text-main);
}

.field input, .field textarea {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--bg-main);
  color: var(--text-main);
}

.field input:focus, .field textarea:focus {
  outline: none;
  border-color: var(--primary);
  ring: 2px solid var(--primary);
}

.button {
  background-color: var(--primary);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover:not(:disabled) {
  filter: brightness(1.1);
}

.button:disabled {
  background-color: var(--accent);
  color: var(--text-main);
  opacity: 0.6;
  cursor: not-allowed;
}

.button.secondary {
  background-color: var(--accent);
  color: var(--text-main);
  margin-top: 10px;
}

.error {
  color: #dc2626;
  font-weight: 500;
}

.successMessage {
  text-align: center;
}

.successMessage h2 {
  color: light-dark(#059669, #10b981);
  margin-bottom: 10px;
}

.verification {
  text-align: center;
}

.verification h2 {
  margin-bottom: 10px;
  color: var(--primary);
}

.verification p {
  margin-bottom: 20px;
  color: var(--text-main);
}

.codeInput {
  text-align: center;
  font-size: 1.5rem !important;
  letter-spacing: 0.5rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
</style>
