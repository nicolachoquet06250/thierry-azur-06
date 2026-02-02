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
} from '@vue-email/components'

defineProps<{
  code: string
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
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0 48px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
}

const codeBox = {
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
  color: '#333',
  fontSize: '32px',
  fontWeight: 'bold',
  letterSpacing: '5px',
  margin: '16px 48px',
  padding: '12px',
  textAlign: 'center' as const,
}
</script>

<template>
  <EHtml lang="fr">
    <EHead />
    <EPreview>Votre code de confirmation</EPreview>
    <EBody :style="main">
      <EContainer :style="container">
        <EHeading :style="h1">Vérification de votre adresse email</EHeading>
        <ESection>
          <EText :style="text">Bonjour,</EText>
          <EText :style="text">
            Merci de nous avoir contactés. Voici votre code de confirmation pour valider l'envoi de votre message :
          </EText>
          <EText :style="codeBox">{{ code }}</EText>
          <EText :style="text">Ce code est valable pendant 10 minutes.</EText>
        </ESection>
      </EContainer>
    </EBody>
  </EHtml>
</template>
