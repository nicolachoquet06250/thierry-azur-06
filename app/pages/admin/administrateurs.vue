<script setup lang="ts">
import { Users, UserPlus, Trash2, Mail, Loader2, Search, X, Shield } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

const admins = ref<any[]>([]);
const isLoading = ref(true);
const isCreating = ref(false);
const showCreateModal = ref(false);
const searchQuery = ref('');

const newAdmin = ref({
  email: '',
  firstName: '',
  lastName: ''
});

const { success: notifySuccess, error: notifyError } = useNotify();
const { ask } = useConfirm();

const currentUserId = ref<number | null>(null);

const fetchAdmins = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    currentUserId.value = parseInt(localStorage.getItem('user_id') || '0');
    const data = await $fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    admins.value = data as any[];
  } catch (err) {
    console.error('Failed to fetch admins', err);
    await notifyError('Erreur', 'Impossible de charger les administrateurs');
  } finally {
    isLoading.value = false;
  }
};

const createAdmin = async () => {
  if (!newAdmin.value.email || !newAdmin.value.firstName || !newAdmin.value.lastName) {
    await notifyError('Erreur', 'Veuillez remplir tous les champs');
    return;
  }

  isCreating.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    await $fetch('/api/admin/users', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: newAdmin.value
    });
    
    await notifySuccess('Succès', 'Administrateur créé avec succès. Un email lui a été envoyé.');
    showCreateModal.value = false;
    newAdmin.value = { email: '', firstName: '', lastName: '' };
    await fetchAdmins();
  } catch (err: any) {
    await notifyError('Erreur', err.data?.statusMessage || "Impossible de créer l'administrateur");
  } finally {
    isCreating.value = false;
  }
};

const deleteAdmin = async (id: number) => {
  const confirmed = await ask({
    title: 'Supprimer l\'administrateur',
    message: 'Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.',
    confirmText: 'Supprimer',
    cancelText: 'Annuler'
  });
  
  if (!confirmed) return;
  
  try {
    const token = localStorage.getItem('auth_token');
    await $fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    admins.value = admins.value.filter(a => a.id !== id);
    await notifySuccess('Succès', 'Administrateur supprimé');
  } catch (err: any) {
    await notifyError('Erreur', err.data?.statusMessage || "Impossible de supprimer l'administrateur");
  }
};

const filteredAdmins = computed(() => {
  return admins.value.filter(a => {
    const search = searchQuery.value.toLowerCase();
    return a.firstName.toLowerCase().includes(search) || 
           a.lastName.toLowerCase().includes(search) || 
           a.email.toLowerCase().includes(search);
  });
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

onMounted(fetchAdmins);
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <div>
        <h1 :class="$style.title">
          <div :class="$style.titleIcon">
            <Shield :size="24" />
          </div>
          Gestion des Administrateurs
        </h1>
        <p :class="$style.subtitle">Gérez les accès à l'interface d'administration.</p>
      </div>
      <button @click="showCreateModal = true" :class="['btn-primary', $style.addBtn]">
        <UserPlus :size="20" />
        Ajouter un administrateur
      </button>
    </div>

    <div :class="$style.controls">
      <div :class="$style.searchWrapper">
        <Search :size="18" :class="$style.searchIcon" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher un administrateur..." :class="$style.searchInput" />
      </div>
    </div>

    <div v-if="isLoading" :class="$style.loaderWrapper">
      <Loader2 :class="$style.spinner" :size="48" />
      <p>Chargement des administrateurs...</p>
    </div>

    <div v-else-if="filteredAdmins.length === 0" :class="$style.emptyState">
      <div :class="$style.emptyIcon">
        <Users :size="48" />
      </div>
      <h3>Aucun administrateur trouvé</h3>
      <p>Il n'y a aucun compte correspondant à votre recherche.</p>
    </div>

    <div v-else :class="$style.tableContainer">
      <table :class="$style.table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Créé le</th>
            <th>Statut</th>
            <th :class="$style.actionsHeader">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in filteredAdmins" :key="admin.id">
            <td data-label="Utilisateur">
              <div :class="$style.userInfo">
                <div :class="$style.avatar">
                  {{ admin.firstName.charAt(0) }}{{ admin.lastName.charAt(0) }}
                </div>
                <div>
                  <div :class="$style.userName">{{ admin.firstName }} {{ admin.lastName }}</div>
                </div>
              </div>
            </td>
            <td data-label="Email">{{ admin.email }}</td>
            <td data-label="Créé le">{{ formatDate(admin.createdAt) }}</td>
            <td data-label="Statut">
              <span :class="[$style.statusBadge, admin.mustChangePassword ? $style.pendingBadge : $style.activeBadge]">
                {{ admin.mustChangePassword ? 'En attente de premier changement' : 'Actif' }}
              </span>
            </td>
            <td :class="$style.actionsCell" data-label="Actions">
              <button 
                v-if="admin.id !== currentUserId"
                @click="deleteAdmin(admin.id)" 
                :class="$style.deleteBtn" 
                title="Supprimer"
              >
                <Trash2 :size="18" />
              </button>
              <span v-else :class="$style.currentUserBadge">Vous</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de création -->
    <div v-if="showCreateModal" :class="$style.modalOverlay" @click.self="showCreateModal = false">
      <div :class="$style.modal">
        <div :class="$style.modalHeader">
          <h2>Nouvel Administrateur</h2>
          <button @click="showCreateModal = false" :class="$style.closeBtn">
            <X :size="24" />
          </button>
        </div>
        <form @submit.prevent="createAdmin" :class="$style.modalBody">
          <div :class="$style.formGrid">
            <div :class="$style.formGroup">
              <label>Prénom</label>
              <input v-model="newAdmin.firstName" type="text" required placeholder="Jean" :disabled="isCreating" />
            </div>
            <div :class="$style.formGroup">
              <label>Nom</label>
              <input v-model="newAdmin.lastName" type="text" required placeholder="Dupont" :disabled="isCreating" />
            </div>
          </div>
          <div :class="$style.formGroup">
            <label>Email</label>
            <input v-model="newAdmin.email" type="email" required placeholder="jean.dupont@exemple.com" :disabled="isCreating" />
          </div>
          <p :class="$style.infoText">
            <Mail :size="16" />
            Un mot de passe sera généré aléatoirement et envoyé par email à l'utilisateur.
          </p>
          <div :class="$style.modalFooter">
            <button type="button" @click="showCreateModal = false" :class="$style.cancelBtn" :disabled="isCreating">Annuler</button>
            <button type="submit" :class="['btn-primary', $style.submitBtn]" :disabled="isCreating">
              <Loader2 v-if="isCreating" :class="$style.spinner" :size="18" />
              <span v-else>Créer le compte</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style module>
.header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
  }
}

