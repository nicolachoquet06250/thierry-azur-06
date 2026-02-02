import { render } from '@vue-email/render'
import VerificationEmail from '../../app/emails/templates/VerificationEmail.vue'
import { generateCode, sendMail } from '../utils/mail'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email manquant',
    })
  }

  const code = generateCode(email)
  const html = await render(VerificationEmail, {
    code,
  })
  const text = await render(VerificationEmail, {
    code,
  }, {plainText: true})

  try {
    await sendMail({
      to: email,
      subject: 'Votre code de confirmation',
      html, text
    })
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du mail:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'envoi de l\'email de confirmation',
    })
  }
})
