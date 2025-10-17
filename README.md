# Web3 DApp Starter Kit

A production-ready, enterprise-grade Web3 decentralized application (DApp) built with **Next.js 14**, **TypeScript**, **Wagmi v2**, and **Tailwind CSS**. This project demonstrates advanced blockchain interaction patterns and modern React architecture, perfect for developers building the next generation of blockchain applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.x-purple.svg)](https://wagmi.sh/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

![Web3 DApp Demo](https://via.placeholder.com/1200x600/1a1b26/58a6ff?text=Web3+DApp+Starter+Kit)

## 🌟 Overview

This Web3 DApp starter kit showcases best practices for building scalable, maintainable blockchain applications. It features a clean architecture with custom hooks, comprehensive error handling, multi-chain support, and a beautiful UI built with shadcn/ui components.

**Perfect for:**
- 🎓 Learning Web3 development with modern React patterns
- 🚀 Bootstrapping new blockchain projects
- 💼 Portfolio demonstration of senior-level React/TypeScript skills
- 🏗️ Understanding enterprise-grade DApp architecture

## ✨ Key Features

### 🔐 Wallet Management
- **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and more
- **Persistent Connections**: Wallet state persists across page reloads
- **Network Switching**: One-click network switching with user-friendly prompts
- **Connection Status**: Real-time connection indicators and account information

### ⛓️ Multi-Chain Support
- **Mainnets**: Ethereum, Polygon, Arbitrum, Optimism
- **Testnets**: Sepolia, Polygon Mumbai, Arbitrum Sepolia, Optimism Sepolia
- **Dynamic Chain Switching**: Switch between networks seamlessly
- **Chain-Specific Configuration**: Custom RPC endpoints and block explorers

### 💰 Token Operations
- **Balance Tracking**: Real-time native and ERC-20 token balances
- **Token Transfers**: Send ETH and ERC-20 tokens with transaction monitoring
- **Transaction History**: Track all wallet transactions with explorer links
- **Gas Estimation**: Real-time gas price tracking and estimation

### 📝 Smart Contract Interactions
- **Read Operations**: Query contract state with automatic updates
- **Write Operations**: Execute transactions with confirmation tracking
- **Event Listening**: Real-time contract event monitoring with notifications
- **ABI Management**: Organized contract ABIs with TypeScript support

### 🎨 User Interface
- **Modern Design**: Built with shadcn/ui and Tailwind CSS v4
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark Mode Ready**: Optimized for both light and dark themes
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Skeleton loaders and spinners for better UX

### 🏗️ Architecture Highlights
- **Domain-Driven Design**: Feature-based folder structure
- **Custom Hooks**: Reusable Web3 hooks for all blockchain operations
- **Type Safety**: Comprehensive TypeScript typing throughout
- **Error Handling**: Centralized error parsing with user-friendly messages
- **State Management**: Zustand for efficient global state management

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, or **pnpm** package manager
- **MetaMask** or another Web3 wallet browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/web3-dapp-starter.git
   cd web3-dapp-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # WalletConnect Project ID (Get from: https://cloud.walletconnect.com)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   
   # Optional: Alchemy or Infura API Keys for better RPC reliability
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
   NEXT_PUBLIC_INFURA_API_KEY=your_infura_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Connect your wallet**
   
   Click "Connect Wallet" and select your preferred wallet provider.

## 📖 Documentation

### Core Concepts

#### Custom Hooks

The application uses custom hooks to abstract Web3 logic:

- **`useWallet`**: Manages wallet connection, disconnection, and network switching
- **`useTokenBalance`**: Fetches native and ERC-20 token balances
- **`useContractWrite`**: Executes contract write operations with transaction tracking
- **`useEventListener`**: Listens to contract events in real-time
- **`useGasEstimation`**: Estimates gas costs for transactions
- **`useNFTPortfolio`**: Manages NFT collections and metadata

#### Component Structure

```
components/
├── web3/              # Web3-specific components
│   ├── WalletConnect.tsx       # Wallet connection UI
│   ├── AccountInfo.tsx         # Account details display
│   ├── TokenBalances.tsx       # Token balance list
│   ├── TransferForm.tsx        # Token transfer form
│   ├── CounterContract.tsx     # Smart contract demo
│   ├── NetworkSwitcher.tsx     # Network selection
│   └── GasTracker.tsx          # Gas price display
├── ui/                # shadcn/ui components
└── layout/            # Layout components
```

#### Project Structure

```
web3-dapp-starter/
├── components/         # React components
├── hooks/             # Custom React hooks
│   └── web3/          # Web3-specific hooks
├── contracts/         # Contract ABIs and addresses
│   └── abis/          # Contract ABI definitions
├── lib/               # Utilities and configuration
│   ├── web3/          # Web3 configuration
│   ├── utils/         # Helper functions
│   └── constants/     # App constants
├── store/             # State management (Zustand)
├── types/             # TypeScript type definitions
├── utils/             # General utilities
└── styles/            # Global styles and Tailwind config
```

### Examples

#### Reading from a Contract

```typescript
import { useReadContract } from 'wagmi'
import { COUNTER_ABI, COUNTER_ADDRESS } from '@/contracts/abis/Counter'

function MyComponent() {
  const { data: counterValue, isLoading } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    functionName: 'getValue',
  })

  return <div>Counter: {counterValue?.toString()}</div>
}
```

#### Writing to a Contract

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { COUNTER_ABI, COUNTER_ADDRESS } from '@/contracts/abis/Counter'

function MyComponent() {
  const { writeContractAsync, data: hash } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleIncrement = async () => {
    await writeContractAsync({
      address: COUNTER_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'increment',
    })
  }

  return (
    <button onClick={handleIncrement} disabled={isConfirming}>
      Increment Counter
    </button>
  )
}
```

#### Watching Contract Events

```typescript
import { useWatchContractEvent } from 'wagmi'
import { COUNTER_ABI, COUNTER_ADDRESS } from '@/contracts/abis/Counter'

function MyComponent() {
  useWatchContractEvent({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    eventName: 'Incremented',
    onLogs(logs) {
      logs.forEach((log) => {
        console.log('Counter incremented!', log.args)
      })
    },
  })

  return <div>Listening for events...</div>
}
```

## 🛠️ Tech Stack

### Core

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Wagmi v2](https://wagmi.sh/)** - React hooks for Ethereum
- **[Viem](https://viem.sh/)** - TypeScript interface for Ethereum

### Web3 Libraries

- **[WalletConnect](https://walletconnect.com/)** - Multi-wallet connectivity
- **[MetaMask SDK](https://docs.metamask.io/sdk/)** - MetaMask integration
- **[Coinbase Wallet SDK](https://www.coinbase.com/wallet)** - Coinbase Wallet support

### UI Components

- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### State Management

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TanStack Query](https://tanstack.com/query)** - Data fetching (via Wagmi)

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Multi-wallet connectivity
- [x] Multi-chain support
- [x] Token balance tracking
- [x] Token transfer functionality
- [x] Smart contract interactions
- [x] Event listening and notifications
- [x] Gas price tracking
- [x] Network switching

### Phase 2: Advanced Features 🚧
- [ ] NFT portfolio display
- [ ] NFT minting interface
- [ ] Token swap integration (Uniswap/1inch)
- [ ] Transaction history with filtering
- [ ] Advanced gas estimation (EIP-1559)
- [ ] ENS domain resolution
- [ ] Multi-signature wallet support

### Phase 3: DeFi Integration 📋
- [ ] Staking interface
- [ ] Liquidity pool management
- [ ] Yield farming dashboard
- [ ] Lending/borrowing protocols
- [ ] DAO governance participation
- [ ] Portfolio analytics

### Phase 4: Enhanced UX 📋
- [ ] PWA support for mobile
- [ ] Offline transaction queueing
- [ ] Transaction simulation (Tenderly)
- [ ] Batch transactions
- [ ] Custom token import
- [ ] Address book management
- [ ] QR code scanning for addresses

### Phase 5: Developer Tools 📋
- [ ] Contract deployment interface
- [ ] ABI import tool
- [ ] Testing utilities
- [ ] Mock data generators
- [ ] Comprehensive test suite
- [ ] CI/CD pipeline
- [ ] Docker support

### Development Guidelines

1. **Code Style**: Follow the existing code style and use Prettier for formatting
2. **TypeScript**: Maintain strict type safety throughout
3. **Commits**: Use conventional commit messages
4. **Testing**: Add tests for new features
5. **Documentation**: Update documentation for significant changes

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **[Wagmi Team](https://wagmi.sh/)** - For the excellent React hooks library
- **[shadcn](https://twitter.com/shadcn)** - For the beautiful UI components
- **[Vitalik Buterin](https://twitter.com/VitalikButerin)** - For creating Ethereum
- **[Next.js Team](https://nextjs.org/)** - For the amazing React framework

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features]
- **Email**: vahdatfardin@example.com

## 🔗 Useful Links

- **[Live Demo](https://your-demo-url.vercel.app)**
- **[Documentation](./docs/)**
- **[Architecture Guide](./docs/ARCHITECTURE.md)**
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)**

---

**⭐ If you find this project helpful, please consider giving it a star!**

**Built with ❤️ by [Your Name](https://github.com/fardinvahdat)**
