/**
 * Wallet Management Hook
 * 
 * Custom hook for wallet connection, disconnection, and state management
 */

import { useEffect } from 'react'
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { useWalletStore } from '../../store/walletStore'
import type { WalletState } from '../../types/web3'

/**
 * Hook for managing wallet connection state
 * @returns Wallet state and connection functions
 */
export function useWallet(): WalletState & {
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
} {
  const { address, isConnected, isConnecting, isReconnecting, connector, chain } = useAccount()
  const chainId = chain?.id
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const { switchChainAsync } = useSwitchChain()
  
  const { setLastConnected, clearLastConnected } = useWalletStore()

  // Persist connection state
  useEffect(() => {
    if (isConnected && address && connector && chainId) {
      setLastConnected(address, chainId, connector.id)
    }
  }, [isConnected, address, chainId, connector, setLastConnected])

  /**
   * Disconnect wallet and clear persisted state
   */
  const disconnect = () => {
    wagmiDisconnect()
    clearLastConnected()
  }

  /**
   * Switch to a different network
   * @param targetChainId - Target chain ID
   */
  const switchNetwork = async (targetChainId: number) => {
    try {
      if (switchChainAsync) {
        await switchChainAsync({ chainId: targetChainId })
      } else {
        throw new Error('Chain switching not supported by current connector')
      }
    } catch (error) {
      console.error('Failed to switch network:', error)
      throw error
    }
  }

  return {
    address,
    chainId,
    isConnected,
    isConnecting,
    isReconnecting,
    connector: connector?.name,
    disconnect,
    switchNetwork,
  }
}
