import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "@/components/layout/MainLayout";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useSignPersonalMessage } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  ArrowRight,
  User,
  Wallet,
  Copy,
  ImageIcon,
  Code,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react";
import { MarketplaceService } from "@/services/marketplace.service";
import type { PromptListing } from "@/services/marketplace.service";

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  
  const [prompt, setPrompt] = useState<PromptListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [decryptedPrompt, setDecryptedPrompt] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  // Check if wallet is connected
  const walletAddress = currentAccount?.address;
  const isWalletConnected = !!walletAddress;

  // Fetch prompt data from blockchain
  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const marketplaceService = new MarketplaceService(suiClient);
        const promptData = await marketplaceService.getPrompt(id);

        if (promptData) {
          setPrompt(promptData);
          
          // Check if user already purchased
          if (walletAddress && promptData.buyers.includes(walletAddress)) {
            setPurchased(true);
          }
        } else {
          toast.error("Prompt not found");
        }
      } catch (error) {
        console.error("Error fetching prompt:", error);
        toast.error("Could not load prompt");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id, walletAddress, suiClient]);

  // Handle purchase
  const handlePurchase = async () => {
    if (!isWalletConnected || !walletAddress) {
      toast.error("Please connect your SUI wallet first.");
      return;
    }

    if (!prompt || !id) {
      toast.error("Prompt not found");
      return;
    }

    setPurchaseLoading(true);

    try {
      toast.info("Processing purchase...");
      
      const marketplaceService = new MarketplaceService(suiClient);
      
      const result = await marketplaceService.buyPrompt(
        id,
        prompt.price,
        (tx) => {
          return new Promise((resolve, reject) => {
            signAndExecuteTransaction(
              { transaction: tx },
              {
                onSuccess: (result) => resolve(result),
                onError: (error) => reject(error),
              }
            );
          });
        }
      );

      console.log("✅ Purchase successful:", result);
      
      setPurchased(true);
      toast.success("Purchase successful! You can now decrypt the prompt.");
      
      // Auto-decrypt after purchase
      setTimeout(() => {
        handleDecrypt();
      }, 1000);
      
    } catch (error) {
      console.error("Purchase error:", error);
      const errorMessage = (error as Error)?.message || "Failed to complete purchase";
      
      if (errorMessage.includes("insufficient")) {
        toast.error("Insufficient SUI balance");
      } else if (errorMessage.includes("rejected")) {
        toast.error("Transaction cancelled");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Handle decrypt
  const handleDecrypt = async () => {
    if (!isWalletConnected || !walletAddress) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!prompt || !id) {
      toast.error("Prompt not found");
      return;
    }

    setIsDecrypting(true);

    try {
      toast.info("Decrypting prompt... Please sign the message in your wallet.");
      
      const marketplaceService = new MarketplaceService(suiClient);
      
      const decrypted = await marketplaceService.decryptPrompt(
        id,
        walletAddress,
        signPersonalMessage,
      );

      setDecryptedPrompt(decrypted);
      toast.success(`Prompt decrypted successfully! ${decrypted}`);
      
    } catch (error) {
      console.error("Decryption error:", error);
      const errorMessage = (error as Error)?.message || "Failed to decrypt prompt";
      
      if (errorMessage.includes("not in buyers list") || errorMessage.includes("must purchase")) {
        toast.error("Please purchase this prompt first");
      } else if (errorMessage.includes("rejected")) {
        toast.error("Signature cancelled");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Check if user is authenticated
  if (!isWalletConnected || !walletAddress) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center mesh-bg">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to view prompt details.
            </p>
            <Link to="/marketplace">
              <Button className="button-primary px-6 py-3 rounded-xl">
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!prompt) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Prompt Not Found
          </h2>
          <p className="text-gray-400 mb-8">
            The prompt you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild>
            <Link to="/marketplace" className="text-white">
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Get output display (handles both text and image)
  const marketplaceService = new MarketplaceService(suiClient);
  const outputDisplay = marketplaceService.getOutputDisplay(prompt);
  
  const isOwner = walletAddress === prompt.owner;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/marketplace"
            className="text-white hover:text-orange-400 flex items-center"
          >
            <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
            Back to Marketplace
          </Link>
        </div>

        {/* Hero section */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
          {outputDisplay.type === 'image' ? (
            <img
              src={outputDisplay.value}
              alt={prompt.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 flex items-center justify-center">
              <Code className="h-24 w-24 text-orange-400/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {prompt.title}
            </h1>
          </div>
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <Badge
              variant="outline"
              className="bg-black/50 backdrop-blur-md text-white border-white/20"
            >
              {prompt.category === 1 ? "Image Generation" : "Text Prompt"}
            </Badge>
            {prompt.encryptedData.length > 0 && (
              <Badge
                variant="outline"
                className="bg-purple-500/20 backdrop-blur-md text-purple-300 border-purple-500/30"
              >
                <Lock className="h-3 w-3 mr-1" />
                SEAL Encrypted
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="glow-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About This Prompt</h2>
              <p className="text-gray-300 mb-4">{prompt.description}</p>
            </div>

            {/* Sample Input/Output */}
            <div className="glow-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                {prompt.category === 1 ? (
                  <ImageIcon className="h-6 w-6 text-orange-400 mr-2" />
                ) : (
                  <Code className="h-6 w-6 text-orange-400 mr-2" />
                )}
                Sample {prompt.category === 1 ? "Output" : "Input/Output"}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Sample Input</Label>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-300">{prompt.inputSample}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">Sample Output</Label>
                  {outputDisplay.type === 'image' ? (
                    <div className="aspect-video rounded-lg overflow-hidden border border-gray-700">
                      <img
                        src={outputDisplay.value}
                        alt="Sample output"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-gray-300 whitespace-pre-wrap">{outputDisplay.value}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Decrypted Prompt (only shown after purchase and decrypt) */}
            {decryptedPrompt && (
              <div className="glow-card rounded-2xl p-6 border-2 border-green-500/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Unlock className="h-6 w-6 text-green-400 mr-2" />
                  Your Decrypted Prompt
                </h2>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                    {decryptedPrompt}
                  </pre>
                </div>
                <Button
                  onClick={() => handleCopyToClipboard(decryptedPrompt)}
                  variant="outline"
                  className="w-full border-green-500/50 text-green-300 hover:bg-green-500/10"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            )}

            {/* Author Info */}
            <div className="glow-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <User className="h-6 w-6 text-orange-400 mr-2" />
                About the Creator
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {prompt.owner.slice(0, 6)}...{prompt.owner.slice(-4)}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{prompt.buyers.length} sales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="glow-card rounded-2xl p-6 sticky top-20">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold gradient-text mb-2">
                  {prompt.price} SUI
                </p>
                <p className="text-sm text-gray-400">One-time purchase</p>
              </div>

              {prompt.encryptedData.length > 0 && (
                <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-purple-400">
                    <Lock className="h-4 w-4" />
                    <span>Encrypted with SEAL</span>
                  </div>
                </div>
              )}

              {/* Owner View */}
              {isOwner && (
                <div className="mb-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                  <p className="text-sm text-teal-400 text-center">
                    You own this prompt
                  </p>
                </div>
              )}

              {/* Purchase/Decrypt Buttons - Always show both */}
              {!isOwner && (
                <div className="space-y-3">
                  {/* Buy Button - Always visible */}
                  <Button
                    onClick={handlePurchase}
                    disabled={purchaseLoading || purchased}
                    className="w-full button-primary py-6 text-lg"
                  >
                    {purchaseLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : purchased ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Purchased
                      </>
                    ) : (
                      <>
                        <Wallet className="h-5 w-5 mr-2" />
                        Buy for {prompt.price} SUI
                      </>
                    )}
                  </Button>

                  {/* Decrypt Button - Always visible and enabled */}
                  <Button
                    onClick={handleDecrypt}
                    disabled={isDecrypting}
                    className="w-full button-primary py-6 text-lg"
                    variant={decryptedPrompt ? "outline" : "default"}
                  >
                    {isDecrypting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Decrypting...
                      </>
                    ) : decryptedPrompt ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Decrypted
                      </>
                    ) : (
                      <>
                        <Unlock className="h-5 w-5 mr-2" />
                        Decrypt Prompt
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Lifetime access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">SEAL encrypted security</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Secure blockchain payment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Instant delivery</span>
                </div>
              </div>

              {purchased && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-xs text-gray-400 text-center">
                    ✅ You have purchased this prompt
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PromptDetail;
