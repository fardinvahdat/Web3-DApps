/**
 * Wagmi Configuration
 * 
 * Configures Web3 providers, chains, and wallet connectors for the application.
 * Uses multiple RPC providers for redundancy and performance.
 */

import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, polygonAmoy, arbitrum, optimism } from 'wagmi/chains'

/**
 * Check if we're in a Node.js environment
 */
const hasProcess = typeof process !== 'undefined' && process.env

/**
 * Project ID for WalletConnect
 * Replace with your actual project ID from cloud.walletconnect.com
 */
const WALLETCONNECT_PROJECT_ID = hasProcess 
  ? process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID_HERE'
  : 'YOUR_PROJECT_ID_HERE'

/**
 * RPC URLs with fallback support
 * In production, use environment variables for API keys
 */
const RPC_URLS = {
  mainnet: hasProcess && process.env.NEXT_PUBLIC_MAINNET_RPC_URL 
    ? process.env.NEXT_PUBLIC_MAINNET_RPC_URL 
    : mainnet.rpcUrls.default.http[0],
  sepolia: hasProcess && process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL 
    ? process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL 
    : sepolia.rpcUrls.default.http[0],
  polygon: hasProcess && process.env.NEXT_PUBLIC_POLYGON_RPC_URL 
    ? process.env.NEXT_PUBLIC_POLYGON_RPC_URL 
    : polygon.rpcUrls.default.http[0],
  polygonAmoy: hasProcess && process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL 
    ? process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL 
    : polygonAmoy.rpcUrls.default.http[0],
  arbitrum: hasProcess && process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL 
    ? process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL 
    : arbitrum.rpcUrls.default.http[0],
  optimism: hasProcess && process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL 
    ? process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL 
    : optimism.rpcUrls.default.http[0],
}

/**
 * Supported chains configuration
 * Customize based on your application needs
 */
export const SUPPORTED_CHAINS = [
  mainnet,
  sepolia,
  polygon,
  polygonAmoy,
  arbitrum,
  optimism,
] as const

/**
 * Wagmi configuration with multiple wallet connectors and chains
 * Connectors are auto-discovered to avoid bundler dependency issues
 */
export const config = createConfig({
  chains: SUPPORTED_CHAINS,
  transports: {
    [mainnet.id]: http(RPC_URLS.mainnet, {
      timeout: 10_000,
    }),
    [sepolia.id]: http(RPC_URLS.sepolia, {
      timeout: 10_000,
    }),
    [polygon.id]: http(RPC_URLS.polygon, {
      timeout: 10_000,
    }),
    [polygonAmoy.id]: http(RPC_URLS.polygonAmoy, {
      timeout: 10_000,
    }),
    [arbitrum.id]: http(RPC_URLS.arbitrum, {
      timeout: 10_000,
    }),
    [optimism.id]: http(RPC_URLS.optimism, {
      timeout: 10_000,
    }),
  },
})

/**
 * Type-safe chain ID enum
 */
export const ChainId = {
  MAINNET: mainnet.id,
  SEPOLIA: sepolia.id,
  POLYGON: polygon.id,
  POLYGON_AMOY: polygonAmoy.id,
  ARBITRUM: arbitrum.id,
  OPTIMISM: optimism.id,
} as const

export type ChainId = typeof ChainId[keyof typeof ChainId]

/**
 * Wallet connector configuration
 * Export this for use in components that need connector information
 */
export const walletConnectConfig = {
  projectId: WALLETCONNECT_PROJECT_ID,
  metadata: {
    name: 'Web3 DApp',
    description: 'Production-ready Web3 Application',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://web3-dapp.example.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
}
