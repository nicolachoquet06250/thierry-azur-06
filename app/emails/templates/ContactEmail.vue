<script setup lang="ts">
import {
  Html as EHtml,
  Head as EHead,
  Body as EBody,
  Container as EContainer,
  Section as ESection,
  Text as EText,
  Heading as EHeading,
  Preview as EPreview,
  Hr as EHr,
} from '@vue-email/components'

defineProps<{
  nom: string
  prenom: string
  email: string
  objet: string
  message: string
}>()

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#1e3a8a',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0 48px',
}

const section = {
  padding: '0 48px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const messageBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '4px',
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '16px',
  whiteSpace: 'pre-wrap' as const,
}
</script>

<template>
  <EHtml lang="fr">
    <EHead />
    <EPreview>Nouveau message de {{ prenom }} {{ nom }}</EPreview>
    <EBody :style="main">
      <EContainer :style="container">
        <EHeading :style="h1">Nouveau message de contact</EHeading>
        <ESection :style="section">
          <EText :style="text">
            <strong>De: </strong>
            {{ prenom }} {{ nom }} ({{ email }})
          </EText>
          <EText :style="text">
            <strong>Objet: </strong>
            {{ objet }}
          </EText>
          <EHr :style="hr" />
          <EText :style="text">
            <strong>Message:</strong>
          </EText>
          <EText :style="messageBox">{{ message }}</EText>
        </ESection>
      </EContainer>
    </EBody>
  </EHtml>
</template>
