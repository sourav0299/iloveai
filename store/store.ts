import { create } from 'zustand'

interface WalletState {
  balance: number | null
  isLoading: boolean
  error: string | null
  fetchBalance: (uid: string) => Promise<void>
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: null,
  isLoading: false,
  error: null,
  fetchBalance: async (uid: string) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch(`/api/sso-login?firebaseUid=${uid}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch balance')
      }
      
      const data = await response.json()
      set({ balance: data.credits, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed fetching balance',
        isLoading: false 
      })
    }
  }
}))