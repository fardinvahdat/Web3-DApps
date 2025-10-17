/**
 * Web3 Type Definitions
 * 
 * Centralized type definitions for Web3 interactions
 */

import type { Address, Hash } from 'viem'

/**
 * Token balance information
 */
export interface TokenBalance {
  address: Address
  symbol: string
  name: string
  decimals: number
  balance: bigint
  formattedBalance: string
  usdValue?: number
}

/**
 * NFT metadata structure
 */
export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
}

/**
 * NFT item with metadata
 */
export interface NFT {
  tokenId: bigint
  contract: Address
  owner: Address
  metadata: NFTMetadata | null
  tokenURI: string
}

/**
 * Transaction history item
 */
export interface Transaction {
  hash: Hash
  from: Address
  to: Address | null
  value: bigint
  timestamp: number
  status: 'pending' | 'success' | 'failed'
  gasUsed?: bigint
  gasPrice?: bigint
  blockNumber?: bigint
  type?: string
}

/**
 * Gas estimation result
 */
export interface GasEstimation {
  gasLimit: bigint
  gasPrice: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  estimatedCost: bigint
  estimatedCostFormatted: string
}

/**
 * Wallet connection state
 */
export interface WalletState {
  address?: Address
  chainId?: number
  isConnected: boolean
  isConnecting: boolean
  isReconnecting: boolean
  connector?: string
}

/**
 * Contract interaction result
 */
export interface ContractResult<T = unknown> {
  data?: T
  error?: Error
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

/**
 * Write transaction result
 */
export interface WriteResult {
  hash?: Hash
  wait: () => Promise<TransactionReceipt>
  error?: Error
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

/**
 * Transaction receipt
 */
export interface TransactionReceipt {
  blockHash: Hash
  blockNumber: bigint
  contractAddress?: Address
  cumulativeGasUsed: bigint
  effectiveGasPrice: bigint
  from: Address
  gasUsed: bigint
  logs: Array<unknown>
  status: 'success' | 'reverted'
  to: Address | null
  transactionHash: Hash
  transactionIndex: number
}

/**
 * EIP-712 typed data
 */
export interface TypedData {
  domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: Address
  }
  types: Record<string, Array<{ name: string; type: string }>>
  primaryType: string
  message: Record<string, unknown>
}

/**
 * Network information
 */
export interface NetworkInfo {
  chainId: number
  name: string
  symbol: string
  isTestnet: boolean
  blockExplorer: string
  rpcUrl: string
}

/**
 * Contract event log
 */
export interface ContractEvent {
  address: Address
  eventName: string
  args: Record<string, unknown>
  blockNumber: bigint
  transactionHash: Hash
  logIndex: number
}
