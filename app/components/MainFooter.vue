<script setup>
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-vue-next'

const { data: metadata } = await useFetch('/api/data/metadata')

const handleCall = () => {
  window.location.href = `tel:${metadata.value.phone}`
}

const formattedPhone = computed(() => {
  const p = metadata.value.phone
  if (p.startsWith('+')) {
    return p.replace(/\+(\d{2})(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5 $6')
  }
  return p.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4')
})
</script>

<template>
  <footer :class="$style.footer">
    <div :class="$style.container">
      <div :class="$style.grid">
        <!-- Brand Info -->
        <div :class="$style.brandColumn">
          <div :class="$style.logoWrapper">
            <img src="/thierry-azur-06_white_transparent.png" alt="logo" style="width: 150px;">
          </div>
          <p :class="$style.brandDesc">
            {{ metadata?.description }}
          </p>
        </div>

        <!-- Quick Links -->
        <div :class="$style.linksColumn">
          <h4 :class="$style.columnTitle">Navigation</h4>
          <div :class="$style.linksGrid">
            <ul :class="$style.linkList">
              <li>
                <NuxtLink to="/#accueil" :class="$style.link">
                  <ChevronRight :class="$style.linkIcon" /> Accueil
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/#services" :class="$style.link">
                  <ChevronRight :class="$style.linkIcon" /> Services
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/#zones" :class="$style.link">
                  <ChevronRight :class="$style.linkIcon" /> Zones
                </NuxtLink>
              </li>
            </ul>
            <ul :class="$style.linkList">
              <li>
                <NuxtLink to="/#avis" :class="$style.link">
                  <ChevronRight :class="$style.linkIcon" /> Avis
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/devis" :class="$style.link">
                  <ChevronRight :class="$style.linkIcon" /> Devis
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" :class="$style.link">
                  <ChevronRight :class="$style.linkIcon" /> Contact
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Contact Info -->
        <div :class="$style.linksColumn">
          <h4 :class="$style.columnTitle">Contact</h4>
          <ul :class="$style.contactList">
            <li :class="$style.contactItem">
              <Phone :class="$style.contactIcon" />
              <a href="#" @click.prevent="handleCall" :class="$style.contactLink">
                {{ formattedPhone }}
              </a>
            </li>
            <li :class="$style.contactItem">
              <Mail :class="$style.contactIcon" />
              <NuxtLink to="/contact" :class="$style.contactLink">
                {{ metadata.contactEmail }}
              </NuxtLink>
            </li>
            <li :class="$style.contactItem">
              <MapPin :class="$style.contactIcon" />
              <span>Alpes-Maritimes (06)</span>
            </li>
          </ul>
        </div>
      </div>

      <div :class="$style.bottomBar">
        <div :class="$style.bottomInfo">
          <div :class="$style.copyright">
            © {{ new Date().getFullYear() }} Thierry Azur 06. Tous droits réservés.
          </div>
          <div :class="$style.developer">
            Développé par 
            <a href="https://nicolas-choquet.fr" target="_blank" rel="noopener noreferrer" :class="$style.devLink">Nicolas Choquet</a>
            <span :class="$style.socialLinks">
              <a href="www.linkedin.com/in/nicolas-choquet-23323993" target="_blank" rel="noopener noreferrer" :class="$style.socialIcon" title="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com/nicolachoquet06250" target="_blank" rel="noopener noreferrer" :class="$style.socialIcon" title="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </span>
          </div>
        </div>
        <div :class="$style.legalLinks">
          <NuxtLink to="/mentions-legales" :class="$style.legalLink">Mentions légales</NuxtLink>
          <span :class="$style.separator">|</span>
          <NuxtLink to="/confidentialite" :class="$style.legalLink">Confidentialité</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style module>
.footer {
  background-color: var(--secondary);
  color: white;
  padding-top: 5rem;
  padding-bottom: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1.5fr 1.5fr 1fr;
  }
}

.logoWrapper {
  margin-bottom: 1.5rem;
}

.brandDesc {
  color: #cbd5e1; /* Slate 300 */
  line-height: 1.6;
  max-width: 24rem;
}

.columnTitle {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  padding-bottom: 0.75rem;
}

.columnTitle::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 2rem;
  height: 2px;
  background-color: var(--primary);
}

.linksGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.linkList, .contactList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.link {
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.link:hover {
  color: light-dark(#60a5fa, #93c5fd);
  transform: translateX(4px);
}

.linkIcon {
  width: 1rem;
  height: 1rem;
  opacity: 0.5;
}

.contactItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #cbd5e1;
}

.contactIcon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--primary);
}

.contactLink {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contactLink:hover {
  color: white;
}

.bottomBar {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

@media (min-width: 768px) {
  .bottomBar {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.copyright {
  font-size: 0.875rem;
  color: #94a3b8;
}

.bottomInfo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.developer {
  font-size: 0.75rem;
  color: #94a3b8;
}

.devLink {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.3s ease;
}

.devLink:hover {
  color: white;
}

.socialLinks {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.75rem;
  vertical-align: middle;
}

.socialIcon {
  color: #94a3b8;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
}

.socialIcon:hover {
  color: white;
}

.legalLinks {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
}

.legalLink {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s ease;
}

.legalLink:hover {
  color: white;
}

.separator {
  color: #475569;
}
</style>
