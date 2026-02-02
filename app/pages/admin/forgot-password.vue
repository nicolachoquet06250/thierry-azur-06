<script setup lang="ts">
import { Mail, Lock, Loader2, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-vue-next';

definePageMeta({
  layout: 'auth'
});

const email = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const step = ref(1); // 1: email, 2: code + new password
const userId = ref<number | null>(null);

const { error: notifyError, success: notifySuccess } = useNotify();

const requestReset = async () => {
  if (!email.value) {
    await notifyError('Erreur', 'Veuillez saisir votre adresse email');
    return;
  }
  
  loading.value = true;
  try {
    const response = await $fetch<{ userId: number, message: string }>('/api/auth/request-reset-password', {
      method: 'POST',
      body: { email: email.value },
    });
    
    await notifySuccess('Email envoyé', response.message);
    userId.value = response.userId;
    step.value = 2;
  } catch (err: any) {
    await notifyError('Erreur', err.data?.statusMessage || "Échec de la demande");
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  if (code.value.length !== 6) {
    await notifyError('Erreur', 'Le code doit contenir 6 chiffres');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    await notifyError('Erreur', 'Les mots de passe ne correspondent pas');
    return;
  }

  if (newPassword.value.length < 8) {
    await notifyError('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
    return;
  }

  loading.value = true;
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { 
        userId: userId.value, 
        code: code.value, 
        newPassword: newPassword.value 
      },
    });
    
    await notifySuccess('Succès', 'Votre mot de passe a été réinitialisé');
    await navigateTo('/admin/login');
  } catch (err: any) {
    await notifyError('Erreur', err.data?.statusMessage || 'Impossible de réinitialiser le mot de passe');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Head>
    <Title>Thierry Azur 06 | Changer mon mot de passe</Title>
  </Head>

  <div :class="$style.forgotPage">
    <div :class="$style.bgDecoration">
      <div :class="[$style.circle, $style.circle1]"></div>
      <div :class="[$style.circle, $style.circle2]"></div>
    </div>

    <div :class="$style.container">
      <div :class="['glass-card', $style.card]">
        <NuxtLink to="/admin/login" :class="$style.backButton" title="Retour à la connexion">
          <ArrowLeft :size="20" />
        </NuxtLink>

        <div :class="$style.header">
          <div :class="$style.logoContainer">
            <KeyRound :class="$style.logoIcon" :size="32" />
          </div>
          <h2>Mot de passe oublié</h2>
          <p v-if="step === 1">Entrez votre email pour recevoir un code de réinitialisation</p>
          <p v-else>Entrez le code reçu par email et votre nouveau mot de passe</p>
        </div>

        <form v-if="step === 1" :class="$style.form" @submit.prevent="requestReset">
          <div :class="$style.formGroup">
            <label for="email">Email</label>
            <div :class="$style.inputWrapper">
              <Mail :class="$style.inputIcon" :size="18" />
              <input
                  v-model="email"
                  id="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  :disabled="loading"
              />
            </div>
          </div>

          <button
              type="submit"
              :disabled="loading"
              :class="['btn-primary', $style.submitButton]"
          >
            <Loader2 v-if="loading" :class="$style.animateSpin" :size="20" />
            <span v-else>Envoyer le code</span>
          </button>
        </form>

        <form v-else :class="$style.form" @submit.prevent="resetPassword">
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
              :class="['btn-primary', $style.submitButton]"
          >
            <Loader2 v-if="loading" :class="$style.animateSpin" :size="20" />
            <span v-else>Réinitialiser le mot de passe</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style module>
.forgotPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-main);
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
  position: relative;
}

.backButton {
  position: absolute;
  top: 24px;
  left: 24px;
  background: none;
  border: none;
  color: var(--text-main);
  opacity: 0.7;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.backButton:hover {
  background: var(--accent);
  color: var(--primary);
  opacity: 1;
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

.codeInput {
  letter-spacing: 0.5em;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: 700;
}

.submitButton {
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
    padding: 48px 24px 32px;
  }
}
</style>
