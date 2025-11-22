import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { truncateAddress } from "@/utils/formatAddress";

import {
  ShoppingCart,
  PlusCircle,
  TrendingUp,
  ChevronRight,
  PenTool,
  RefreshCw,
  BarChart3,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useLogin } from "@/context/AuthContext";
import { StatCard } from "@/components/dashboard/stats";

const Dashboard = () => {
  const [tab, setTab] = useState("overview");
  const account = useCurrentAccount();
  const effectiveAddress = account?.address;
  const { login } = useLogin();

  const { uploadedPrompts, purchasedPrompts, loading, refetch } =
    useDashboardData(effectiveAddress);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!effectiveAddress) {
        return;
      }
    };

    loadUserProfile();
  }, [effectiveAddress]);

  // Calculate stats from real data
  const totalUploads = uploadedPrompts.filter((p) => !p.isDefault).length;
  const totalPurchases = purchasedPrompts.filter((p) => !p.isDefault).length;
  // const totalSales = uploadedPrompts.reduce(
  //   (sum, p) => sum + (p.sales || 0),
  //   0
  // );
  const totalRevenue = uploadedPrompts.reduce((sum, p) => {
    const revenue = parseFloat(p.revenue?.replace("$", "") || "0");
    return sum + revenue;
  }, 0);

  if (!effectiveAddress) {
    return (
      <div className="min-h-screen flex flex-col mesh-bg">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to access your dashboard.
            </p>
            <Button
              asChild
              className="button-primary px-6 py-3 rounded-xl"
              onClick={login}
            >
              Connect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col mesh-bg">
      <Navbar />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Profile Card */}
          <div className="glow-card p-6 mb-8 rounded-2xl border border-orange-500/20 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbgbxLOuQhRKRgQD3jXqd4g0Smn5b5x1A-LA&s"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="flex items-center mt-1"></div>
                {account && (
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-blue-400">
                      Wallet Address: {truncateAddress(account.address)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="button-primary px-6 py-5 text-base rounded-xl shadow-lg shadow-orange-500/20"
              >
                <Link to="/sell-prompt">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Sell a Prompt
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-lg text-gray-400">
                Welcome back {effectiveAddress}! Here's your activity overview.
              </p>
            </div>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="purchased">Purchased</TabsTrigger>
              <TabsTrigger value="uploaded">My Uploads</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Section */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-orange-400" />
                  <span className="ml-3 text-gray-400">
                    Loading your dashboard...
                  </span>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Total Purchases"
                    value={purchasedPrompts.length}
                    description={`${totalPurchases} from marketplace`}
                    icon={<ShoppingCart className="h-4 w-4" />}
                    trend={
                      totalPurchases > 0
                        ? { value: `${totalPurchases}`, positive: true }
                        : undefined
                    }
                  />
                  <StatCard
                    title="Prompts Uploaded"
                    value={uploadedPrompts.length}
                    description={`${totalUploads} active listings`}
                    icon={<PenTool className="h-4 w-4" />}
                    trend={
                      totalUploads > 0
                        ? { value: `${totalUploads}`, positive: true }
                        : undefined
                    }
                  />
                  <StatCard
                    title="Revenue"
                    value={`${totalRevenue.toFixed(2)}`}
                    description="Total earnings"
                    icon={<TrendingUp className="h-4 w-4" />}
                    trend={
                      totalRevenue > 0
                        ? {
                            value: `${totalRevenue.toFixed(2)}`,
                            positive: true,
                          }
                        : undefined
                    }
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="purchased" className="space-y-6">
              <div className="glow-card rounded-2xl">
                <div className="p-6 flex flex-row items-center justify-between border-b border-orange-500/10">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Purchased Prompts
                    </h3>
                    <p className="text-sm text-gray-400">
                      {totalPurchases > 0
                        ? `${totalPurchases} purchases`
                        : "No purchases yet"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-300 hover:text-white border-teal-500/50 hover:bg-teal-500/10 rounded-xl"
                    onClick={refetch}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-orange-400" />
                      <span className="ml-3 text-gray-400">
                        Loading your prompts...
                      </span>
                    </div>
                  ) : purchasedPrompts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No purchased prompts yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {purchasedPrompts.map((prompt) => (
                        <Link
                          key={prompt.id}
                          to={`/prompt/${prompt.id}`}
                          className="glow-card overflow-hidden card-hover group block"
                        >
                          <div className="h-40 overflow-hidden relative">
                            <img
                              src={prompt.image}
                              alt={prompt.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs px-3 py-1 rounded-full">
                              {prompt.category}
                            </div>
                            {prompt.isDefault && (
                              <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
                                Free
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-white mb-1">
                              {prompt.title}
                            </h3>
                            <div className="flex justify-between text-sm text-gray-300 mb-3">
                              <span>By {prompt.author}</span>
                              <span className="font-semibold text-orange-400">
                                {prompt.price}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {prompt.isDefault
                                  ? "Starter prompt"
                                  : `Purchased: ${new Date(
                                      prompt.date
                                    ).toLocaleDateString()}`}
                              </span>
                              <ChevronRight className="h-4 w-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="uploaded" className="space-y-6">
              <div className="glow-card rounded-2xl">
                <div className="p-6 flex flex-row items-center justify-between border-b border-orange-500/10">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      My Uploaded Prompts
                    </h3>
                    <p className="text-sm text-gray-400">
                      {totalUploads > 0
                        ? `${totalUploads} active listings`
                        : "No uploads yet"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-300 hover:text-white border-teal-500/50 hover:bg-teal-500/10 rounded-xl"
                      onClick={refetch}
                      disabled={loading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                      />
                    </Button>
                    <Button
                      asChild
                      className="button-primary text-sm px-4 py-2 rounded-xl"
                    >
                      <Link to="/sell-prompt">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Prompt
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin text-orange-400" />
                      <span className="ml-3 text-gray-400">
                        Loading your uploads...
                      </span>
                    </div>
                  ) : uploadedPrompts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No uploaded prompts yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {uploadedPrompts.map((prompt) => (
                        <Link
                          key={prompt.id}
                          to={`/prompt/${prompt.id}`}
                          className="glow-card overflow-hidden card-hover group block"
                        >
                          <div className="h-40 overflow-hidden relative">
                            <img
                              src={prompt.image}
                              alt={prompt.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div
                              className={`absolute top-2 right-2 text-white text-xs px-3 py-1 rounded-full ${
                                prompt.status === "Active"
                                  ? "bg-teal-500"
                                  : "bg-gray-500"
                              }`}
                            >
                              {prompt.status}
                            </div>
                            {prompt.isDefault && (
                              <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                                Example
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-white mb-1">
                              {prompt.title}
                            </h3>
                            <div className="flex justify-between text-sm text-gray-300 mb-3">
                              <span>{prompt.category}</span>
                              <span>{prompt.sales} sales</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-orange-400">
                                  {typeof prompt.price === "number"
                                    ? `$${prompt.price.toFixed(2)}`
                                    : prompt.price}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Revenue: {prompt.revenue}
                                </span>
                              </div>
                              <div className="flex space-x-1">
                                {!prompt.isDefault && (
                                  <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className="text-purple-400 hover:text-white hover:bg-purple-500/20 rounded-lg"
                                  >
                                    <Link to={`/sell-prompt/${prompt.id}`}>
                                      <PenTool className="h-4 w-4 mr-1" />
                                      Edit
                                    </Link>
                                  </Button>
                                )}
                                <ChevronRight className="h-4 w-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="glow-card rounded-2xl p-8">
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-orange-500/30 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      <span className="gradient-text">Sales Analytics</span>
                    </h3>
                    <p className="text-gray-400 max-w-md mb-4">
                      Track your prompt performance, revenue trends, and user
                      engagement with detailed analytics
                    </p>
                    <Button className="button-primary px-6 py-3 rounded-xl">
                      View Full Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
