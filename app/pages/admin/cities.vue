<script setup lang="ts">
import { Save, Plus, Trash2, Edit, MapPin, Loader2 } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

const cities = ref<any[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isModalOpen = ref(false);
const editingCity = ref<any>(null);
const cityForm = ref({ name: '', lat: 0, lng: 0 });

const { success: notifySuccess, error: notifyError } = useNotify();
const { ask } = useConfirm();

const fetchCities = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    cities.value = await $fetch<{name: string, id: number, lat: number, lng: number}[]>('/api/admin/cities', { headers });
  } catch (err) {
    console.error('Failed to fetch cities', err);
    await notifyError('Erreur', 'Erreur lors du chargement des villes');
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  editingCity.value = null;
  cityForm.value = { name: '', lat: 0, lng: 0 };
  isModalOpen.value = true;
};

const openEditModal = (city: any) => {
  editingCity.value = city;
  cityForm.value = { 
    name: city.name,
    lat: city.lat,
    lng: city.lng
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveCity = async () => {
  if (!cityForm.value.name) return;
  
  isSaving.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    
    if (editingCity.value) {
      await $fetch(`/api/admin/cities/${editingCity.value.id}`, {
        method: 'PUT',
        headers,
        body: { 
          name: cityForm.value.name,
          lat: cityForm.value.lat,
          lng: cityForm.value.lng
        }
      });
      await notifySuccess('Succès', 'Ville mise à jour avec succès');
    } else {
      await $fetch('/api/admin/cities', {
        method: 'POST',
        headers,
        body: { 
          name: cityForm.value.name,
          lat: cityForm.value.lat,
          lng: cityForm.value.lng
        }
      });
      await notifySuccess('Succès', 'Ville ajoutée avec succès');
    }
    
    await fetchCities();
    closeModal();
  } catch (err) {
    console.error('Failed to save city', err);
    await notifyError('Erreur', 'Erreur lors de l\'enregistrement de la ville');
  } finally {
    isSaving.value = false;
  }
};

const deleteCity = async (id: number) => {
  const confirmed = await ask({
    title: 'Supprimer la ville',
    message: 'Êtes-vous sûr de vouloir supprimer cette ville ? Cette action est irréversible.',
    confirmText: 'Supprimer',
    cancelText: 'Annuler'
  });
  
  if (!confirmed) return;
  
  try {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    await $fetch(`/api/admin/cities/${id}`, {
      method: 'DELETE',
      headers
    });
    await notifySuccess('Succès', 'Ville supprimée avec succès');
    await fetchCities();
  } catch (err) {
    console.error('Failed to delete city', err);
    await notifyError('Erreur', 'Erreur lors de la suppression de la ville');
  }
};

onMounted(fetchCities);
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <div>
        <h1 :class="$style.title">Villes d'intervention</h1>
        <p :class="$style.subtitle">Configurez les secteurs géographiques couverts par Thierry Azur 06.</p>
      </div>
      <button 
        @click="openAddModal"
        :class="$style.addButton"
      >
        <Plus :class="$style.plusIcon" :size="20" />
        <span :class="$style.bold">Ajouter une ville</span>
      </button>
    </div>

    <div v-if="isLoading" :class="$style.loaderWrapper">
      <Loader2 :class="$style.spinner" :size="40" />
    </div>

    <div v-else :class="$style.grid">
      <div 
        v-for="city in cities" 
        :key="city.id" 
        :class="$style.card"
      >
        <div :class="$style.cardContent">
          <div :class="$style.cityInfo">
            <div :class="$style.cityIconWrapper">
              <MapPin :size="18" />
            </div>
            <h3 :class="$style.cityName" :title="city.name">
              {{ city.name }}
            </h3>
            <div :class="$style.cityCoords" v-if="city.lat !== 0 || city.lng !== 0">
              {{ city.lat }}, {{ city.lng }}
            </div>
          </div>
          
          <div :class="$style.actions">
            <button 
              @click="openEditModal(city)"
              :class="$style.editButton"
              title="Modifier"
            >
              <Edit :size="16" />
            </button>
            <button 
              @click="deleteCity(city.id)"
              :class="$style.deleteButton"
              title="Supprimer"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>

      <div 
        v-if="cities.length === 0" 
        :class="$style.emptyState"
      >
        <div :class="$style.emptyStateContent">
          <div :class="$style.pulseIconWrapper">
            <div :class="$style.pulseBg"></div>
            <div :class="$style.pulseIconCenter">
              <MapPin :class="$style.pulseIcon" />
            </div>
          </div>
          <h4 :class="$style.emptyStateTitle">Aucune ville enregistrée</h4>
          <p :class="$style.emptyStateText">
            Commencez par ajouter les villes dans lesquelles vous proposez vos services de nettoyage.
          </p>
          <button 
            @click="openAddModal"
            :class="$style.emptyAddButton"
          >
            <Plus :size="20" />
            Ajouter votre première ville
          </button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" :class="$style.modalOverlay">
      <div :class="$style.backdrop" @click="closeModal"></div>
      <div :class="$style.modalContainer">
        <div :class="$style.modalTopGradient"></div>
        <div :class="$style.modalBody">
          <div :class="$style.modalHeader">
            <h2 :class="$style.modalTitle">
              <div :class="$style.modalTitleIcon">
                <MapPin :size="24" />
              </div>
              {{ editingCity ? 'Modifier la ville' : 'Nouvelle ville' }}
            </h2>
            <button @click="closeModal" :class="$style.closeButton">
              <Plus :class="$style.closeIcon" :size="24" />
            </button>
          </div>

          <form @submit.prevent="saveCity">
            <div :class="$style.formContent">
              <div>
                <label :class="$style.label">Nom de la ville</label>
                <div :class="$style.inputWrapper">
                  <input 
                    v-model="cityForm.name"
                    type="text" 
                    :class="$style.input"
                    placeholder="Ex: Nice, Antibes, Cannes..."
                    required
                    autofocus
                  />
                </div>
                <p :class="$style.inputHelp">
                  Ce nom apparaîtra sur la carte des zones d'intervention.
                </p>
              </div>

              <div :class="$style.row">
                <div :class="$style.column">
                  <label :class="$style.label">Latitude</label>
                  <div :class="$style.inputWrapper">
                    <input 
                      v-model.number="cityForm.lat"
                      type="number" 
                      step="any"
                      :class="$style.input"
                      placeholder="43.7102"
                    />
                  </div>
                </div>
                <div :class="$style.column">
                  <label :class="$style.label">Longitude</label>
                  <div :class="$style.inputWrapper">
                    <input 
                      v-model.number="cityForm.lng"
                      type="number" 
                      step="any"
                      :class="$style.input"
                      placeholder="7.2620"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div :class="$style.modalActions">
              <button 
                type="button"
                @click="closeModal"
                :class="$style.cancelButton"
              >
                Annuler
              </button>
              <button 
                type="submit"
                :disabled="isSaving"
                :class="$style.saveButton"
              >
                <Loader2 v-if="isSaving" :class="$style.spinner" :size="20" />
                <Plus v-else-if="!editingCity" :size="20" />
                <Save v-else :size="20" />
                {{ editingCity ? 'Enregistrer' : 'Créer la ville' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .header {
    flex-direction: row;
    align-items: center;
  }
}

.title {
  font-size: 1.875rem;
  font-weight: 800;
  color: light-dark(#0f172a, #ffffff);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.subtitle {
  color: light-dark(#64748b, #94a3b8);
  margin-top: 0.5rem;
  font-weight: 500;
}

.addButton {
  background-color: var(--primary);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
}

.addButton:hover {
  filter: brightness(1.1);
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
}

.addButton:active {
  transform: scale(0.95);
}

.plusIcon {
  transition: transform 0.3s;
}

.addButton:hover .plusIcon {
  transform: rotate(90deg);
}

.bold {
  font-weight: 700;
}

.loaderWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
}

.spinner {
  animation: spin 1s linear infinite;
  color: var(--primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background-color: var(--bg-card);
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  position: relative;
  min-width: 0;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.cardContent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.cityInfo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.cityIconWrapper {
  background-color: light-dark(#eff6ff, #1e293b);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--primary);
  flex-shrink: 0;
}

.cityName {
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cityCoords {
  font-size: 0.75rem;
  color: var(--text-main);
  opacity: 0.6;
  font-family: monospace;
}

.row {
  display: flex;
  gap: 1rem;
}

.column {
  flex: 1;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.editButton, .deleteButton {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  color: light-dark(#94a3b8, #64748b);
}

.editButton:hover {
  color: var(--primary);
  background-color: light-dark(#eff6ff, #1e293b);
}

.deleteButton:hover {
  color: #dc2626;
  background-color: light-dark(#fef2f2, #450a0a);
}

.emptyState {
  grid-column: 1 / -1;
  background-color: var(--bg-card);
  border: 2px dashed var(--border-color);
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
}

.emptyAddButton {
  margin-top: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  font-weight: 600;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.emptyAddButton:hover {
  color: var(--secondary);
}

.modalOverlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
}

.modalContainer {
  background-color: var(--bg-card);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 28rem;
  position: relative;
  z-index: 10;
  overflow: hidden;
  border: 1px solid var(--border-color);
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modalTopGradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.5rem;
  background: linear-gradient(to right, #2563eb, #4f46e5);
}

.modalBody {
  padding: 2rem;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.modalTitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modalTitleIcon {
  background-color: light-dark(#eff6ff, #1e293b);
  padding: 0.5rem;
  border-radius: 0.75rem;
  color: var(--primary);
}

.closeButton {
  color: var(--text-main);
  opacity: 0.5;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: opacity 0.2s;
}

.closeButton:hover {
  opacity: 1;
}

.closeIcon {
  transform: rotate(45deg);
}

.formContent {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.inputWrapper {
  position: relative;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  color: var(--text-main);
  transition: all 0.2s;
  outline: none;
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px light-dark(rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.2));
  background-color: var(--bg-card);
}

.input::placeholder {
  color: var(--text-main);
  opacity: 0.5;
}

.inputHelp {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: light-dark(#64748b, #94a3b8);
  font-style: italic;
}

.modalActions {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
}

.cancelButton {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  font-weight: 600;
  border-radius: 0.75rem;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.cancelButton:hover {
  background-color: light-dark(#f8fafc, #1e293b);
  color: var(--text-main);
}

.saveButton {
  flex: 2;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: #ffffff;
  font-weight: 700;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
}

.saveButton:hover {
  filter: brightness(1.1);
}

.saveButton:active {
  transform: scale(0.95);
}

.saveButton:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
