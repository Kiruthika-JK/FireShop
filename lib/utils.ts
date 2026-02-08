import { clsx, type ClassValue } from "clsx"
import { twMerge as tailwindMerge } from "tailwind-merge"

export function mergeClasses(...inputs: ClassValue[]) {
  return tailwindMerge(clsx(inputs))
}

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(...inputs)
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
}
