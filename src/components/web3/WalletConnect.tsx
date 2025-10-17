/**
 * Wallet Connect Component
 * 
 * UI component for connecting and managing wallet connections
 */

'use client'

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { useState } from 'react'
import { formatAddress } from '../../utils/formatters'
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useConnect } from 'wagmi'
import { getAddressExplorerUrl } from '../../lib/web3/chains'
import { copyToClipboard } from '../../utils/clipboard'

/**
 * Wallet connection button with dropdown menu
 */
export function WalletConnect() {
  const { address, isConnected, isConnecting, disconnect, chainId } =
    useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const { connectors, connect, error } = useConnect()

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
          onClick={() => setIsOpen(true)}
          disabled={isConnecting}
          className="gap-2"
        >
          <Wallet className="h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Choose a wallet provider to connect to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {error && (
                <div className="text-sm text-red-600 mb-2 p-3 bg-red-50 rounded-md">
                  {error.message}
                </div>
              )}
              {connectors.length > 0 ? (
                connectors
                  .filter((connector) => connector.type !== 'injected' || connector.id === 'io.metamask')
                  .map((connector) => (
                    <Button
                      key={connector.id}
                      variant="outline"
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        try {
                          connect({ connector })
                          setIsOpen(false)
                        } catch (err) {
                          console.error('Connection error:', err)
                          toast.error('Failed to connect wallet')
                        }
                      }}
                    >
                      <Wallet className="h-5 w-5" />
                      {connector.name}
                    </Button>
                  ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p className="mb-4">No wallet detected.</p>
                  <p className="text-xs">
                    Please install MetaMask or another Web3 wallet extension and refresh the page.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          {formatAddress(address)}
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
        <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
