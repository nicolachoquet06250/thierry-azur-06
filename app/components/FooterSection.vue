<script setup>
import { Star } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const { data: about } = await useFetch('/api/data/about')
const { data: cities } = await useFetch('/api/data/cities')
const { data: dbReviews, refresh: refreshReviews } = await useFetch('/api/data/reviews')

const rating = ref(5)
const form = ref({
  fullName: '',
  email: '',
  type: 'professionnel',
  cityId: null,
  message: ''
})

const code = ref('')
const isSubmitting = ref(false)
const isSendingCode = ref(false)
const step = ref(1) // 1: Formulaire, 2: Code de confirmation
const submitSuccess = ref(false)
const submitError = ref('')

const title = computed(() =>
    about.value?.reviewsSectionTitle)

const sectionSubtitle = computed(() =>
    about.value?.reviewsSectionSubtitle)

const sectionRating = computed(() => {
  if (!dbReviews.value || dbReviews.value.length === 0) {
    return 5
  }
  const sum = dbReviews.value.reduce((acc, r) => acc + r.note, 0)
  return Math.round((sum / dbReviews.value.length) * 10) / 10
})

const displayRating = computed(() => Math.round(sectionRating.value))

const reviews = computed(() => (dbReviews.value || []).map((r) => ({
  name: r.fullName,
  image: `https://placehold.co/150?text=${r.fullName.split(' ')[0].substring(0, 1).toUpperCase()}${r.fullName.split(' ')[1].substring(0, 1).toUpperCase()}`,
  text: r.message || '',
  rating: r.note
})))

