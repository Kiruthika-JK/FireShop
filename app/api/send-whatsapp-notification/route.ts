import { NextRequest, NextResponse } from 'next/server'
import { firestore } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

interface WhatsAppNotificationData {
  orderId: string
  customerPhone: string
  customerName: string
  type: 'order_confirmation' | 'status_update'
  status?: string
  orderData?: any
  previousStatus?: string
}

export async function POST(request: NextRequest) {
  try {
    const notificationData: WhatsAppNotificationData = await request.json()

    if (!notificationData || !notificationData.customerPhone) {
      return NextResponse.json({ error: 'Invalid notification data' }, { status: 400 })
    }

    console.log(`Sending WhatsApp notification: ${notificationData.type} for order ${notificationData.orderId}`)

    let message: string

    if (notificationData.type === 'order_confirmation') {
      message = generateOrderConfirmationMessage(notificationData)
    } else if (notificationData.type === 'status_update') {
      message = generateStatusUpdateMessage(notificationData)
    } else {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
    }

    // Send WhatsApp message
    const result = await sendWhatsAppMessage(
      notificationData.customerPhone,
      message,
      notificationData.type
    )

    // Save notification record
    await saveWhatsAppNotificationRecord(notificationData, result)

    return NextResponse.json({
      success: true,
      orderId: notificationData.orderId,
      customerPhone: notificationData.customerPhone,
      type: notificationData.type,
      result: result
    })

  } catch (error) {
    console.error('WhatsApp notification failed:', error)
    return NextResponse.json({ error: 'Failed to send WhatsApp notification' }, { status: 500 })
  }
}

function generateOrderConfirmationMessage(data: WhatsAppNotificationData): string {
  const orderData = data.orderData
  const formattedDate = new Date(orderData.createdAt).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  let message = `*FireShop - Order Confirmed!*\n\n`
  message += `Dear ${data.customerName},\n`
  message += `Thank you for your order! Your order has been confirmed.\n\n`
  message += `*Order Details:*\n`
  message += `Order ID: #${data.orderId}\n`
  message += `Date: ${formattedDate}\n`
  message += `Total Amount: Rs.${orderData.totalPrice}\n\n`
  message += `*Items Ordered:*\n`

  orderData.products.forEach((product: any, index: number) => {
    message += `${index + 1}. ${product.name} - ${product.quantity} pcs - Rs.${product.discountedPrice * product.quantity}\n`
  })

  message += `\n*Delivery Address:*\n`
  message += `${orderData.customerInfo.name}\n`
  message += `${orderData.customerInfo.address}, ${orderData.customerInfo.city}\n`
  message += `Pincode: ${orderData.customerInfo.pincode}\n\n`
  message += `*Next Steps:*\n`
  message += `1. We'll process your order within 24 hours\n`
  message += `2. You'll receive updates when your order ships\n`
  message += `3. Expected delivery: 3-5 business days\n\n`
  message += `Need help? Call us at: +91XXXXXXXXXX\n`
  message += `Thank you for choosing FireShop!`

  return message
}

function generateStatusUpdateMessage(data: WhatsAppNotificationData): string {
  const statusMessages = {
    'processing': 'Your order is being processed and will be shipped soon.',
    'shipped': 'Great news! Your order has been shipped and is on its way to you.',
    'delivered': 'Your order has been delivered. We hope you enjoy your purchase!',
    'cancelled': 'Your order has been cancelled. We apologize for any inconvenience.'
  }

  const message = statusMessages[data.status as keyof typeof statusMessages] || 'Your order status has been updated.'

  let whatsappMessage = `*FireShop - Order Status Update*\n\n`
  whatsappMessage += `Hello ${data.customerName},\n\n`
  whatsappMessage += `Order ID: #${data.orderId}\n`
  whatsappMessage += `Status: ${data.status?.toUpperCase()}\n\n`
  whatsappMessage += `${message}\n`
  
  if (data.previousStatus) {
    whatsappMessage += `Previous status: ${data.previousStatus}\n\n`
  }
  
  whatsappMessage += `Need help? Call us at: +91XXXXXXXXXX\n`
  whatsappMessage += `Thank you for shopping with FireShop!`

  return whatsappMessage
}

async function sendWhatsAppMessage(phoneNumber: string, message: string, type: string): Promise<any> {
  // Format phone number (remove +91 if present, add +91)
  const formattedPhone = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '')
  const whatsappNumber = `91${formattedPhone}`

  // Method 1: Use Twilio WhatsApp API (if configured)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: `whatsapp:+14155238886`, // Twilio WhatsApp number
          To: `whatsapp:+${whatsappNumber}`,
          Body: message
        })
      })

      if (response.ok) {
        console.log(`WhatsApp sent to ${whatsappNumber} via Twilio`)
        return { method: 'twilio', status: 'success' }
      }
    } catch (error) {
      console.error('Twilio WhatsApp failed:', error)
    }
  }

  // Method 2: Use WhatsApp Business API (if configured)
  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_ID) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: whatsappNumber,
          type: 'text',
          text: {
            body: message
          }
        })
      })

      if (response.ok) {
        console.log(`WhatsApp sent to ${whatsappNumber} via WhatsApp API`)
        return { method: 'whatsapp_api', status: 'success' }
      }
    } catch (error) {
      console.error('WhatsApp API failed:', error)
    }
  }

  // Method 3: Use WhatsApp Click to Chat (Free - opens WhatsApp)
  try {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    
    // Save to Firestore for manual sending
    await setDoc(doc(firestore, 'whatsapp-queue', `${Date.now()}_${whatsappNumber}`), {
      to: whatsappNumber,
      message: message,
      type: type,
      whatsappUrl: whatsappUrl,
      createdAt: new Date().toISOString(),
      status: 'pending_click_to_chat'
    })

    console.log(`WhatsApp message saved for ${whatsappNumber} - Click to Chat`)
    return { method: 'click_to_chat', status: 'pending', url: whatsappUrl }
  } catch (error) {
    console.error('Click to Chat failed:', error)
  }

  // Method 4: Save to queue for manual sending
  await setDoc(doc(firestore, 'whatsapp-queue', `${Date.now()}_${whatsappNumber}`), {
    to: whatsappNumber,
    message: message,
    type: type,
    createdAt: new Date().toISOString(),
    status: 'pending_manual'
  })

  console.log(`WhatsApp message saved to queue for ${whatsappNumber}`)
  return { method: 'queue', status: 'pending' }
}

async function saveWhatsAppNotificationRecord(data: WhatsAppNotificationData, result: any) {
  try {
    await setDoc(doc(firestore, 'whatsapp-notifications', `${data.orderId}_${data.type}_${Date.now()}`), {
      orderId: data.orderId,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      type: data.type,
      status: data.status,
      result: result,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to save WhatsApp notification record:', error)
  }
}
