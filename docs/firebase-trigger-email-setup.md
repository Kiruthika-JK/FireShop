# Firebase Trigger Email Extension Setup

## Overview
Firebase Trigger Email extension is the most reliable way to send emails from your FireShop application. It uses a Firestore collection to trigger emails through SMTP providers.

## Setup Steps

### 1. Install Firebase Trigger Email Extension

1. **Go to Firebase Console** -> Your Project -> Extensions
2. **Click "Install"** and search for "Trigger Email"
3. **Configure the extension:**
   - **SMTP Server:** Choose your provider (SendGrid, Mailgun, Gmail, etc.)
   - **SMTP Credentials:** Your email service credentials
   - **Collection Name:** `mail` (default)
   - **From Address:** `noreply@fireshop.com` (or your domain email)

### 2. SMTP Provider Setup

#### Option A: SendGrid (Recommended)
```env
# Add to your Firebase functions environment
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

#### Option B: Gmail (Free)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Option C: Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.com
SMTP_PASS=your-mailgun-api-key
```

### 3. Email Collection Structure

The extension watches the `mail` collection. Documents should have this structure:

```javascript
{
  to: "customer@example.com",
  from: "noreply@fireshop.com",
  subject: "Order Confirmation - #12345",
  html: "<h1>Your order is confirmed!</h1>...",
  text: "Your order is confirmed!...",
  replyTo: "support@fireshop.com",
  headers: {
    "X-Priority": "1"
  }
}
```

## Updated Code Implementation

### 1. Update Email Sending Function

```javascript
// In /lib/email/firebase-trigger-email.ts
import { doc, setDoc, collection } from 'firebase/firestore'
import { firestore } from '@/lib/config'

export class FirebaseTriggerEmail {
  static async sendEmail(emailData: {
    to: string
    subject: string
    html: string
    text?: string
    from?: string
    replyTo?: string
  }) {
    const emailDoc = {
      to: emailData.to,
      from: emailData.from || 'noreply@fireshop.com',
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || this.htmlToText(emailData.html),
      replyTo: emailData.replyTo || 'support@fireshop.com',
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    // Add to mail collection (Firebase Trigger Email will pick this up)
    await setDoc(doc(collection(firestore, 'mail')), emailDoc)
    
    return { method: 'firebase-trigger', status: 'queued' }
  }

  static htmlToText(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
  }
}
```

### 2. Update Customer Notifications

```javascript
// In /lib/email/customer-notifications.ts
import { FirebaseTriggerEmail } from './firebase-trigger-email'

export class CustomerNotificationService {
  static async sendOrderConfirmation(orderData: any) {
    const emailHtml = generateOrderConfirmationTemplate(orderData)
    
    return await FirebaseTriggerEmail.sendEmail({
      to: orderData.customerInfo.emailId,
      subject: `Order Confirmation - #${orderData.orderId}`,
      html: emailHtml,
      replyTo: 'orders@fireshop.com'
    })
  }

  static async sendOrderStatusUpdate(orderData: any, newStatus: string) {
    const emailHtml = generateStatusUpdateTemplate(orderData, newStatus)
    
    return await FirebaseTriggerEmail.sendEmail({
      to: orderData.customerInfo.emailId,
      subject: `Order Status Update - #${orderData.orderId}`,
      html: emailHtml,
      replyTo: 'orders@fireshop.com'
    })
  }
}
```

### 3. Update Checkout Page

```javascript
// In /app/checkout/page.tsx
import { CustomerNotificationService } from '@/lib/email/customer-notifications'

// Replace the current email sending with:
try {
  const result = await CustomerNotificationService.sendOrderConfirmation(orderData)
  console.log('Customer confirmation queued:', result)
} catch (error) {
  console.error('Error sending customer confirmation:', error)
}
```

## Benefits of Firebase Trigger Email

### Advantages:
- **Reliable delivery** through established SMTP providers
- **Automatic retries** and error handling
- **No external API calls** from your frontend
- **Scalable** solution that grows with your business
- **Professional email delivery** with proper DKIM/SPF records
- **Built-in analytics** and delivery tracking

### Cost:
- **Free tier** available with most SMTP providers
- **Pay-as-you-go** for higher volumes
- **No additional Firebase costs** beyond usage

## Testing Your Setup

### 1. Test Email Queue
```javascript
// Add a test email to the mail collection
await FirebaseTriggerEmail.sendEmail({
  to: 'your-email@example.com',
  subject: 'Test Email',
  html: '<h1>This is a test email</h1>'
})
```

### 2. Check Firebase Console
- Go to Firestore Database
- Look at the `mail` collection
- Documents should disappear after being sent

### 3. Monitor Logs
- Check Firebase Functions logs for email delivery status
- Monitor for any SMTP authentication issues

## Troubleshooting

### Common Issues:
1. **SMTP Authentication Failed** - Check credentials
2. **Email Not Sending** - Check collection name matches extension config
3. **Spam Folder** - Check SPF/DKIM records for your domain
4. **Rate Limits** - Monitor SMTP provider limits

### Debug Steps:
1. Check Firebase Functions logs
2. Verify SMTP credentials
3. Test with simple email first
4. Check mail collection in Firestore

## Migration Steps

1. **Install Firebase Trigger Email extension**
2. **Configure SMTP provider**
3. **Update email sending code** (above)
4. **Test with a sample order**
5. **Monitor email delivery**
6. **Remove old email sending methods**

## Security Notes

- **Never commit SMTP credentials** to git
- **Use Firebase environment variables** for sensitive data
- **Set up proper domain authentication** (SPF/DKIM)
- **Monitor for abuse** and rate limiting

This setup will give you the most reliable email delivery for your FireShop customer notifications!