const handleSendCode = async () => {
  if (!form.value.email) {
    submitError.value = "Veuillez saisir votre adresse email pour recevoir le code."
    return
  }
  
  isSendingCode.value = true
  submitError.value = ''
  
  try {
    await $fetch('/api/send-code', {
      method: 'POST',
      body: { email: form.value.email }
    })
    step.value = 2
  } catch (e) {
    submitError.value = e.data?.statusMessage || "Erreur lors de l'envoi du code de vérification."
  } finally {
    isSendingCode.value = false
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    await $fetch('/api/reviews', {
      method: 'POST',
      body: {
        ...form.value,
        note: rating.value,
        code: code.value
      }
    })
    await refreshReviews()
    submitSuccess.value = true
    form.value = {
      fullName: '',
      email: '',
      type: 'professionnel',
      cityId: null,
      message: ''
    }
    rating.value = 5
    code.value = ''
    step.value = 1
  } catch (e) {
    submitError.value = e.data?.statusMessage || "Erreur lors de l'envoi de votre avis."
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section id="avis" :class="$style.footerSection">
    <!-- Footer/Bottom shape background -->
    <div :class="[$style.shapeBackground, 'bg-footer-shape']"/>

    <div :class="$style.container">
      <div :class="$style.header">
        <h2 :class="$style.title">{{ title }}</h2>
        <div :class="$style.ratingWrapper">
          <Star v-for="i in displayRating" :key="i" :class="$style.starIcon" />
          <Star v-for="i in 5 - displayRating" :key="i" :class="[$style.starIcon, $style.empty]" />
          <span :class="$style.ratingValue">{{ sectionRating }}/5</span>
          <span :class="$style.ratingSource">- {{ sectionSubtitle }}</span>
        </div>
      </div>

      <div :class="[$style.grid, { [$style.noReviews]: reviews.length === 0 }]">
        <!-- Testimonials -->
        <div v-if="reviews.length > 0" :class="$style.testimonials">
          <div v-for="review in reviews" :key="review.name" :class="$style.reviewCard">
            <div :class="$style.reviewHeader">
              <img :src="review.image" :alt="review.name" :class="$style.reviewAvatar" />
              <div>
                <h4 :class="$style.reviewName">{{ review.name }}</h4>
                <div :class="$style.reviewStars">
                  <Star v-for="i in Math.floor(review.rating)" :key="i" :class="$style.smallStarIcon" />
                  <Star v-for="i in 5 - Math.floor(review.rating)" :key="i" :class="[$style.smallStarIcon, $style.empty]" />
                </div>
              </div>
            </div>
            <p :class="$style.reviewText">"{{ review.text }}"</p>
          </div>
        </div>

        <!-- Contact Form Card -->
        <div id="contact" :class="[$style.contactWrapper, { [$style.centered]: reviews.length === 0 }]">
          <div :class="$style.contactCard">
            <h3 :class="$style.contactTitle">Donner mon avis</h3>
            
            <div v-if="submitSuccess" :class="$style.successMsg">
              <p>Merci pour votre avis ! Il sera publié après modération.</p>
              <button @click="submitSuccess = false" :class="$style.submitButton">Envoyer un autre avis</button>
            </div>

            <form v-else :class="$style.form" @submit.prevent="step === 1 ? handleSendCode() : handleSubmit()">
              <template v-if="step === 1">
                <div :class="$style.ratingInputGroup">
                  <label :class="$style.label">Votre note</label>
                  <!-- Étoiles pour desktop -->
                  <div :class="[$style.starRating, $style.desktopOnly]">
                    <button 
                      v-for="star in 5" 
                      :key="star" 
                      type="button"
                      :class="[$style.starButton, { [$style.active]: star <= rating }]"
                      @click="rating = star"
                    >
                      <Star :class="$style.formStarIcon" />
                    </button>
                  </div>
                  <!-- Champ de saisie pour mobile -->
                  <div :class="$style.mobileOnly">
                    <input 
                      type="number" 
                      v-model="rating" 
                      min="1" 
                      max="5" 
                      :class="$style.input" 
                      placeholder="Note sur 5"
                    />
                  </div>
                </div>

                <div>
                  <label :class="$style.label">Nom complet</label>
                  <input type="text" v-model="form.fullName" :class="$style.input" placeholder="Votre nom" required />
                </div>
                
                <div>
                  <label :class="$style.label">Email</label>
                  <input type="email" v-model="form.email" :class="$style.input" placeholder="Votre email" required />
                </div>
                
                <div :class="$style.checkboxGroup">
                  <label :class="$style.checkboxLabel">
                    <input type="radio" v-model="form.type" value="particulier" :class="$style.checkbox" />
                    <span :class="$style.checkboxText">Particulier</span>
                  </label>
                  <label :class="$style.checkboxLabel">
                    <input type="radio" v-model="form.type" value="professionnel" :class="$style.checkbox" />
                    <span :class="$style.checkboxText">Professionnel</span>
                  </label>
                  <label :class="$style.checkboxLabel">
                    <input type="radio" v-model="form.type" value="copropriete" :class="$style.checkbox" />
                    <span :class="$style.checkboxText">Copropriété</span>
                  </label>
                  <label :class="$style.checkboxLabel">
                    <input type="radio" v-model="form.type" value="immeuble" :class="$style.checkbox" />
                    <span :class="$style.checkboxText">Immeuble</span>
                  </label>
                </div>

                <div>
                  <label :class="$style.label">Ville</label>
                  <select v-model="form.cityId" :class="$style.input" required>
                    <option :value="null" disabled>Sélectionnez une ville</option>
                    <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
                  </select>
                </div>

                <div>
                  <label :class="$style.label">Message (optionnel)</label>
                  <textarea v-model="form.message" :class="$style.textarea" placeholder="Votre message..."></textarea>
                </div>
              </template>

              <template v-else>
                <div>
                  <label :class="$style.label">Code de vérification reçu par email</label>
                  <p :class="$style.codeHelp">Un code a été envoyé à {{ form.email }}</p>
                  <input type="text" v-model="code" :class="$style.input" placeholder="Entrez le code à 6 chiffres" required />
                </div>
                <button type="button" @click="step = 1" :class="$style.backButton">Modifier mes informations</button>
              </template>

              <div v-if="submitError" :class="$style.errorMsg">{{ submitError }}</div>

              <button type="submit" :class="$style.submitButton" :disabled="isSubmitting || isSendingCode">
                <template v-if="isSubmitting">Envoi en cours...</template>
                <template v-else-if="isSendingCode">Envoi du code...</template>
                <template v-else-if="step === 1">Recevoir un code de vérification</template>
                <template v-else>Valider et donner mon avis</template>
              </button>
              
              <p :class="$style.disclaimer">
                Vos informations restent confidentielles et ne sont jamais partagées.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style module>
.footerSection {
  padding-top: 6rem; /* py-24 */
  padding-bottom: 6rem;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-main);
}

.shapeBackground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-color: var(--bg-main);
  z-index: -10;
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
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: var(--primary); /* text-blue-900 */
  margin-bottom: 0.5rem;
}

.ratingWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.starIcon {
  width: 1.25rem;
  height: 1.25rem;
  fill: #facc15; /* fill-yellow-400 */
  color: #facc15; /* text-yellow-400 */

  &.empty {
    fill: none;
  }
}

.ratingValue {
  margin-left: 0.5rem;
  font-weight: 700;
  color: var(--text-main);
}

.ratingSource {
  color: var(--text-main);
  margin-left: 0.25rem;
}

.grid {
  display: grid;
  gap: 3rem; /* gap-12 */
  items: start;
}

.grid.noReviews {
  display: flex;
  justify-content: center;
}

.testimonials {
  display: grid;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.reviewCard {
  background-color: var(--bg-card);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  width: 100%;
  height: min-content;
  min-height: 300px;
}

@media (min-width: 1024px) and (max-width: 1279px){
  .testimonials {
    grid-template-columns: 1fr;
  }
}

.reviewHeader {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.reviewAvatar {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
}

.reviewName {
  font-weight: 700;
  color: var(--primary);
}

.reviewStars {
  display: flex;
  gap: 0.125rem;
}

.smallStarIcon {
  width: 0.75rem;
  height: 0.75rem;
  fill: #facc15;
  color: #facc15;

  &.empty {
    fill: none;
  }
}

.reviewText {
  color: var(--text-main);
  font-style: italic;
  line-height: 1.625;
}

.contactWrapper {
  /* lg:col-span-5 */
}

.centered {
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  width: 100%;
}

.contactCard {
  background-color: var(--bg-card);
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.contactTitle {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.successMsg {
  background-color: light-dark(#dcfce7, #064e3b);
  color: light-dark(#166534, #34d399);
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  margin-bottom: 1.5rem;

  & p {
    margin-bottom: 1rem;
  }
}

.errorMsg {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.input, .textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  transition: all 0.2s;
  outline: none;
  color: var(--text-main);
}

.input::placeholder, .textarea::placeholder {
  color: var(--text-main);
  opacity: 0.85;
}

.input:focus, .textarea:focus {
  box-shadow: 0 0 0 2px var(--primary);
  background-color: var(--bg-main);
}

.textarea {
  height: 6rem;
  resize: vertical;
}

.checkboxGroup {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  color: #2563eb;
  border-radius: 0.25rem;
  border: 1px solid var(--border-color);
}

.checkboxText {
  font-size: 0.875rem;
  color: var(--text-main);
}

.submitButton {
  width: 100%;
  background-color: var(--primary);
  color: white;
  font-weight: 700;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.submitButton:hover {
  background-color: var(--secondary);
  transform: translateY(-0.125rem);
}

.disclaimer {
  font-size: 11px;
  text-align: center;
  color: var(--text-main);
  margin-top: 1rem;
  line-height: 1.25;
}

.codeHelp {
  font-size: 0.875rem;
  color: var(--text-main);
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.backButton {
  background: none;
  border: none;
  color: var(--primary);
  text-decoration: underline;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
  display: block;
}

.ratingInputGroup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.starRating {
  display: flex;
  gap: 0.5rem;
}

.starButton {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.starButton:hover {
  transform: scale(1.1);
}

.formStarIcon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text-main);
  opacity: 0.3;
  fill: none;
  transition: all 0.2s;
}

.starButton.active .formStarIcon {
  color: #facc15; /* Yellow 400 */
  fill: #facc15;
  opacity: 1;
}

.desktopOnly {
  display: none;
}

.mobileOnly {
  display: block;
}

@media (min-width: 768px) {
  .desktopOnly {
    display: flex;
  }
  .mobileOnly {
    display: none;
  }
  .testimonials {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
  .testimonials {
    grid-column: span 7 / span 7;
  }
  .contactWrapper {
    grid-column: span 5 / span 5;
  }
}
</style>
