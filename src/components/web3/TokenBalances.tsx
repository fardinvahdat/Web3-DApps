/**
 * Token Balances Component
 * 
 * Displays native and ERC20 token balances
 */

'use client'

import { useNativeBalance, useERC20Balance } from '../../hooks/web3/useTokenBalance'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { formatTokenBalance, formatAddress } from '../../utils/formatters'
import { Coins, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'
import { CONTRACT_ADDRESSES } from '../../lib/constants/contracts'
import { useWallet } from '../../hooks/web3/useWallet'
import type { Address } from 'viem'

/**
 * Native token balance display
 */
export function NativeBalance() {
  const { balance, symbol, isLoading, refetch } = useNativeBalance()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Native Balance
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl">{formatTokenBalance(balance || 0n)}</span>
              <span className="text-muted-foreground">{symbol}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Single ERC20 token balance
 */
interface ERC20BalanceProps {
  tokenAddress: Address
  label?: string
}

export function ERC20Balance({ tokenAddress, label }: ERC20BalanceProps) {
  const { symbol, balance, decimals, isLoading, refetch } =
    useERC20Balance(tokenAddress)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          {label || symbol}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl">{formatTokenBalance(balance, decimals)}</span>
              <span className="text-muted-foreground">{symbol}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatAddress(tokenAddress)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * All token balances overview
 */
export function TokenBalancesOverview() {
  const { chainId } = useWallet()

  // Get token addresses for current chain
  const usdcAddress = chainId
    ? CONTRACT_ADDRESSES.USDC[chainId as keyof typeof CONTRACT_ADDRESSES.USDC]
    : undefined
  const usdtAddress = chainId
    ? CONTRACT_ADDRESSES.USDT[chainId as keyof typeof CONTRACT_ADDRESSES.USDT]
    : undefined
  const daiAddress = chainId
    ? CONTRACT_ADDRESSES.DAI[chainId as keyof typeof CONTRACT_ADDRESSES.DAI]
    : undefined

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2">
        Token Balances
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NativeBalance />
        
        {usdcAddress && (
          <ERC20Balance tokenAddress={usdcAddress as Address} label="USDC" />
        )}
        
        {usdtAddress && (
          <ERC20Balance tokenAddress={usdtAddress as Address} label="USDT" />
        )}
        
        {daiAddress && (
          <ERC20Balance tokenAddress={daiAddress as Address} label="DAI" />
        )}
      </div>
    </div>
  )
}
