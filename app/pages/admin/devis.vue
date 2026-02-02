<script setup lang="ts">
import { Mail, Calendar, User, FileText, CheckCircle2, Circle, Users, Loader2 } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

const devisList = ref<any[]>([]);
const isLoading = ref(true);
const filterReplied = ref<boolean | null>(false);
const { success: notifySuccess, error: notifyError } = useNotify();

const fetchDevis = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    let url = '/api/admin/devis';
    if (filterReplied.value !== null) {
      url += `?replied=${filterReplied.value}`;
    }
    const response = await $fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    devisList.value = response as any[];
  } catch (err) {
    console.error('Failed to fetch devis', err);
    await notifyError('Erreur', 'Impossible de charger les demandes de devis');
  } finally {
    isLoading.value = false;
  }
};

const toggleReplied = async (devis: any) => {
  try {
    const token = localStorage.getItem('auth_token');
    await $fetch(`/api/admin/devis/${devis.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { replied: !devis.replied }
    });
    
    devis.replied = !devis.replied;
    await notifySuccess('Succès', devis.replied ? 'Devis marqué comme répondu' : 'Devis marqué comme non répondu');
    
    // Si on filtre, on rafraîchit la liste
    if (filterReplied.value !== null) {
      await fetchDevis();
    }
  } catch (err) {
    console.error('Failed to update devis', err);
    await notifyError('Erreur', 'Impossible de mettre à jour le statut du devis');
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

watch(filterReplied, () => {
  fetchDevis();
});

onMounted(fetchDevis);
</script>

<template>
  <Head>
    <Title>Thierry Azur 06 | Les demandes de devis</Title>
  </Head>

  <div :class="$style.page">
    <div :class="$style.header">
      <div :class="$style.headerMain">
        <h1 :class="$style.title">Demandes de Devis</h1>
        <p :class="$style.subtitle">Gérez les demandes de devis reçues via le site.</p>
      </div>
      
      <div :class="$style.filters">
        <span :class="$style.filterLabel">Non répondus</span>
        <label :class="$style.switch">
          <input type="checkbox" v-model="filterReplied" :true-value="true" :false-value="false">
          <span :class="$style.slider"></span>
        </label>
        <span :class="$style.filterLabel">Répondus</span>
      </div>
    </div>

    <div v-if="isLoading" :class="$style.loaderWrapper">
      <Loader2 :class="$style.spinner" :size="40" />
    </div>

    <div v-else-if="devisList.length === 0" :class="$style.emptyState">
      <div :class="$style.emptyStateContent">
        <div :class="$style.pulseIconWrapper">
          <div :class="$style.pulseBg"></div>
          <div :class="$style.pulseIconCenter">
            <Users :class="$style.pulseIcon" />
          </div>
        </div>
        <h4 :class="$style.emptyStateTitle">Aucun devis</h4>
        <p :class="$style.emptyStateText">
          Aucune demande de devis ne correspond à vos filtres actuels.
        </p>
      </div>
    </div>

    <div v-else :class="$style.grid">
      <div v-for="devis in devisList" :key="devis.id" :class="[$style.card, devis.replied && $style.cardReplied]">
        <div :class="$style.cardHeader">
          <div :class="$style.userInfo">
            <div :class="[$style.avatar, devis.replied && $style.avatarReplied]">
              <User :size="20" />
            </div>
            <div :class="$style.userDetails">
              <h3 :class="$style.userName">{{ devis.firstName }} {{ devis.lastName }}</h3>
              <div :class="$style.userEmail">
                <Mail :size="14" />
                <a :href="'mailto:' + devis.email">{{ devis.email }}</a>
              </div>
            </div>
          </div>
          
          <div :class="$style.actions">
            <div :class="$style.dateInfo">
              <Calendar :size="14" />
              <span>{{ formatDate(devis.createdAt) }}</span>
            </div>
            <button 
              @click="toggleReplied(devis)" 
              :class="[$style.replyButton, devis.replied && $style.replyButtonActive]"
              :title="devis.replied ? 'Marquer comme non répondu' : 'Marquer comme répondu'"
            >
              <CheckCircle2 v-if="devis.replied" :size="18" />
              <Circle v-else :size="18" />
              <span>{{ devis.replied ? 'Répondu' : 'Marquer comme répondu' }}</span>
            </button>
          </div>
        </div>
        
        <div :class="$style.cardBody">
          <div :class="$style.subject">
            <div :class="$style.subjectIconWrapper">
              <FileText :size="16" />
            </div>
            <strong>Objet :</strong> <span :class="$style.subjectText">{{ devis.subject }}</span>
          </div>
          <div :class="$style.messageContainer">
            <div :class="$style.message">
              {{ devis.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 100%;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: light-dark(#0f172a, #ffffff);
}

.subtitle {
  color: #64748b;
}

.filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--bg-card);
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  width: fit-content;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .filters {
    margin: 0;
  }
}

.filterLabel {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  opacity: 0.7;
}

.switch {
  position: relative;
  display: inline-block;
  width: 2.75rem;
  height: 1.5rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: var(--border-color);
  transition: .4s;
  border-radius: 9999px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.125rem;
  width: 1.125rem;
  left: 0.1875rem;
  bottom: 0.1875rem;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.switch input:checked + .slider {
  background-color: #2563eb;
}

.switch input:checked + .slider:before {
  transform: translateX(1.25rem);
}

.loaderWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
}

.spinner {
  animation: spin 1s linear infinite;
  color: #2563eb;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.emptyState {
  background-color: var(--bg-card);
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  padding: 3rem;
  text-align: center;
}

.emptyStateContent {
  max-width: 24rem;
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

.pulseBg {
  position: absolute;
  inset: 0;
  background-color: #eff6ff;
  border-radius: 9999px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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
  color: #bfdbfe;
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

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.card {
  background-color: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  position: relative;
  overflow: visible;
  min-width: 0;
}

.card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.25rem);
}

.cardReplied {
  background-color: var(--accent);
  opacity: 0.9;
}

.cardHeader {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .cardHeader {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.userInfo {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
  flex: 1;
}

.avatar {
  width: 3rem;
  height: 3rem;
  background-color: #eff6ff;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  border: 1px solid #dbeafe;
  flex-shrink: 0;
}

.avatarReplied {
  background-color: #ecfdf5;
  color: #10b981;
  border-color: #d1fae5;
}

.userDetails {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}

.userName {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.userEmail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #2563eb;
  min-width: 0;
  width: 100%;
  overflow: hidden;
}

.userEmail a {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  flex: 1;
}

.userEmail a:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.dateInfo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-main);
  opacity: 0.7;
  font-weight: 500;
  background-color: var(--bg-main);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.replyButton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-main);
  opacity: 0.8;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.replyButton:hover {
  background-color: var(--accent);
  border-color: var(--primary);
  color: var(--primary);
  opacity: 1;
}

.replyButtonActive {
  background-color: #ecfdf5;
  color: #059669;
  border-color: #10b981;
}

.replyButtonActive:hover {
  background-color: #d1fae5;
}

.cardBody {
  padding: 1.5rem;
  background-color: var(--bg-card);
}

.subject {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: var(--text-main);
  margin-bottom: 1rem;
  min-width: 0;
}

.subjectText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  min-width: 0;
  flex: 1;
}

.subjectIconWrapper {
  background-color: var(--bg-main);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--text-main);
  opacity: 0.7;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.messageContainer {
  background-color: var(--bg-main);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  padding: 1.25rem;
}

.message {
  color: var(--text-main);
  opacity: 0.9;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
