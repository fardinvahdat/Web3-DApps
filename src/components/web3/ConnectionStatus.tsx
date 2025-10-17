/**
 * Connection Status Component
 * 
 * Debug component to display Web3 connection status
 * Useful for troubleshooting connection issues
 */

'use client'

import { useAccount, useChainId } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Badge } from '../ui/badge'

/**
 * Simple connection status display
 * Can be used for debugging or as a status indicator
 */
export function ConnectionStatus() {
  const { address, isConnected, isConnecting, isReconnecting, connector, status } = useAccount()
  const chainId = useChainId()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          {isConnected ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : isConnecting || isReconnecting ? (
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          )}
          Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
        
        {address && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address:</span>
            <code className="text-xs">{address.slice(0, 6)}...{address.slice(-4)}</code>
          </div>
        )}
        
        {chainId && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chain ID:</span>
            <span>{chainId}</span>
          </div>
        )}
        
        {connector && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Connector:</span>
            <span>{connector.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Minimal status badge for headers
 */
export function ConnectionStatusBadge() {
  const { isConnected, isConnecting } = useAccount()

  if (isConnecting) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connecting
      </Badge>
    )
  }

  if (isConnected) {
    return (
      <Badge variant="default" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Connected
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1">
      <AlertCircle className="h-3 w-3" />
      Not Connected
    </Badge>
  )
}
