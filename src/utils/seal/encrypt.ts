import { SealClient } from "@mysten/seal";

// Polyfill for crypto.randomUUID if not available
function randomUUIDFallback(): `${string}-${string}-${string}-${string}-${string}` {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }) as `${string}-${string}-${string}-${string}-${string}`;
}

/**
 * Encrypts data using SEAL encryption
 * @param packageId - The package ID for the SEAL contract
 * @param sealClient - Instance of SealClient
 * @param promptId - The prompt ID to associate with the encrypted data
 * @param data - The data to encrypt as Uint8Array
 * @returns The encrypted data as Uint8Array
 */
export async function encryptData(
  packageId: string,
  sealClient: SealClient,
  promptId: string,
  data: Uint8Array
): Promise<Uint8Array> {
  // Ensure crypto.randomUUID is available
  if (!globalThis.crypto.randomUUID) {
    globalThis.crypto.randomUUID = randomUUIDFallback;
  }

  const { encryptedObject } = await sealClient.encrypt({
    threshold: 2,
    packageId,
    id: promptId,
    demType: 1,
    kemType: 0,
    data,
  });
  
  return encryptedObject;
}
