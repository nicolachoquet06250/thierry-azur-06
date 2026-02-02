<script setup lang="ts">
import { Mail, Lock, Loader2, LogIn } from 'lucide-vue-next';

definePageMeta({
  layout: 'auth'
});

const email = ref('');
const password = ref('');
const loading = ref(false);
const { error: notifyError, success: notifySuccess } = useNotify();

const login = async () => {
  if (!email.value || !password.value) {
    await notifyError('Erreur', 'Veuillez remplir tous les champs');
    return;
  }
  
  loading.value = true;
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });
    
    await notifySuccess('Connexion réussie', 'Redirection vers la vérification...');
    
    // Store userId for next step
    localStorage.setItem('2fa_userId', response.userId.toString());
    
    // Redirect to verification page
    await navigateTo('/admin/verify');
  } catch (err: any) {
    await notifyError('Erreur de connexion', err.data?.statusMessage || 'Identifiants invalides');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <NuxtLayout>
    <div :class="$style.loginPage">
      <div :class="$style.bgDecoration">
        <div :class="[$style.circle, $style.circle1]"></div>
        <div :class="[$style.circle, $style.circle2]"></div>
      </div>

      <div :class="$style.loginContainer">
        <div :class="['glass-card', $style.loginCard]">
          <div :class="$style.loginHeader">
            <div :class="$style.logoContainer">
              <LogIn :class="$style.logoIcon" :size="32" />
            </div>
            <h2>Administration</h2>
            <p>Accédez à votre tableau de bord</p>
          </div>

          <form :class="$style.loginForm" @submit.prevent="login">
            <div :class="$style.formGroup">
              <label for="email-address">Email</label>
              <div :class="$style.inputWrapper">
                <Mail :class="$style.inputIcon" :size="18" />
                <input
                    v-model="email"
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    placeholder="votre@email.com"
                    :disabled="loading"
                />
              </div>
            </div>

            <div :class="$style.formGroup">
              <label for="password">Mot de passe</label>
              <div :class="$style.inputWrapper">
                <Lock :class="$style.inputIcon" :size="18" />
                <input
                    v-model="password"
                    id="password"
                    name="password"
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
                :class="['btn-primary', $style.loginButton]"
            >
              <Loader2 v-if="loading" :class="$style.animateSpin" :size="20" />
              <span v-else>Se connecter</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style module>
.loginPage {
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

.loginContainer {
  width: 100%;
  max-width: 440px;
  padding: 20px;
  z-index: 1;
}

.loginCard {
  padding: 40px;
  border-radius: 24px;
}

.loginHeader {
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

.loginHeader h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

.loginHeader p {
  color: var(--text-main);
  opacity: 0.7;
  font-size: 14px;
}

.loginForm {
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

.loginButton {
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
  .loginCard {
    padding: 32px 24px;
  }
}
</style>
