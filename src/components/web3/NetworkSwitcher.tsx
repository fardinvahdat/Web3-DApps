/**
 * Network Switcher Component
 * 
 * UI component for switching between supported blockchain networks
 */

'use client'

import { useWallet } from '../../hooks/web3/useWallet'
import { SUPPORTED_CHAINS } from '../../lib/web3/config'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ChevronDown, Network } from 'lucide-react'
import { Badge } from '../ui/badge'
import { toast } from 'sonner@2.0.3'
import { isTestnet } from '../../lib/web3/chains'

/**
 * Network switcher dropdown component
 */
export function NetworkSwitcher() {
  const { chainId, switchNetwork, isConnected } = useWallet()

  if (!isConnected) {
    return null
  }

  const currentChain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const handleSwitchNetwork = async (targetChainId: number) => {
    try {
      await switchNetwork(targetChainId)
      toast.success(`Switched to ${SUPPORTED_CHAINS.find((c) => c.id === targetChainId)?.name}`)
    } catch (error) {
      toast.error('Failed to switch network')
      console.error(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Network className="h-4 w-4" />
          {currentChain?.name || 'Unknown Network'}
          {chainId && isTestnet(chainId) && (
            <Badge variant="secondary" className="ml-1">
              Testnet
            </Badge>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-xs opacity-50">Mainnets</div>
          {SUPPORTED_CHAINS.filter((chain) => !isTestnet(chain.id)).map((chain) => (
            <DropdownMenuItem
              key={chain.id}
              onClick={() => handleSwitchNetwork(chain.id)}
              className="cursor-pointer"
              disabled={chain.id === chainId}
            >
              <div className="flex items-center justify-between w-full">
                <span>{chain.name}</span>
                {chain.id === chainId && (
                  <Badge variant="default" className="ml-2">
                    Active
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-xs opacity-50">Testnets</div>
          {SUPPORTED_CHAINS.filter((chain) => isTestnet(chain.id)).map((chain) => (
            <DropdownMenuItem
              key={chain.id}
              onClick={() => handleSwitchNetwork(chain.id)}
              className="cursor-pointer"
              disabled={chain.id === chainId}
            >
              <div className="flex items-center justify-between w-full">
                <span>{chain.name}</span>
                {chain.id === chainId && (
                  <Badge variant="default" className="ml-2">
                    Active
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
