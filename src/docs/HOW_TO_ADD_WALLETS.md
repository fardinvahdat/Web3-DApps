# How to Add More Wallets

## Quick Guide

Adding a new wallet to the modal is super easy! Just add it to the `WALLET_OPTIONS` array.

## Step-by-Step

### 1. Find the Wallet Info

You need:
- **Name** - Official wallet name
- **Icon** - Emoji or image
- **Download URL** - Where to get the wallet
- **Deep Link** (optional) - For mobile support
- **Detection property** (optional) - How to detect if installed

### 2. Add to WALLET_OPTIONS

Open `/components/web3/WalletConnectModal.tsx` and add to the array:

```typescript
const WALLET_OPTIONS: Omit<WalletOption, 'isInstalled'>[] = [
  // ... existing wallets ...
  
  // Add your new wallet here:
  {
    id: 'phantom',              // Unique ID (lowercase, no spaces)
    name: 'Phantom',            // Display name
    icon: '👻',                 // Emoji icon
    description: 'Connect with Phantom',
    downloadUrl: 'https://phantom.app/download',
    deepLink: 'https://phantom.app/ul/',  // Optional
    type: 'both',               // 'injected' | 'mobile' | 'both'
  },
]
```

### 3. Add Detection (Optional)

If the wallet has a detection property, add it to the detection logic:

```typescript
// In the useEffect, find the switch statement:
switch (wallet.id) {
  case 'metamask':
    isInstalled = window.ethereum.isMetaMask === true
    break
  case 'coinbase':
    isInstalled = window.ethereum.isCoinbaseWallet === true
    break
  // Add your wallet:
  case 'phantom':
    isInstalled = window.ethereum.isPhantom === true
    break
}
```

### 4. Add TypeScript Type (Optional)

If adding detection, update `/types/window.d.ts`:

```typescript
interface EthereumProvider {
  isMetaMask?: boolean
  isCoinbaseWallet?: boolean
  isPhantom?: boolean  // Add this
  // ...
}
```

Done! Your wallet now appears in the modal. ✅

---

## Examples

### Example 1: Basic Wallet (No Detection)

```typescript
{
  id: 'onekey',
  name: 'OneKey',
  icon: '🔑',
  description: 'Connect with OneKey',
  downloadUrl: 'https://onekey.so/download',
  type: 'both',
}
```

### Example 2: With Deep Link

```typescript
{
  id: 'imtoken',
  name: 'imToken',
  icon: '💎',
  description: 'Connect with imToken',
  downloadUrl: 'https://token.im/download',
  deepLink: 'imtokenv2://navigate/DappView?url=',
  type: 'mobile',  // Mobile-only wallet
}
```

### Example 3: With Detection

```typescript
{
  id: 'okx',
  name: 'OKX Wallet',
  icon: '⭕',
  description: 'Connect with OKX',
  downloadUrl: 'https://www.okx.com/download',
  type: 'both',
}

// In detection logic:
case 'okx':
  isInstalled = window.ethereum.isOkxWallet === true
  break
```

### Example 4: Desktop Only

```typescript
{
  id: 'frame',
  name: 'Frame',
  icon: '🖼️',
  description: 'Connect with Frame',
  downloadUrl: 'https://frame.sh/',
  type: 'injected',  // Desktop browser only
}
```

---

## Wallet Types

### `type: 'injected'`
- Desktop browser extension only
- Won't show in mobile tab
- Examples: Frame, Rabby

### `type: 'mobile'`
- Mobile app only
- Won't show in desktop tab
- Examples: Argent, some DeFi wallets

### `type: 'both'`
- Works on desktop AND mobile
- Shows in both tabs
- Examples: MetaMask, Coinbase, Trust

---

## Finding Deep Links

### Common Deep Link Patterns

**MetaMask:**
```
https://metamask.app.link/dapp/{YOUR_URL}
```

**Trust Wallet:**
```
https://link.trustwallet.com/open_url?url={YOUR_URL}
```

**Coinbase:**
```
https://go.cb-w.com/dapp?cb_url={YOUR_URL}
```

**Rainbow:**
```
https://rnbwapp.com/
```

### How to Find
1. Check wallet's documentation
2. Search "[Wallet Name] deep link dapp"
3. Look in their GitHub issues
4. Test with: `walletDeepLink + window.location.href`

---

## Popular Wallets to Add

### DeFi Focused
```typescript
{
  id: 'onekey',
  name: 'OneKey',
  icon: '🔑',
  downloadUrl: 'https://onekey.so/download',
  type: 'both',
}
```

### Hardware Wallets
```typescript
{
  id: 'trezor',
  name: 'Trezor',
  icon: '🔒',
  downloadUrl: 'https://trezor.io/',
  type: 'injected',
}
```

