<script setup lang="ts">
import {ArrowUpRight, CheckCircle2, Clock, MessageSquare, Users} from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

const stats = ref({ contacts: 0, devis: 0 });
const activities = ref<any[]>([]);
const isLoadingActivities = ref(true);

const fetchStats = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    stats.value = await $fetch<{contacts: number, devis: number}>('/api/admin/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error('Failed to fetch stats', err);
  }
};

const fetchActivities = async () => {
  isLoadingActivities.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const response = await $fetch('/api/admin/activities', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    activities.value = response as any[];
  } catch (err) {
    console.error('Failed to fetch activities', err);
  } finally {
    isLoadingActivities.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // Décalage de 1h en arrière car enregistré en UTC
  date.setHours(date.getHours() - 1);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleContactSupport = () => {
  window.location.href = `mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`;
}

onMounted(() => {
  fetchStats();
  fetchActivities();
});
</script>

<template>
  <div :class="$style.dashboard">
    <!-- Header de bienvenue -->
    <div :class="$style.header">
      <div>
        <h1 :class="$style.title">Tableau de bord</h1>
        <p :class="$style.subtitle">Bienvenue dans votre espace d'administration.</p>
      </div>
      <div>
        <span :class="$style.statusBadge">
          <CheckCircle2 :size="16" />
          Système opérationnel
        </span>
      </div>
    </div>

    <!-- Cartes de Statistiques -->
    <div :class="$style.statsGrid">
      <NuxtLink to="/admin/contact" :class="$style.card" style="text-decoration: none;">
        <div :class="$style.cardTop">
          <div :class="[$style.iconWrapper, $style.blueIcon]">
            <MessageSquare :class="$style.icon" />
          </div>
          <span :class="$style.arrowIcon">
            <ArrowUpRight :size="20" />
          </span>
        </div>
        <div :class="$style.cardContent">
          <h3 :class="$style.cardLabel">Messages de Contact</h3>
          <p :class="$style.cardValue">{{ stats.contacts }}</p>
          <div :class="$style.cardBadge">
            <span :class="[$style.badgeText, $style.blueBadge]">Total reçus</span>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/devis" :class="$style.card" style="text-decoration: none;">
        <div :class="$style.cardTop">
          <div :class="[$style.iconWrapper, $style.emeraldIcon]">
            <Users :class="$style.icon" />
          </div>
          <span :class="$style.arrowIcon">
            <ArrowUpRight :size="20" />
          </span>
        </div>
        <div :class="$style.cardContent">
          <h3 :class="$style.cardLabel">Demandes de Devis</h3>
          <p :class="$style.cardValue">{{ stats.devis }}</p>
          <div :class="$style.cardBadge">
            <span :class="[$style.badgeText, $style.emeraldBadge]">Total reçues</span>
          </div>
        </div>
      </NuxtLink>

      <!-- Carte d'aide rapide ou Info -->
      <div :class="$style.darkCard">
        <div :class="$style.watermark">
          <MessageSquare :size="120" />
        </div>
        <div :class="$style.darkCardContent">
          <div>
            <h3 :class="$style.darkCardTitle">Support Technique</h3>
            <p :class="$style.darkCardText">Besoin d'aide pour utiliser votre panel ? Nous sommes là pour vous.</p>
          </div>
          <button :class="$style.darkCardButton" @click.prevent="handleContactSupport">
            Contacter le support
          </button>
        </div>
      </div>
    </div>

    <!-- Dernières Activités Section -->
    <div :class="$style.activitySection">
      <div :class="$style.activityHeader">
        <div :class="$style.activityTitleWrapper">
          <div :class="$style.activityIconWrapper">
            <Clock :class="$style.activityIcon" />
          </div>
          <h3 :class="$style.activityTitle">Dernières Activités</h3>
        </div>
        <NuxtLink to="/admin/contact" :class="$style.viewAllButton">Tout voir</NuxtLink>
      </div>

      <div v-if="isLoadingActivities" :class="$style.loadingState">
        Chargement des activités...
      </div>

      <div v-else-if="activities.length === 0" :class="$style.emptyState">
        <div :class="$style.emptyStateContent">
          <div :class="$style.pulseIconWrapper">
            <div :class="$style.pulseBg"></div>
            <div :class="$style.pulseIconCenter">
              <Clock :class="$style.pulseIcon" />
            </div>
          </div>
          <h4 :class="$style.emptyStateTitle">Aucune activité récente</h4>
          <p :class="$style.emptyStateText">
            Vos nouveaux messages et demandes de devis apparaîtront ici en temps réel dès qu'ils seront reçus.
          </p>
        </div>
      </div>

      <div v-else :class="$style.activityList">
        <div v-for="activity in activities" :key="activity.type + activity.id" :class="$style.activityItem">
          <div :class="[$style.activityItemIcon, activity.type === 'devis' ? $style.devisIcon : $style.contactIcon]">
            <Users v-if="activity.type === 'devis'" :size="18" />
            <MessageSquare v-else :size="18" />
          </div>
          <div :class="$style.activityItemContent">
            <div :class="$style.activityItemHeader">
              <span :class="$style.activityItemName">{{ activity.firstName }} {{ activity.lastName }}</span>
              <span :class="$style.activityItemDate">{{ formatDate(activity.createdAt) }}</span>
            </div>
            <div :class="$style.activityItemMeta">
              <span :class="[$style.typeBadge, activity.type === 'devis' ? $style.devisBadge : $style.contactBadge]">
                {{ activity.type === 'devis' ? 'Devis' : 'Contact' }}
              </span>
              <span :class="$style.activityItemSubject">{{ activity.subject }}</span>
            </div>
          </div>
          <NuxtLink :to="activity.type === 'devis' ? '/admin/devis' : '/admin/contact'" :class="$style.activityItemLink">
            <ArrowUpRight :size="18" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* space-y-8 */
}

/* Header */
.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  color: var(--text-main); /* slate-900 */
}

