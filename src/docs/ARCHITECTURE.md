# Architecture Documentation

## 🏗️ System Architecture

The Web3 DApp Starter Kit follows a **modular, feature-based architecture** with clear separation of concerns and domain-driven design principles.

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │  React 18+   │  │  Tailwind    │      │
│  │   App Router │  │  Components  │  │  shadcn/ui   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Custom Hooks Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  useWallet   │  │ useContract  │  │   useToken   │      │
│  │              │  │   Write      │  │   Balance    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Web3 Provider Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Wagmi     │  │     Viem     │  │  TanStack    │      │
│  │   v2.x       │  │  TypeScript  │  │    Query     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Blockchain Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Ethereum   │  │   Polygon    │  │   Arbitrum   │      │
│  │   Optimism   │  │   Testnets   │  │     RPC      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
web3-dapp-starter/
│
├── components/              # React Components
│   ├── web3/               # Web3-specific components
│   │   ├── WalletConnect.tsx
│   │   ├── AccountInfo.tsx
│   │   ├── TokenBalances.tsx
│   │   ├── TransferForm.tsx
│   │   ├── CounterContract.tsx
│   │   ├── NetworkSwitcher.tsx
│   │   └── GasTracker.tsx
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/             # Layout components
│   │   └── Header.tsx
│   └── providers/          # Context providers
│       └── Web3Provider.tsx
│
├── hooks/                  # Custom React Hooks
│   └── web3/               # Web3-specific hooks
│       ├── useWallet.ts
│       ├── useTokenBalance.ts
│       ├── useContractWrite.ts
│       ├── useEventListener.ts
│       ├── useGasEstimation.ts
│       └── useNFTPortfolio.ts
│
├── lib/                    # Libraries and Configuration
│   ├── web3/               # Web3 configuration
│   │   ├── config.ts       # Wagmi configuration
│   │   └── chains.ts       # Chain configurations
│   ├── utils/              # Utility functions
│   │   └── errors.ts       # Error handling
│   └── constants/          # Application constants
│       └── contracts.ts
│
├── contracts/              # Smart Contract Interfaces
│   └── abis/               # Contract ABIs
│       ├── Counter.ts
│       ├── ERC20.ts
│       └── ERC721.ts
│
├── store/                  # State Management
│   └── walletStore.ts      # Zustand store
│
├── types/                  # TypeScript Types
│   └── web3.ts             # Web3 type definitions
│
├── utils/                  # General Utilities
│   ├── formatters.ts       # Data formatting
│   └── clipboard.ts        # Clipboard utilities
│
└── styles/                 # Styling
    └── globals.css         # Global styles + Tailwind
```

## 🔄 Data Flow

### Wallet Connection Flow

```
User Clicks "Connect" 
    ↓
WalletConnect Component
    ↓
useConnect Hook (Wagmi)
    ↓
Wallet Provider (MetaMask/WalletConnect)
    ↓
Connection Established
    ↓
useWallet Hook Updates State
    ↓
walletStore (Zustand) Persists State
    ↓
UI Updates Across All Components
```

### Transaction Flow

```
User Initiates Transaction
    ↓
TransferForm Component Validates Input
    ↓
useContractWrite Hook
    ↓
writeContractAsync (Wagmi)
    ↓
Wallet Prompts User for Confirmation
    ↓
Transaction Submitted to Blockchain
    ↓
useWaitForTransactionReceipt Monitors Status
    ↓
Transaction Confirmed
    ↓
useWatchContractEvent Detects Event
    ↓
Toast Notification Shows Success
    ↓
