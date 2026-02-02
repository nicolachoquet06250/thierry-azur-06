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
  firstName: string,
  email: string,
  password: string
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
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '16px 48px',
  padding: '12px',
  textAlign: 'center' as const,
}
</script>

<template>
  <EHtml lang="fr">
    <EHead />
    <EPreview>Votre nouveau compte administrateur</EPreview>
    <EBody :style="main">
      <EContainer :style="container">
        <EHeading :style="h1">Bienvenue sur Thierry Azur 06</EHeading>
        <ESection>
          <EText :style="text">Bonjour {{ firstName }},</EText>
          <EText :style="text">
            Un compte administrateur a été créé pour vous. Voici vos identifiants de connexion :
          </EText>
          <ESection :style="codeBox">
            <EText :style="{ margin: '0' }">Email : {{ email }}</EText>
            <EText :style="{ margin: '8px 0 0' }">Mot de passe : {{ password }}</EText>
          </ESection>
          <EText :style="text">
            Pour des raisons de sécurité, vous devrez changer votre mot de passe lors de votre première connexion.
          </EText>
          <EText :style="text">
            Cordialement,<br />
            L'équipe Thierry Azur 06
          </EText>
        </ESection>
      </EContainer>
    </EBody>
  </EHtml>
</template>
