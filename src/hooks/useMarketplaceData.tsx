import { useState, useEffect } from "react";

export interface PromptCardData {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  model: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  imageUrl?: string;
}

interface MarketplaceData {
  prompts: PromptCardData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface MarketplaceFilters {
  priceRange?: [number, number];
  ratingMin?: number;
  models?: string[];
  categories?: string[];
  sortBy?: string;
}

/**
 * Custom hook to fetch marketplace prompts from Sui blockchain
 * Currently returns empty data - blockchain integration needed
 */
export const useMarketplaceData = (
  filters: MarketplaceFilters,
  searchQuery: string
): MarketplaceData => {
  const [prompts] = useState<PromptCardData[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  
  // TODO: Sui Blockchain Integration - Uncomment these when implementing blockchain queries
  // const [prompts, setPrompts] = useState<PromptCardData[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const fetchMarketplaceData = async () => {
    // TODO: Sui Blockchain Integration - Uncomment when ready
    // setLoading(true);
    // setError(null);

    // try {
    //   let displayPrompts: PromptCardData[] = [];
    //
    //   // If there's a search query, search backend
    //   if (searchQuery && searchQuery.trim()) {
    //     // TODO: Call contentService.searchContent(searchQuery)
    //     const searchResults = await contentService.searchContent(searchQuery);
    //     displayPrompts = await transformContents(searchResults.results || []);
    //   } else {
    //     // No search query - fetch all prompts from backend
    //     // TODO: Call contentService.getNItems(1000)
    //     const backendPrompts = await contentService.getNItems(1000);
    //     displayPrompts = await transformContents(backendPrompts);
    //   }
    //
    //   // Apply filters
    //   let filteredPrompts = displayPrompts;
    //
    //   // Apply price range filter
    //   if (filters.priceRange) {
    //     filteredPrompts = filteredPrompts.filter(
    //       (prompt) =>
    //         prompt.price >= filters.priceRange[0] &&
    //         prompt.price <= filters.priceRange[1]
    //     );
    //   }
    //
    //   // Apply rating filter
    //   if (filters.ratingMin !== undefined) {
    //     filteredPrompts = filteredPrompts.filter(
    //       (prompt) => prompt.rating >= filters.ratingMin
    //     );
    //   }
    //
    //   // Apply model filter
    //   if (filters.models && filters.models.length > 0) {
    //     filteredPrompts = filteredPrompts.filter((prompt) =>
    //       filters.models.some((model: string) =>
    //         prompt.model.toLowerCase().includes(model.toLowerCase())
    //       )
    //     );
    //   }
    //
    //   // Apply category filter
    //   if (filters.categories && filters.categories.length > 0) {
    //     filteredPrompts = filteredPrompts.filter((prompt) =>
    //       filters.categories.some((category: string) =>
    //         prompt.category.toLowerCase().includes(category.toLowerCase())
    //       )
    //     );
    //   }
    //
    //   // Apply sorting
    //   if (filters.sortBy) {
    //     switch (filters.sortBy) {
    //       case "newest":
    //         filteredPrompts = [...filteredPrompts].reverse();
    //         break;
    //       case "price-low":
    //         filteredPrompts = [...filteredPrompts].sort(
    //           (a, b) => a.price - b.price
    //         );
    //         break;
    //       case "price-high":
    //         filteredPrompts = [...filteredPrompts].sort(
    //           (a, b) => b.price - a.price
    //         );
    //         break;
    //       case "rating":
    //         filteredPrompts = [...filteredPrompts].sort(
    //           (a, b) => b.rating - a.rating
    //         );
    //         break;
    //       case "popular":
    //       default:
    //         filteredPrompts = [...filteredPrompts].sort(
    //           (a, b) => b.reviews - a.reviews
    //         );
    //     }
    //   }
    //
    //   setPrompts(filteredPrompts);
    // } catch (err: any) {
    //   const errorMessage = err.message || "Failed to fetch marketplace data";
    //   setError(errorMessage);
    //   console.error("Marketplace data fetch error:", err);
    //   setPrompts([]);
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, [filters, searchQuery]);

  return {
    prompts,
    loading,
    error,
    refetch: fetchMarketplaceData,
  };
};

// TODO: Sui Blockchain Integration - Helper function to transform backend content to UI format
// const transformContents = async (contents: any[]): Promise<PromptCardData[]> => {
//   if (!contents?.length) return [];
//
//   // TODO: Resolve owner names using userService.getUser()
//   const ownerIds = Array.from(
//     new Set(
//       contents
//         .map((content) => content.owner_id)
//         .filter((ownerId): ownerId is string => typeof ownerId === "string" && ownerId.trim().length > 0)
//     )
//   );
//
//   const ownerNameCache: Record<string, string> = {};
//   await Promise.all(
//     ownerIds.map(async (ownerId) => {
//       try {
//         const profile = await userService.getUser(ownerId);
//         ownerNameCache[ownerId] = profile?.username || ownerId;
//       } catch (error) {
//         ownerNameCache[ownerId] = ownerId;
//       }
//     })
//   );
//
//   return contents.map((content: any) => {
//     const ownerId = content.owner_id;
//     const authorName = (ownerId && ownerNameCache[ownerId]) || ownerId || "Unknown";
//
//     return {
//       id: content.id,
//       title: content.title,
//       description: content.description,
//       price: content.price,
//       rating: 4.5,
//       reviews: 0,
//       model: content.llm_model,
//       category: content.metadata?.category || "General",
//       author: {
//         name: authorName,
//         avatar: ownerId
//           ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${ownerId}`
//           : `https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous`,
//       },
//       imageUrl:
//         content.preview_url ||
//         content.metadata?.sample_images?.[0] ||
//         "https://placehold.co/600x400/252232/e2e8f0?text=Prompt",
//     };
//   });
// };
