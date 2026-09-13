'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { OrderService } from '@/lib/features/orders/service'
import { Order } from '@/lib/features/orders/types'
import { buildWhatsAppMessage } from '@/lib/features/orders/utils'
import { formatPrice, formatPhoneNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Loader2,
    Copy,
    Check,
    PartyPopper,
    Truck,
    Package,
    Phone,
    ShoppingBag,
    Sparkles,
    Clock
} from 'lucide-react'

function triggerConfetti() {
    const count = 200
    const defaults = { origin: { y: 0.7 } }

    function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })
}

function Step({ icon: Icon, title, description, active }: { icon: React.ComponentType<{ className?: string }>, title: string, description: string, active?: boolean }) {
    return (
        <div className={`flex gap-4 ${active ? 'opacity-100' : 'opacity-60'}`}>
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="font-semibold text-slate-900">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    )
}

export default function OrderConfirmationPage() {
    const params = useParams()
    const router = useRouter()
    const orderId = typeof params.id === 'string' ? params.id : ''
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(!!orderId)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!orderId) return;
        OrderService.getOrderById(orderId)
            .then((data) => {
                setOrder(data)
                setLoading(false)
                if (data) {
                    triggerConfetti()
                }
            })
            .catch((err) => {
                console.error('Failed to load order:', err)
                setLoading(false)
            })
    }, [orderId])

    const whatsappNumber = '918248817401'
    const whatsappText = order ? buildWhatsAppMessage(order) : ''
    const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`

    const handleCopy = async () => {
        if (!order) return
        try {
            await navigator.clipboard.writeText(whatsappText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Copy failed:', err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
                <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="container mx-auto max-w-2xl text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Order not found</h1>
                    <p className="text-gray-600 mb-6">We could not load this order. It may still be processing, or the link may be incorrect.</p>
                    <Button onClick={() => router.push('/')}>
                        Continue Shopping
                    </Button>
                </div>
            </div>
        )
    }

    const finalTotal = order.grandTotal ?? order.totalPrice

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-8 px-4">
            <div className="container mx-auto max-w-2xl space-y-6">
                {/* Success Header */}
                <div className="text-center pt-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full shadow-lg mb-4 animate-bounce">
                        <PartyPopper className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
                    <p className="text-lg text-gray-700">
                        Thank you, <span className="font-semibold text-orange-700">{order.customerInfo.name}</span>! Your Diwali crackers order is in.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-200 text-sm font-medium text-slate-800">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        Order #{order.id}
                    </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="bg-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-1">Send details on WhatsApp</h2>
                            <p className="text-green-100 text-sm mb-4">
                                Tap below to open WhatsApp with your order summary. Our team will confirm payment and delivery details with you there.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-green-700 hover:bg-green-50 font-bold py-3 px-6 rounded-xl transition-colors flex-1"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Send on WhatsApp
                                </a>
                                <Button
                                    variant="outline"
                                    onClick={handleCopy}
                                    className="flex-1 sm:flex-none border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                                >
                                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? 'Copied' : 'Copy order'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <Card className="bg-white p-6 shadow-sm border-0 rounded-2xl">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange-600" />
                        Order Summary
                    </h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Mobile</p>
                                <p className="font-medium text-slate-900">{formatPhoneNumber(order.customerInfo.mobileNo)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Order ID</p>
                                <p className="font-medium text-slate-900">#{order.id}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-gray-500 mb-1">Delivery Address</p>
                                <p className="font-medium text-slate-900">
                                    {order.customerInfo.address}, {order.customerInfo.city}{order.customerInfo.state ? `, ${order.customerInfo.state}` : ''} - {order.customerInfo.pincode}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-gray-500 text-sm mb-3">Products</p>
                            <ul className="space-y-3">
                                {order.products.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center text-slate-800 bg-gray-50 rounded-lg p-3">
                                        <span className="font-medium">{item.name} <span className="text-gray-500 font-normal">x {item.quantity}</span></span>
                                        <span className="font-semibold">₹{formatPrice(item.discountedPrice * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₹{formatPrice(order.totalPrice)}</span>
                            </div>
                            {order.gstAmount ? (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">GST</span>
                                    <span className="font-medium">₹{formatPrice(order.gstAmount)}</span>
                                </div>
                            ) : null}
                            <div className="flex justify-between text-lg font-bold pt-2">
                                <span className="text-slate-900">Total</span>
                                <span className="text-green-600">₹{formatPrice(finalTotal)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* What happens next */}
                <Card className="bg-white p-6 shadow-sm border-0 rounded-2xl">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-600" />
                        What happens next?
                    </h2>
                    <div className="space-y-6">
                        <Step icon={Check} title="Order Received" description="We have received your order and started processing it." active />
                        <Step icon={Phone} title="Payment Confirmation" description="Our team will call or WhatsApp you to confirm payment and transport." />
                        <Step icon={Package} title="Packed with Care" description="Your crackers are safely packed at our Sivakasi store." />
                        <Step icon={Truck} title="Delivered to You" description="Dispatched through our transport partner to your address." />
                    </div>
                </Card>

                {/* Footer actions */}
                <div className="text-center space-y-4 pb-8">
                    <p className="text-sm text-gray-600">
                        Questions? Call <a href="tel:+918248817401" className="text-orange-600 font-semibold hover:underline">82488 17401</a> or <a href="tel:+918148165318" className="text-orange-600 font-semibold hover:underline">81481 65318</a>
                    </p>
                    <Button onClick={() => router.push('/')} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    )
}
