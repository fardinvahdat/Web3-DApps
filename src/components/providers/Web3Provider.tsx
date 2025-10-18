/**
 * Web3 Provider Component
 * 
 * Wraps the application with Wagmi and React Query providers
 * Handles wallet connections and blockchain state management
 */

'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '../../lib/web3/config'
import { useState, type ReactNode } from 'react'

interface Web3ProviderProps {
  children: ReactNode
}

/**
 * Main Web3 provider component
 * Configures Wagmi and React Query with optimized settings
 */
export function Web3Provider({ children }: Web3ProviderProps) {
  // Create a client with optimized settings
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            retryDelay: 1000,
            staleTime: 30000, // 30 seconds
            gcTime: 60000, // 1 minute
            suspense: false,
            useErrorBoundary: false,
          },
        },
      })
  )

  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
