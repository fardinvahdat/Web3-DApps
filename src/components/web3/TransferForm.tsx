/**
 * Transfer Form Component
 * 
 * Form for transferring native tokens and ERC20 tokens
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useSendTransaction, useTokenTransfer } from '../../hooks/web3/useContractWrite'
import { parseTokenAmount, isValidAddress } from '../../utils/formatters'
import { toast } from 'sonner@2.0.3'
import { Send, Loader2 } from 'lucide-react'
import type { Address } from 'viem'
import { CONTRACT_ADDRESSES } from '../../lib/constants/contracts'
import { useWallet } from '../../hooks/web3/useWallet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

/**
 * Native token transfer form
 */
function NativeTransferForm() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  
  const { sendTransaction, isPending, isConfirming } = useSendTransaction({
    onSuccess: (hash) => {
      toast.success(`Transaction submitted: ${hash}`)
      setRecipient('')
      setAmount('')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidAddress(recipient)) {
      toast.error('Invalid recipient address')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Invalid amount')
      return
    }

    try {
      await sendTransaction(recipient as Address, parseTokenAmount(amount))
    } catch (error) {
      console.error('Transfer failed:', error)
    }
  }

  const isLoading = isPending || isConfirming

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="native-recipient">Recipient Address</Label>
        <Input
          id="native-recipient"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="native-amount">Amount</Label>
        <Input
          id="native-amount"
          type="number"
          step="0.000001"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isConfirming ? 'Confirming...' : 'Sending...'}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send
          </>
        )}
      </Button>
    </form>
  )
}

/**
 * ERC20 token transfer form
 */
function TokenTransferForm() {
  const { chainId } = useWallet()
  const [tokenAddress, setTokenAddress] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const { transfer, isPending, isConfirming } = useTokenTransfer(
    tokenAddress as Address,
    {
      onSuccess: (hash) => {
        toast.success(`Transaction submitted: ${hash}`)
        setRecipient('')
        setAmount('')
      },
    }
  )

  // Get available tokens for current chain
  const availableTokens = chainId
    ? [
        {
          symbol: 'USDC',
          address: CONTRACT_ADDRESSES.USDC[chainId as keyof typeof CONTRACT_ADDRESSES.USDC],
        },
        {
          symbol: 'USDT',
          address: CONTRACT_ADDRESSES.USDT[chainId as keyof typeof CONTRACT_ADDRESSES.USDT],
        },
        {
          symbol: 'DAI',
          address: CONTRACT_ADDRESSES.DAI[chainId as keyof typeof CONTRACT_ADDRESSES.DAI],
        },
      ].filter((token) => token.address)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidAddress(recipient)) {
      toast.error('Invalid recipient address')
      return
    }

    if (!tokenAddress || !isValidAddress(tokenAddress)) {
      toast.error('Invalid token address')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Invalid amount')
      return
    }

    try {
      await transfer(recipient as Address, parseTokenAmount(amount))
    } catch (error) {
      console.error('Transfer failed:', error)
    }
  }

  const isLoading = isPending || isConfirming

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="token">Token</Label>
        <Select value={tokenAddress} onValueChange={setTokenAddress}>
          <SelectTrigger id="token">
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            {availableTokens.map((token) => (
              <SelectItem key={token.address} value={token.address!}>
                {token.symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="token-recipient">Recipient Address</Label>
        <Input
          id="token-recipient"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="token-amount">Amount</Label>
        <Input
          id="token-amount"
          type="number"
          step="0.000001"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading || !tokenAddress} className="w-full gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isConfirming ? 'Confirming...' : 'Sending...'}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Token
          </>
        )}
      </Button>
    </form>
  )
}

/**
 * Main transfer component with tabs
 */
export function TransferForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Transfer Assets
        </CardTitle>
        <CardDescription>
          Send native tokens or ERC20 tokens to another address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="native" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="native">Native Token</TabsTrigger>
            <TabsTrigger value="token">ERC20 Token</TabsTrigger>
          </TabsList>
          <TabsContent value="native" className="mt-4">
            <NativeTransferForm />
          </TabsContent>
          <TabsContent value="token" className="mt-4">
            <TokenTransferForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
