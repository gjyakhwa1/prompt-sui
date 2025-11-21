import { useState, useEffect } from "react";

interface PromptData {
  id: string;
  title: string;
  category: string;
  [key: string]: unknown;
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
 */
export const useDashboardData = (userId: string | undefined): DashboardData => {
  const [uploadedPrompts] = useState<PromptData[]>([]);
  const [purchasedPrompts] = useState<PromptData[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  
  // TODO: Sui Blockchain Integration - Uncomment these when implementing blockchain queries
  // const [uploadedPrompts, setUploadedPrompts] = useState<PromptData[]>([]);
  // const [purchasedPrompts, setPurchasedPrompts] = useState<PromptData[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    // TODO: Sui Blockchain Integration - Uncomment when ready
    // Use test address if in development and no userId provided
    // const effectiveUserId = userId || (import.meta.env.DEV ? "0xf48a46401b66bc6d5cf9171e5db9f8de2acec2a666c58c00300d6c06ff82bd60" : undefined);
    
    // if (!effectiveUserId) {
    //   // No authenticated user – keep lists empty
    //   console.log("No userId provided, skipping dashboard data fetch");
    //   setUploadedPrompts([]);
    //   setPurchasedPrompts([]);
    //   return;
    // }

    // setLoading(true);
    // setError(null);

    // try {
    //   console.log("Fetching dashboard data for userId:", effectiveUserId);
    //   // Fetch user's uploaded content
    //   const userContent = await contentService.getContentByOwner(effectiveUserId);
    //   console.log("Fetched uploaded content:", userContent);
      
    //   // Transform backend data to match UI format
    //   const transformedUploads = userContent.map((content) => ({
    //     id: content.id,
    //     title: content.title,
    //     category: content.metadata?.category || "Uncategorized",
    //     sales: content.metadata?.sales_count || 0,
    //     revenue: `${(content.metadata?.revenue || 0).toFixed(2)}`,
    //     status: "Active",
    //     image: content.preview_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    //     price: content.price,
    //     description: content.description,
    //     isDefault: false,
    //   }));

    //   setUploadedPrompts(transformedUploads);
    //   console.log("Set uploaded prompts:", transformedUploads);

    //   // Fetch user's purchases
    //   try {
    //     const purchases = await purchaseService.getUserPurchases(effectiveUserId);
        
    //     // Fetch content details for each purchase
    //     const purchasedContent = await Promise.all(
    //       purchases.map(async (purchase) => {
    //         try {
    //           const content = await contentService.getContent(purchase.content_id);
    //           return {
    //             id: content.id,
    //             title: content.title,
    //             category: content.metadata?.category || "Uncategorized",
    //             author: "Unknown", // TODO: Fetch owner name
    //             price: `${content.price.toFixed(2)}`,
    //             date: purchase.purchased_at || new Date().toISOString().split('T')[0], // Fallback to today if missing
    //             image: content.preview_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    //             isDefault: false,
    //           };
    //         } catch (err) {
    //           console.error(`Failed to fetch content ${purchase.content_id}:`, err);
    //           return null;
    //         }
    //       })
    //     );

    //     // Filter out failed fetches
    //     const validPurchases = purchasedContent.filter(
    //       (p): p is NonNullable<typeof p> => p !== null
    //     );
    //     setPurchasedPrompts(validPurchases);
    //     console.log("Set purchased prompts:", validPurchases);
    //   } catch (purchaseError: any) {
    //     // Silently handle purchase fetch errors (backend might not have the endpoint working)
    //     console.log("No purchases found or error fetching purchases:", purchaseError);
    //     // Don't show error toast for purchase errors - it's not critical
    //     setPurchasedPrompts([]);
    //   }
    // } catch (err: any) {
    //   const errorMessage = err.message || "Failed to fetch dashboard data";
    //   setError(errorMessage);
    //   console.error("Dashboard data fetch error:", err);
      
    //   // Don't show error toast for empty results or purchase errors, just log it
    //   if (!err.message?.includes("404") && !err.message?.includes("purchases") && !err.config?.url?.includes("purchases")) {
    //     toast({
    //       title: "Error loading data",
    //       description: errorMessage,
    //       variant: "destructive",
    //     });
    //   }
      
    //   // Keep lists empty on error
    //   setUploadedPrompts([]);
    //   setPurchasedPrompts([]);
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    console.log("useDashboardData effect triggered with userId:", userId);
    fetchDashboardData();
  }, [userId]);

  return {
    uploadedPrompts,
    purchasedPrompts,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};
