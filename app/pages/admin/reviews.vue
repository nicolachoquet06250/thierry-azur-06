<script setup lang="ts">
import { Star, Check, X, Trash2, MessageSquare, Loader2, Search } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

const reviews = ref<any[]>([]);
const isLoading = ref(true);
const filter = ref('all'); // all, pending, approved
const searchQuery = ref('');

const { success: notifySuccess, error: notifyError } = useNotify();

const fetchReviews = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const data = await $fetch('/api/admin/reviews', {
      headers: { Authorization: `Bearer ${token}` }
    });
    reviews.value = data as any[];
  } catch (err) {
    console.error('Failed to fetch reviews', err);
    await notifyError('Erreur', 'Impossible de charger les avis');
  } finally {
    isLoading.value = false;
  }
};

const toggleApproval = async (review: any) => {
  try {
    const token = localStorage.getItem('auth_token');
    await $fetch(`/api/admin/reviews/${review.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { approved: !review.approved }
    });
    review.approved = !review.approved;
    await notifySuccess('Succès', review.approved ? 'Avis approuvé' : 'Avis masqué');
  } catch (err) {
    await notifyError('Erreur', "Impossible de modifier l'état de l'avis");
  }
};

const deleteReview = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;
  
  try {
    const token = localStorage.getItem('auth_token');
    await $fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    reviews.value = reviews.value.filter(r => r.id !== id);
    await notifySuccess('Succès', 'Avis supprimé');
  } catch (err) {
    await notifyError('Erreur', "Impossible de supprimer l'avis");
  }
};

const filteredReviews = computed(() => {
  return reviews.value.filter(r => {
    const matchesFilter = filter.value === 'all' || 
                         (filter.value === 'pending' && !r.approved) || 
                         (filter.value === 'approved' && r.approved);
    const matchesSearch = r.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         (r.message && r.message.toLowerCase().includes(searchQuery.value.toLowerCase()));
    return matchesFilter && matchesSearch;
  });
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(fetchReviews);
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <div>
        <h1 :class="$style.title">
          <div :class="$style.titleIcon">
            <MessageSquare :size="24" />
          </div>
          Gestion des Avis
        </h1>
        <p :class="$style.subtitle">Modérez et gérez les avis clients affichés sur le site.</p>
      </div>
    </div>

    <div :class="$style.controls">
      <div :class="$style.searchWrapper">
        <Search :size="18" :class="$style.searchIcon" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher un avis..." :class="$style.searchInput" />
      </div>
      <div :class="$style.filterTabs">
        <button 
          v-for="f in ['all', 'pending', 'approved']" 
          :key="f"
          @click="filter = f"
          :class="[$style.filterTab, filter === f && $style.activeTab]"
        >
          {{ f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : 'Approuvés' }}
          <span :class="$style.badge" v-if="f === 'pending' && reviews.filter(r => !r.approved).length > 0">
            {{ reviews.filter(r => !r.approved).length }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="isLoading" :class="$style.loaderWrapper">
      <Loader2 :class="$style.spinner" :size="48" />
      <p>Chargement des avis...</p>
    </div>

    <div v-else-if="filteredReviews.length === 0" :class="$style.emptyState">
      <div :class="$style.emptyIcon">
        <MessageSquare :size="48" />
      </div>
      <h3>Aucun avis trouvé</h3>
      <p>Il n'y a aucun avis correspondant à vos critères.</p>
    </div>

    <div v-else :class="$style.grid">
      <div v-for="review in filteredReviews" :key="review.id" :class="[$style.card, !review.approved && $style.pendingCard]">
        <div :class="$style.cardHeader">
          <div :class="$style.userInfo">
            <div :class="$style.avatar">
              {{ review.fullName.charAt(0) }}
            </div>
            <div :class="$style.userDetails">
              <h3 :class="$style.userName">{{ review.fullName }}</h3>
              <p :class="$style.userEmail">{{ review.email }}</p>
            </div>
          </div>
          <div :class="[$style.statusBadge, (review.approved ? $style.approvedBadge : $style.pendingBadge)]">
            {{ review.approved ? 'Approuvé' : 'En attente' }}
          </div>
        </div>

        <div :class="$style.cardBody">
          <div :class="$style.rating">
            <Star v-for="i in 5" :key="i" :size="16" 
                  :class="[i <= review.note ? $style.starFilled : $style.starEmpty]" />
            <span :class="$style.date">{{ formatDate(review.createdAt) }}</span>
          </div>
          <p :class="$style.meta">
            Type: <strong>{{ review.type }}</strong> • Ville: <strong>{{ review.cityName || 'Inconnue' }}</strong>
          </p>
          <div :class="$style.messageContainer">
            <p :class="$style.message">{{ review.message || '(Aucun message)' }}</p>
          </div>
        </div>

        <div :class="$style.cardActions">
          <button @click="toggleApproval(review)" :class="[$style.actionBtn, review.approved ? $style.unapproveBtn : $style.approveBtn]">
            <component :is="review.approved ? X : Check" :size="18" />
            {{ review.approved ? 'Désapprouver' : 'Approuver' }}
          </button>
          <button @click="deleteReview(review.id)" :class="[$style.actionBtn, $style.deleteBtn]">
            <Trash2 :size="18" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.page {
  padding: 1.5rem;
}

.header {
  margin-bottom: 2rem;
}

.title {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.titleIcon {
  background-color: var(--primary);
  padding: 0.5rem;
  border-radius: 0.75rem;
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.subtitle {
  color: var(--text-main);
  opacity: 0.7;
  margin-top: 0.5rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .controls {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.searchWrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.searchIcon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-main);
  opacity: 0.5;
}

.searchInput {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  color: var(--text-main);
  outline: none;
  transition: all 0.2s;
}

.searchInput:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.filterTabs {
  display: flex;
  background-color: var(--bg-card);
  padding: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
}

.filterTab {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activeTab {
  background-color: var(--bg-main);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  color: var(--primary);
}

.badge {
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  background-color: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.pendingCard {
  border-left: 4px solid #f59e0b;
}

.cardHeader {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
}

.userInfo {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--accent);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.userName {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
}

.userEmail {
  font-size: 0.875rem;
  color: var(--text-main);
  opacity: 0.6;
}

.statusBadge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  text-transform: uppercase;
}

.approvedBadge {
  background-color: #dcfce7;
  color: #166534;
}

.pendingBadge {
  background-color: #fef3c7;
  color: #92400e;
}

.cardBody {
  padding: 1.25rem;
  flex: 1;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.starFilled {
  color: #facc15;
  fill: #facc15;
}

.starEmpty {
  color: #d1d5db;
}

.date {
  font-size: 0.75rem;
  color: var(--text-main);
  opacity: 0.5;
  margin-left: 0.5rem;
}

.meta {
  font-size: 0.875rem;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.messageContainer {
  background-color: var(--bg-main);
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
}

.message {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--text-main);
  font-style: italic;
}

.cardActions {
  padding: 1rem;
  background-color: var(--bg-main);
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.actionBtn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
}

.approveBtn {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.approveBtn:hover {
  background-color: #059669;
}

.unapproveBtn {
  background-color: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.unapproveBtn:hover {
  background-color: #d97706;
}

.deleteBtn {
  background-color: transparent;
  color: #ef4444;
  border-color: #fee2e2;
}

.deleteBtn:hover {
  background-color: #fef2f2;
  border-color: #ef4444;
}

.loaderWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  gap: 1rem;
  color: var(--text-main);
  opacity: 0.7;
}

.spinner {
  animation: spin 1s linear infinite;
  color: var(--primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.emptyState {
  text-align: center;
  padding: 5rem;
  background-color: var(--bg-card);
  border-radius: 1rem;
  border: 2px dashed var(--border-color);
}

.emptyIcon {
  margin-bottom: 1rem;
  color: var(--text-main);
  opacity: 0.3;
}
</style>