UI Updates with New Balances
```

## 🧩 Core Components

### 1. Web3Provider

**Location**: `/components/providers/Web3Provider.tsx`

The root provider that wraps the entire application with Wagmi and WalletConnect configuration.

**Responsibilities**:
- Initialize Wagmi with chain configurations
- Configure WalletConnect project
- Set up query client for data fetching
- Provide Web3 context to all child components

### 2. Custom Hooks

#### useWallet

**Location**: `/hooks/web3/useWallet.ts`

Central hook for wallet management.

**Features**:
- Connection/disconnection
- Network switching
- Persistent wallet state
- Chain information

**Usage**:
```typescript
const { address, isConnected, disconnect, switchNetwork } = useWallet()
```

#### useTokenBalance

**Location**: `/hooks/web3/useTokenBalance.ts`

Fetches native and ERC-20 token balances.

**Features**:
- Real-time balance updates
- Multiple token support
- Formatted output
- Error handling

**Usage**:
```typescript
const { balance, isLoading, formatted } = useTokenBalance(address, tokenAddress)
```

#### useContractWrite

**Location**: `/hooks/web3/useContractWrite.ts`

Handles smart contract write operations.

**Features**:
- Transaction submission
- Confirmation waiting
- Error parsing
- Toast notifications

**Usage**:
```typescript
const { write, isLoading, isSuccess } = useContractWrite(contractConfig)
```

### 3. State Management

#### Wallet Store (Zustand)

**Location**: `/store/walletStore.ts`

Persists wallet connection state across page reloads.

**State**:
```typescript
interface WalletState {
  lastConnected: {
    address: string
    chainId: number
    connectorId: string
  } | null
  setLastConnected: (address: string, chainId: number, connectorId: string) => void
  clearLastConnected: () => void
}
```

## 🔐 Security Considerations

### 1. Private Key Management

- **Never store private keys in the application**
- All signing happens in the user's wallet
- No server-side transaction signing

### 2. Transaction Validation

- Validate all inputs before submitting transactions
- Check network before contract interactions
- Display transaction details for user review

### 3. Error Handling

- Parse and display user-friendly error messages
- Never expose sensitive error details
- Log errors for debugging without exposing users

### 4. Network Security

- Use HTTPS for all RPC endpoints
- Verify contract addresses
- Implement proper CORS policies

## 🎯 Design Patterns

### 1. Custom Hooks Pattern

All Web3 logic is abstracted into reusable custom hooks.

**Benefits**:
- Separation of concerns
- Reusability across components
- Easier testing
- Consistent API

### 2. Provider Pattern

Web3 configuration provided through React Context.

**Benefits**:
- Single source of truth
- Avoid prop drilling
- Global state management
- Clean component tree

### 3. Presenter Pattern

Components separate presentation from business logic.

**Benefits**:
- Easier to test
- Better maintainability
- Clear responsibilities
- Reusable UI components

## 📊 Performance Optimizations

### 1. React Query Caching

- Wagmi uses TanStack Query for data caching
- Reduces unnecessary blockchain calls
- Automatic background refetching
- Stale-while-revalidate strategy

### 2. Memoization

- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Optimize re-renders with `React.memo`

### 3. Code Splitting

- Next.js automatic code splitting
- Dynamic imports for heavy components
- Lazy loading for modals and dialogs

### 4. Optimistic Updates

- Update UI immediately on user actions
- Revert on transaction failure
- Better perceived performance

## 🧪 Testing Strategy

### Unit Tests

- Test individual hooks and utilities
- Mock Web3 providers
- Test edge cases and error states

### Integration Tests

- Test component interactions
- Test full transaction flows
- Test wallet connection/disconnection

### E2E Tests

- Test complete user journeys
- Test on real testnets
- Verify transaction success

## 🚀 Deployment

### Environment Variables

Required for production:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Optional RPC provider keys for reliability

### Build Process

```bash
npm run build
npm run start
```

### Recommended Platforms

- **Vercel**: Optimal for Next.js
- **Netlify**: Good alternative
- **AWS Amplify**: Enterprise option

## 📈 Scalability

### Horizontal Scaling

- Stateless application design
- Can run multiple instances
- Load balancer compatible

### Database Integration

For future features (transaction history, user preferences):
- Use serverless database (Supabase, PlanetScale)
- Store only non-sensitive data
- Never store private keys or seeds

### Caching Strategy

- Redis for session data
- CDN for static assets
- Browser caching for blockchain data

## 🔄 Upgrade Path

### Adding New Chains

1. Add chain config to `/lib/web3/chains.ts`
2. Update Wagmi config in `/lib/web3/config.ts`
3. Test on testnet first
4. Update documentation

### Adding New Contract Types

1. Add ABI to `/contracts/abis/`
2. Create TypeScript types
3. Add contract constants
4. Create component/hook if needed

### Integrating New Wallets

1. Install connector package
2. Add to Wagmi connectors array
3. Test connection flow
4. Update documentation

---

**For questions about architecture, please open a GitHub Discussion.**
