/**
 * Header Component
 * 
 * Main application header with wallet connection and network switcher
 */

'use client'

import { WalletConnect } from '../web3/WalletConnect'
import { NetworkSwitcher } from '../web3/NetworkSwitcher'
import { Layers } from 'lucide-react'

/**
 * Application header
 */
export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="h-8 w-8" />
            <div>
              <h1 className="tracking-tight">Web3 DApp</h1>
              <p className="text-xs text-muted-foreground">
                Production-ready modular architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NetworkSwitcher />
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
}
