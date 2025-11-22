import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sparkles,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import InfinitePromptList from "@/components/marketplace/InfinitePromptList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useLogin } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Marketplace = () => {
  const account = useCurrentAccount();
  const { login } = useLogin();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filters] = useState({
    priceRange: [0, 100],
    ratingMin: 0,
    models: [],
    categories: [],
    sortBy: "popular",
  });
  
  // TODO: Sui Blockchain Integration - These will be used when implementing advanced filtering
  // const [selectedCategory, setSelectedCategory] = useState("all");
  // const [filters, setFilters] = useState({...});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputQuery);
  };

  const categories = [
    { id: "all", label: "All Prompts", icon: <Sparkles className="h-4 w-4" /> },
    { id: "prompt", label: "Prompts", icon: <Zap className="h-4 w-4" /> },
  ];

  if (!account?.address) {
    return (
      <div className="min-h-screen flex flex-col mesh-bg">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to access the marketplace.
            </p>
            <Button
              className="button-primary px-6 py-3 rounded-xl"
              onClick={login}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section with Search */}
        <div className="relative py-16 mesh-bg border-b border-orange-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="gradient-text">Find Your Perfect</span>
                <br />
                <span className="text-white">AI Prompt</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Browse expert-crafted prompts, test them instantly, and buy what
                works.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 z-10" />
                  <Input
                    type="text"
                    placeholder="What are you looking to create today?"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    className="pl-16 pr-32 py-8 w-full text-lg bg-card/50 border-2 border-orange-500/20 rounded-2xl focus:border-orange-500 transition-colors"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 button-primary px-8 py-6 text-base rounded-xl shadow-lg"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Tabs */}
          <Tabs defaultValue="all" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-card/50 border border-orange-500/20 p-2 rounded-xl">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4 py-2"
                  >
                    <span className="flex items-center gap-2">
                      {cat.icon}
                      {cat.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-teal-500/50 text-teal-300 hover:bg-teal-500/10 rounded-xl"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Sort:{" "}
                      {sortBy === "popular"
                        ? "Popular"
                        : sortBy === "newest"
                        ? "Newest"
                        : "Price"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="glass-card border-orange-500/20"
                  >
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>
                      Most Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("rating")}>
                      Highest Rated
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content for each tab */}
            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-400">
                    Showing results for{" "}
                    <span className="text-white font-semibold">{cat.label}</span>
                  </p>
                </div>
                <InfinitePromptList
                  filters={{
                    ...filters,
                    sortBy,
                    categories: cat.id !== "all" ? [cat.id] : [],
                  }}
                  searchQuery={searchQuery}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Marketplace;
