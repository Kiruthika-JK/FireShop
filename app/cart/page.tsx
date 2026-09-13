'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useCartStore, CartItem } from '@/lib/features/cart/store'
import { useCustomerInfoStore } from '@/lib/features/checkout/customer-info-store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'

interface CartItemListViewProps {
    item: CartItem;
    updateQuantity: (productId: string, quantity: number) => void;
    removeItem: (productId: string) => void;
}

const STATES = [
    'Tamil Nadu',
    'Pondicherry',
    'Andhra Pradesh',
    'Karnataka',
    'Kerala',
    'Telangana',
    'Maharashtra',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Jammu & Kashmir',
    'Gujarat',
    'Rajasthan',
    'Delhi',
    'Other States',
]

function getMinOrder(state: string): number {
    return state === 'Tamil Nadu' || state === 'Pondicherry' ? 3000 : 6000
}

interface MinOrderModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

function MinOrderModal({ isOpen, title, message, onClose }: MinOrderModalProps) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                <h3 className="text-lg font-bold text-red-700 mb-3">{title}</h3>
                <p className="text-sm text-gray-700 mb-6 whitespace-pre-line">{message}</p>
                <Button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">
                    Got it
                </Button>
            </div>
        </div>
    )
}

function CartItemListView({ item, updateQuantity, removeItem }: CartItemListViewProps) {
    const itemSavings = item.originalPrice ? item.originalPrice - item.price : 0
    const itemSavingsPercent = item.originalPrice ? Math.round((itemSavings / item.originalPrice) * 100) : 0

    const handleIncrement = () => {
        updateQuantity(item.productId, item.quantity + 1)
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-start gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xl font-bold text-gray-900">₹{formatPrice(item.price)}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                            <>
                                <span className="text-sm text-gray-500 line-through">₹{formatPrice(item.originalPrice)}</span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                    {itemSavingsPercent}% OFF
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Quantity Controls and Actions */}
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Remove item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                            onClick={handleIncrement}
                            className="w-8 h-8 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-lg font-bold text-gray-900">₹{formatPrice(item.price * item.quantity)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface CartSummaryPanelProps {
    variant: 'desktop' | 'mobile';
    itemsCount: number;
    totalOriginalPrice: number;
    discount: number;
    savingsPercentage: number;
    total: number;
    onCheckout: () => void;
    canCheckout: boolean;
    checkoutDisabledReason?: string;
    stateRef?: React.RefObject<HTMLSelectElement | null>;
}

function CartSummaryPanel({
    variant,
    itemsCount,
    totalOriginalPrice,
    discount,
    savingsPercentage,
    total,
    onCheckout,
    canCheckout,
    checkoutDisabledReason,
    stateRef,
}: CartSummaryPanelProps) {
    const { customerInfo, updateField } = useCustomerInfoStore()
    const state = customerInfo.state || ''
    const isStateSelected = state.trim() !== ''
    const minOrder = isStateSelected ? getMinOrder(state) : 0
    const shortfall = isStateSelected ? Math.max(0, minOrder - total) : 0

    const isDesktop = variant === 'desktop'

    return (
        <>
            <div className={isDesktop ? 'hidden lg:block lg:col-span-1 sticky top-24' : 'lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20'}>
                
                {/* Mobile Specific View - Extremely Compact */}
                {!isDesktop && (
                    <div className="flex flex-col">
                        {/* Minimum Order Warning Bar (Mobile only) */}
                        {!canCheckout && (
                            <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex items-start sm:items-center gap-2">
                                <span className="text-red-600 text-lg leading-none shrink-0 mt-0.5 sm:mt-0">⚠️</span>
                                <p className="text-xs sm:text-sm font-medium text-red-800 leading-tight">
                                    {!isStateSelected
                                        ? "Select your delivery state to continue."
                                        : `Min order for ${state} is ₹${formatPrice(minOrder)}. Add ₹${formatPrice(shortfall)} more.`}
                                </p>
                            </div>
                        )}
                        
                        <div className="px-4 py-3 pb-safe flex flex-row items-end sm:items-center justify-between gap-3">
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">TOTAL</span>
                                    <span className="text-xl font-bold text-green-600 tracking-tight leading-none">
                                        ₹{formatPrice(total)}
                                    </span>
                                </div>
                                <select
                                    ref={stateRef}
                                    value={state}
                                    onChange={(e) => updateField('state', e.target.value)}
                                    className="w-full max-w-[200px] px-2 py-1.5 rounded bg-gray-100 border-none focus:ring-2 focus:ring-green-500 text-xs font-medium text-gray-700 truncate cursor-pointer h-8"
                                >
                                    <option value="">Select State</option>
                                    {STATES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={onCheckout}
                                className={`shrink-0 px-6 sm:px-8 h-12 rounded-lg font-bold text-sm tracking-wide uppercase shadow-md transition-colors ${canCheckout ? 'bg-green-600 active:bg-green-700 text-white' : 'bg-gray-200 text-gray-500'}`}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}

                {/* Desktop View */}
                {isDesktop && (
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Price Details</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Items ({itemsCount})</span>
                                <span className="text-gray-800 font-medium">₹{formatPrice(totalOriginalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount</span>
                                <span className="text-green-600 font-medium">-₹{formatPrice(discount)} ({savingsPercentage}%)</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-base font-semibold text-slate-800">Final Price</span>
                                <span className="text-xl font-bold text-green-600">
                                    ₹{formatPrice(total)}
                                </span>
                            </div>
                            {savingsPercentage > 0 && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm text-green-800 font-medium">
                                        🎉 You saved {savingsPercentage}% on this order!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* State selection */}
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Delivery State</label>
                            <select
                                ref={stateRef}
                                value={state}
                                onChange={(e) => updateField('state', e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                            >
                                <option value="">Select State</option>
                                {STATES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Minimum order notice (Only show if not ready for checkout) */}
                        {!canCheckout && (
                            <div className={`mt-3 p-3 rounded-lg border ${shortfall > 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                                {isStateSelected ? (
                                    <>
                                        <p className={`text-xs font-medium ${shortfall > 0 ? 'text-red-800' : 'text-blue-800'}`}>
                                            Minimum order for {state} is ₹{formatPrice(minOrder)}.
                                        </p>
                                        {shortfall > 0 && (
                                            <p className="text-xs font-bold text-red-800 mt-1">
                                                Add items worth ₹{formatPrice(shortfall)} more to checkout.
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-blue-800 font-medium">
                                        Select your delivery state to proceed.
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            onClick={onCheckout}
                            title={checkoutDisabledReason}
                            className={`w-full font-semibold py-3 rounded-lg mt-3 transition-colors shadow-sm cursor-pointer flex items-center justify-center ${canCheckout ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-500'}`}
                        >
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default function CartPage() {
    const router = useRouter()
    const { items, total, discount, clearCart, updateQuantity, removeItem } = useCartStore()
    const { customerInfo } = useCustomerInfoStore()
    const stateRef = useRef<HTMLSelectElement>(null)
    const [modal, setModal] = useState<{ open: boolean; title: string; message: string }>({
        open: false,
        title: '',
        message: ''
    })

    const totalOriginalPrice = items.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0)
    const savingsPercentage = totalOriginalPrice > 0 ? Math.round(((totalOriginalPrice - total) / totalOriginalPrice) * 100) : 0
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

    const isStateSelected = !!(customerInfo.state && customerInfo.state.trim() !== '')
    const minOrder = isStateSelected ? getMinOrder(customerInfo.state) : 0
    const shortfall = isStateSelected ? Math.max(0, minOrder - total) : 0
    const canCheckout = isStateSelected && shortfall === 0

    const checkoutDisabledReason = useMemo(() => {
        if (!isStateSelected) return 'Please select your delivery state'
        if (shortfall > 0) return `Minimum order is ₹${formatPrice(minOrder)}. Add ₹${formatPrice(shortfall)} more.`
        return undefined
    }, [isStateSelected, minOrder, shortfall])

    const handleCheckout = useCallback(() => {
        if (!isStateSelected) {
            setModal({
                open: true,
                title: 'Select Delivery State',
                message: 'Please select your delivery state before proceeding to checkout.'
            })
            stateRef.current?.focus()
            return
        }
        if (shortfall > 0) {
            setModal({
                open: true,
                title: 'Minimum Order Required',
                message: `Minimum order for ${customerInfo.state} is ₹${formatPrice(minOrder)}.\nPlease add items worth ₹${formatPrice(shortfall)} more to checkout.`
            })
            return
        }
        router.push('/checkout')
    }, [isStateSelected, router, shortfall, customerInfo.state, minOrder])

    return (
        <div className="min-h-screen bg-gray-50 pb-64 lg:pb-12">

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        {items.length > 0 && (
                            <p className="text-sm text-green-600 font-medium mt-1">
                                You saved {savingsPercentage}% on this order!
                            </p>
                        )}
                    </div>
                    {items.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={clearCart}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cart
                        </Button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Your cart is empty
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        {/* Cart Items - Takes up 3 columns on desktop */}
                        <div className="lg:col-span-3">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <CartItemListView
                                        key={item.productId}
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeItem={removeItem}
                                    />
                                ))}
                            </div>
                        </div>

                        <CartSummaryPanel
                            variant="desktop"
                            itemsCount={itemsCount}
                            totalOriginalPrice={totalOriginalPrice}
                            discount={discount}
                            savingsPercentage={savingsPercentage}
                            total={total}
                            onCheckout={handleCheckout}
                            canCheckout={canCheckout}
                            checkoutDisabledReason={checkoutDisabledReason}
                            stateRef={stateRef}
                        />
                    </div>
                )}
            </div>

            {/* Mobile Fixed Price Panel */}
            {items.length > 0 && (
                <CartSummaryPanel
                    variant="mobile"
                    itemsCount={itemsCount}
                    totalOriginalPrice={totalOriginalPrice}
                    discount={discount}
                    savingsPercentage={savingsPercentage}
                    total={total}
                    onCheckout={handleCheckout}
                    canCheckout={canCheckout}
                    checkoutDisabledReason={checkoutDisabledReason}
                    stateRef={stateRef}
                />
            )}

            <MinOrderModal
                isOpen={modal.open}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
            />
        </div>
    )
}
