/**
 * Counter Contract ABI
 * 
 * Smart contract for incrementing and decrementing a counter value
 */

export const COUNTER_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "Decreament",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "Increament",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "decreament",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getValue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increament",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

/**
 * Counter contract address
 * TODO: Move to environment variables
 */
export const COUNTER_ADDRESS = '0xE1154A98ca967d28B505D8DF29ebCE3dcB6B7BEe' as const
