import { randomBytes, createHmac } from 'crypto'

// Configuration de sécurité
const CSRF_SECRET = process.env.CSRF_SECRET || 'your-secret-key-change-in-production'
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5 // 5 requêtes par fenêtre

// Interface pour le rate limiting
interface RateLimitEntry {
  count: number
  resetTime: number
}

// Map pour le rate limiting (en production, utilisez Redis)
const rateLimitMap = new Map<string, RateLimitEntry>()

// Génération d'un token CSRF
export function generateCSRFToken(): string {
  const token = randomBytes(32).toString('hex')
  const timestamp = Date.now().toString()
  const data = `${token}:${timestamp}`
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(data)
    .digest('hex')
  
  return Buffer.from(`${data}:${signature}`).toString('base64')
}

// Validation d'un token CSRF
export function validateCSRFToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [tokenPart, timestamp, signature] = decoded.split(':')
    
    if (!tokenPart || !timestamp || !signature) {
      return false
    }
    
    // Vérification de l'expiration (1 heure)
    const tokenTime = parseInt(timestamp)
    const now = Date.now()
    if (now - tokenTime > 60 * 60 * 1000) {
      return false
    }
    
    // Vérification de la signature
    const data = `${tokenPart}:${timestamp}`
    const expectedSignature = createHmac('sha256', CSRF_SECRET)
      .update(data)
      .digest('hex')
    
    return signature === expectedSignature
  } catch (error) {
    return false
  }
}

// Vérification du rate limiting
export function checkRateLimit(identifier: string): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)
  
  if (!entry || now > entry.resetTime) {
    // Nouvelle fenêtre ou première requête
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetTime: now + RATE_LIMIT_WINDOW
    }
  }
  
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }
  
  entry.count++
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    resetTime: entry.resetTime
  }
}

// Validation des types MIME pour les uploads
export function validateMimeType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType)
}

// Validation de la taille des fichiers
export function validateFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize
}

// Nettoyage du nom de fichier
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplace les caractères spéciaux
    .replace(/_{2,}/g, '_') // Remplace les underscores multiples
    .substring(0, 100) // Limite la longueur
}

// Validation de l'email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Validation du téléphone français
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Échappement HTML
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// Validation des données du formulaire de contact
export function validateContactForm(data: {
  name: string
  email: string
  phone: string
  company: string
  message: string
  csrfToken: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Validation du nom
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères')
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Le nom ne peut pas dépasser 100 caractères')
  }
  
  // Validation de l'email
  if (!data.email || !validateEmail(data.email)) {
    errors.push('L\'email n\'est pas valide')
  }
  
  // Validation du téléphone
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Le téléphone n\'est pas valide')
  }
  
  // Validation de l'entreprise
  if (data.company && data.company.length > 100) {
    errors.push('Le nom de l\'entreprise ne peut pas dépasser 100 caractères')
  }
  
  // Validation du message
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Le message doit contenir au moins 10 caractères')
  }
  
  if (data.message && data.message.length > 2000) {
    errors.push('Le message ne peut pas dépasser 2000 caractères')
  }
  
  // Validation du token CSRF
  if (!data.csrfToken || !validateCSRFToken(data.csrfToken)) {
    errors.push('Token de sécurité invalide')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Types MIME autorisés pour les uploads
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'text/plain',
  'application/pdf'
]

// Taille maximale des fichiers (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024
