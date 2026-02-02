import { verifyCode, sendMail } from '../utils/mail'
import { render } from '@vue-email/render'
import ContactEmail from '../../app/emails/templates/ContactEmail.vue'
import { contacts, devisAsks } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nom, prenom, email, objet, message, code } = body

  if (!email || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email ou code manquant',
    })
  }

  const isValid = verifyCode(email, code)
  if (!isValid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Code de confirmation invalide ou expiré',
    })
  }

  const db = useDb()

  // Enregistrer en base de données
  try {
    const isDevis = objet.toLowerCase().includes('devis')
    
    if (isDevis) {
      await db.insert(devisAsks).values({
        firstName: prenom,
        lastName: nom,
        email,
        subject: objet,
        message,
      })
    } else {
      await db.insert(contacts).values({
        firstName: prenom,
        lastName: nom,
        email,
        subject: objet,
        message,
      })
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement en base de données:', error)
    // On continue quand même l'envoi du mail car c'est le plus important pour le client
  }

  // Ici on simule l'envoi final du message (par exemple vers l'admin)
  try {
    const html = await render(ContactEmail, {
      nom, prenom,
      email, objet,
      message,
    })
    const text = await render(ContactEmail, {
      nom, prenom,
      email, objet,
      message,
    }, {plainText: true})

    await sendMail({
      to: process.env.CONTACT_EMAIL || 'admin@thierry-azure.fr',
      subject: `Contact de ${nom} ${prenom}: ${objet}`,
      html, text
    })
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message final:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'envoi du message final',
    })
  }
})
