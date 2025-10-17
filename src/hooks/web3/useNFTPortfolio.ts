/**
 * NFT Portfolio Hook
 * 
 * Custom hooks for fetching NFT ownership and metadata
 */

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import type { Address } from 'viem'
import { ERC721_ABI } from '../../contracts/abis/ERC721'
import type { NFT, NFTMetadata } from '../../types/web3'

/**
 * Fetch NFT metadata from tokenURI
 * @param tokenURI - The token URI
 * @returns NFT metadata
 */
async function fetchMetadata(tokenURI: string): Promise<NFTMetadata | null> {
  try {
    // Handle IPFS URIs
    let url = tokenURI
    if (tokenURI.startsWith('ipfs://')) {
      url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }

    const response = await fetch(url)
    if (!response.ok) return null

    const metadata = await response.json()
    return metadata as NFTMetadata
  } catch (error) {
    console.error('Failed to fetch NFT metadata:', error)
    return null
  }
}

/**
 * Hook to get NFT balance for an address
 * @param nftAddress - NFT contract address
 * @param ownerAddress - Optional owner address
 * @returns NFT balance
 */
export function useNFTBalance(
  nftAddress: Address | undefined,
  ownerAddress?: Address
) {
  const { address: accountAddress } = useAccount()
  const targetAddress = ownerAddress || accountAddress

  const { data, isLoading, error, refetch } = useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!nftAddress && !!targetAddress,
    },
  })

  return {
    balance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get NFT information by token ID
 * @param nftAddress - NFT contract address
 * @param tokenId - Token ID
 * @returns NFT information
 */
export function useNFT(
  nftAddress: Address | undefined,
  tokenId: bigint | undefined
): NFT & { isLoading: boolean; error: Error | null; refetch: () => void } {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null)
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: !!nftAddress && tokenId !== undefined,
    },
  })

  const {
    data: tokenURI,
    isLoading: isLoadingURI,
    refetch,
  } = useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: !!nftAddress && tokenId !== undefined,
    },
  })

  // Fetch metadata when tokenURI changes
  useEffect(() => {
    if (tokenURI) {
      setIsLoadingMetadata(true)
      fetchMetadata(tokenURI as string)
        .then(setMetadata)
        .finally(() => setIsLoadingMetadata(false))
    }
  }, [tokenURI])

  return {
    tokenId: tokenId || 0n,
    contract: nftAddress || ('0x0' as Address),
    owner: (owner as Address) || ('0x0' as Address),
    metadata,
    tokenURI: (tokenURI as string) || '',
    isLoading: isLoadingOwner || isLoadingURI || isLoadingMetadata,
    error: null,
    refetch,
  }
}

/**
 * Hook to get multiple NFTs from a collection
 * @param nftAddress - NFT contract address
 * @param tokenIds - Array of token IDs
 * @returns Array of NFTs
 */
export function useNFTCollection(
  nftAddress: Address | undefined,
  tokenIds: bigint[]
) {
  const nfts = tokenIds.map((tokenId) => useNFT(nftAddress, tokenId))

  const isLoading = nfts.some((nft) => nft.isLoading)
  const hasError = nfts.some((nft) => nft.error)

  return {
    nfts,
    isLoading,
    hasError,
  }
}

/**
 * Hook to check if address owns a specific NFT
 * @param nftAddress - NFT contract address
 * @param tokenId - Token ID
 * @param ownerAddress - Optional owner address
 * @returns Ownership status
 */
export function useNFTOwnership(
  nftAddress: Address | undefined,
  tokenId: bigint | undefined,
  ownerAddress?: Address
) {
  const { address: accountAddress } = useAccount()
  const targetAddress = ownerAddress || accountAddress

  const { data: owner, isLoading, error } = useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: !!nftAddress && tokenId !== undefined,
    },
  })

  const isOwner =
    targetAddress && owner
      ? (owner as Address).toLowerCase() === targetAddress.toLowerCase()
      : false

  return {
    isOwner,
    owner: owner as Address | undefined,
    isLoading,
    error,
  }
}

/**
 * Hook to get NFT contract information
 * @param nftAddress - NFT contract address
 * @returns Contract information
 */
export function useNFTContractInfo(nftAddress: Address | undefined) {
  const { data: name } = useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'name',
    query: {
      enabled: !!nftAddress,
    },
  })

  const { data: symbol } = useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!nftAddress,
    },
  })

  return {
    name: name as string | undefined,
    symbol: symbol as string | undefined,
  }
}

/**
 * Hook to get NFT approval status
 * @param nftAddress - NFT contract address
 * @param tokenId - Token ID
 * @returns Approved address
 */
export function useNFTApproval(
  nftAddress: Address | undefined,
  tokenId: bigint | undefined
) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: nftAddress,
    abi: ERC721_ABI,
    functionName: 'getApproved',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: !!nftAddress && tokenId !== undefined,
    },
  })

  return {
    approvedAddress: data as Address | undefined,
    isLoading,
    error,
    refetch,
  }
}
