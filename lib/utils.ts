import { clsx, type ClassValue } from "clsx"
import { twMerge as tailwindMerge } from "tailwind-merge"

export function mergeClasses(...inputs: ClassValue[]) {
    return tailwindMerge(clsx(inputs))
}

export function cn(...inputs: ClassValue[]) {
    return mergeClasses(...inputs)
}

export function formatPrice(price: number): string {
    return price.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export function normalizePhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    // Indian numbers: strip leading 91 country code if present and local length is 10
    if (digits.length === 12 && digits.startsWith('91')) {
        return digits.slice(2)
    }
    return digits
}

export function formatPhoneNumber(phone: string): string {
    const normalized = normalizePhoneNumber(phone)
    if (normalized.length === 10) {
        return `+91 ${normalized}`
    }
    return `+${normalized}`
}
