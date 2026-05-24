import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { DocumentSnapshot } from 'firebase-functions/lib/v1/firestore'

// Initialize Firebase Admin SDK
admin.initializeApp()

interface OrderData {
  id: string
  totalPrice: number
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
    pincode: string
  }
  createdAt: string
  status: string
}

interface AdminUser {
  email: string
  name?: string
}

// Cloud Function that triggers when a new order is created
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snapshot: DocumentSnapshot, context: functions.EventContext) => {
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
      const emailContent = generateAdminEmailContent(orderData)
      
      // Send email to each admin
      for (const adminEmail of adminEmails) {
        await sendEmailToAdmin(adminEmail, orderData.id, emailContent)
      }
      
      console.log(`Order notifications sent to ${adminEmails.length} admins`)
      
    } catch (error) {
      console.error('Error processing order notification:', error)
    }
  })

// Get admin emails from Firestore
async function getAdminEmails(): Promise<string[]> {
  try {
    const adminsSnapshot = await admin.firestore().collection('admins').doc('config').get()
    const adminData = adminsSnapshot.data()
    
    if (adminData?.emails && Array.isArray(adminData.emails)) {
      return adminData.emails
    }
    
    // Fallback to default admin emails
    return ['admin@fireshop.com', 'orders@fireshop.com']
  } catch (error) {
    console.error('Failed to get admin emails:', error)
    return ['admin@fireshop.com']
  }
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
      <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Rs.${product.discountedPrice}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Rs.${product.discountedPrice * product.quantity}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ffa500); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
        .order-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffa500; }
        .customer-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4CAF50; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #ffa500; color: white; padding: 10px; text-align: left; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FireShop - New Order Received! </h1>
          <p>Order #${orderData.id}</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> #${orderData.id}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Status:</strong> ${orderData.status}</p>
            <p><strong>Total Amount:</strong> <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">Rs.${orderData.totalPrice}</span></p>
          </div>

          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${orderData.customerInfo.name}</p>
            <p><strong>Email:</strong> ${orderData.customerInfo.emailId}</p>
            <p><strong>Phone:</strong> ${orderData.customerInfo.mobileNo}</p>
            <p><strong>Address:</strong> ${orderData.customerInfo.address}</p>
            <p><strong>City:</strong> ${orderData.customerInfo.city}</p>
            <p><strong>Pincode:</strong> ${orderData.customerInfo.pincode}</p>
          </div>

          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsTable}
              <tr class="total-row">
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #4CAF50;">Rs.${orderData.totalPrice}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin: 20px 0;">
            <a href="mailto:${orderData.customerInfo.emailId}" class="btn">Contact Customer</a>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification from FireShop. Please do not reply to this email.</p>
          <p>© 2024 FireShop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send email to admin using Firebase Admin SDK
async function sendEmailToAdmin(adminEmail: string, orderId: string, emailContent: string): Promise<void> {
  try {
    // Method 1: Using Firebase Admin SDK with SendGrid (if configured)
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      
      const msg = {
        to: adminEmail,
        from: 'noreply@fireshop.com',
        subject: `New Order Received - Order #${orderId}`,
        html: emailContent,
      }
      
      await sgMail.send(msg)
      console.log(`Email sent to ${adminEmail} via SendGrid`)
      return
    }

    // Method 2: Using Nodemailer with Gmail (if configured)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      const nodemailer = require('nodemailer')
      
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      })

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: adminEmail,
        subject: `New Order Received - Order #${orderId}`,
        html: emailContent,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Email sent to ${adminEmail} via Gmail`)
      return
    }

    // Method 3: Save to Firestore for manual sending
    await admin.firestore().collection('email-queue').add({
      to: adminEmail,
      subject: `New Order Received - Order #${orderId}`,
      html: emailContent,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      orderId: orderId
    })

    console.log(`Email saved to queue for ${adminEmail}`)

  } catch (error) {
    console.error(`Failed to send email to ${adminEmail}:`, error)
    
    // Save to queue as fallback
    await admin.firestore().collection('email-queue').add({
      to: adminEmail,
      subject: `New Order Received - Order #${orderId}`,
      html: emailContent,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      error: error.message,
      orderId: orderId
    })
  }
}
