import { doc, setDoc, collection } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'

export interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

/**
 * Send email using Firebase Trigger Email extension
 * Just writes to the 'mail' collection - Firebase handles the rest
 */
export async function sendEmail(emailData: EmailData) {
    const emailDoc = {
        to: emailData.to,
        from: emailData.from || 'ganishkhasricrackers@gmail.com',
        subject: emailData.subject,
        html: emailData.html,
        replyTo: emailData.replyTo || 'ganishkhasricrackers@gmail.com',
        createdAt: new Date().toISOString()
    }

    // Add to mail collection (Firebase Trigger Email will pick this up)
    await setDoc(doc(collection(firestore, 'mail')), emailDoc)
  
    console.log(`Email queued for ${emailData.to}`)
    return { status: 'queued' }
}
