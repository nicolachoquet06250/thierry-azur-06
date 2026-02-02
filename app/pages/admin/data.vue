<script setup lang="ts">
import { Save, Plus, Trash2, Edit, Database, Loader2 } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

const metadata = ref({
  phone: '',
  contactEmail: '',
  devisEmail: '',
  schedules: '',
  description: '',
  imageHeroContent: null as any,
  imageZonesContent: null as any
});

const previews = ref({
  hero: null as string | null,
  zones: null as string | null,
  about: null as string | null
});

const files = ref({
  hero: null as File | null,
  zones: null as File | null,
  about: null as File | null
});

const handleImageChange = (event: Event, type: 'hero' | 'zones' | 'about') => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    files.value[type] = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      previews.value[type] = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const about = ref({
  subtitle: '',
  historySectionTitle: '',
  historySectionContent: '',
  valuesSectionTitle: '',
  reviewsSectionTitle: '',
  reviewsSectionSubtitle: '',
  imageContent: null as any
});

const aboutValues = ref<any[]>([]);
const isValueModalOpen = ref(false);
const editingValue = ref<any>(null);
const newValue = ref({ title: '', description: '' });

const isLoading = ref(true);
const { success: notifySuccess, error: notifyError } = useNotify();
const { ask } = useConfirm();

const fetchData = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };

    const [metaRes, aboutRes, valuesRes] = await Promise.all([
      $fetch('/api/admin/data/metadata', { headers }),
      $fetch('/api/admin/data/about', { headers }),
      $fetch('/api/admin/data/about-values', { headers })
    ]);

    metadata.value = metaRes as any;
    about.value = aboutRes as any;
    aboutValues.value = valuesRes as any[];

    // Gérer les previews initiales si les images existent
    if (metadata.value.imageHeroContent) {
      previews.value.hero = metadata.value.imageHeroContent;
    }
    if (metadata.value.imageZonesContent) {
      previews.value.zones = metadata.value.imageZonesContent;
    }
    if (about.value.imageContent) {
      previews.value.about = about.value.imageContent;
    }
  } catch (err) {
    console.error('Failed to fetch data', err);
    await notifyError('Erreur', 'Erreur lors du chargement des données');
  } finally {
    isLoading.value = false;
  }
};

const saveMetadata = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('phone', metadata.value.phone);
    formData.append('contactEmail', metadata.value.contactEmail);
    formData.append('devisEmail', metadata.value.devisEmail);
    formData.append('schedules', metadata.value.schedules);
    formData.append('description', metadata.value.description);
    
    if (files.value.hero) {
      formData.append('imageHero', files.value.hero);
    }
    if (files.value.zones) {
      formData.append('imageZones', files.value.zones);
    }

    await $fetch('/api/admin/data/metadata', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    await notifySuccess('Succès', 'Métadonnées et images enregistrées avec succès');
    await fetchData(); // Refresh to get new image URLs if needed
  } catch (err) {
    await notifyError('Erreur', 'Erreur lors de l\'enregistrement des métadonnées');
  }
};

const saveAbout = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('subtitle', about.value.subtitle);
    formData.append('historySectionTitle', about.value.historySectionTitle);
    formData.append('historySectionContent', about.value.historySectionContent);
    formData.append('valuesSectionTitle', about.value.valuesSectionTitle);
    formData.append('reviewsSectionTitle', about.value.reviewsSectionTitle);
    formData.append('reviewsSectionSubtitle', about.value.reviewsSectionSubtitle);

    if (files.value.about) {
      formData.append('imageAbout', files.value.about);
    }

    await $fetch('/api/admin/data/about', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    await notifySuccess('Succès', 'Section À Propos enregistrée avec succès');
    await fetchData();
  } catch (err) {
    await notifyError('Erreur', 'Erreur lors de l\'enregistrement de la section À Propos');
  }
};

const openAddValueModal = () => {
  editingValue.value = null;
  newValue.value = { title: '', description: '' };
  isValueModalOpen.value = true;
};

