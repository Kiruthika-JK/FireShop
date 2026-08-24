import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK
admin.initializeApp()

interface OrderData {
  id: string
  totalPrice: number
  gstAmount?: number
  grandTotal?: number
  products: Array<{
    name: string
    quantity: number
    discountedPrice: number
  }>
  customerInfo: {
    name: string
    mobileNo: string
    emailId: string
    address: string
    city: string
    state?: string
    pincode: string
  }
  createdAt: string
  status: string
}

interface MailPayload {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

// Cloud Function that triggers when a new order is created
export const onOrderCreated = functions
  .runWith({
    secrets: ['GMAIL_USER', 'GMAIL_PASS'],
    timeoutSeconds: 60,
  })
  .region('asia-south1')
  .firestore
  .document('orders/{orderId}')
  .onCreate(async (snapshot: functions.firestore.DocumentSnapshot, context: functions.EventContext) => {
    try {
      const orderData = snapshot.data() as OrderData
      
      if (!orderData) {
        console.log('No order data found')
        return
      }

      console.log(`New order created: ${context.params.orderId}`)

      // Get admin emails from Firestore
      const adminEmails = await getAdminEmails()

      // Generate email content
      const adminEmailContent = generateAdminEmailContent(orderData)

      // TODO: Change to Admin mail group to save costs. For now, sending to all admins
      for (const adminEmail of adminEmails) {
        await sendEmail({
          to: adminEmail,
          subject: `New Order Received - Order #${orderData.id}`,
          html: adminEmailContent,
        })
      }

      console.log(`Order notifications sent to ${adminEmails.length} admins`)

    } catch (error) {
      console.error('Error processing order notification:', error)
    }
  })

// Get admin emails from Firestore.
// Preferred scheme: each admin is a document in `admins/{email}` (matches frontend admin check).
// Legacy scheme: `admins/config` doc with an `emails` array (kept for backward compatibility).
async function getAdminEmails(): Promise<string[]> {
  try {
    const snapshot = await admin.firestore().collection('admins').get()
    const emails = new Set<string>()

    snapshot.forEach((docSnap: admin.firestore.QueryDocumentSnapshot) => {
      // Legacy: admins/config with an `emails` array
      if (docSnap.id === 'config') {
        const data = docSnap.data() as { emails?: unknown }
        if (Array.isArray(data?.emails)) {
          data.emails.forEach(e => {
            if (typeof e === 'string' && isValidEmail(e)) emails.add(e)
          })
        }
        return
      }
      // Preferred: doc id is the admin's email
      if (isValidEmail(docSnap.id)) emails.add(docSnap.id)
    })

    return Array.from(emails)
  } catch (error) {
    console.error('Failed to get admin emails:', error)
    return []
  }
}

function isValidEmail(email: string | undefined): boolean {
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(value)
}

// Generate HTML email content for admin notifications
function generateAdminEmailContent(orderData: OrderData): string {
  const formattedDate = new Date(orderData.createdAt).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const productsTable = orderData.products.map(product => `
    <tr>
      <td style="padding: 10px; border: 1px solid #e5e7eb;">${escapeHtml(product.name)}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${product.quantity}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Rs.${formatMoney(product.discountedPrice)}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-weight: 700;">Rs.${formatMoney(product.discountedPrice * product.quantity)}</td>
    </tr>
  `).join('')

  const finalTotal = orderData.grandTotal || orderData.totalPrice

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { margin: 0; background: #f3f4f6; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
        .container { max-width: 680px; margin: 0 auto; padding: 24px 16px; }
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); }
        .header { background: linear-gradient(135deg, #ef4444, #f59e0b); color: white; padding: 24px; }
        .title { margin: 0; font-size: 24px; }
        .subtitle { margin: 8px 0 0 0; opacity: 0.95; font-size: 14px; }
        .section { padding: 20px 24px; border-top: 1px solid #f3f4f6; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
        .label { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
        .value { color: #111827; font-size: 14px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #f59e0b; color: #ffffff; padding: 10px; text-align: left; font-size: 12px; }
        .total-row { font-weight: 700; background: #f9fafb; }
        .cta-wrap { text-align: center; margin-top: 18px; }
        .btn { display: inline-block; background: #111827; color: #ffffff !important; text-decoration: none; padding: 10px 16px; border-radius: 10px; font-weight: 600; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; padding: 18px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1 class="title">New Order Received</h1>
            <p class="subtitle">Order #${escapeHtml(orderData.id)} | ${formattedDate}</p>
          </div>

          <div class="section">
            <div class="grid">
              <div>
                <div class="label">Order ID</div>
                <div class="value">#${escapeHtml(orderData.id)}</div>
              </div>
              <div>
                <div class="label">Status</div>
                <div class="value">${escapeHtml(orderData.status)}</div>
              </div>
              <div>
                <div class="label">Subtotal</div>
                <div class="value">Rs.${formatMoney(orderData.totalPrice)}</div>
              </div>
              <div>
                <div class="label">Final Total</div>
                <div class="value">Rs.${formatMoney(finalTotal)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 style="margin: 0 0 10px 0;">Customer Details</h3>
            <p style="margin: 6px 0;"><strong>Name:</strong> ${escapeHtml(orderData.customerInfo.name)}</p>
            <p style="margin: 6px 0;"><strong>Email:</strong> ${escapeHtml(orderData.customerInfo.emailId)}</p>
            <p style="margin: 6px 0;"><strong>Phone:</strong> ${escapeHtml(orderData.customerInfo.mobileNo)}</p>
            <p style="margin: 6px 0;"><strong>Address:</strong> ${escapeHtml(orderData.customerInfo.address)}, ${escapeHtml(orderData.customerInfo.city)}${orderData.customerInfo.state ? `, ${escapeHtml(orderData.customerInfo.state)}` : ''} - ${escapeHtml(orderData.customerInfo.pincode)}</p>
          </div>

          <div class="section">
            <h3 style="margin: 0 0 10px 0;">Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                ${productsTable}
                <tr class="total-row">
                  <td colspan="3" style="padding: 10px; text-align: right;">Final Total</td>
                  <td style="padding: 10px; text-align: right; color: #047857;">Rs.${formatMoney(finalTotal)}</td>
                </tr>
              </tbody>
            </table>
            <div class="cta-wrap">
              <a href="mailto:${escapeHtml(orderData.customerInfo.emailId)}" class="btn">Contact Customer</a>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">Automated FireShop order alert.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send email via provider if configured, otherwise queue in Firestore.
async function sendEmail(mail: MailPayload): Promise<void> {
  try {
    // Method 1: Using Firebase Admin SDK with SendGrid (if configured)
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      const msg = {
        to: mail.to,
        from: mail.from || 'noreply@fireshop.com',
        subject: mail.subject,
        html: mail.html,
        replyTo: mail.replyTo,
      }

      await sgMail.send(msg)
      console.log(`Email sent to ${mail.to} via SendGrid`)
      return
    }

    // Method 2: Using Nodemailer with Gmail (if configured)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      const nodemailer = require('nodemailer')
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      })

      const mailOptions = {
        from: mail.from || process.env.GMAIL_USER,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        replyTo: mail.replyTo,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Email sent to ${mail.to} via Gmail`)
      return
    }

    // Method 3: Save to Firestore for manual sending
    await admin.firestore().collection('email-queue').add({
      to: mail.to,
      from: mail.from || 'noreply@fireshop.com',
      replyTo: mail.replyTo || 'support@fireshop.com',
      subject: mail.subject,
      html: mail.html,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      source: 'onOrderCreated'
    })

    console.log(`Email saved to queue for ${mail.to}`)

  } catch (error) {
    console.error(`Failed to send email to ${mail.to}:`, error)

    // Save to queue as fallback
    await admin.firestore().collection('email-queue').add({
      to: mail.to,
      from: mail.from || 'noreply@fireshop.com',
      replyTo: mail.replyTo || 'support@fireshop.com',
      subject: mail.subject,
      html: mail.html,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      source: 'onOrderCreated'
    })
  }
}
