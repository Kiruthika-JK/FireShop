import { formatPrice } from "../../utils"
import { Order, OrderStatus } from "./types"

export const getStatusColor = (status: OrderStatus | string) => {
    switch (status) {
        case OrderStatus.Delivered: return 'bg-green-100 text-green-800 border-green-200'
        case OrderStatus.Shipped: return 'bg-blue-100 text-blue-800 border-blue-200'
        case OrderStatus.ReadyToShip: return 'bg-purple-100 text-purple-800 border-purple-200'
        case OrderStatus.Processing: return 'bg-orange-100 text-orange-800 border-orange-200'
        case OrderStatus.Ordered: return 'bg-amber-100 text-amber-800 border-amber-200'
        case OrderStatus.Canceled: return 'bg-red-100 text-red-800 border-red-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
}

export const buildAcknowledgeMailBody = (order: Order) => {
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })

    const gstAmount = order.gstAmount ?? 0
    const finalTotal = order.grandTotal ?? order.totalPrice
    const paymentStatus = order.paymentStatus || 'Unpaid'
    const paidAmount = order.paidAmount ?? 0
    const remainingAmount = order.remainingAmount ?? finalTotal

    const paymentLines = paymentStatus === 'Fully Paid'
        ? ['', '=====Payment Details=====', 'Payment Status: Fully Paid', `Total Paid: Rs.${formatPrice(finalTotal)}`]
        : [
            '',
            '=====Payment Details=====',
            `Payment Status: ${paymentStatus}`,
            `Paid: Rs.${formatPrice(paidAmount)}`,
            `Remaining: Rs.${formatPrice(remainingAmount)}`
        ]

    const maxItemNameLength = order.products.reduce(
        (maxLength, product) => Math.max(maxLength, product.name.length),
        0
    )
    const itemColWidth = Math.max(22, Math.min(maxItemNameLength, 40))
    const qtyStartColumn = 54
    const minItemQtyGap = 10
    const qtyColWidth = 3
    const amountColWidth = 14
    const qtyAmountGap = '       '

    const getItemQtyGap = (itemLength: number) => ' '.repeat(
        Math.max(minItemQtyGap, qtyStartColumn - itemLength)
    )

    const rows = order.products.map((product) => {
        const item = product.name.length > itemColWidth
            ? `${product.name.slice(0, itemColWidth - 3)}...`
            : product.name
        const itemQtyGap = getItemQtyGap(item.length)
        const qty = String(product.quantity).padStart(qtyColWidth, ' ')
        const amount = `Rs.${formatPrice(product.discountedPrice * product.quantity)}`.padStart(amountColWidth, ' ')
        return `${item}${itemQtyGap}${qty}${qtyAmountGap}${amount}`
    })

    const headerItem = 'Item'
    const header = `${headerItem}${getItemQtyGap(headerItem.length)}${'Qty'.padStart(qtyColWidth, ' ')}${qtyAmountGap}${'Amount'.padStart(amountColWidth, ' ')}`
    const divider = '-'.repeat(Math.max(header.length, ...rows.map((row) => row.length)))

    const addressLine = `${order.customerInfo.city} - ${order.customerInfo.pincode}`

    return [
        `===== Order Status: ${order.status} =====`,
        `Thanks for shopping with Ganishkha Sri Crackers. Order #${order.id}`,
        '',
        `Order Date: ${formattedDate}`,
        `Status: ${order.status}`,
        ...(order.adminComment ? ['', `Reason: ${order.adminComment}`] : []),
        '',
        '=====Delivery Address=====',
        `${order.customerInfo.name}`,
        `${order.customerInfo.address}`,
        `${addressLine}`,
        `Phone: ${order.customerInfo.mobileNo}`,
        '',
        '=====Order Summary=====',
        divider,
        header,
        divider,
        ...rows,
        divider,
        `Subtotal: Rs.${formatPrice(order.totalPrice)}`,
        `GST: Rs.${formatPrice(gstAmount)}`,
        `Final Total: Rs.${formatPrice(finalTotal)}`,
        ...paymentLines,
        '',
        'Courier charges are not included in the final total above and will be handled as per the delivery location policy.',
        '',
        'Need help? Contact us at 8248817401 | 8148165318 or email us at ganishkhasricrackers@gmail.com'
    ].join('\n')
}

export const buildGmailComposeUrl = (order: Order) => {
    const to = encodeURIComponent(order.customerInfo.emailId)
    const subject = encodeURIComponent(`Order Update - #${order.id} - ${order.status}`)
    const body = encodeURIComponent(buildAcknowledgeMailBody(order))
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`
}

export const buildWhatsAppAcknowledgeUrl = (order: Order) => {
    const rawPhone = order.customerInfo.mobileNo.replace(/\D/g, '')
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone
    const reasonLine = order.adminComment ? `\nReason: ${order.adminComment}` : ''

    const totalDue = order.grandTotal ?? order.totalPrice
    const paymentStatus = order.paymentStatus || 'Unpaid'
    const paidAmount = order.paidAmount ?? 0
    const remainingAmount = order.remainingAmount ?? totalDue

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Canceled:
                return 'has been canceled. Please contact us if you need any help.'
            case OrderStatus.Delivered:
                return 'has been delivered. Thank you for shopping with us!'
            case OrderStatus.Shipped:
                return 'has been shipped. Please contact 8248817401 for any assistance.'
            case OrderStatus.ReadyToShip:
                return 'is ready to ship. We will share delivery details shortly.'
            case OrderStatus.Ordered:
            case OrderStatus.Processing:
            default:
                return `is now ${status}.`
        }
    }

    const getPaymentText = () => {
        if (paymentStatus === 'Fully Paid') {
            return 'Your payment has been fully received. Thank you!'
        }
        if (paymentStatus === 'Partially Paid') {
            return `You have paid ₹${formatPrice(paidAmount)}. Remaining amount ₹${formatPrice(remainingAmount)} to be paid.`
        }
        return 'We will contact you shortly for payment and delivery details.'
    }

    const message = `Hi ${order.customerInfo.name},\n\nYour order #${order.id} at Ganishkha Sri Crackers ${getStatusText(order.status)} ${getPaymentText()}${reasonLine}\n\nTotal: ₹${formatPrice(totalDue)}\n\nThank you!`
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export const buildWhatsAppMessage = (order: Order) => {
    const { customerInfo, products, totalPrice } = order
    const productsList = products
        .map(p => `${p.name}: ${p.quantity} x ₹${formatPrice(p.discountedPrice)} = ₹${formatPrice(p.quantity * p.discountedPrice)}`)
        .join('\n')

    return [
        'Hi Ganishkha Sri Crackers, I placed an order:',
        `Order #${order.id}`,
        `Customer: ${customerInfo.name}`,
        `Mobile: ${customerInfo.mobileNo}`,
        `Total: ₹${formatPrice(totalPrice)}`,
        `Address: ${customerInfo.address}, ${customerInfo.city}${customerInfo.state ? `, ${customerInfo.state}` : ''} - ${customerInfo.pincode}`,
        '',
        'Products:',
        productsList,
    ].join('\n')
}
