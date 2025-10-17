/**
 * Counter Contract Component
 * 
 * Demonstrates contract interaction with read, write, and event watching
 */

'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'
import { COUNTER_ABI, COUNTER_ADDRESS } from '../../contracts/abis/Counter'
import { toast } from 'sonner@2.0.3'
import { Plus, Minus, Loader2, Activity, AlertTriangle } from 'lucide-react'
import { parseWeb3Error } from '../../lib/utils/errors'
import { useWallet } from '../../hooks/web3/useWallet'
import { sepolia } from 'wagmi/chains'

// The Counter contract is deployed on Sepolia testnet
const REQUIRED_CHAIN_ID = sepolia.id // 11155111

/**
 * Counter contract interaction component
 */
export function CounterContract() {
  const { chainId, isConnected, switchNetwork } = useWallet()
  const isCorrectNetwork = chainId === REQUIRED_CHAIN_ID
  
  // Read current counter value
  const { data: counterValue, refetch: refetchValue, isLoading: isReading } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    functionName: 'getValue',
    chainId: REQUIRED_CHAIN_ID,
    query: {
      refetchInterval: 3000, // Refetch every 3 seconds
      enabled: isConnected, // Only fetch when wallet is connected
    },
  })

  // Write contract functions
  const { 
    writeContractAsync, 
    data: hash, 
    isPending: isWriting,
    error: writeError,
  } = useWriteContract()

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Watch for Increment events (only on correct network)
  useWatchContractEvent({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    eventName: 'Increament',
    chainId: REQUIRED_CHAIN_ID,
    enabled: isCorrectNetwork,
    onLogs(logs) {
      logs.forEach((log) => {
        toast.success('Counter Incremented!', {
          description: (log.args as any).message,
        })
        refetchValue()
      })
    },
  })

  // Watch for Decrement events (only on correct network)
  useWatchContractEvent({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    eventName: 'Decreament',
    chainId: REQUIRED_CHAIN_ID,
    enabled: isCorrectNetwork,
    onLogs(logs) {
      logs.forEach((log) => {
        toast.info('Counter Decremented', {
          description: (log.args as any).message,
        })
        refetchValue()
      })
    },
  })

  // Handle transaction confirmation and refetch value
  useEffect(() => {
    if (isConfirmed && hash) {
      // Dismiss the loading toast and show success
      toast.dismiss(hash)
      toast.success('Transaction Confirmed!', {
        description: `Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
      })
      // Refetch the counter value after confirmation
      refetchValue()
    }
  }, [isConfirmed, hash, refetchValue])

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      // Dismiss any loading toasts
      if (hash) toast.dismiss(hash)
      const message = parseWeb3Error(writeError)
      toast.error('Transaction Failed', {
        description: message,
      })
    }
    if (confirmError) {
      // Dismiss any loading toasts
      if (hash) toast.dismiss(hash)
      toast.error('Confirmation Failed', {
        description: confirmError.message,
      })
    }
  }, [writeError, confirmError, hash])

  // Increment function
  const handleIncrement = async () => {
    if (!isCorrectNetwork) {
      toast.error('Wrong Network', {
        description: 'Please switch to Sepolia network first',
      })
      return
    }
    
    try {
      const txHash = await writeContractAsync({
        address: COUNTER_ADDRESS,
        abi: COUNTER_ABI,
        functionName: 'increament',
        chainId: REQUIRED_CHAIN_ID,
      })
      toast.loading('Transaction Submitted', {
        description: 'Waiting for confirmation...',
        id: txHash, // Use hash as ID so we can dismiss it later
      })
    } catch (error) {
      // Error is handled by useEffect above
      console.error('Increment error:', error)
    }
  }

  // Decrement function
  const handleDecrement = async () => {
    if (!isCorrectNetwork) {
      toast.error('Wrong Network', {
        description: 'Please switch to Sepolia network first',
      })
      return
    }
    
    try {
      const txHash = await writeContractAsync({
        address: COUNTER_ADDRESS,
        abi: COUNTER_ABI,
        functionName: 'decreament',
        chainId: REQUIRED_CHAIN_ID,
      })
      toast.loading('Transaction Submitted', {
        description: 'Waiting for confirmation...',
        id: txHash, // Use hash as ID so we can dismiss it later
      })
    } catch (error) {
      // Error is handled by useEffect above
      console.error('Decrement error:', error)
    }
  }

  // Switch to Sepolia network
  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork(REQUIRED_CHAIN_ID)
      toast.success('Network Switched', {
        description: 'Connected to Sepolia network',
      })
    } catch (error) {
      toast.error('Failed to Switch Network', {
        description: 'Please switch manually in your wallet',
      })
    }
  }

  const isLoading = isWriting || isConfirming

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Smart Contract Interaction
          </CardTitle>
          <CardDescription>
            Interact with a deployed counter contract on Sepolia testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Network Warning */}
          {isConnected && !isCorrectNetwork && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Wrong Network</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  This contract is deployed on <strong>Sepolia Testnet</strong>. Please switch to Sepolia network to interact with it.
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleSwitchNetwork}
                  className="mt-2"
                >
                  Switch to Sepolia
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!isConnected && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Wallet Not Connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to interact with the contract.
              </AlertDescription>
            </Alert>
          )}
        {/* Current Value Display */}
        <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Current Counter Value</div>
          {isReading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <div className="text-5xl font-bold">{counterValue?.toString() ?? '0'}</div>
          )}
          <div className="text-xs text-muted-foreground mt-2">
            Contract: {COUNTER_ADDRESS.slice(0, 6)}...{COUNTER_ADDRESS.slice(-4)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleIncrement}
            disabled={isLoading || !isConnected || !isCorrectNetwork}
            size="lg"
            className="gap-2"
          >
            {isLoading && isWriting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Increment
          </Button>

          <Button
            onClick={handleDecrement}
            disabled={isLoading || !isConnected || !isCorrectNetwork}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {isLoading && isWriting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
            Decrement
          </Button>
        </div>

        {/* Status Indicator */}
        {isConfirming && (
          <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming transaction...
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p>• Contract deployed on Sepolia Testnet</p>
          <p>• Click Increment/Decrement to interact with the contract</p>
          <p>• Events are automatically detected and displayed as notifications</p>
          <p>• Value updates automatically after each transaction</p>
        </div>
      </CardContent>
    </Card>

    {/* Contract ABI Display */}
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Contract ABI
        </CardTitle>
        <CardDescription>
          Application Binary Interface for the Counter contract
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="text-xs text-muted-foreground">
            <strong>Network:</strong> Sepolia Testnet (Chain ID: {REQUIRED_CHAIN_ID})
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Address:</strong> <code className="bg-muted px-1 py-0.5 rounded">{COUNTER_ADDRESS}</code>
          </div>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-[500px] overflow-y-auto">
          {JSON.stringify(COUNTER_ABI, null, 2)}
        </pre>
      </CardContent>
    </Card>
  </div>
  )
}
