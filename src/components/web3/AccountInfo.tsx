/**
 * Account Info Component
 * 
 * Displays connected wallet information
 */

'use client'

import { useWallet } from '../../hooks/web3/useWallet'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatAddress } from '../../utils/formatters'
import { User, Link as LinkIcon } from 'lucide-react'
import { Badge } from '../ui/badge'
import { getChainName, isTestnet } from '../../lib/web3/chains'

/**
 * Account information display
 */
export function AccountInfo() {
  const { address, chainId, isConnected, connector } = useWallet()

  if (!isConnected || !address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view account information
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Address</span>
            <code className="text-sm">{formatAddress(address)}</code>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">{getChainName(chainId || 1)}</span>
              {chainId && isTestnet(chainId) && (
                <Badge variant="secondary" className="text-xs">
                  Testnet
                </Badge>
              )}
            </div>
          </div>

          {connector && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connector</span>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-3 w-3" />
                <span className="text-sm">{connector}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