.title {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
  }
}

.titleIcon {
  background-color: var(--primary);
  padding: 0.5rem;
  border-radius: 0.75rem;
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
  width: 50px;
  min-width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.subtitle {
  color: var(--text-main);
  opacity: 0.7;
  margin-top: 0.5rem;
  word-break: break-word;
}

.addBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
}

.controls {
  margin-bottom: 2rem;
}

.searchWrapper {
  position: relative;
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

.tableContainer {
  background-color: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

@media (max-width: 768px) {
  .table, .table thead, .table tbody, .table th, .table td, .table tr {
    display: block;
  }

  .table thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .table tr {
    border-bottom: 1px solid var(--border-color);
    padding: 1rem;
  }

  .table td {
    border: none;
    position: relative;
    padding-left: 50% !important;
    text-align: right;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .table td:before {
    position: absolute;
    left: 1rem;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    content: attr(data-label);
    font-weight: 600;
    text-align: left;
    color: var(--text-main);
    opacity: 0.8;
  }

  .actionsCell {
    text-align: right !important;
  }
  
  .userInfo {
    justify-content: flex-end;
  }
}

.table th {
  padding: 1rem 1.5rem;
  background-color: var(--bg-main);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-main);
  opacity: 0.8;
  font-size: 0.875rem;
}

.table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
  vertical-align: middle;
}

.userInfo {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  font-size: 0.875rem;
}

.userName {
  font-weight: 600;
}

.statusBadge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.activeBadge {
  background-color: #dcfce7;
  color: #166534;
}

.pendingBadge {
  background-color: #fef3c7;
  color: #92400e;
}

.actionsHeader {
  text-align: right;
}

.actionsCell {
  text-align: right;
}

.deleteBtn {
  color: #ef4444;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.deleteBtn:hover {
  background-color: #fee2e2;
}

.currentUserBadge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background-color: var(--accent);
  color: var(--primary);
  text-transform: uppercase;
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

/* Modal Styles */
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background-color: var(--bg-card);
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modalHeader {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modalHeader h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.closeBtn {
  background: transparent;
  border: none;
  color: var(--text-main);
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.2s;
}

.closeBtn:hover {
  opacity: 1;
}

.modalBody {
  padding: 1.5rem;
}

.formGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 480px) {
  .formGrid {
    grid-template-columns: 1fr;
  }

  .avatar {
    display: none;
  }
}

.formGroup {
  margin-bottom: 1.25rem;
}

.formGroup label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.formGroup input {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-main);
  outline: none;
  transition: all 0.2s;
}

.formGroup input:focus {
  border-color: var(--primary);
}

.infoText {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-main);
  opacity: 0.7;
  background-color: var(--bg-main);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.modalFooter {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancelBtn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
}

.submitBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
