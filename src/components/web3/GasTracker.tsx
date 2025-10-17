/**
 * Gas Tracker Component
 * 
 * Displays current gas prices and estimates
 */

'use client'

import { useCurrentGasPrice, useGasPrices } from '../../hooks/web3/useGasEstimation'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { formatGwei } from '../../utils/formatters'
import { Fuel, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Badge } from '../ui/badge'

/**
 * Gas price display component
 */
export function GasTracker() {
  const { gasPrice, isLoading, error } = useCurrentGasPrice()
  const { slow, standard, fast, isLoading: isPricesLoading } = useGasPrices()

  // Show loading state
  if (isLoading || isPricesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Gas Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Show error or unavailable state
  const hasValidGasPrice = gasPrice && gasPrice > 0n
  
  if (error || !hasValidGasPrice) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            Gas Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl text-muted-foreground">--</span>
                <span className="text-sm text-muted-foreground">Gwei</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {error 
                ? `Error: ${error.message}` 
                : 'Gas price not available on this network. This is common on some testnets.'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Gas Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Gas Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{formatGwei(gasPrice)}</span>
              <span className="text-sm text-muted-foreground">Gwei</span>
            </div>
          </div>

          {/* Gas Speed Options */}
          <div className="grid grid-cols-3 gap-2">
            <GasSpeedCard
              label="Slow"
              gasPrice={slow}
              icon={<TrendingDown className="h-4 w-4" />}
              variant="secondary"
            />
            <GasSpeedCard
              label="Standard"
              gasPrice={standard}
              icon={<Minus className="h-4 w-4" />}
              variant="default"
            />
            <GasSpeedCard
              label="Fast"
              gasPrice={fast}
              icon={<TrendingUp className="h-4 w-4" />}
              variant="destructive"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Individual gas speed card
 */
interface GasSpeedCardProps {
  label: string
  gasPrice: bigint
  icon: React.ReactNode
  variant: 'default' | 'secondary' | 'destructive'
}

function GasSpeedCard({ label, gasPrice, icon, variant }: GasSpeedCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-lg border">
      <div className="flex items-center gap-1">
        {icon}
        <Badge variant={variant} className="text-xs">
          {label}
        </Badge>
      </div>
      <span className="text-sm">{formatGwei(gasPrice)}</span>
      <span className="text-xs text-muted-foreground">Gwei</span>
    </div>
  )
}
