/**
 * Chain Utilities
 * 
 * Helper functions for working with blockchain networks
 */

import { SUPPORTED_CHAINS } from './config'
import type { Chain } from 'wagmi/chains'

/**
 * Get chain by ID
 * @param chainId - The chain ID to look up
 * @returns The chain object or undefined
 */
export function getChainById(chainId: number): Chain | undefined {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId)
}

/**
 * Check if a chain is supported
 * @param chainId - The chain ID to check
 * @returns True if the chain is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAINS.some(chain => chain.id === chainId)
}

/**
 * Get chain name by ID
 * @param chainId - The chain ID
 * @returns The chain name or 'Unknown Chain'
 */
export function getChainName(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.name || 'Unknown Chain'
}

/**
 * Get block explorer URL for a chain
 * @param chainId - The chain ID
 * @returns The block explorer URL or empty string
 */
export function getBlockExplorerUrl(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.blockExplorers?.default.url || ''
}

/**
 * Get transaction URL on block explorer
 * @param chainId - The chain ID
 * @param txHash - The transaction hash
 * @returns The full URL to view the transaction
 */
export function getTxExplorerUrl(chainId: number, txHash: string): string {
  const baseUrl = getBlockExplorerUrl(chainId)
  return baseUrl ? `${baseUrl}/tx/${txHash}` : ''
}

/**
 * Get address URL on block explorer
 * @param chainId - The chain ID
 * @param address - The wallet/contract address
 * @returns The full URL to view the address
 */
export function getAddressExplorerUrl(chainId: number, address: string): string {
  const baseUrl = getBlockExplorerUrl(chainId)
  return baseUrl ? `${baseUrl}/address/${address}` : ''
}

/**
 * Check if chain is a testnet
 * @param chainId - The chain ID
 * @returns True if the chain is a testnet
 */
export function isTestnet(chainId: number): boolean {
  const testnets = [11155111, 80002] // Sepolia, Polygon Amoy
  return testnets.includes(chainId)
}

/**
 * Get native currency symbol for a chain
 * @param chainId - The chain ID
 * @returns The native currency symbol
 */
export function getNativeCurrency(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.nativeCurrency.symbol || 'ETH'
}
