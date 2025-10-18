/**
 * Window type declarations for wallet detection
 */

interface EthereumProvider {
  isMetaMask?: boolean
  isCoinbaseWallet?: boolean
  isBraveWallet?: boolean
  isTrust?: boolean
  isRabby?: boolean
  request?: (args: { method: string; params?: any[] }) => Promise<any>
  on?: (event: string, handler: (...args: any[]) => void) => void
  removeListener?: (event: string, handler: (...args: any[]) => void) => void
}

interface Window {
  ethereum?: EthereumProvider
}
