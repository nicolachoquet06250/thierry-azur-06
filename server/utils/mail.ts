import nodemailer from 'nodemailer'

// Note: Pour la démonstration, on utilise des variables d'environnement
// ou des valeurs par défaut (à configurer en production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
})

// Stockage temporaire des codes (en production, utilisez Redis ou une DB)
const codes = new Map<string, { code: string, expires: number }>()

export const generateCode = (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
  codes.set(email, { code, expires })
  return code
}

export const verifyCode = (email: string, code: string) => {
  const entry = codes.get(email)
  if (!entry) return false
  if (Date.now() > entry.expires) {
    codes.delete(email)
    return false
  }
  const isValid = entry.code === code
  if (isValid) {
    codes.delete(email)
  }
  return isValid
}

export const sendMail = async (options: { to: string, subject: string, html: string, text?: string }) => {
  return transporter.sendMail({
    from: '"Thierry Azur 06" <no-reply@thierry-azure.fr>',
    ...options
  })
}
