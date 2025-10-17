/**
 * Token Balance Hook
 * 
 * Custom hook for fetching native and ERC20 token balances
 */

import { useAccount, useBalance, useReadContract } from 'wagmi'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import type { Address } from 'viem'
import { ERC20_ABI } from '../../contracts/abis/ERC20'
import type { TokenBalance } from '../../types/web3'

/**
 * Hook to get native token balance (ETH, MATIC, etc.)
 * @param address - Optional address to check (defaults to connected wallet)
 * @returns Balance information
 */
export function useNativeBalance(address?: Address) {
  const { address: accountAddress } = useAccount()
  const targetAddress = address || accountAddress

  const { data, isLoading, error, refetch } = useBalance({
    address: targetAddress,
    query: {
      enabled: !!targetAddress,
      retry: 1,
      retryDelay: 1000,
    }
  })

  return {
    balance: data?.value,
    formatted: data?.formatted,
    symbol: data?.symbol,
    decimals: data?.decimals,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get ERC20 token information
 * @param tokenAddress - Token contract address
 * @returns Token information
 */
export function useTokenInfo(tokenAddress: Address) {
  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'name',
  })

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
  })

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
  })

  return {
    name: name as string | undefined,
    symbol: symbol as string | undefined,
    decimals: decimals as number | undefined,
  }
}

/**
 * Hook to get ERC20 token balance
 * @param tokenAddress - Token contract address
 * @param ownerAddress - Optional owner address (defaults to connected wallet)
 * @returns Token balance information
 */
export function useERC20Balance(
  tokenAddress: Address | undefined,
  ownerAddress?: Address
): TokenBalance & { isLoading: boolean; error: Error | null; refetch: () => void } {
  const { address: accountAddress } = useAccount()
  const targetAddress = ownerAddress || accountAddress

  const tokenInfo = useTokenInfo(tokenAddress!)

  const { data: balance, isLoading, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!targetAddress,
    },
  })

  const tokenBalance = useMemo<TokenBalance>(() => {
    const balanceValue = (balance as bigint) || 0n
    const decimals = tokenInfo.decimals || 18

    return {
      address: tokenAddress || ('0x0' as Address),
      symbol: tokenInfo.symbol || 'TOKEN',
      name: tokenInfo.name || 'Unknown Token',
      decimals,
      balance: balanceValue,
      formattedBalance: formatUnits(balanceValue, decimals),
    }
  }, [balance, tokenAddress, tokenInfo])

  return {
    ...tokenBalance,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}

/**
 * Hook to get multiple ERC20 token balances
 * @param tokenAddresses - Array of token addresses
 * @param ownerAddress - Optional owner address
 * @returns Array of token balances
 */
export function useMultipleTokenBalances(
  tokenAddresses: Address[],
  ownerAddress?: Address
) {
  const balances = tokenAddresses.map((address) =>
    useERC20Balance(address, ownerAddress)
  )

  const isLoading = balances.some((b) => b.isLoading)
  const hasError = balances.some((b) => b.error)

  return {
    balances,
    isLoading,
    hasError,
  }
}

/**
 * Hook to get token allowance
 * @param tokenAddress - Token contract address
 * @param spenderAddress - Spender contract address
 * @param ownerAddress - Optional owner address
 * @returns Allowance amount
 */
export function useTokenAllowance(
  tokenAddress: Address | undefined,
  spenderAddress: Address | undefined,
  ownerAddress?: Address
) {
  const { address: accountAddress } = useAccount()
  const targetAddress = ownerAddress || accountAddress

  const { data, isLoading, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args:
      targetAddress && spenderAddress ? [targetAddress, spenderAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!targetAddress && !!spenderAddress,
    },
  })

  return {
    allowance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}
