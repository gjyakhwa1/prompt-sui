import { useState, useEffect, useCallback } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { MarketplaceService, type PromptListing } from "@/services/marketplace.service";

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
 */
export const useMarketplaceData = (
  filters: MarketplaceFilters,
  searchQuery: string
): MarketplaceData => {
  const suiClient = useSuiClient();
  const [prompts, setPrompts] = useState<PromptCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketplaceData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch prompts from blockchain
      const marketplaceService = new MarketplaceService(suiClient);
      const blockchainPrompts = await marketplaceService.getAllPrompts();

      // Transform blockchain data to UI format
      let displayPrompts = transformPromptsToCardData(blockchainPrompts, marketplaceService);

      // Apply search filter
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        displayPrompts = displayPrompts.filter(
          (prompt) =>
            prompt.title.toLowerCase().includes(query) ||
            prompt.description.toLowerCase().includes(query) ||
            prompt.model.toLowerCase().includes(query)
        );
      }

      // Apply price range filter
      if (filters.priceRange) {
        displayPrompts = displayPrompts.filter(
          (prompt) =>
            prompt.price >= filters.priceRange![0] &&
            prompt.price <= filters.priceRange![1]
        );
      }

      // Apply rating filter
      if (filters.ratingMin !== undefined) {
        displayPrompts = displayPrompts.filter(
          (prompt) => prompt.rating >= filters.ratingMin!
        );
      }

      // Apply model filter
      if (filters.models && filters.models.length > 0) {
        displayPrompts = displayPrompts.filter((prompt) =>
          filters.models!.some((model: string) =>
            prompt.model.toLowerCase().includes(model.toLowerCase())
          )
        );
      }

      // Apply category filter
      if (filters.categories && filters.categories.length > 0) {
        displayPrompts = displayPrompts.filter((prompt) =>
          filters.categories!.some((category: string) =>
            prompt.category.toLowerCase().includes(category.toLowerCase())
          )
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "newest":
            displayPrompts = [...displayPrompts].reverse();
            break;
          case "price-low":
            displayPrompts = [...displayPrompts].sort(
              (a, b) => a.price - b.price
            );
            break;
          case "price-high":
            displayPrompts = [...displayPrompts].sort(
              (a, b) => b.price - a.price
            );
            break;
          case "rating":
            displayPrompts = [...displayPrompts].sort(
              (a, b) => b.rating - a.rating
            );
            break;
          case "popular":
          default:
            displayPrompts = [...displayPrompts].sort(
              (a, b) => b.reviews - a.reviews
            );
        }
      }

      setPrompts(displayPrompts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch marketplace data";
      setError(errorMessage);
      console.error("❌ Marketplace data fetch error:", err);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }, [suiClient, filters, searchQuery]);

  useEffect(() => {
    fetchMarketplaceData();
  }, [fetchMarketplaceData]);

  return {
    prompts,
    loading,
    error,
    refetch: fetchMarketplaceData,
  };
};

/**
 * Transform blockchain prompts to UI card format
 */
function transformPromptsToCardData(
  prompts: PromptListing[],
  marketplaceService: MarketplaceService
): PromptCardData[] {
  return prompts.map((prompt) => {
    const output = marketplaceService.getOutputDisplay(prompt);
    
    // Generate avatar from owner address
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${prompt.owner}`;
    
    // Shorten owner address for display
    const ownerName = `${prompt.owner.slice(0, 6)}...${prompt.owner.slice(-4)}`;

    return {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      price: prompt.price,
      rating: 4.5, // Default rating (can be enhanced later)
      reviews: prompt.buyers.length, // Number of buyers
      model: "Prompt", // Default model label
      category: prompt.category === 0 ? "Text" : "Image",
      author: {
        name: ownerName,
        avatar: avatar,
      },
      imageUrl: output.type === 'image' ? output.value : undefined,
    };
  });
}
