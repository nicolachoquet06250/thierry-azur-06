<script setup lang="ts">
import { AlertTriangle, Loader2 } from 'lucide-vue-next';

const { isOpen, config, confirm, cancel, isLoading } = useConfirm();
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" :class="$style.overlay" @click.self="cancel">
      <Transition name="scale">
        <div :class="$style.modal">
          <div :class="$style.iconWrapper">
            <AlertTriangle :class="$style.icon" :size="32" />
          </div>
          
          <div :class="$style.content">
            <h3 :class="$style.title">{{ config.title || 'Confirmation' }}</h3>
            <p :class="$style.message">{{ config.message }}</p>
          </div>

          <div :class="$style.footer">
            <button 
              @click="cancel" 
              :class="$style.cancelBtn"
              :disabled="isLoading"
            >
              {{ config.cancelText || 'Annuler' }}
            </button>
            <button 
              @click="confirm" 
              :class="$style.confirmBtn"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" :class="$style.spinner" :size="18" />
              <span v-else>{{ config.confirmText || 'Confirmer' }}</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style module>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  padding: 20px;
}

.modal {
  background-color: var(--bg-card);
  border-radius: 1.25rem;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color);
  text-align: center;
}

.iconWrapper {
  width: 64px;
  height: 64px;
  background-color: light-dark(#fff7ed, #451a03);
  color: #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.content {
  margin-bottom: 24px;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

.message {
  color: var(--text-main);
  opacity: 0.7;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.footer {
  display: flex;
  gap: 12px;
}

.cancelBtn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-main);
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancelBtn:hover:not(:disabled) {
  background-color: var(--accent);
}

.confirmBtn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background-color: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirmBtn:hover:not(:disabled) {
  background-color: #dc2626;
}

.confirmBtn:disabled, .cancelBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

:global(.fade-enter-active),
:global(.fade-leave-active) {
  transition: opacity 0.3s ease;
}

:global(.fade-enter-from),
:global(.fade-leave-to) {
  opacity: 0;
}

:global(.scale-enter-active),
:global(.scale-leave-active) {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

:global(.scale-enter-from),
:global(.scale-leave-to) {
  transform: scale(0.9);
  opacity: 0;
}
</style>
