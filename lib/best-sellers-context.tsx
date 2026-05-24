'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface BestSellersContextType {
  showBestSellersOnly: boolean
  setShowBestSellersOnly: (value: boolean) => void
}

const BestSellersContext = createContext<BestSellersContextType | undefined>(undefined)

export function BestSellersProvider({ children }: { children: ReactNode }) {
  const [showBestSellersOnly, setShowBestSellersOnly] = useState(false)

  return (
    <BestSellersContext.Provider value={{ showBestSellersOnly, setShowBestSellersOnly }}>
      {children}
    </BestSellersContext.Provider>
  )
}

export function useBestSellers() {
  const context = useContext(BestSellersContext)
  if (context === undefined) {
    throw new Error('useBestSellers must be used within a BestSellersProvider')
  }
  return context
}
