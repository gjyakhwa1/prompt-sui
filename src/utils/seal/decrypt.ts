import { SealClient, SessionKey, EncryptedObject } from "@mysten/seal";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex } from "@mysten/sui/utils";

export interface DecryptParams {
  packageId: string;
  sealClient: SealClient;
  suiClient: SuiClient;
  promptId: string;
  encryptedBytes: Uint8Array;
  userAddress: string;
  signPersonalMessage: (message: { message: Uint8Array }) => Promise<{ signature: string }>;
}

/**
 * Decrypts data using SEAL encryption
 * @param params - Decryption parameters
 * @returns The decrypted data as Uint8Array
 */
export async function decryptData(params: DecryptParams): Promise<Uint8Array> {
  const {
    packageId,
    sealClient,
    suiClient,
    promptId,
    encryptedBytes,
    userAddress,
    signPersonalMessage,
  } = params;

  // Step 1: Create session key
  console.log("🔑 Creating session key...");
  const sessionKey = await SessionKey.create({
    address: userAddress,
    suiClient,
    ttlMin: 30,
    packageId,
  });

  // Step 2: Get personal message and sign it
  console.log("✍️ Requesting signature...");
  const personalMessage = sessionKey.getPersonalMessage();
  const messageBytes = new TextEncoder().encode(personalMessage);

  const { signature } = await signPersonalMessage({
    message: messageBytes,
  });

  // Step 3: Attach signature to session key
  sessionKey.setPersonalMessageSignature(signature);

  // Step 4: Parse encrypted object
  const encryptedObject = EncryptedObject.parse(encryptedBytes);

  // Step 5: Build approval transaction
  console.log("📝 Building approval transaction...");
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::marketplace::seal_approve` as `${string}::${string}::${string}`,
    arguments: [
      tx.pure.vector("u8", Array.from(fromHex(encryptedObject.id))),
      tx.object(promptId),
    ],
  });

  const txBytes = await tx.build({
    client: suiClient,
    onlyTransactionKind: true,
  });

  // Step 6: Fetch decryption keys from SEAL servers
  console.log("🔓 Fetching decryption keys...");
  await sealClient.fetchKeys({
    ids: [encryptedObject.id],
    txBytes,
    sessionKey,
    threshold: encryptedObject.threshold,
  });

  // Step 7: Decrypt the data
  console.log("🔐 Decrypting prompt...");
  const decrypted = await sealClient.decrypt({
    data: encryptedBytes,
    sessionKey,
    txBytes,
    checkShareConsistency: true,
  });

  console.log("✅ Decryption successful!");
  return decrypted;
}
