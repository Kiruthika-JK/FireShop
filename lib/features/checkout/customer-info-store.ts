import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CustomerInfo {
    name: string
    mobileNumber: string
    fullAddress: string
    landmark: string
    city: string
    pincode: string
}

export interface CustomerInfoStore {
    customerInfo: CustomerInfo
    setCustomerInfo: (info: CustomerInfo) => void
    updateField: (field: keyof CustomerInfo, value: string) => void
    isComplete: () => boolean
    reset: () => void
}

const initialCustomerInfo: CustomerInfo = {
    name: '',
    mobileNumber: '',
    fullAddress: '',
    landmark: '',
    city: '',
    pincode: '',
}

export const useCustomerInfoStore = create<CustomerInfoStore>()(
    persist(
        (set, get) => ({
            customerInfo: initialCustomerInfo,
            setCustomerInfo: (info) => set({ customerInfo: info }),
            updateField: (field, value) =>
                set({ customerInfo: { ...get().customerInfo, [field]: value } }),
            isComplete: () => {
                const { name, mobileNumber, fullAddress, city, pincode } = get().customerInfo
                return !!(
                    name.trim() &&
                    mobileNumber.trim() &&
                    fullAddress.trim() &&
                    city.trim() &&
                    pincode.trim()
                )
            },
            reset: () => set({ customerInfo: initialCustomerInfo }),
        }),
        {
            name: 'customer-info-storage',
        }
    )
)
