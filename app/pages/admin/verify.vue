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
    localStorage.setItem('user_id', response.user.id.toString());
    localStorage.removeItem('2fa_userId');
    
    // Check if password change is required
    if (response.user.mustChangePassword) {
      localStorage.setItem('must_change_password', 'true');
      await navigateTo('/admin/change-password');
    } else {
      // Redirect to dashboard
      await navigateTo('/admin');
    }
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
  <Head>
    <Title>Thierry Azur 06 | Vérification de mon identité</Title>
  </Head>

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
</template>

<style module>
.verifyPage {
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

.verifyHeader {
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

.verifyHeader h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

.verifyHeader p {
  color: var(--text-main);
  opacity: 0.7;
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
  color: var(--text-main);
}

.codeInput {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5em;
  transition: all 0.2s;
  outline: none;
  background: var(--bg-main);
  color: var(--text-main);
}

.codeInput:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(0, 119, 204, 0.1);
}

.codeInput::placeholder {
  letter-spacing: normal;
  font-size: 24px;
  color: var(--text-main);
  opacity: 0.3;
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

.verifyFooter {
  margin-top: 32px;
  text-align: center;
}

.verifyFooter p {
  color: var(--text-main);
  opacity: 0.5;
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

@media (max-width: 480px) {
  .verifyCard {
    padding: 48px 24px 32px;
  }
}
</style>
