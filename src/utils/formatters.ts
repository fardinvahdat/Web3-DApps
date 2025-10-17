/**
 * Formatting Utilities
 * 
 * Helper functions for formatting blockchain data for display
 */

import { formatUnits, formatEther, parseUnits } from 'viem'
import type { Address } from 'viem'

/**
 * Format an Ethereum address for display
 * @param address - The address to format
 * @param startChars - Number of characters to show at start
 * @param endChars - Number of characters to show at end
 * @returns Formatted address (e.g., "0x1234...5678")
 */
export function formatAddress(
  address: Address | string | undefined,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return ''
  if (address.length < startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Format token balance with proper decimals
 * @param balance - The balance in wei/smallest unit
 * @param decimals - Token decimals
 * @param displayDecimals - Number of decimals to display
 * @returns Formatted balance string
 */
export function formatTokenBalance(
  balance: bigint | undefined,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  if (balance === undefined) return '0'
  const formatted = formatUnits(balance, decimals)
  const num = parseFloat(formatted)
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  })
}

/**
 * Format Ether value for display
 * @param value - Value in wei
 * @param displayDecimals - Number of decimals to display
 * @returns Formatted ETH string
 */
export function formatEtherValue(
  value: bigint | undefined,
  displayDecimals: number = 4
): string {
  if (value === undefined) return '0'
  const formatted = formatEther(value)
  const num = parseFloat(formatted)
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals,
  })
}

/**
 * Format USD value
 * @param value - USD value
 * @returns Formatted USD string
 */
export function formatUSD(value: number | undefined): string {
  if (value === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format gas price in Gwei
 * @param gasPrice - Gas price in wei
 * @returns Formatted gas price in Gwei
 */
export function formatGwei(gasPrice: bigint | undefined): string {
  if (gasPrice === undefined) return '0'
  const gwei = formatUnits(gasPrice, 9)
  const num = parseFloat(gwei)
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

/**
 * Format transaction hash
 * @param hash - Transaction hash
 * @returns Formatted hash
 */
export function formatTxHash(hash: string | undefined): string {
  return formatAddress(hash as Address, 10, 8)
}

/**
 * Format timestamp to readable date
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param timestamp - Unix timestamp
 * @returns Relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000
  const diff = now - timestamp
  
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
  
  return formatTimestamp(timestamp)
}

/**
 * Format large numbers with K, M, B suffixes
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`
  return `${(num / 1000000000).toFixed(1)}B`
}

/**
 * Parse user input to wei
 * @param value - String value to parse
 * @param decimals - Token decimals
 * @returns Bigint value in wei
 */
export function parseTokenAmount(value: string, decimals: number = 18): bigint {
  try {
    return parseUnits(value, decimals)
  } catch {
    return 0n
  }
}

/**
 * Validate Ethereum address
 * @param address - Address to validate
 * @returns True if valid
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate transaction hash
 * @param hash - Hash to validate
 * @returns True if valid
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}
