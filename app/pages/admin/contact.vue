<script setup lang="ts">
import { Mail, Calendar, User, FileText, MessageSquare, Loader2 } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

const contacts = ref<any[]>([]);
const isLoading = ref(true);
const { error: notifyError } = useNotify();

const fetchContacts = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const response = await $fetch('/api/admin/contacts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    contacts.value = response as any[];
  } catch (err) {
    console.error('Failed to fetch contacts', err);
    await notifyError('Erreur', 'Impossible de charger les contacts');
  } finally {
    isLoading.value = false;
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

onMounted(fetchContacts);
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <div>
        <h1 :class="$style.title">Messages de Contact</h1>
        <p :class="$style.subtitle">Liste de tous les messages reçus via le formulaire de contact.</p>
      </div>
    </div>

    <div v-if="isLoading" :class="$style.loaderWrapper">
      <Loader2 :class="$style.spinner" :size="40" />
    </div>

    <div v-else-if="contacts.length === 0" :class="$style.emptyState">
      <div :class="$style.emptyStateContent">
        <div :class="$style.pulseIconWrapper">
          <div :class="$style.pulseBg"></div>
          <div :class="$style.pulseIconCenter">
            <MessageSquare :class="$style.pulseIcon" />
          </div>
        </div>
        <h4 :class="$style.emptyStateTitle">Aucun message</h4>
        <p :class="$style.emptyStateText">
          Vous n'avez reçu aucun message via le formulaire de contact pour le moment.
        </p>
      </div>
    </div>

    <div v-else :class="$style.grid">
      <div v-for="contact in contacts" :key="contact.id" :class="$style.card">
        <div :class="$style.cardHeader">
          <div :class="$style.userInfo">
            <div :class="$style.avatar">
              <User :size="20" />
            </div>
            <div :class="$style.userDetails">
              <h3 :class="$style.userName">{{ contact.firstName }} {{ contact.lastName }}</h3>
              <div :class="$style.userEmail">
                <Mail :size="14" />
                <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
              </div>
            </div>
          </div>
          <div :class="$style.dateInfo">
            <Calendar :size="14" />
            <span>{{ formatDate(contact.createdAt) }}</span>
          </div>
        </div>
        
        <div :class="$style.cardBody">
          <div :class="$style.subject">
            <div :class="$style.subjectIconWrapper">
              <FileText :size="16" />
            </div>
            <strong>Objet :</strong> <span :class="$style.subjectText">{{ contact.subject }}</span>
          </div>
          <div :class="$style.messageContainer">
            <div :class="$style.message">
              {{ contact.message }}
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
  gap: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: light-dark(#0f172a, #ffffff);
}

.subtitle {
  color: #64748b;
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
  min-width: 0;
}

.card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-0.25rem);
}

.cardHeader {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
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
  align-self: flex-start;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .dateInfo {
    align-self: center;
  }
}

.cardBody {
  padding: 1.5rem;
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
