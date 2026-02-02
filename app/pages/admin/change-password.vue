<script setup lang="ts">
import { Lock, Loader2, KeyRound, ShieldCheck } from 'lucide-vue-next';

// definePageMeta({
//   layout: 'admin'
// });

const newPassword = ref('');
const confirmPassword = ref('');
const oldPassword = ref('');
const code = ref('');
const loading = ref(false);
const step = ref(1); // 1: password entry, 2: code verification
const isForced = ref(false);
const { error: notifyError, success: notifySuccess } = useNotify();

onMounted(() => {
  isForced.value = localStorage.getItem('must_change_password') === 'true';
  // Si ce n'est pas forcé, on vérifie si l'utilisateur est connecté via le token
  if (!isForced.value && !localStorage.getItem('auth_token')) {
    navigateTo('/admin/login');
  }
});

const requestVerificationCode = async () => {
  if (newPassword.value !== confirmPassword.value) {
    await notifyError('Erreur', 'Les mots de passe ne correspondent pas');
    return;
  }

  if (newPassword.value.length < 8) {
    await notifyError('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
    return;
  }

  if (!isForced.value && !oldPassword.value) {
    await notifyError('Erreur', "L'ancien mot de passe est requis");
    return;
  }

  loading.value = true;
  const userId = localStorage.getItem('user_id');

  try {
    await $fetch('/api/admin/users/request-password-change-code', {
      method: 'POST',
      body: { userId: parseInt(userId!) },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    await notifySuccess('Succès', 'Un code de vérification vous a été envoyé par email');
    step.value = 2;
  } catch (err: any) {
    await notifyError('Erreur', err.data?.statusMessage || "Échec de l'envoi du code");
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (code.value.length !== 6) {
    await notifyError('Erreur', 'Le code doit contenir 6 chiffres');
    return;
  }

  loading.value = true;
  const userId = localStorage.getItem('user_id');

  try {
    await $fetch('/api/admin/users/change-password', {
      method: 'PATCH',
      body: { 
        userId: parseInt(userId!), 
        newPassword: newPassword.value,
        oldPassword: oldPassword.value || undefined,
        code: code.value
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    await notifySuccess('Succès', 'Votre mot de passe a été mis à jour');
    
    if (isForced.value) {
      localStorage.removeItem('must_change_password');
      // On redirige vers le dashboard après un changement forcé
      await navigateTo('/admin');
    } else {
      // Si c'est un changement volontaire, on réinitialise
      newPassword.value = '';
      confirmPassword.value = '';
      oldPassword.value = '';
      code.value = '';
      step.value = 1;
    }
    
  } catch (err: any) {
    await notifyError('Erreur', err.data?.statusMessage || 'Impossible de changer le mot de passe');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Head>
    <Title>Thierry Azur 06 | Changer de mot de passe</Title>
  </Head>

  <div :class="$style.changePasswordPage">
    <div :class="$style.bgDecoration">
      <div :class="[$style.circle, $style.circle1]"></div>
      <div :class="[$style.circle, $style.circle2]"></div>
    </div>

    <div :class="$style.container">
      <div :class="['glass-card', $style.card]">
        <div :class="$style.header">
          <div :class="$style.logoContainer">
            <KeyRound :class="$style.logoIcon" :size="32" />
          </div>
          <h2>{{ isForced ? 'Nouveau mot de passe' : 'Modifier le mot de passe' }}</h2>
          <p v-if="step === 1">{{ isForced ? 'Pour votre première connexion, vous devez définir un nouveau mot de passe sécurisé.' : 'Modifiez votre mot de passe actuel pour un nouveau plus sécurisé.' }}</p>
          <p v-else>Un code de vérification a été envoyé à votre adresse email. Veuillez le saisir ci-dessous pour valider le changement.</p>
        </div>

        <form v-if="step === 1" :class="$style.form" @submit.prevent="requestVerificationCode">
          <div v-if="!isForced" :class="$style.formGroup">
            <label for="old-password">Ancien mot de passe</label>
            <div :class="$style.inputWrapper">
              <Lock :class="$style.inputIcon" :size="18" />
              <input
                  v-model="oldPassword"
                  id="old-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  :disabled="loading"
              />
            </div>
          </div>

          <div :class="$style.formGroup">
            <label for="new-password">Nouveau mot de passe</label>
            <div :class="$style.inputWrapper">
              <Lock :class="$style.inputIcon" :size="18" />
              <input
                  v-model="newPassword"
                  id="new-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  :disabled="loading"
              />
            </div>
          </div>

          <div :class="$style.formGroup">
            <label for="confirm-password">Confirmer le mot de passe</label>
            <div :class="$style.inputWrapper">
              <Lock :class="$style.inputIcon" :size="18" />
              <input
                  v-model="confirmPassword"
                  id="confirm-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  :disabled="loading"
              />
            </div>
          </div>

          <button
              type="submit"
              :disabled="loading"
              :class="['btn-primary', $style.button]"
          >
            <Loader2 v-if="loading" :class="$style.animateSpin" :size="20" />
            <span v-else>Continuer</span>
          </button>
        </form>

        <form v-else :class="$style.form" @submit.prevent="changePassword">
          <div :class="$style.formGroup">
            <label for="code">Code de vérification</label>
            <div :class="$style.inputWrapper">
              <ShieldCheck :class="$style.inputIcon" :size="18" />
              <input
                  v-model="code"
                  id="code"
                  type="text"
                  required
                  maxlength="6"
                  placeholder="000000"
                  :class="$style.codeInput"
                  :disabled="loading"
              />
            </div>
          </div>

          <div :class="$style.actionButtons">
            <button
                type="button"
                @click="step = 1"
                :disabled="loading"
                :class="['btn-secondary', $style.button]"
            >
              Retour
            </button>
            <button
                type="submit"
                :disabled="loading || code.length !== 6"
                :class="['btn-primary', $style.button]"
            >
              <Loader2 v-if="loading" :class="$style.animateSpin" :size="20" />
              <span v-else>Valider et changer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style module>
.changePasswordPage {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.bgDecoration {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
}

.circle1 {
  width: 400px;
  height: 400px;
  background: var(--primary);
  top: -100px;
  right: -100px;
}

.circle2 {
  width: 300px;
  height: 300px;
  background: var(--secondary);
  bottom: -50px;
  left: -50px;
}

.container {
  width: 100%;
  max-width: 440px;
  padding: 20px;
  z-index: 1;
}

.card {
  padding: 40px;
  border-radius: 24px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.logoContainer {
  width: 64px;
  height: 64px;
  background: var(--accent);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: var(--primary);
}

.header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

.header p {
  color: var(--text-main);
  opacity: 0.7;
  font-size: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.formGroup label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  margin-left: 4px;
}

.actionButtons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.codeInput {
  width: 100% !important;
  text-align: center;
  letter-spacing: 0.5em;
  font-size: 24px !important;
  font-weight: 700;
}

.inputWrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.inputIcon {
  position: absolute;
  left: 12px;
  color: var(--text-main);
  opacity: 0.5;
  pointer-events: none;
}

.inputWrapper input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s;
  outline: none;
  background: var(--bg-main);
  color: var(--text-main);
}

.inputWrapper input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(0, 119, 204, 0.1);
}

.button {
  margin-top: 8px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  width: 100%;
}

.animateSpin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .card {
    padding: 32px 24px;
  }
}
</style>
