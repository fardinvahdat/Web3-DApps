# Troubleshooting Guide

Common issues and solutions for the Web3 DApp Starter Kit.

## 🔍 Table of Contents

- [Wallet Connection Issues](#wallet-connection-issues)
- [Transaction Failures](#transaction-failures)
- [Network Problems](#network-problems)
- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [Performance Issues](#performance-issues)

## 🔌 Wallet Connection Issues

### MetaMask Not Detected

**Problem**: "No wallet detected" or MetaMask not appearing in connector list.

**Solutions**:
1. Ensure MetaMask extension is installed
2. Refresh the page after installing MetaMask
3. Try in incognito mode to rule out extension conflicts
4. Check browser console for errors

```typescript
// Verify connectors are loading
import { useConnect } from 'wagmi'

function Debug() {
  const { connectors } = useConnect()
  console.log('Available connectors:', connectors)
}
```

### WalletConnect QR Code Not Showing

**Problem**: WalletConnect modal doesn't open or QR code doesn't display.

**Solutions**:
1. Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly
2. Get a new Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)
3. Check browser console for errors
4. Ensure your domain is whitelisted in WalletConnect dashboard

```bash
# Check environment variable
echo $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
```

### Wallet Connects But Immediately Disconnects

**Problem**: Wallet connects briefly then disconnects.

**Solutions**:
1. Clear browser cache and local storage
2. Check network connection
3. Verify RPC URLs are accessible
4. Try different network (e.g., Sepolia instead of Mainnet)

```javascript
// Clear local storage
localStorage.clear()
// Reload page
window.location.reload()
```

### "User Rejected" Error

**Problem**: Connection fails with "User rejected the request" error.

**Solution**: This is expected behavior when user cancels the connection in their wallet. Handle gracefully:

```typescript
const { connect } = useConnect()

const handleConnect = async (connector) => {
  try {
    await connect({ connector })
  } catch (error) {
    if (error.message.includes('User rejected')) {
      toast.info('Connection cancelled')
    } else {
      toast.error('Connection failed')
    }
  }
}
```

## 💸 Transaction Failures

### "Insufficient Funds" Error

**Problem**: Transaction fails with insufficient funds error.

**Solutions**:
1. Ensure wallet has enough native token (ETH, MATIC, etc.) for gas
2. Check if you're on a testnet and need test tokens
3. Try reducing transaction amount
4. Estimate gas before transaction

**Get test tokens**:
- Sepolia: [sepoliafaucet.com](https://sepoliafaucet.com)
- Mumbai: [faucet.polygon.technology](https://faucet.polygon.technology)

### Transaction Pending Forever

**Problem**: Transaction submitted but never confirms.

**Solutions**:
1. Check gas price - may be too low
2. Verify transaction on block explorer
3. Check network congestion
4. Wait longer (some networks are slow)
5. Speed up transaction in wallet

```typescript
// Monitor transaction with timeout
const { isLoading, isSuccess } = useWaitForTransactionReceipt({
  hash,
  timeout: 60_000, // 60 seconds
})

useEffect(() => {
  if (isLoading) {
    const timeout = setTimeout(() => {
      toast.warning('Transaction taking longer than expected')
    }, 30_000)
    return () => clearTimeout(timeout)
  }
}, [isLoading])
```

### "Gas Estimation Failed"

**Problem**: Can't estimate gas for transaction.

**Solutions**:
1. Check if contract is deployed on current network
2. Verify contract address is correct
3. Ensure you're on correct network
4. Check if function exists in contract
5. Verify function parameters are correct

```typescript
// Manual gas limit
await writeContract({
  ...config,
  gas: 100_000n, // Set manually if estimation fails
})
```

### "Nonce Too Low" Error

**Problem**: Transaction fails with nonce error.

**Solutions**:
1. Wait for pending transactions to complete
2. Reset account in MetaMask (Settings → Advanced → Reset Account)
3. Ensure you're not submitting multiple transactions simultaneously

## 🌐 Network Problems

### Wrong Network Error

**Problem**: "Please switch to [Network Name]" error.

**Solutions**:
1. Use the network switcher in the UI
2. Manually switch in wallet
3. Add network to wallet if not present

```typescript
// Programmatic network switch
const { switchNetwork } = useSwitchChain()

await switchNetwork({ chainId: sepolia.id })
```

### Network Not in Wallet

**Problem**: Network doesn't appear in wallet's network list.

**Solution**: Add network manually or programmatically:

```typescript
const addNetwork = async () => {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [{
      chainId: '0xaa36a7', // Sepolia
      chainName: 'Sepolia',
      nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://sepolia.infura.io/v3/YOUR_KEY'],
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
    }],
  })
}
```

### RPC Error / Network Timeout

**Problem**: "RPC request failed" or timeout errors.

**Solutions**:
1. Check internet connection
2. Try different RPC endpoint
3. Use Alchemy or Infura RPC URLs
4. Check RPC provider status

```typescript
// Use backup RPC in config.ts
transports: {
  [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'),
}
```

## 🏗️ Build Errors

### TypeScript Errors

**Problem**: Build fails with TypeScript errors.

**Solutions**:
1. Run `npm run type-check` to see all errors
2. Ensure all dependencies are installed
3. Clear `.next` folder and rebuild
4. Check for version mismatches

```bash
# Clear and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Module Not Found Errors

**Problem**: Can't resolve module imports.

**Solutions**:
1. Verify import paths are correct
2. Ensure package is installed
3. Check `tsconfig.json` paths
4. Restart dev server

```bash
# Reinstall dependencies
npm install
# or clear npm cache
npm cache clean --force
npm install
```

### "Cannot find module 'wagmi/chains'"

**Problem**: Import error for Wagmi chains.

**Solution**: Ensure you're using Wagmi v2:

```bash
npm install wagmi@^2.0.0 viem@^2.0.0
```

### Build Size Too Large

**Problem**: Bundle size exceeds limits.

**Solutions**:
1. Use dynamic imports for large components
2. Remove unused dependencies
3. Optimize images
4. Use Next.js bundle analyzer

```bash
# Analyze bundle
npm install @next/bundle-analyzer
```

## ⚡ Runtime Errors

### "Hydration Mismatch" Error

**Problem**: React hydration errors in browser console.

**Solutions**:
1. Ensure server and client render the same content
2. Use `'use client'` directive for client-only components
3. Use `useEffect` for client-only code

```typescript
'use client'

import { useEffect, useState } from 'react'

function Component() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return <div>{/* client-only content */}</div>
}
```

### Hooks Can Only Be Called Inside Function Components

**Problem**: "Invalid hook call" error.

**Solutions**:
1. Ensure hooks are only called in function components
2. Don't call hooks conditionally
3. Don't call hooks in loops
4. Ensure single React version

```bash
# Check for duplicate React
npm ls react
```

### "window is not defined"

**Problem**: Server-side rendering error referencing window.

**Solutions**:
1. Use `typeof window !== 'undefined'` checks
2. Move code to `useEffect`
3. Use `'use client'` directive

```typescript
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  // Browser-only code
}
```

## 🐌 Performance Issues

### Slow Page Load

**Solutions**:
1. Optimize images (use Next.js Image)
2. Implement code splitting
3. Use dynamic imports
4. Reduce bundle size

```typescript
// Dynamic import
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Loading />,
})
```

### Too Many RPC Calls

**Solutions**:
1. Increase React Query stale time
2. Use batched requests
3. Implement proper caching

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // Cache for 1 minute
    },
  },
})
```

### UI Freezing During Transactions

**Solutions**:
1. Use optimistic updates
2. Show loading states
3. Debounce user inputs
4. Use Web Workers for heavy computations

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check GitHub Issues**: [github.com/yourusername/web3-dapp-starter/issues](https://github.com/yourusername/web3-dapp-starter/issues)
2. **Search Wagmi Docs**: [wagmi.sh](https://wagmi.sh)
3. **Viem Documentation**: [viem.sh](https://viem.sh)
4. **Open a New Issue**: Include:
   - Error message
   - Steps to reproduce
   - Browser and wallet versions
   - Network you're testing on
   - Relevant code snippets

## 📝 Common Environment Issues

### Missing Environment Variables

**Problem**: Features not working due to missing env vars.

**Solution**: Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

### CORS Errors

**Problem**: API requests blocked by CORS.

**Solution**: Configure Next.js headers:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
}
```

---

**Still need help? Open an issue or join our community!**
