/**
 * Event Listener Hook
 * 
 * Custom hooks for listening to blockchain events and real-time updates
 */

import { useEffect, useCallback, useState } from 'react'
import { useWatchContractEvent, useBlockNumber } from 'wagmi'
import type { Address, Abi, Log } from 'viem'
import type { ContractEvent } from '../../types/web3'

/**
 * Hook to watch for contract events
 * @param address - Contract address
 * @param abi - Contract ABI
 * @param eventName - Event name to watch
 * @param onEvent - Callback when event occurs
 */
export function useContractEvent<TAbi extends Abi>(
  address: Address | undefined,
  abi: TAbi,
  eventName: string,
  onEvent?: (event: ContractEvent) => void
) {
  const [events, setEvents] = useState<ContractEvent[]>([])

  useWatchContractEvent({
    address,
    abi,
    eventName,
    onLogs: (logs) => {
      const parsedEvents = logs.map((log) => ({
        address: log.address,
        eventName,
        args: log.args as Record<string, unknown>,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
      }))

      setEvents((prev) => [...prev, ...parsedEvents])
      parsedEvents.forEach((event) => onEvent?.(event))
    },
  })

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  return {
    events,
    clearEvents,
  }
}

/**
 * Hook to watch for ERC20 Transfer events
 * @param tokenAddress - Token contract address
 * @param options - Filter options
 */
export function useTokenTransferEvents(
  tokenAddress: Address | undefined,
  options?: {
    from?: Address
    to?: Address
    onTransfer?: (event: ContractEvent) => void
  }
) {
  const ERC20_ABI = [
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'from', type: 'address' },
        { indexed: true, name: 'to', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'event',
    },
  ] as const

  return useContractEvent(
    tokenAddress,
    ERC20_ABI,
    'Transfer',
    options?.onTransfer
  )
}

/**
 * Hook to watch for NFT Transfer events
 * @param nftAddress - NFT contract address
 * @param options - Filter options
 */
export function useNFTTransferEvents(
  nftAddress: Address | undefined,
  options?: {
    from?: Address
    to?: Address
    tokenId?: bigint
    onTransfer?: (event: ContractEvent) => void
  }
) {
  const ERC721_ABI = [
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'from', type: 'address' },
        { indexed: true, name: 'to', type: 'address' },
        { indexed: true, name: 'tokenId', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'event',
    },
  ] as const

  return useContractEvent(
    nftAddress,
    ERC721_ABI,
    'Transfer',
    options?.onTransfer
  )
}

/**
 * Hook to watch for block updates
 * @param onNewBlock - Callback when new block is mined
 */
export function useBlockListener(onNewBlock?: (blockNumber: bigint) => void) {
  const { data: blockNumber } = useBlockNumber({
    watch: true,
  })

  useEffect(() => {
    if (blockNumber !== undefined) {
      onNewBlock?.(blockNumber)
    }
  }, [blockNumber, onNewBlock])

  return {
    blockNumber,
  }
}

/**
 * Hook to poll for data at block intervals
 * @param callback - Function to call on each block
 * @param enabled - Whether polling is enabled
 */
export function useBlockPolling(
  callback: () => void | Promise<void>,
  enabled: boolean = true
) {
  const { blockNumber } = useBlockListener()

  useEffect(() => {
    if (enabled && blockNumber !== undefined) {
      callback()
    }
  }, [blockNumber, callback, enabled])
}

/**
 * Hook to track pending transactions
 * @param txHash - Transaction hash to track
 * @param onConfirmed - Callback when transaction is confirmed
 */
export function useTransactionMonitor(
  txHash: string | undefined,
  onConfirmed?: () => void
) {
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'failed' | null>(
    null
  )

  useEffect(() => {
    if (!txHash) {
      setStatus(null)
      return
    }

    setStatus('pending')
    // In a real implementation, you would watch the transaction receipt
    // This is a simplified example
  }, [txHash])

  return {
    status,
  }
}

/**
 * Hook to create a real-time balance updater
 * @param address - Address to watch
 * @param tokenAddress - Optional token address (undefined for native token)
 * @param onBalanceChange - Callback when balance changes
 */
export function useBalanceUpdater(
  address: Address | undefined,
  tokenAddress?: Address,
  onBalanceChange?: (newBalance: bigint) => void
) {
  const [lastBalance, setLastBalance] = useState<bigint | undefined>()

  // Watch for Transfer events to/from the address
  const { events } = tokenAddress
    ? useTokenTransferEvents(tokenAddress, {
        onTransfer: (event) => {
          const { from, to } = event.args as { from: Address; to: Address }
          if (
            from.toLowerCase() === address?.toLowerCase() ||
            to.toLowerCase() === address?.toLowerCase()
          ) {
            // Balance changed, trigger callback
            onBalanceChange?.(0n) // Would need to refetch actual balance
          }
        },
      })
    : { events: [] }

  return {
    events,
    lastBalance,
  }
}
