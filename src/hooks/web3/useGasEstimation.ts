/**
 * Gas Estimation Hook
 * 
 * Custom hooks for gas price estimation and transaction cost calculation
 */

import { useGasPrice, useBlock } from 'wagmi'
import { useMemo } from 'react'
import { formatEther } from 'viem'

/**
 * Hook to get current gas price
 * @returns Gas price information
 */
export function useCurrentGasPrice() {
  const { data: gasPrice, isLoading, error, refetch } = useGasPrice({
    query: {
      retry: 2,
      retryDelay: 1000,
      refetchInterval: 12000, // Refetch every 12 seconds
    }
  })

  return {
    gasPrice: gasPrice || 0n,
    gasPriceGwei: gasPrice ? formatEther(gasPrice) : undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get current block information
 * @returns Block information
 */
export function useCurrentBlock() {
  const { data: block, isLoading, error } = useBlock({
    query: {
      retry: 1,
      retryDelay: 1000,
    }
  })

  return {
    block,
    blockNumber: block?.number,
    timestamp: block?.timestamp,
    baseFeePerGas: block?.baseFeePerGas,
    isLoading,
    error,
  }
}

/**
 * Hook to get gas price in different speeds
 * @returns Gas prices for slow, standard, and fast
 */
export function useGasPrices() {
  const { gasPrice, isLoading } = useCurrentGasPrice()
  const { baseFeePerGas } = useCurrentBlock()

  const prices = useMemo(() => {
    if (!gasPrice) {
      return {
        slow: 0n,
        standard: 0n,
        fast: 0n,
      }
    }

    // Simple multipliers for different speeds
    const slow = (gasPrice * 80n) / 100n // 80% of current
    const standard = gasPrice
    const fast = (gasPrice * 120n) / 100n // 120% of current

    return {
      slow,
      standard,
      fast,
      baseFee: baseFeePerGas,
    }
  }, [gasPrice, baseFeePerGas])

  return {
    ...prices,
    isLoading,
  }
}