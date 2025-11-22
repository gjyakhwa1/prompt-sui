import PromptCard from "./PromptCard";
import { Loader } from "lucide-react";
import { useMarketplaceData } from "@/hooks/useMarketplaceData";

interface InfinitePromptListProps {
  filters: any;
  searchQuery: string;
}

const InfinitePromptList = ({
  filters,
  searchQuery,
}: InfinitePromptListProps) => {
  // TODO: Sui Blockchain Integration - This hook will fetch data from Sui blockchain
  const { prompts, loading } = useMarketplaceData(filters, searchQuery);

  if (prompts.length === 0 && !loading) {
    return (
      <div className="bg-muted/30 rounded-lg border border-muted p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't find any prompts matching your criteria.
        </p>
        <p className="text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 text-lavender-400 animate-spin" />
          <p className="mt-2 text-muted-foreground">Loading prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} {...prompt} />
        ))}
      </div>

      {prompts.length > 0 && !searchQuery && (
        <div className="text-center py-4 text-muted-foreground">
          Showing {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
        </div>
      )}

      {prompts.length > 0 && searchQuery && (
        <div className="text-center py-4 text-muted-foreground">
          Found {prompts.length} result{prompts.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default InfinitePromptList;