.subtitle {
  color: var(--text-main); /* slate-500 */
  opacity: 0.7;
}

.statusBadge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: light-dark(#059669, #34d399); /* emerald-600 */
  background-color: light-dark(#ecfdf5, rgba(16, 185, 129, 0.1)); /* emerald-50 */
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid light-dark(#d1fae5, rgba(16, 185, 129, 0.2)); /* emerald-100 */
}

/* Stats Grid */
.statsGrid {
  display: grid;
  grid-template-cols: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .statsGrid {
    grid-template-cols: repeat(2, 1fr);
  }
}

/* On force la carte de support à prendre toute la largeur sur ordi pour que les deux premières restent seules sur leur ligne si besoin, 
   ou on la laisse simplement couler à la ligne suivante. 
   L'utilisateur a demandé les deux premières sur une ligne. */
@media (min-width: 1024px) {
  .darkCard {
    grid-column: span 2;
  }
}

/* Stat Card */
.card {
  background-color: var(--bg-card);
  padding: 1.5rem;
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  border: 1px solid var(--border-color); /* slate-200 */
  transition: all 0.3s;
  cursor: default;
  color: var(--text-main);
}

.card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-xl */
  transform: translateY(-0.25rem); /* -translate-y-1 */
}

.cardTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.iconWrapper {
  padding: 0.75rem;
  border-radius: 0.75rem; /* rounded-xl */
  transition: all 0.3s;
}

.blueIcon {
  background-color: #eff6ff; /* blue-50 */
}

.card:hover .blueIcon {
  background-color: #2563eb; /* blue-600 */
}

.emeraldIcon {
  background-color: #ecfdf5; /* emerald-50 */
}

.card:hover .emeraldIcon {
  background-color: #059669; /* emerald-600 */
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: color 0.3s;
}

.blueIcon .icon {
  color: #2563eb;
}

.card:hover .blueIcon .icon {
  color: #ffffff;
}

.emeraldIcon .icon {
  color: #059669;
}

.card:hover .emeraldIcon .icon {
  color: #ffffff;
}

.arrowIcon {
  color: #cbd5e1; /* slate-300 */
  width: 1.25rem;
  height: 1.25rem;
  transition: color 0.3s;
}

.card:hover .arrowIcon {
  color: inherit;
}

.card:hover .blueIcon + .arrowIcon {
  color: #2563eb;
}

.card:hover .emeraldIcon + .arrowIcon {
  color: #059669;
}

.cardContent {
  margin-top: 1rem;
}

.cardLabel {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-main); /* slate-500 */
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cardValue {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: var(--text-main); /* slate-900 */
  margin-top: 0.25rem;
}

.cardBadge {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badgeText {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
}

.blueBadge {
  color: #2563eb;
  background-color: #eff6ff;
}

.emeraldBadge {
  color: #059669;
  background-color: #ecfdf5;
}

/* Dark Card */
.darkCard {
  background: linear-gradient(to bottom right, #1e293b, #0f172a);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #1e293b;
  color: #ffffff;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.darkCard:hover {
  box-shadow: 0 20px 25px -5px rgba(226, 232, 240, 0.3);
}

.watermark {
  position: absolute;
  right: -1rem;
  bottom: -1rem;
  opacity: 0.1;
  transition: transform 0.5s;
}

.darkCard:hover .watermark {
  transform: scale(1.1);
}

.darkCardContent {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  position: relative;
  z-index: 10;
}

.darkCardTitle {
  font-weight: 700;
  font-size: 1.125rem;
}

.darkCardText {
  color: #94a3b8; /* slate-400 */
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.darkCardButton {
  margin-top: 1rem;
  background-color: #ffffff;
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  text-align: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.darkCardButton:hover {
  background-color: #eff6ff;
}

.darkCardButton:active {
  transform: scale(0.95);
}

/* Activity Section */
.activitySection {
  background-color: var(--bg-card);
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.activityHeader {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-card); /* slate-50/50 */
}

.activityTitleWrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.activityIconWrapper {
  padding: 0.5rem;
  background-color: var(--bg-main);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.activityIcon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-main);
  opacity: 0.7;
}

.activityTitle {
  font-weight: 700;
  color: var(--text-main);
}

.viewAllButton {
  font-size: 0.875rem;
  color: #2563eb;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.viewAllButton:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.emptyState {
  padding: 3rem;
  text-align: center;
}

.emptyStateContent {
  max-width: 24rem; /* max-w-sm */
  margin-left: auto;
  margin-right: auto;
}

.pulseIconWrapper {
  position: relative;
  width: 5rem;
  height: 5rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.5rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulseBg {
  position: absolute;
  inset: 0;
  background-color: #eff6ff;
  border-radius: 9999px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.pulseIconCenter {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulseIcon {
  width: 2.5rem;
  height: 2.5rem;
  color: #bfdbfe; /* blue-200 */
}

.emptyStateTitle {
  color: var(--text-main);
  font-weight: 700;
  font-size: 1.125rem;
}

.emptyStateText {
  color: var(--text-main);
  opacity: 0.7;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  line-height: 1.625;
}

.decoration {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.dot {
  height: 0.375rem;
  width: 0.375rem;
  border-radius: 9999px;
  background-color: #e2e8f0;
}

.loadingState {
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.activityList {
  display: flex;
  flex-direction: column;
}

.activityItem {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.activityItem:last-child {
  border-bottom: none;
}

.activityItem:hover {
  background-color: var(--accent);
}

.activityItemIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.contactIcon {
  background-color: #eff6ff;
  color: #2563eb;
}

.devisIcon {
  background-color: #ecfdf5;
  color: #059669;
}

.activityItemContent {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.activityItemHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  gap: 1rem;
}

.activityItemName {
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activityItemDate {
  font-size: 0.75rem;
  color: var(--text-main);
  opacity: 0.6;
}

.activityItemMeta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.typeBadge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.contactBadge {
  background-color: #dbeafe;
  color: #1e40af;
}

.devisBadge {
  background-color: #d1fae5;
  color: #065f46;
}

.activityItemSubject {
  font-size: 0.875rem;
  color: var(--text-main);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activityItemLink {
  color: #cbd5e1;
  transition: color 0.2s;
}

.activityItem:hover .activityItemLink {
  color: #64748b;
}
</style>
