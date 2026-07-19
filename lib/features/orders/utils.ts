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

    const gstAmount = 0
    const finalTotal = order.totalPrice

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
        '=====Order Confirmed=====',
        `Thanks for shopping with Ganishkha Sri Crackers. Order #${order.id}`,
        '',
        `Order Date: ${formattedDate}`,
        `Status: ${order.status}`,
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
        '',
        'Courier charges are not included in the final total above and will be handled as per the delivery location policy.',
        '',
        'Need help? Contact us'
    ].join('\n')
}

export const buildGmailComposeUrl = (order: Order) => {
    const to = encodeURIComponent(order.customerInfo.emailId)
    const subject = encodeURIComponent(`Order Confirmation - #${order.id}`)
    const body = encodeURIComponent(buildAcknowledgeMailBody(order))
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`
}
