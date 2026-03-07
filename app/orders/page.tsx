'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { ChevronRight, Search, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { OrderService } from '@/lib/features/orders/service'
import { Order, OrderStatus, ORDER_STATUSES } from '@/lib/features/orders/types'
import { DocumentSnapshot } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStatusColor } from '@/lib/features/orders/utils'

export default function OrdersPage() {
    const router = useRouter()
    const { user, isAdmin, loading: authLoading } = useAuth()

    // State
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [fetchingMore, setFetchingMore] = useState(false)
    const [hasMore, setHasMore] = useState(false)
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All')
    const [isSearchExpanded, setIsSearchExpanded] = useState(false)
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Redirect if not logged in — must be before any early returns to keep hooks order stable
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/')
        }
    }, [authLoading, user, router])

    // Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 500)
        return () => clearTimeout(handler)
    }, [searchQuery])

    // Load Orders Function — takes explicit params to avoid stale-closure bugs
    const loadOrders = useCallback(async (
        isLoadMore: boolean,
        currentLastDoc: DocumentSnapshot | null,
        search: string,
        status: OrderStatus | 'All'
    ) => {
        if (!user) return

        try {
            if (isLoadMore) {
                setFetchingMore(true)
            } else {
                setLoading(true)
            }

            const result = await OrderService.fetchOrders(
                isAdmin,
                user.email,
                isLoadMore ? currentLastDoc : null,
                {
                    status,
                    search
                }
            )

            if (isLoadMore) {
                setOrders(prev => [...prev, ...result.orders])
            } else {
                setOrders(result.orders)
            }

            setLastDoc(result.lastDoc)
            setHasMore(result.hasMore)

        } catch (error) {
            console.error("Failed to fetch orders", error)
        } finally {
            setLoading(false)
            setFetchingMore(false)
        }
    }, [user, isAdmin])

    // Initial Load & Filter Change — reset and re-fetch when filters or user changes
    useEffect(() => {
        if (!authLoading && user) {
            setLastDoc(null)
            loadOrders(false, null, debouncedSearch, statusFilter)
        }
    }, [authLoading, user, isAdmin, debouncedSearch, statusFilter, loadOrders])

    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(new Date(dateString))
        } catch (e) {
            return 'Invalid Date'
        }
    }

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className={`transition-all duration-300 ${isSearchExpanded ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 whitespace-nowrap">Order History</h1>
                    </div>

                    {isAdmin && (
                        <div className="flex items-center gap-2 flex-1 justify-end">
                            {/* Expandable Search */}
                            <div className={`relative transition-all duration-300 ${isSearchExpanded ? 'w-full md:w-96' : 'w-10'}`}>
                                <div className="flex items-center">
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search Mobile, Email, Name..."
                                        className={`transition-all duration-300 ${isSearchExpanded ? 'w-full pl-10 pr-4' : 'w-0 p-0 border-0 opacity-0 pointer-events-none'}`}
                                    />
                                    <button
                                        onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                                        className={`absolute right-0 p-2 text-gray-500 hover:text-primary transition-colors ${isSearchExpanded ? 'right-auto left-0' : ''}`}
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Status Dropdown */}
                            <Select
                                value={statusFilter}
                                onValueChange={(val: string) => setStatusFilter(val as OrderStatus | 'All')}
                            >
                                <SelectTrigger className="w-[140px] md:w-[180px]">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Status</SelectItem>
                                    {ORDER_STATUSES.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Orders List */}
                {loading && orders.length === 0 ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : orders.length === 0 ? (
                    <Card className="p-12 text-center">
                        <p className="text-gray-500 text-lg mb-4">No orders found</p>
                        {!isAdmin && (
                            <button
                                onClick={() => router.push('/')}
                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                                Start Shopping
                            </button>
                        )}
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card
                                key={order.id}
                                className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white"
                                onClick={() => router.push(`/orders/${order.id}`)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg text-slate-900">{order.id}</h3>
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Order Date: <span className="text-slate-900">{formatDate(order.createdAt)}</span></p>
                                            <p>Customer: <span className="text-slate-900">{order.customerInfo.name}</span></p>
                                            <p>Items: <span className="text-slate-900">{order.products.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
                                        </div>
                                    </div>

                                    {/* Price and Arrow */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                            <p className="text-2xl font-bold text-green-600">₹{formatPrice(order.totalPrice)}</p>
                                        </div>
                                        <ChevronRight className="h-6 w-6 text-gray-400" />
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {/* Pagination Loader */}
                        <div className="py-4 text-center">
                            {hasMore ? (
                                <button
                                    onClick={() => loadOrders(true, lastDoc, debouncedSearch, statusFilter)}
                                    disabled={fetchingMore}
                                    className="flex items-center gap-2 mx-auto text-primary hover:underline disabled:opacity-50"
                                >
                                    {fetchingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {fetchingMore ? 'Loading more...' : 'Load More Orders'}
                                </button>
                            ) : (
                                <p className="text-gray-400 text-sm">End of Orders</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
