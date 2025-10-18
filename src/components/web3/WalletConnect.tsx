/**
 * Wallet Connect Component
 * 
 * Beautiful wallet connection UI with modal
 * Shows different wallet options similar to Web3Modal/RainbowKit
 */

'use client'

import { useState } from 'react'
import { useWallet } from '../../hooks/web3/useWallet'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { WalletConnectModal } from './WalletConnectModal'
import { formatAddress } from '../../utils/formatters'
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { getAddressExplorerUrl } from '../../lib/web3/chains'
import { copyToClipboard } from '../../utils/clipboard'

/**
 * Wallet connection button with beautiful modal
 */
export function WalletConnect() {
  const { address, isConnected, disconnect, chainId } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await copyToClipboard(address)
        toast.success('Address copied to clipboard')
      } catch (error) {
        console.error('Failed to copy:', error)
        toast.error('Failed to copy address')
      }
    }
  }

  const handleViewExplorer = () => {
    if (address && chainId) {
      const url = getAddressExplorerUrl(chainId, address)
      window.open(url, '_blank')
    }
  }

  if (!isConnected) {
    return (
      <>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>

        <WalletConnectModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">{formatAddress(address)}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewExplorer} className="cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={disconnect}
          className="cursor-pointer text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
