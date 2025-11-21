import { useState, useEffect, useCallback } from "react";
import { SuiClient } from "@mysten/sui/client";
import { MarketplaceService } from "@/services/marketplace.service";
import type { PromptListing } from "@/services/marketplace.service";

interface PromptData {
  id: string;
  title: string;
  category: string;
  sales?: number;
  revenue?: string;
  status?: string;
  image?: string;
  price?: number | string;
  description?: string;
  author?: string;
  date?: string;
  isDefault?: boolean;
}

interface DashboardData {
  uploadedPrompts: PromptData[];
  purchasedPrompts: PromptData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch dashboard data from Sui blockchain
 * Fetches user's uploaded and purchased prompts from smart contracts
 * 
 * Ownership rules:
 * - User OWNS a prompt if:
 *   1. Their address matches the owner field, OR
 *   2. Their address is in FIRST place in allowlist (if allowlist is used)
 * - User has PURCHASED a prompt if:
 *   1. Their address is in the buyers list, OR
 *   2. Their address is in allowlist (but not first position)
 */
export const useDashboardData = (userAddress: string | undefined): DashboardData => {
  const [uploadedPrompts, setUploadedPrompts] = useState<PromptData[]>([]);
  const [purchasedPrompts, setPurchasedPrompts] = useState<PromptData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!userAddress) {
      console.log("No userAddress provided, skipping dashboard data fetch");
      setUploadedPrompts([]);
      setPurchasedPrompts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching dashboard data for address:", userAddress);

      // Initialize Sui client and marketplace service
      const suiClient = new SuiClient({
        url: import.meta.env.VITE_SUI_NETWORK_URL || "https://fullnode.testnet.sui.io:443",
      });
      const marketplaceService = new MarketplaceService(suiClient);

      // Fetch all prompts from marketplace
      const allPrompts = await marketplaceService.getAllPrompts();
      console.log(`📦 Fetched ${allPrompts.length} total prompts from marketplace`);

      // Separate prompts into owned and purchased
      const owned: PromptData[] = [];
      const purchased: PromptData[] = [];

      allPrompts.forEach((prompt: PromptListing) => {
        const allowlist = prompt.allowlist || [];
        const buyers = prompt.buyers || [];
        
        // User owns the prompt if:
        // 1. Their address matches the owner field, OR
        // 2. Their address is FIRST in allowlist (if allowlist is populated)
        const isOwnerByField = prompt.owner === userAddress;
        const isOwnerByAllowlist = allowlist.length > 0 && allowlist[0] === userAddress;
        const isOwner = isOwnerByField || isOwnerByAllowlist;
        
        // User has purchased if:
        // 1. Their address is in the buyers list, OR
        // 2. Their address is in allowlist (but not first position)
        const hasPurchasedByBuyers = buyers.includes(userAddress);
        const hasPurchasedByAllowlist = allowlist.includes(userAddress) && !isOwnerByAllowlist;
        const hasPurchased = (hasPurchasedByBuyers || hasPurchasedByAllowlist) && !isOwner;

        console.log(`📋 Prompt "${prompt.title}" (${prompt.id}):`, {
          owner: prompt.owner,
          allowlist,
          buyers,
          isOwner,
          hasPurchased,
          userAddress,
        });

        if (isOwner) {
          // Transform to owned prompt format
          const outputDisplay = marketplaceService.getOutputDisplay(prompt);
          
          // Calculate sales from buyers list or allowlist (excluding owner)
          const salesCount = buyers.length || (allowlist.length > 0 ? allowlist.length - 1 : 0);
          
          owned.push({
            id: prompt.id,
            title: prompt.title,
            category: prompt.category === 0 ? "Text" : "Image",
            sales: salesCount,
            revenue: `${(salesCount * prompt.price).toFixed(2)} SUI`,
            status: "Active",
            image: outputDisplay.type === 'image' ? outputDisplay.value : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            price: prompt.price,
            description: prompt.description,
            isDefault: false,
          });
        } else if (hasPurchased) {
          // Transform to purchased prompt format
          const outputDisplay = marketplaceService.getOutputDisplay(prompt);
          
          purchased.push({
            id: prompt.id,
            title: prompt.title,
            category: prompt.category === 0 ? "Text" : "Image",
            author: prompt.owner.slice(0, 6) + "..." + prompt.owner.slice(-4),
            price: `${prompt.price.toFixed(2)} SUI`,
            date: new Date().toISOString().split('T')[0], // Current date as purchase date
            image: outputDisplay.type === 'image' ? outputDisplay.value : "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            isDefault: false,
          });
        }
      });

      console.log(`✅ Found ${owned.length} owned prompts and ${purchased.length} purchased prompts`);
      
      setUploadedPrompts(owned);
      setPurchasedPrompts(purchased);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard data";
      setError(errorMessage);
      console.error("❌ Dashboard data fetch error:", err);
      
      setUploadedPrompts([]);
      setPurchasedPrompts([]);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    console.log("useDashboardData effect triggered with userAddress:", userAddress);
    fetchDashboardData();
  }, [userAddress, fetchDashboardData]);

  return {
    uploadedPrompts,
    purchasedPrompts,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};
