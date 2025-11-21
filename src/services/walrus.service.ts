/**
 * Walrus Storage Service
 * Handles file uploads to Walrus decentralized storage
 */

// Walrus configuration - these should be moved to .env in production
const WALRUS_PUBLISHER = import.meta.env.VITE_WALRUS_PUBLISHER || "publisher.walrus-testnet.walrus.space"
const WALRUS_AGGREGATOR = import.meta.env.VITE_WALRUS_AGGREGATOR || "aggregator.walrus-testnet.walrus.space"
const WALRUS_EPOCHS = import.meta.env.VITE_WALRUS_EPOCHS || "5"

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
  try {
    // Convert file to bytes
    const fileData = await file.arrayBuffer()
    
    // Upload to Walrus
    const storeUrl = `https://${WALRUS_PUBLISHER}/v1/store?epochs=${WALRUS_EPOCHS}`
    
    const response = await fetch(storeUrl, {
      method: 'PUT',
      body: fileData,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    })

    if (!response.ok) {
      throw new Error(`Walrus upload failed with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Extract blob ID from response
    const blobId = data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId
    
    if (!blobId) {
      throw new Error('No blob ID returned from Walrus')
    }

    const walrusUrl = `https://${WALRUS_AGGREGATOR}/v1/${blobId}`

    return {
      blob_id: blobId,
      url: walrusUrl,
      storage: 'walrus',
    }
  } catch (error) {
    console.error('Walrus upload failed:', error)
    throw error
  }
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
    const url = `https://${WALRUS_AGGREGATOR}/v1/${blobId}`
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.error('Error checking blob existence:', error)
    return false
  }
}
