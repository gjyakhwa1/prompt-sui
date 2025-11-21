import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { SealClient } from "@mysten/seal";
import { PACKAGE_ID, MARKETPLACE_OBJECT_ID } from "@/constants";
import { encryptData } from "@/utils/seal/encrypt";

// SEAL Key Server List for Testnet
const KEY_SERVER_LIST_TESTNET = [
  "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75",
  "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8",
];

export interface ListPromptParams {
  title: string;
  description: string;
  price: number; // in SUI (will be converted to MIST)
  inputSample: string;
  outputSample: string;
  category: number; // 0 for text, 1 for image
  promptContent: string; // The actual prompt to encrypt
}

export interface ListPromptResult {
  promptId: string;
  encryptedData: Uint8Array;
  digest: string;
}

export class MarketplaceService {
  private suiClient: SuiClient;
  private sealClient: SealClient;

  constructor(suiClient: SuiClient) {
    this.suiClient = suiClient;
    
    // Initialize SEAL client with testnet key servers
    this.sealClient = new SealClient({
      suiClient: this.suiClient,
      serverConfigs: KEY_SERVER_LIST_TESTNET.map((id: string) => ({
        objectId: id,
        weight: 1,
      })),
      verifyKeyServers: true,
    });
  }

  /**
   * Lists a prompt on the marketplace with encryption
   * This handles all 3 steps:
   * 1. Create prompt on-chain
   * 2. Encrypt the prompt content
   * 3. Update the prompt with encrypted data
   */
  async listPrompt(
    params: ListPromptParams,
    signAndExecute: (tx: Transaction) => Promise<{
      digest: string;
      objectChanges?: Array<{
        type: string;
        objectId?: string;
      }>;
    }>
  ): Promise<ListPromptResult> {
    try {
      // Step 1: Create prompt on-chain
      console.log("📝 Step 1: Creating prompt on-chain...");
      
      const createPromptTx = new Transaction();
      
      // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
      const priceInMist = Math.floor(params.price * 1_000_000_000);
      
      createPromptTx.moveCall({
        target: `${PACKAGE_ID}::marketplace::list_prompt` as `${string}::${string}::${string}`,
        arguments: [
          createPromptTx.object(MARKETPLACE_OBJECT_ID),
          createPromptTx.pure.u64(priceInMist),
          createPromptTx.pure.string(params.title),
          createPromptTx.pure.string(params.description),
          createPromptTx.pure.string(params.inputSample),
          createPromptTx.pure.string(params.outputSample),
          createPromptTx.pure.u8(params.category),
        ],
      });

      const createResult = await signAndExecute(createPromptTx);

      // Wait for transaction to be confirmed and fetch full details
      const txResponse = await this.suiClient.waitForTransaction({
        digest: createResult.digest,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      console.log("✅ Prompt created on-chain");
      console.log("Transaction digest:", createResult.digest);
      console.log("Object changes:", txResponse.objectChanges);

      // Extract prompt ID from created objects
      const createdObjects = txResponse.objectChanges?.filter(
        (obj) => obj.type === "created"
      );
      
      console.log("Created objects:", createdObjects);
      
      const promptId = createdObjects?.[0]?.objectId;

      if (!promptId) {
        console.error("Full transaction response:", JSON.stringify(txResponse, null, 2));
        throw new Error("Failed to get prompt ID from transaction. Check console for details.");
      }

      console.log("📦 Prompt ID:", promptId);

      // Step 2: Encrypt the prompt content
      console.log("🔐 Step 2: Encrypting prompt content...");
      
      const promptBytes = new TextEncoder().encode(params.promptContent);
      const encryptedData = await encryptData(
        PACKAGE_ID,
        this.sealClient,
        promptId,
        promptBytes
      );
      
      console.log("✅ Prompt encrypted, size:", encryptedData.length, "bytes");

      // Step 3: Update prompt with encrypted data
      console.log("📤 Step 3: Storing encrypted data on-chain...");
      
      const updateTx = new Transaction();
      updateTx.moveCall({
        target: `${PACKAGE_ID}::marketplace::update_encrypted_data` as `${string}::${string}::${string}`,
        arguments: [
          updateTx.object(promptId),
          updateTx.pure.vector("u8", Array.from(encryptedData)),
        ],
      });

      const updateResult = await signAndExecute(updateTx);

      await this.suiClient.waitForTransaction({
        digest: updateResult.digest,
      });

      console.log("✅ Encrypted data stored on-chain");

      return {
        promptId,
        encryptedData,
        digest: updateResult.digest,
      };
    } catch (error) {
      console.error("❌ Error listing prompt:", error);
      throw error;
    }
  }

  /**
   * Fetches all prompts from the marketplace
   */
  async getAllPrompts(): Promise<unknown[]> {
    try {
      const marketplace = await this.suiClient.getObject({
        id: MARKETPLACE_OBJECT_ID,
        options: {
          showContent: true,
        },
      });

      // Extract prompt IDs from marketplace
      const content = marketplace.data?.content as Record<string, unknown>;
      const fields = content?.fields as Record<string, unknown>;
      const promptIds = (fields?.prompts as string[]) || [];

      // Fetch details for each prompt
      const prompts = await Promise.all(
        promptIds.map(async (id: string) => {
          const prompt = await this.suiClient.getObject({
            id,
            options: {
              showContent: true,
            },
          });
          return prompt.data;
        })
      );

      return prompts;
    } catch (error) {
      console.error("Error fetching prompts:", error);
      throw error;
    }
  }

  /**
   * Fetches a single prompt by ID
   */
  async getPrompt(promptId: string): Promise<unknown> {
    try {
      const prompt = await this.suiClient.getObject({
        id: promptId,
        options: {
          showContent: true,
        },
      });

      return prompt.data;
    } catch (error) {
      console.error("Error fetching prompt:", error);
      throw error;
    }
  }
}
