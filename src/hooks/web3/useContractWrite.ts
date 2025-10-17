/**
 * Contract Write Operations Hook
 * 
 * Custom hooks for executing contract write operations with transaction monitoring
 */

import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useSendTransaction as useWagmiSendTransaction } from 'wagmi'
import type { Address, Abi } from 'viem'
import type { Hash } from 'viem'
import { toast } from 'sonner@2.0.3'
import { parseWeb3Error } from '../../lib/utils/errors'

interface UseContractWriteOptions {
  onSuccess?: (txHash: Hash) => void
  onError?: (error: Error) => void
  onConfirmed?: (receipt: unknown) => void
}

/**
 * Hook for writing to contracts with transaction monitoring
 * @param options - Callback options
 * @returns Write function and state
 */
export function useContractWrite(options?: UseContractWriteOptions) {
  const [txHash, setTxHash] = useState<Hash | undefined>()
  
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // Handle transaction success/failure
  useEffect(() => {
    if (isConfirmed && txHash) {
      // Dismiss loading toast if it exists
      toast.dismiss(txHash)
      toast.success('Transaction Confirmed!', {
        description: `Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
      })
      options?.onConfirmed?.(receipt)
    }
  }, [isConfirmed, txHash, receipt, options])

  useEffect(() => {
    if (confirmError && txHash) {
      // Dismiss loading toast if it exists
      toast.dismiss(txHash)
      toast.error('Transaction Failed', {
        description: parseWeb3Error(confirmError),
      })
    }
  }, [confirmError, txHash])

  /**
   * Execute contract write
   */
  const write = useCallback(
    async (
      address: Address,
      abi: Abi,
      functionName: string,
      args?: unknown[],
      value?: bigint
    ) => {
      try {
        const hash = await writeContract({
          address,
          abi,
          functionName,
          args,
          value,
        })

        setTxHash(hash)
        toast.success('Transaction submitted!')
        options?.onSuccess?.(hash)
        
        return hash
      } catch (error) {
        const message = parseWeb3Error(error)
        toast.error(message)
        options?.onError?.(error as Error)
        throw error
      }
    },
    [writeContract, options]
  )

  return {
    write,
    hash: txHash || hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: writeError || confirmError,
  }
}

/**
 * Hook for ERC20 token transfers
 */
export function useTokenTransfer(tokenAddress: Address, options?: UseContractWriteOptions) {
  const { write, ...rest } = useContractWrite(options)

  const transfer = useCallback(
    async (to: Address, amount: bigint) => {
      const ERC20_ABI = [
        {
          name: 'transfer',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
        },
      ] as const

      return write(tokenAddress, ERC20_ABI, 'transfer', [to, amount])
    },
    [write, tokenAddress]
  )

  return {
    transfer,
    ...rest,
  }
}

/**
 * Hook for ERC20 token approval
 */
export function useTokenApproval(tokenAddress: Address, options?: UseContractWriteOptions) {
  const { write, ...rest } = useContractWrite(options)

  const approve = useCallback(
    async (spender: Address, amount: bigint) => {
      const ERC20_ABI = [
        {
          name: 'approve',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
        },
      ] as const

      return write(tokenAddress, ERC20_ABI, 'approve', [spender, amount])
    },
    [write, tokenAddress]
  )

  return {
    approve,
    ...rest,
  }
}

/**
 * Hook for NFT transfers
 */
export function useNFTTransfer(nftAddress: Address, options?: UseContractWriteOptions) {
  const { write, ...rest } = useContractWrite(options)

  const transfer = useCallback(
    async (from: Address, to: Address, tokenId: bigint) => {
      const ERC721_ABI = [
        {
          name: 'safeTransferFrom',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
          ],
          outputs: [],
        },
      ] as const

      return write(nftAddress, ERC721_ABI, 'safeTransferFrom', [from, to, tokenId])
    },
    [write, nftAddress]
  )

  return {
    transfer,
    ...rest,
  }
}

/**
 * Hook for sending native tokens (ETH, MATIC, etc.)
 */
export function useSendTransaction(options?: UseContractWriteOptions) {
  const { sendTransactionAsync, data: hash, isPending, error } = useWagmiSendTransaction()
  const [txHash, setTxHash] = useState<Hash | undefined>()

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // Handle transaction success/failure
  useEffect(() => {
    if (isConfirmed && txHash) {
      // Dismiss loading toast
      toast.dismiss(txHash)
      toast.success('Transfer Successful!', {
        description: `Transaction confirmed: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
      })
      options?.onConfirmed?.(receipt)
    }
  }, [isConfirmed, txHash, receipt, options])

  useEffect(() => {
    if (confirmError && txHash) {
      // Dismiss loading toast
      toast.dismiss(txHash)
      toast.error('Transfer Failed', {
        description: parseWeb3Error(confirmError),
      })
    }
  }, [confirmError, txHash])

  const sendTransaction = useCallback(
    async (to: Address, value: bigint) => {
      try {
        const hash = await sendTransactionAsync({
          to,
          value,
        })

        setTxHash(hash)
        toast.loading('Transaction Submitted', {
          description: 'Waiting for confirmation...',
          id: hash,
        })
        options?.onSuccess?.(hash)
        
        return hash
      } catch (error) {
        const message = parseWeb3Error(error)
        toast.error('Transaction Rejected', {
          description: message,
        })
        options?.onError?.(error as Error)
        throw error
      }
    },
    [sendTransactionAsync, options]
  )

  return {
    sendTransaction,
    hash: txHash || hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}