const openEditValueModal = (val: any) => {
  editingValue.value = val;
  newValue.value = { ...val };
  isValueModalOpen.value = true;
};

const saveValue = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (editingValue.value) {
      await $fetch('/api/admin/data/about-values', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: { id: editingValue.value.id, ...newValue.value }
      });
      notifySuccess('Succès', 'Valeur mise à jour');
    } else {
      await $fetch('/api/admin/data/about-values', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: newValue.value
      });
      await notifySuccess('Succès', 'Nouvelle valeur ajoutée');
    }
    isValueModalOpen.value = false;
    await fetchData();
  } catch (err) {
    await notifyError('Erreur', 'Erreur lors de l\'enregistrement de la valeur');
  }
};

const deleteValue = async (id: number) => {
  const confirmed = await ask({
    title: 'Supprimer la valeur',
    message: 'Êtes-vous sûr de vouloir supprimer cette valeur ? Cette action est irréversible.',
    confirmText: 'Supprimer',
    cancelText: 'Annuler'
  });
  
  if (!confirmed) return;
  try {
    const token = localStorage.getItem('auth_token');
    await $fetch(`/api/admin/data/about-values?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    await notifySuccess('Succès', 'Valeur supprimée');
    await fetchData();
  } catch (err) {
    await notifyError('Erreur', 'Erreur lors de la suppression');
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <div>
        <h1 :class="$style.title">
          <div :class="$style.titleIcon">
            <Database :size="24" />
          </div>
          Gestion des Données
        </h1>
        <p :class="$style.subtitle">Modifiez les informations textuelles et les images du site.</p>
      </div>
    </div>

    <div v-if="isLoading" :class="$style.loaderWrapper">
      <Loader2 :class="$style.spinner" :size="40" />
    </div>

    <div v-else :class="$style.grid">
      <!-- Section Métadonnées -->
      <section :class="$style.section">
        <div :class="$style.sectionHeader">
          <div :class="$style.sectionIconWrapper">
            <Database :class="$style.sectionIcon" :size="20" />
          </div>
          <h2 :class="$style.sectionTitle">Méta-données & Contacts</h2>
        </div>
        
        <form @submit.prevent="saveMetadata" :class="$style.form">
          <div :class="$style.formContent">
            <div :class="$style.formGroup">
              <label :class="$style.label">Téléphone</label>
              <div :class="$style.inputWrapper">
                <input v-model="metadata.phone" type="text" :class="$style.input" placeholder="06 00 00 00 00" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Email de Contact</label>
              <div :class="$style.inputWrapper">
                <input v-model="metadata.contactEmail" type="email" :class="$style.input" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Email Devis</label>
              <div :class="$style.inputWrapper">
                <input v-model="metadata.devisEmail" type="email" :class="$style.input" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Horaires</label>
              <div :class="$style.inputWrapper">
                <input v-model="metadata.schedules" type="text" :class="$style.input" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Description (Meta OG & Footer)</label>
              <div :class="$style.inputWrapper">
                <textarea v-model="metadata.description" rows="3" :class="$style.textarea"></textarea>
              </div>
            </div>

            <div :class="$style.formGroup">
              <label :class="$style.label">Image Hero (Accueil)</label>
              <div :class="$style.imageUploadCard">
                <div v-if="previews.hero" :class="$style.imagePreview">
                  <img :src="previews.hero" alt="Hero Preview" />
                </div>
                <div :class="$style.fileInputWrapper">
                  <input type="file" @change="handleImageChange($event, 'hero')" accept="image/*" :class="$style.fileInput" />
                </div>
              </div>
            </div>

            <div :class="$style.formGroup">
              <label :class="$style.label">Image Zones d'intervention</label>
              <div :class="$style.imageUploadCard">
                <div v-if="previews.zones" :class="$style.imagePreview">
                  <img :src="previews.zones" alt="Zones Preview" />
                </div>
                <div :class="$style.fileInputWrapper">
                  <input type="file" @change="handleImageChange($event, 'zones')" accept="image/*" :class="$style.fileInput" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" :class="$style.saveButton">
            <Save :size="20" /> 
            <span>Enregistrer Métadonnées</span>
          </button>
        </form>
      </section>

      <!-- Section À Propos -->
      <section :class="$style.section">
        <div :class="$style.sectionHeader">
          <div :class="$style.sectionIconWrapper">
            <Edit :class="$style.sectionIcon" :size="20" />
          </div>
          <h2 :class="$style.sectionTitle">Contenu "À Propos"</h2>
        </div>
        
        <form @submit.prevent="saveAbout" :class="$style.form">
          <div :class="$style.formContent">
            <div :class="$style.formGroup">
              <label :class="$style.label">Sous-titre de la page</label>
              <div :class="$style.inputWrapper">
                <input v-model="about.subtitle" type="text" :class="$style.input" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Titre Section Histoire</label>
              <div :class="$style.inputWrapper">
                <input v-model="about.historySectionTitle" type="text" :class="$style.input" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Contenu Histoire</label>
              <div :class="$style.inputWrapper">
                <textarea v-model="about.historySectionContent" rows="5" :class="$style.textarea"></textarea>
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Titre Section Valeurs</label>
              <div :class="$style.inputWrapper">
                <input v-model="about.valuesSectionTitle" type="text" :class="$style.input" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Titre Section Avis</label>
              <div :class="$style.inputWrapper">
                <input v-model="about.reviewsSectionTitle" type="text" :class="$style.input" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Sous-titre Section Avis</label>
              <div :class="$style.inputWrapper">
                <input v-model="about.reviewsSectionSubtitle" type="text" :class="$style.input" />
              </div>
            </div>
            <div :class="$style.formGroup">
              <label :class="$style.label">Image À Propos</label>
              <div :class="$style.imageUploadCard">
                <div v-if="previews.about" :class="$style.imagePreview">
                  <img :src="previews.about" alt="About Preview" />
                </div>
                <div :class="$style.fileInputWrapper">
                  <input type="file" @change="handleImageChange($event, 'about')" accept="image/*" :class="$style.fileInput" />
                </div>
              </div>
            </div>
          </div>
          
          <button type="submit" :class="$style.saveButton">
            <Save :size="20" /> 
            <span>Enregistrer À Propos</span>
          </button>
        </form>
      </section>

      <!-- Section Valeurs -->
      <section :class="[$style.section, $style.fullWidth]">
        <div :class="$style.sectionHeader">
          <div :class="$style.sectionIconWrapper">
            <Plus :class="$style.sectionIcon" :size="20" />
          </div>
          <h2 :class="$style.sectionTitle">Nos Valeurs</h2>
          <button @click="openAddValueModal" :class="$style.headerAddButton">
            <Plus :size="18" />
            <span>Ajouter une valeur</span>
          </button>
        </div>
        
        <div v-if="aboutValues.length === 0" :class="$style.emptyValues">
          <p>Aucune valeur définie pour le moment.</p>
        </div>
        
        <div v-else :class="$style.valuesGrid">
          <div v-for="val in aboutValues" :key="val.id" :class="$style.valueCard">
            <div :class="$style.cardIndicator"></div>
            <div :class="$style.valueCardContent">
              <div :class="$style.valueInfo">
                <h3 :class="$style.valueTitle">{{ val.title }}</h3>
                <p :class="$style.valueDescription">{{ val.description }}</p>
              </div>
              <div :class="$style.valueActions">
                <button @click="openEditValueModal(val)" :class="$style.editButton" title="Modifier">
                  <Edit :size="16" />
                </button>
                <button @click="deleteValue(val.id)" :class="$style.deleteButton" title="Supprimer">
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal pour ajouter/modifier une valeur -->
    <div v-if="isValueModalOpen" :class="$style.modalOverlay">
      <div :class="$style.backdrop" @click="isValueModalOpen = false"></div>
      <div :class="$style.modalContainer">
        <div :class="$style.modalTopGradient"></div>
        <div :class="$style.modalBody">
          <div :class="$style.modalHeader">
            <h2 :class="$style.modalTitle">
              <div :class="$style.modalTitleIcon">
                <Plus :size="24" v-if="!editingValue" />
                <Edit :size="24" v-else />
              </div>
              {{ editingValue ? 'Modifier la valeur' : 'Nouvelle valeur' }}
            </h2>
            <button @click="isValueModalOpen = false" :class="$style.closeButton">
              <Plus :class="$style.closeIcon" :size="24" />
            </button>
          </div>

          <form @submit.prevent="saveValue">
            <div :class="$style.formContent">
              <div :class="$style.formGroup">
                <label :class="$style.label">Titre</label>
                <div :class="$style.inputWrapper">
                  <input v-model="newValue.title" type="text" :class="$style.input" required />
                </div>
              </div>
              <div :class="$style.formGroup">
                <label :class="$style.label">Description</label>
                <div :class="$style.inputWrapper">
                  <textarea v-model="newValue.description" rows="4" :class="$style.textarea" required></textarea>
                </div>
              </div>
            </div>

            <div :class="$style.modalActions">
              <button type="button" @click="isValueModalOpen = false" :class="$style.cancelButton">
                Annuler
              </button>
              <button type="submit" :class="$style.confirmButton">
                <Save :size="20" />
                <span>Enregistrer</span>
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
  margin-bottom: 2rem;
}

.title {
  font-size: 1.875rem;
  font-weight: 800;
  color: light-dark(#0f172a, #ffffff);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.titleIcon {
  background-color: #2563eb;
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
  color: #64748b;
  margin-top: 0.5rem;
  font-weight: 500;
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

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.section {
  background-color: var(--bg-card);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fullWidth {
  grid-column: 1 / -1;
}

.sectionHeader {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sectionIconWrapper {
  background-color: #eff6ff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #2563eb;
}

.sectionTitle {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-main);
  flex: 1;
}

.headerAddButton {
  background-color: #0f172a;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.headerAddButton:hover {
  background-color: #2563eb;
}

.form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.formContent {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
}

.inputWrapper {
  position: relative;
}

.input, .textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  color: var(--text-main);
  transition: all 0.2s;
  outline: none;
}

.input:focus, .textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  background-color: var(--bg-card);
}

.textarea {
  resize: vertical;
}

.imageUploadCard {
  border: 2px dashed var(--border-color);
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: var(--bg-main);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.imagePreview {
  width: 100%;
  height: 180px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
}

.imagePreview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.fileInputWrapper {
  font-size: 0.875rem;
}

.fileInput {
  width: 100%;
}

.saveButton {
  background-color: #2563eb;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
  border: none;
  cursor: pointer;
  margin-top: auto;
}

.saveButton:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
}

.valuesGrid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .valuesGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .valuesGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.valueCard {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}

.valueCard:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.cardIndicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 0.25rem;
  height: 100%;
  background-color: var(--primary);
  opacity: 0;
  transition: opacity 0.2s;
}

.valueCard:hover .cardIndicator {
  opacity: 1;
}

.valueCardContent {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.valueInfo {
  flex: 1;
}

.valueTitle {
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.valueDescription {
  font-size: 0.875rem;
  color: var(--text-main);
  opacity: 0.7;
  line-height: 1.5;
}

.valueActions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
}

.editButton, .deleteButton {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
}

.editButton:hover {
  color: #2563eb;
  background-color: #eff6ff;
}

.deleteButton:hover {
  color: #dc2626;
  background-color: #fef2f2;
}

.emptyValues {
  padding: 3rem;
  text-align: center;
  color: #64748b;
  font-style: italic;
}

/* Modal styles - shared with cities.vue patterns */
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
  max-width: 32rem;
  position: relative;
  z-index: 10;
  overflow: hidden;
  border: 1px solid var(--border-color);
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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

.modalActions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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
  background-color: var(--bg-main);
}

.confirmButton {
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

.confirmButton:hover {
  background-color: var(--secondary);
}
</style>
