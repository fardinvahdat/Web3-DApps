/**
 * Clipboard Utilities
 * 
 * Cross-browser clipboard functions with fallbacks
 */

/**
 * Copy text to clipboard with fallback for environments where Clipboard API is blocked
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (err) {
      console.warn('Clipboard API failed, using fallback:', err)
    }
  }

  // Fallback method using textarea
  return new Promise((resolve, reject) => {
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      
      // Make the textarea invisible but still functional
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.setAttribute('readonly', '')
      
      document.body.appendChild(textArea)
      
      // Select and copy
      textArea.focus()
      textArea.select()
      
      // For iOS compatibility
      textArea.setSelectionRange(0, 99999)
      
      const successful = document.execCommand('copy')
      
      // Clean up
      document.body.removeChild(textArea)
      
      if (successful) {
        resolve()
      } else {
        reject(new Error('Copy command failed'))
      }
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Check if clipboard is available
 * @returns True if clipboard write is available
 */
export function isClipboardAvailable(): boolean {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    document.queryCommandSupported?.('copy')
  )
}
