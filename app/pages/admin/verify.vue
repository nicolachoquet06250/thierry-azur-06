<script setup lang="ts">
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-vue-next';

definePageMeta({
  layout: 'auth'
});

const code = ref('');
const loading = ref(false);
const { error: notifyError, success: notifySuccess } = useNotify();

onMounted(() => {
  if (!localStorage.getItem('2fa_userId')) {
    navigateTo('/admin/login');
  }
});

const verify = async () => {
  if (code.value.length !== 6) {
    await notifyError('Erreur', 'Le code doit contenir 6 chiffres');
    return;
  }

  loading.value = true;
  const userId = localStorage.getItem('2fa_userId');
  
  try {
    const response = await $fetch('/api/auth/verify', {
      method: 'POST',
      body: { userId: parseInt(userId!), code: code.value },
    });
    
    await notifySuccess('Succès', 'Authentification réussie');
    
    // Store token
    localStorage.setItem('auth_token', response.token);
    localStorage.removeItem('2fa_userId');
    
    // Redirect to dashboard
    await navigateTo('/admin');
  } catch (err: any) {
    await notifyError('Erreur', err.data?.statusMessage || 'Code invalide ou expiré');
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  localStorage.removeItem('2fa_userId');
  navigateTo('/admin/login');
};
</script>

<template>
  <NuxtLayout>
    <div :class="$style.verifyPage">
      <div :class="$style.bgDecoration">
        <div :class="[$style.circle, $style.circle1]"></div>
        <div :class="[$style.circle, $style.circle2]"></div>
      </div>

      <div :class="$style.verifyContainer">
        <div :class="['glass-card', $style.verifyCard]">
          <button @click="goBack" :class="$style.backButton" title="Retour à la connexion">
            <ArrowLeft :size="20" />
          </button>

          <div :class="$style.verifyHeader">
            <div :class="$style.logoContainer">
              <ShieldCheck :class="$style.logoIcon" :size="32" />
            </div>
            <h2>Vérification</h2>
            <p>Entrez le code de sécurité envoyé à votre adresse email</p>
          </div>

          <form :class="$style.verifyForm" @submit.prevent="verify">
            <div :class="$style.formGroup">
              <label for="code">Code de vérification</label>
              <input
                  v-model="code"
                  id="code"
                  name="code"
                  type="text"
                  required
                  maxlength="6"
                  placeholder="000000"
                  :class="$style.codeInput"
                  :disabled="loading"
                  autocomplete="one-time-code"
              />
            </div>

            <button
                type="submit"
                :disabled="loading || code.length !== 6"
                :class="['btn-primary', $style.verifyButton]"
            >
              <Loader2 v-if="loading" :class="$style.animateSpin" :size="20" />
              <span v-else>Vérifier le code</span>
            </button>
          </form>

          <div :class="$style.verifyFooter">
            <p>Vous n'avez pas reçu le code ? <br> Vérifiez vos spams ou réessayez dans quelques minutes.</p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style module>
.verifyPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
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
  opacity: 0.4;
}

.circle1 {
  width: 400px;
  height: 400px;
  background: var(--primary, #0077cc);
  top: -100px;
  right: -100px;
}

.circle2 {
  width: 300px;
  height: 300px;
  background: var(--secondary, #005fa3);
  bottom: -50px;
  left: -50px;
}

.verifyContainer {
  width: 100%;
  max-width: 440px;
  padding: 20px;
  z-index: 1;
}

.verifyCard {
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
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.backButton:hover {
  background: #f1f5f9;
  color: var(--primary, #0077cc);
}

.verifyHeader {
  text-align: center;
  margin-bottom: 32px;
}

.logoContainer {
  width: 64px;
  height: 64px;
  background: var(--accent, #e6f2ff);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: var(--primary, #0077cc);
}

.verifyHeader h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark, #1a365d);
  margin-bottom: 8px;
}

.verifyHeader p {
  color: #64748b;
  font-size: 14px;
}

.verifyForm {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
}

.formGroup label {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.codeInput {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5em;
  transition: all 0.2s;
  outline: none;
  background: white;
  color: var(--text-dark, #1a365d);
}

.codeInput:focus {
  border-color: var(--primary, #0077cc);
  box-shadow: 0 0 0 4px rgba(0, 119, 204, 0.1);
}

.codeInput::placeholder {
  letter-spacing: normal;
  font-size: 24px;
  color: #cbd5e1;
}

.verifyButton {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  width: 100%;
}

.errorMessage {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #fee2e2;
}

.verifyFooter {
  margin-top: 32px;
  text-align: center;
}

.verifyFooter p {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

.animateSpin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .verifyCard {
    padding: 48px 24px 32px;
  }
}
</style>
