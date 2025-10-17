/**
 * Contract Addresses
 * 
 * Centralized configuration for all contract addresses across different chains
 */

import { ChainId } from '../web3/config'

/**
 * Contract addresses by chain
 * Add your contract addresses here
 */
export const CONTRACT_ADDRESSES = {
  // ERC20 Token Contracts
  USDC: {
    [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    [ChainId.SEPOLIA]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    [ChainId.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    [ChainId.ARBITRUM]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  },
  
  USDT: {
    [ChainId.MAINNET]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    [ChainId.SEPOLIA]: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    [ChainId.POLYGON]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
  
  DAI: {
    [ChainId.MAINNET]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    [ChainId.SEPOLIA]: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
    [ChainId.POLYGON]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  },

  // NFT Contracts
  SAMPLE_NFT: {
    [ChainId.SEPOLIA]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [ChainId.POLYGON_AMOY]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },

  // Custom DApp Contracts
  SAMPLE_CONTRACT: {
    [ChainId.SEPOLIA]: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    [ChainId.POLYGON_AMOY]: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
} as const

/**
 * Get contract address for a specific chain
 * @param contractName - Name of the contract
 * @param chainId - Chain ID
 * @returns Contract address or undefined
 */
export function getContractAddress(
  contractName: keyof typeof CONTRACT_ADDRESSES,
  chainId: number
): string | undefined {
  return CONTRACT_ADDRESSES[contractName][chainId as keyof typeof CONTRACT_ADDRESSES[typeof contractName]]
}

/**
 * Check if contract exists on chain
 * @param contractName - Name of the contract
 * @param chainId - Chain ID
 * @returns True if contract exists on the chain
 */
export function hasContract(
  contractName: keyof typeof CONTRACT_ADDRESSES,
  chainId: number
): boolean {
  return !!getContractAddress(contractName, chainId)
}
