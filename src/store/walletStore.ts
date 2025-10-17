/**
 * Wallet State Management
 * 
 * Zustand store for managing wallet state and persistence
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Address } from 'viem'

interface WalletStore {
  // State
  lastConnectedAddress?: Address
  lastConnectedChainId?: number
  preferredConnector?: string
  
  // Actions
  setLastConnected: (address: Address, chainId: number, connector: string) => void
  clearLastConnected: () => void
}

/**
 * Wallet store with persistence
 * Persists wallet connection preferences to localStorage
 */
export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      // Initial state
      lastConnectedAddress: undefined,
      lastConnectedChainId: undefined,
      preferredConnector: undefined,

      // Set last connected wallet info
      setLastConnected: (address, chainId, connector) =>
        set({
          lastConnectedAddress: address,
          lastConnectedChainId: chainId,
          preferredConnector: connector,
        }),

      // Clear connection data
      clearLastConnected: () =>
        set({
          lastConnectedAddress: undefined,
          lastConnectedChainId: undefined,
          preferredConnector: undefined,
        }),
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        lastConnectedAddress: state.lastConnectedAddress,
        lastConnectedChainId: state.lastConnectedChainId,
        preferredConnector: state.preferredConnector,
      }),
    }
  )
)
