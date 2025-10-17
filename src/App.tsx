/**
 * Main Application Component
 * 
 * Root component with Web3 provider and main UI
 */

'use client'

import { Web3Provider } from './components/providers/Web3Provider'
import { Header } from './components/layout/Header'
import { AccountInfo } from './components/web3/AccountInfo'
import { TokenBalancesOverview } from './components/web3/TokenBalances'
import { TransferForm } from './components/web3/TransferForm'
import { GasTracker } from './components/web3/GasTracker'
import { CounterContract } from './components/web3/CounterContract'
import { Toaster } from './components/ui/sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { useWallet } from './hooks/web3/useWallet'
import { 
  Wallet, 
  Send, 
  Coins, 
  Fuel, 
  Code,
  Info
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Alert, AlertDescription } from './components/ui/alert'
import { Suspense } from 'react'

/**
 * Main content when wallet is connected
 */
function ConnectedContent() {
  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <AccountInfo />
        <Suspense fallback={<Card><CardContent className="p-6">Loading...</CardContent></Card>}>
          <GasTracker />
        </Suspense>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="balances" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="balances" className="gap-2">
            <Coins className="h-4 w-4" />
            Balances
          </TabsTrigger>
          <TabsTrigger value="transfer" className="gap-2">
            <Send className="h-4 w-4" />
            Transfer
          </TabsTrigger>
          <TabsTrigger value="contracts" className="gap-2">
            <Code className="h-4 w-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Info className="h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="space-y-4">
          <Suspense fallback={<Card><CardContent className="p-6">Loading balances...</CardContent></Card>}>
            <TokenBalancesOverview />
          </Suspense>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-4">
          <div className="max-w-2xl">
            <TransferForm />
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <CounterContract />
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <AboutSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * About section with architecture information
 */
function AboutSection() {
  const features = [
    {
      title: 'Modular Architecture',
      description: 'Feature-based organization with clear separation of concerns',
    },
    {
      title: 'Type-Safe Web3',
      description: 'Comprehensive TypeScript implementation with strict typing',
    },
    {
      title: 'Custom Hooks',
      description: 'Reusable hooks for all Web3 interactions',
    },
    {
      title: 'Multi-Chain Support',
      description: 'Support for Ethereum, Polygon, Arbitrum, Optimism, and testnets',
    },
    {
      title: 'Error Handling',
      description: 'Comprehensive error handling with user-friendly messages',
    },
    {
      title: 'State Management',
      description: 'Zustand for wallet state persistence',
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About This DApp</CardTitle>
          <CardDescription>
            Production-ready, modular Web3 application architecture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This application demonstrates enterprise-grade Web3 patterns using Wagmi, 
            TypeScript, and modern React practices. Built with scalability and 
            maintainability in mind.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-1">
                <h4 className="text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm mb-2">Technology Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['Wagmi', 'TypeScript', 'Tailwind CSS', 'Zustand', 'React Query', 'Viem'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs bg-secondary rounded-full"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Welcome screen when wallet is not connected
 */
function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 max-w-2xl mx-auto text-center">
      <div className="p-6 rounded-full bg-primary/10">
        <Wallet className="h-16 w-16 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h2>Welcome to Web3 DApp</h2>
        <p className="text-muted-foreground">
          Connect your wallet to get started with this production-ready Web3 application
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-left">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-left text-sm">
            <li className="flex items-start gap-2">
              <Coins className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <span className="block">Multi-Token Support</span>
                <span className="text-xs text-muted-foreground">
                  View balances for native and ERC20 tokens
                </span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Send className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <span className="block">Token Transfers</span>
                <span className="text-xs text-muted-foreground">
                  Send tokens with real-time transaction monitoring
                </span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Fuel className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <span className="block">Gas Tracking</span>
                <span className="text-xs text-muted-foreground">
                  Real-time gas price monitoring and estimation
                </span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Code className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <span className="block">Enterprise Architecture</span>
                <span className="text-xs text-muted-foreground">
                  Production-ready, modular, and type-safe codebase
                </span>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * App content that checks wallet connection
 */
function AppContent() {
  const { isConnected } = useWallet()

  return isConnected ? <ConnectedContent /> : <WelcomeScreen />
}

/**
 * Main App Component with error boundary
 */
export default function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <AppContent />
          </Suspense>
        </main>

        <Toaster />
      </div>
    </Web3Provider>
  )
}
