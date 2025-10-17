/**
 * Gas Estimation Hook
 * 
 * Custom hooks for gas price estimation and transaction cost calculation
 */

import { useGasPrice, useEstimateGas, useBlock } from 'wagmi'
import { useMemo } from 'react'
import { formatEther } from 'viem'
import type { Address } from 'viem'
import type { GasEstimation } from '../../types/web3'

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
 * Hook to estimate gas for a transaction
 * @param to - Destination address
 * @param value - Value to send
 * @param data - Transaction data
 * @returns Gas estimation
 */
export function useTransactionGasEstimate(
  to?: Address,
  value?: bigint,
  data?: `0x${string}`
): GasEstimation & { isLoading: boolean; error: Error | null } {
  const { data: gasLimit, isLoading: isLoadingGas } = useEstimateGas({
    to,
    value,
    data,
    query: {
      enabled: !!to,
    },
  })

  const { gasPrice, isLoading: isLoadingPrice } = useCurrentGasPrice()
  const { baseFeePerGas } = useCurrentBlock()

  const estimation = useMemo<GasEstimation>(() => {
    const limit = gasLimit || 21000n
    const price = gasPrice || 0n

    // Calculate estimated cost
    const estimatedCost = limit * price

    // Calculate EIP-1559 fees if available
    const maxFeePerGas = baseFeePerGas
      ? baseFeePerGas * 2n + price / 10n
      : undefined
    const maxPriorityFeePerGas = price / 10n

    return {
      gasLimit: limit,
      gasPrice: price,
      maxFeePerGas,
      maxPriorityFeePerGas,
      estimatedCost,
      estimatedCostFormatted: formatEther(estimatedCost),
    }
  }, [gasLimit, gasPrice, baseFeePerGas])

  return {
    ...estimation,
    isLoading: isLoadingGas || isLoadingPrice,
    error: null,
  }
}

/**
 * Hook to estimate gas for contract interaction
 * @param address - Contract address
 * @param abi - Contract ABI
 * @param functionName - Function to call
 * @param args - Function arguments
 * @param value - Value to send
 * @returns Gas estimation
 */
export function useContractGasEstimate(
  address?: Address,
  abi?: unknown[],
  functionName?: string,
  args?: unknown[],
  value?: bigint
) {
  const { data: gasLimit, isLoading } = useEstimateGas({
    to: address,
    data: address && abi && functionName ? undefined : undefined, // Would need to encode function call
    value,
    query: {
      enabled: !!address && !!functionName,
    },
  })

  const { gasPrice } = useCurrentGasPrice()

  const estimatedCost = useMemo(() => {
    if (!gasLimit || !gasPrice) return 0n
    return gasLimit * gasPrice
  }, [gasLimit, gasPrice])

  return {
    gasLimit,
    gasPrice,
    estimatedCost,
    estimatedCostFormatted: formatEther(estimatedCost),
    isLoading,
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

/**
 * Calculate transaction cost in USD
 * @param gasLimit - Gas limit
 * @param gasPrice - Gas price in wei
 * @param ethPriceUSD - ETH price in USD
 * @returns Cost in USD
 */
export function calculateGasCostUSD(
  gasLimit: bigint,
  gasPrice: bigint,
  ethPriceUSD: number
): number {
  const costInEth = formatEther(gasLimit * gasPrice)
  return parseFloat(costInEth) * ethPriceUSD
}
