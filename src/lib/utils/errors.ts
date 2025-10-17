/**
 * Error Handling Utilities
 * 
 * Centralized error handling with user-friendly messages
 */

/**
 * Web3 error types
 */
export enum Web3ErrorType {
  USER_REJECTED = 'USER_REJECTED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Custom Web3 Error class
 */
export class Web3Error extends Error {
  type: Web3ErrorType
  originalError?: Error

  constructor(type: Web3ErrorType, message: string, originalError?: Error) {
    super(message)
    this.name = 'Web3Error'
    this.type = type
    this.originalError = originalError
  }
}

/**
 * Parse error and return user-friendly message
 * @param error - Error object
 * @returns User-friendly error message
 */
export function parseWeb3Error(error: unknown): string {
  if (!error) return 'An unknown error occurred'

  // Handle string errors
  if (typeof error === 'string') return error

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // User rejected transaction
    if (
      message.includes('user rejected') ||
      message.includes('user denied') ||
      message.includes('user cancelled')
    ) {
      return 'Transaction was rejected by user'
    }

    // Insufficient funds
    if (
      message.includes('insufficient funds') ||
      message.includes('insufficient balance')
    ) {
      return 'Insufficient funds for this transaction'
    }

    // Network errors
    if (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('fetch')
    ) {
      return 'Network error. Please check your connection and try again'
    }

    // Contract errors
    if (message.includes('revert') || message.includes('execution reverted')) {
      // Try to extract revert reason
      const revertMatch = message.match(/reason="([^"]+)"/)
      if (revertMatch) {
        return `Contract error: ${revertMatch[1]}`
      }
      return 'Transaction reverted. Please check contract conditions'
    }

    // Gas errors
    if (message.includes('gas')) {
      return 'Transaction may fail or exceed gas limit. Try adjusting gas settings'
    }

    // Invalid address
    if (message.includes('invalid address')) {
      return 'Invalid address provided'
    }

    // Nonce errors
    if (message.includes('nonce')) {
      return 'Transaction nonce error. Please try again'
    }

    return error.message
  }

  return 'An unexpected error occurred'
}

/**
 * Create a Web3Error from unknown error
 * @param error - Unknown error
 * @returns Web3Error instance
 */
export function createWeb3Error(error: unknown): Web3Error {
  const message = parseWeb3Error(error)
  let type = Web3ErrorType.UNKNOWN_ERROR

  if (message.includes('rejected')) {
    type = Web3ErrorType.USER_REJECTED
  } else if (message.includes('insufficient')) {
    type = Web3ErrorType.INSUFFICIENT_FUNDS
  } else if (message.includes('network')) {
    type = Web3ErrorType.NETWORK_ERROR
  } else if (message.includes('contract') || message.includes('revert')) {
    type = Web3ErrorType.CONTRACT_ERROR
  } else if (message.includes('invalid address')) {
    type = Web3ErrorType.INVALID_ADDRESS
  } else if (message.includes('failed')) {
    type = Web3ErrorType.TRANSACTION_FAILED
  }

  return new Web3Error(
    type,
    message,
    error instanceof Error ? error : undefined
  )
}

/**
 * Log error to console in development
 * @param error - Error to log
 * @param context - Context where error occurred
 */
export function logError(error: unknown, context?: string): void {
  const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'
  if (isDevelopment) {
    console.error(`[${context || 'Error'}]:`, error)
  }
}

/**
 * Handle error with toast notification
 * @param error - Error to handle
 * @param toast - Toast function
 * @param context - Context for logging
 */
export function handleError(
  error: unknown,
  toast: (message: string) => void,
  context?: string
): void {
  logError(error, context)
  const message = parseWeb3Error(error)
  toast(message)
}
