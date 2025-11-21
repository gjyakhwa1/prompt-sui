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
  async getAllPrompts(): Promise<PromptListing[]> {
    try {
      console.log("📦 Fetching marketplace data...");

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

      console.log(`📦 Found ${promptIds.length} prompts in marketplace`);

      if (promptIds.length === 0) {
        return [];
      }

      // Fetch details for each prompt
      const prompts = await Promise.all(
        promptIds.map(async (id: string) => {
          try {
            const prompt = await this.suiClient.getObject({
              id,
              options: {
                showContent: true,
              },
            });

            const promptContent = prompt.data?.content as Record<string, unknown>;
            const promptFields = promptContent?.fields as Record<string, unknown>;

            if (!promptFields) {
              console.warn(`⚠️ No fields found for prompt ${id}`);
              return null;
            }

            const idField = promptFields?.id as Record<string, unknown>;

            // Debug: Log raw field values
            console.log(`🔍 Raw fields for prompt ${id}:`, {
              owner: promptFields?.owner,
              buyers: promptFields?.buyers,
              allowlist: promptFields?.allowlist,
            });

            const promptData = {
              id: (idField?.id as string) || id,
              owner: (promptFields?.owner as string) || "",
              title: (promptFields?.title as string) || "",
              description: (promptFields?.description as string) || "",
              price: parseInt((promptFields?.price as string) || "0") / 1_000_000_000, // Convert MIST to SUI
              inputSample: (promptFields?.input_sample as string) || "",
              outputSample: (promptFields?.output_sample as string) || "",
              category: (promptFields?.category as number) || 0, // 0=text, 1=image
              encryptedData: (promptFields?.encrypted_data as number[]) || [],
              buyers: (promptFields?.buyers as string[]) || [],
              allowlist: (promptFields?.allowlist as string[]) || [],
            };

            console.log(`📋 Prompt ${id} parsed data:`, {
              title: promptData.title,
              owner: promptData.owner,
              category: promptData.category,
              outputSample: promptData.outputSample,
              buyers: promptData.buyers,
              allowlist: promptData.allowlist,
              isWalrusBlobId: !promptData.outputSample.startsWith('http'),
            });

            return promptData;
          } catch (error) {
            console.error(`Error fetching prompt ${id}:`, error);
            return null;
          }
        })
      );

      // Filter out null values
      const validPrompts = prompts.filter((p): p is PromptListing => p !== null);

      console.log(`✅ Successfully fetched ${validPrompts.length} prompts`);

      return validPrompts;
    } catch (error) {
      console.error("❌ Error fetching prompts:", error);
      throw error;
    }
  }

  /**
   * Fetches a single prompt by ID
   */
  async getPrompt(promptId: string): Promise<PromptListing | null> {
    try {
      console.log("🔍 [MarketplaceService] Fetching prompt:", promptId);
      
      const prompt = await this.suiClient.getObject({
        id: promptId,
        options: {
          showContent: true,
        },
      });

      console.log("📦 [MarketplaceService] Raw prompt data:", JSON.stringify(prompt, null, 2));

      const promptContent = prompt.data?.content as Record<string, unknown>;
      const promptFields = promptContent?.fields as Record<string, unknown>;

      if (!promptFields) {
        console.error("❌ [MarketplaceService] No fields found in prompt data");
        return null;
      }

      console.log("📋 [MarketplaceService] Prompt fields:", JSON.stringify(promptFields, null, 2));

      const idField = promptFields?.id as Record<string, unknown>;
      const buyersRaw = promptFields?.buyers;
      
      console.log("👥 [MarketplaceService] Raw buyers field:", buyersRaw);
      console.log("👥 [MarketplaceService] Buyers type:", typeof buyersRaw);
      console.log("👥 [MarketplaceService] Buyers is array?", Array.isArray(buyersRaw));

      const promptListing = {
        id: (idField?.id as string) || promptId,
        owner: (promptFields?.owner as string) || "",
        title: (promptFields?.title as string) || "",
        description: (promptFields?.description as string) || "",
        price: parseInt((promptFields?.price as string) || "0") / 1_000_000_000,
        inputSample: (promptFields?.input_sample as string) || "",
        outputSample: (promptFields?.output_sample as string) || "",
        category: (promptFields?.category as number) || 0,
        encryptedData: (promptFields?.encrypted_data as number[]) || [],
        buyers: (promptFields?.buyers as string[]) || [],
        allowlist: (promptFields?.allowlist as string[]) || [],
      };

      console.log("✅ [MarketplaceService] Parsed prompt listing:");
      console.log("  - ID:", promptListing.id);
      console.log("  - Title:", promptListing.title);
      console.log("  - Owner:", promptListing.owner);
      console.log("  - Buyers:", promptListing.buyers);
      console.log("  - Buyers length:", promptListing.buyers.length);
      console.log("  - Allowlist:", promptListing.allowlist);
      console.log("  - Allowlist length:", promptListing.allowlist?.length || 0);
      
      // Check if allowlist and buyers are the same or different
      if (promptListing.allowlist && promptListing.allowlist.length > 0) {
        console.log("📋 [MarketplaceService] Allowlist vs Buyers comparison:");
        console.log("  - Allowlist has entries that buyers doesn't:", 
          promptListing.allowlist.filter(a => !promptListing.buyers.includes(a)));
        console.log("  - Buyers has entries that allowlist doesn't:", 
          promptListing.buyers.filter(b => !promptListing.allowlist.includes(b)));
      }

      return promptListing;
    } catch (error) {
      console.error("❌ [MarketplaceService] Error fetching prompt:", error);
      throw error;
    }
  }

  /**
   * Get the display format for output sample based on category
   */
  getOutputDisplay(prompt: PromptListing): { type: 'text' | 'image', value: string } {
    if (prompt.category === 1) {
      // Image - outputSample can be either a blob_id or a full URL
      const outputSample = prompt.outputSample;

      console.log(`🖼️ Processing image output for "${prompt.title}":`, {
        outputSample,
        isFullUrl: outputSample.startsWith('http://') || outputSample.startsWith('https://'),
      });

      // Check if it's already a full URL (starts with http:// or https://)
      if (outputSample.startsWith('http://') || outputSample.startsWith('https://')) {
        console.log(`  ✅ Using full URL as-is: ${outputSample}`);
        return {
          type: 'image',
          value: outputSample
        };
      }

      // Otherwise, it's a blob_id - construct Walrus URL
      const walrusUrl = `https://aggregator.walrus-testnet.walrus.space/v1/${outputSample}`;
      console.log(`  ✅ Constructed Walrus URL: ${walrusUrl}`);
      return {
        type: 'image',
        value: walrusUrl
      };
    } else {
      // Text - outputSample is the actual text
      return {
        type: 'text',
        value: prompt.outputSample
      };
    }
  }

  /**
   * Buys a prompt by paying the specified price
   */
  async buyPrompt(
    promptId: string,
    price: number,
    signAndExecute: (tx: Transaction) => Promise<{
      digest: string;
    }>
  ): Promise<{ success: boolean; digest: string }> {
    try {
      console.log("💰 [MarketplaceService] Starting purchase...");
      console.log("  - Prompt ID:", promptId);
      console.log("  - Price:", price, "SUI");

      const buyTx = new Transaction();

      // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
      const priceInMist = Math.floor(price * 1_000_000_000);
      console.log("  - Price in MIST:", priceInMist);

      // Split coins for payment
      const [coin] = buyTx.splitCoins(buyTx.gas, [priceInMist]);

      // Call buy_prompt function
      buyTx.moveCall({
        target: `${PACKAGE_ID}::marketplace::purchase_access` as `${string}::${string}::${string}`,
        arguments: [
          buyTx.object(promptId),
          coin,
        ],
      });

      console.log("📝 [MarketplaceService] Transaction built, waiting for signature...");
      const result = await signAndExecute(buyTx);
      console.log("✅ [MarketplaceService] Transaction signed, digest:", result.digest);

      console.log("⏳ [MarketplaceService] Waiting for transaction confirmation...");
      const txResult = await this.suiClient.waitForTransaction({
        digest: result.digest,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      console.log("✅ [MarketplaceService] Transaction confirmed!");
      console.log("📦 [MarketplaceService] Transaction result:", JSON.stringify(txResult, null, 2));

      // Fetch updated prompt to verify buyer was added
      console.log("🔍 [MarketplaceService] Fetching updated prompt to verify purchase...");
      const updatedPrompt = await this.getPrompt(promptId);
      if (updatedPrompt) {
        console.log("👥 [MarketplaceService] Updated buyers list:", updatedPrompt.buyers);
      }

      return {
        success: true,
        digest: result.digest,
      };
    } catch (error) {
      console.error("❌ [MarketplaceService] Error buying prompt:", error);
      throw error;
    }
  }

  /**
   * Decrypts a prompt that the user has purchased
   */
  async decryptPrompt(
    promptId: string,
    userAddress: string,
    signPersonalMessage: (message: { message: Uint8Array }) => Promise<{ signature: string }>
  ): Promise<string> {
    try {
      console.log("🔐 Starting decryption for prompt:", promptId);

      // Step 1: Fetch the prompt to get encrypted data
      const prompt = await this.getPrompt(promptId);

      if (!prompt) {
        throw new Error("Prompt not found");
      }

      if (!prompt.encryptedData || prompt.encryptedData.length === 0) {
        throw new Error("No encrypted data found for this prompt");
      }


      // Step 3: Convert encrypted data array to Uint8Array
      const encryptedBytes = new Uint8Array(prompt.encryptedData);
      // Step 4: Decrypt using SEAL
      const { decryptData } = await import("@/utils/seal/decrypt");

      const decryptedBytes = await decryptData({
        packageId: PACKAGE_ID,
        sealClient: this.sealClient,
        suiClient: this.suiClient,
        promptId,
        encryptedBytes,
        userAddress,
        signPersonalMessage,
      });

      // Step 5: Convert decrypted bytes to string
      const decryptedText = new TextDecoder().decode(decryptedBytes);

      console.log("✅ Prompt decrypted successfully");

      return decryptedText;
    } catch (error) {
      console.error("❌ Error decrypting prompt:", error);
      throw error;
    }
  }
}

export interface PromptListing {
  id: string;
  owner: string;
  title: string;
  description: string;
  price: number; // in SUI
  inputSample: string;
  outputSample: string; // text or blob_id
  category: number; // 0=text, 1=image
  encryptedData: number[];
  buyers: string[];
  allowlist: string[];
}