### Gaming Wallets
```typescript
{
  id: 'portal',
  name: 'Portal',
  icon: '🎮',
  downloadUrl: 'https://portalhq.io/',
  type: 'both',
}
```

### Multi-Chain
```typescript
{
  id: 'phantom',
  name: 'Phantom',
  icon: '👻',
  downloadUrl: 'https://phantom.app/download',
  deepLink: 'https://phantom.app/ul/',
  type: 'both',
}
```

### Mobile First
```typescript
{
  id: 'alpha',
  name: 'Alpha Wallet',
  icon: '🅰️',
  downloadUrl: 'https://alphawallet.com/',
  type: 'mobile',
}
```

---

## Custom Icons

### Using Emojis (Default)
```typescript
icon: '🦊'  // Simple and works everywhere
```

### Using Images
```typescript
icon: '/wallets/metamask.svg'  // Custom SVG

// Then in the render:
<div className="w-12 h-12">
  {wallet.icon.startsWith('/') ? (
    <img src={wallet.icon} alt={wallet.name} />
  ) : (
    <span className="text-2xl">{wallet.icon}</span>
  )}
</div>
```

### Using Icon Components
```typescript
import { MetaMaskIcon } from './wallet-icons'

icon: <MetaMaskIcon />  // React component
```

---

## Reordering Wallets

Wallets appear in the order they're in the array.

**Most popular first:**
```typescript
const WALLET_OPTIONS = [
  // Top wallets
  metamask,
  coinbase,
  walletconnect,
  
  // Other popular
  trust,
  rainbow,
  ledger,
  
  // Niche wallets
  argent,
  zerion,
  rabby,
]
```

---

## Advanced: Conditional Wallets

### Show wallet only on certain chains:
```typescript
const wallets = WALLET_OPTIONS.filter(wallet => {
  // Only show Phantom on Solana-compatible chains
  if (wallet.id === 'phantom' && !isSolanaChain) {
    return false
  }
  return true
})
```

### Show wallet based on region:
```typescript
const isChina = navigator.language === 'zh-CN'

const localWallets = isChina ? [
  {
    id: 'imtoken',
    name: 'imToken',
    // ...
  }
] : []

const WALLET_OPTIONS = [...defaultWallets, ...localWallets]
```

---

## Testing

After adding a wallet:

1. **Check appearance**
   ```
   ✓ Icon displays correctly
   ✓ Name and description are clear
   ✓ Positioned correctly in list
   ```

2. **Test download link**
   ```
   ✓ Clicking opens correct URL
   ✓ URL is HTTPS
   ✓ Page loads successfully
   ```

3. **Test deep link** (if added)
   ```
   ✓ Opens wallet app on mobile
   ✓ Passes current URL correctly
   ✓ Returns to site after connecting
   ```

4. **Test detection** (if added)
   ```
   ✓ Shows checkmark when installed
   ✓ Shows "Ready to connect"
   ✓ Connects successfully when clicked
   ```

---

## Quick Reference

### Minimum Required
```typescript
{
  id: 'mywallet',
  name: 'My Wallet',
  icon: '🎯',
  description: 'Connect with My Wallet',
  downloadUrl: 'https://mywallet.com',
  type: 'both',
}
```

### Recommended
```typescript
{
  id: 'mywallet',
  name: 'My Wallet',
  icon: '🎯',
  description: 'Connect with My Wallet',
  downloadUrl: 'https://mywallet.com/download',
  deepLink: 'mywallet://dapp/',  // For mobile
  type: 'both',
}
```

### Full Featured
```typescript
{
  id: 'mywallet',
  name: 'My Wallet',
  icon: '🎯',
  description: 'Connect with My Wallet',
  downloadUrl: 'https://mywallet.com/download',
  deepLink: 'mywallet://dapp/',
  type: 'both',
}

// + Detection in switch statement
case 'mywallet':
  isInstalled = window.ethereum.isMyWallet === true
  break

// + TypeScript type
interface EthereumProvider {
  isMyWallet?: boolean
}
```

---

## Need Help?

**Common Issues:**

1. **Wallet doesn't appear**
   - Check it's in WALLET_OPTIONS array
   - Verify no syntax errors
   - Ensure `type` is set correctly

2. **Icon doesn't show**
   - Try different emoji
   - Check emoji is supported
   - Use image fallback

3. **Detection doesn't work**
   - Verify wallet's detection property
   - Check browser console
   - Test with wallet installed

4. **Deep link doesn't work**
   - Test URL format
   - Check wallet documentation
   - Try on actual mobile device

---

**That's it! Adding wallets is easy.** 🎉

Most wallets just need the basic info. Detection and deep links are nice-to-have features that enhance UX but aren't required.
