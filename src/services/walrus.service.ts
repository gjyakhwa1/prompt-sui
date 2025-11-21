/**
 * Walrus Storage Service
 * Handles file uploads to Walrus decentralized storage
 */

// Walrus configuration - these should be moved to .env in production
const WALRUS_PUBLISHER = import.meta.env.VITE_WALRUS_PUBLISHER || "walrus-testnet-publisher.nodes.guru"
const WALRUS_AGGREGATOR = import.meta.env.VITE_WALRUS_AGGREGATOR || "walrus-testnet-aggregator.nodes.guru"
const WALRUS_EPOCHS = import.meta.env.VITE_WALRUS_EPOCHS || "5"

// Fallback publishers to try if primary fails
const FALLBACK_PUBLISHERS = [
  "publisher.walrus-testnet.walrus.space",
  "walrus-testnet-publisher.nodes.guru",
  "publisher-devnet.walrus.space",
]

interface WalrusUploadResponse {
  blob_id: string
  url: string
  storage: string
}

/**
 * Upload a file to Walrus storage
 * @param file - The file to upload
 * @returns Object with blob_id, url, and storage type
 */
export async function uploadToWalrus(file: File): Promise<WalrusUploadResponse> {
  // Convert file to bytes
  const fileData = await file.arrayBuffer()

  // Try primary publisher first, then fallbacks
  const publishersToTry = [WALRUS_PUBLISHER, ...FALLBACK_PUBLISHERS]

  let lastError: Error | null = null

  for (const publisher of publishersToTry) {
    try {
      // Use /v1/blobs endpoint (correct Walrus API path)
      const storeUrl = `https://${publisher}/v1/blobs?epochs=${WALRUS_EPOCHS}`

      console.log('Trying Walrus publisher:', publisher)

      const response = await fetch(storeUrl, {
        method: 'PUT',
        body: fileData,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      })

      console.log('Walrus response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Walrus error response:', errorText)
        throw new Error(`Status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('Walrus upload response:', data)

      // Extract blob ID from response
      const blobId = data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId

      if (!blobId) {
        throw new Error('No blob ID returned from Walrus')
      }

      // Use /v1/blobs/ path for aggregator
      const walrusUrl = `https://${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`

      console.log('✅ Successfully uploaded to Walrus:', blobId)

      return {
        blob_id: blobId,
        url: walrusUrl,
        storage: 'walrus',
      }
    } catch (error) {
      console.warn(`Failed to upload to ${publisher}:`, error)
      lastError = error as Error
      // Continue to next publisher
    }
  }

  // If all publishers failed
  console.error('All Walrus publishers failed. Last error:', lastError)
  throw new Error(`Walrus upload failed: ${lastError?.message || 'Unknown error'}`)
}

/**
 * Upload multiple files to Walrus storage
 * @param files - Array of files to upload
 * @returns Array of upload responses
 */
export async function uploadMultipleToWalrus(files: File[]): Promise<WalrusUploadResponse[]> {
  const uploadPromises = files.map(file => uploadToWalrus(file))
  return Promise.all(uploadPromises)
}

/**
 * Check if a blob exists in Walrus storage
 * @param blobId - The blob ID to check
 * @returns Boolean indicating if blob exists
 */
export async function checkBlobExists(blobId: string): Promise<boolean> {
  try {
    const url = `https://${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.error('Error checking blob existence:', error)
    return false
  }
}
