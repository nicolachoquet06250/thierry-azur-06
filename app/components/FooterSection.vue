<script setup>
import { Star } from 'lucide-vue-next'
import { ref, computed } from 'vue'

const { data: about } = await useFetch('/api/data/about')
const { data: cities } = await useFetch('/api/data/cities')

const rating = ref(5)

const title = computed(() => {
  return about.value?.valuesSectionTitle || 'Ils recommandent Thierry Azur 06'
})

const reviews = [
  {
    name: 'Thierry L.',
    image: 'https://i.pravatar.cc/150?u=thierry',
    text: 'Un service impeccable et professionnel. Mon appartement n\'a jamais été aussi propre. Je recommande vivement !',
    rating: 5
  },
  {
    name: 'Elena M.',
    image: 'https://i.pravatar.cc/150?u=elena',
    text: 'Thierry est ponctuel, efficace et très sympathique. Le travail est soigné dans les moindres détails.',
    rating: 5
  }
]
</script>

<template>
  <section id="avis" :class="$style.footerSection">
    <!-- Footer/Bottom shape background -->
    <div :class="[$style.shapeBackground, 'bg-footer-shape']"></div>

    <div :class="$style.container">
      <div :class="$style.header">
        <h2 :class="$style.title">{{ title }}</h2>
        <div :class="$style.ratingWrapper">
          <Star v-for="i in 5" :key="i" :class="$style.starIcon" />
          <span :class="$style.ratingValue">5/5</span>
          <span :class="$style.ratingSource">- Avis clients sur Google</span>
        </div>
      </div>

      <div :class="$style.grid">
        <!-- Testimonials -->
        <div :class="$style.testimonials">
          <div v-for="review in reviews" :key="review.name" :class="$style.reviewCard">
            <div :class="$style.reviewHeader">
              <img :src="review.image" :alt="review.name" :class="$style.reviewAvatar" />
              <div>
                <h4 :class="$style.reviewName">{{ review.name }}</h4>
                <div :class="$style.reviewStars">
                  <Star v-for="i in 5" :key="i" :class="$style.smallStarIcon" />
                </div>
              </div>
            </div>
            <p :class="$style.reviewText">"{{ review.text }}"</p>
          </div>
        </div>

        <!-- Contact Form Card -->
        <div id="contact" :class="$style.contactWrapper">
          <div :class="$style.contactCard">
            <h3 :class="$style.contactTitle">Donne mon avis</h3>
            
            <form :class="$style.form">
              <div :class="$style.ratingInputGroup">
                <label :class="$style.label">Votre note</label>
                <!-- Étoiles pour desktop -->
                <div :class="[$style.starRating, $style.desktopOnly]">
                  <button 
                    v-for="star in 5" 
                    :key="star" 
                    type="button"
                    :class="[$style.starButton, { [$style.active]: star <= (rating || 5) }]"
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
                <label :class="$style.label">Nom</label>
                <input type="text" :class="$style.input" placeholder="Votre nom" />
              </div>
              
              <div>
                <label :class="$style.label">Email</label>
                <input type="email" :class="$style.input" placeholder="Votre email" />
              </div>
              
              <div :class="$style.checkboxGroup">
                <label :class="$style.checkboxLabel">
                  <input type="radio" name="message-type" :class="$style.checkbox" />
                  <span :class="$style.checkboxText">Particulier</span>
                </label>
                <label :class="$style.checkboxLabel">
                  <input type="radio" name="message-type" :class="$style.checkbox" checked />
                  <span :class="$style.checkboxText">Professionnel</span>
                </label>
                <label :class="$style.checkboxLabel">
                  <input type="radio" name="message-type" :class="$style.checkbox" checked />
                  <span :class="$style.checkboxText">Copropriété</span>
                </label>
                <label :class="$style.checkboxLabel">
                  <input type="radio" name="message-type" :class="$style.checkbox" checked />
                  <span :class="$style.checkboxText">Immeuble</span>
                </label>
              </div>

              <div>
                <label :class="$style.label">Ville</label>
                <select :class="$style.input">
                  <option v-for="city in cities" :key="city.id">{{ city.name }}</option>
                  <option>Autres</option>
                </select>
              </div>

              <div>
                <label :class="$style.label">Message (optionnel)</label>
                <textarea :class="$style.textarea" placeholder="Votre message..."></textarea>
              </div>

              <button type="submit" :class="$style.submitButton">
                Donner mon avis
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
}

.ratingValue {
  margin-left: 0.5rem;
  font-weight: 700;
  color: var(--text-main); /* text-gray-700 */
}

.ratingSource {
  color: #9ca3af; /* text-gray-400 */
  margin-left: 0.25rem;
}

.grid {
  display: grid;
  gap: 3rem; /* gap-12 */
  items: start;
}

.testimonials {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.reviewCard {
  background-color: var(--bg-card);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  max-width: 300px;
  height: min-content;
  min-height: 300px;
}

@media (min-width: 1024px) and (max-width: 1279px){
  .reviewCard {
    min-width: 100%;
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
}

.reviewText {
  color: var(--text-main); /* text-gray-600 */
  opacity: 0.9;
  font-style: italic;
  line-height: 1.625;
}

.contactWrapper {
  /* lg:col-span-5 */
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
  color: #3b82f6;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.checkboxText {
  font-size: 0.875rem;
  color: var(--text-main);
}

.submitButton {
  width: 100%;
  background-color: #2563eb;
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
  background-color: #1d4ed8;
  transform: translateY(-0.125rem);
}

.disclaimer {
  font-size: 10px;
  text-align: center;
  color: #9ca3af;
  margin-top: 1rem;
  line-height: 1.25;
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
  color: #d1d5db; /* Gray 300 */
  fill: none;
  transition: all 0.2s;
}

.starButton.active .formStarIcon {
  color: #facc15; /* Yellow 400 */
  fill: #facc15;
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
