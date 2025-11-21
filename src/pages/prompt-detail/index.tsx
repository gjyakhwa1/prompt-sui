import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "@/components/layout/MainLayout";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Dialog components will be needed when full UI is implemented
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Star,
  Zap,
  CheckCircle,
  MessageSquare,
  Shield,
  ArrowRight,
  ThumbsUp,
  User,
  Wallet,
  Copy,
  Info,
  Sparkles,
  ImageIcon,
  Code,
  Lock,
  Loader,
  Unlock,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLogin } from "@/context/AuthContext";

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const currentAccount = useCurrentAccount();
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputImage, setOutputImage] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [remainingCredits, setRemainingCredits] = useState(5);
  const [decryptedPrompt, setDecryptedPrompt] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isDecryptingPrompt, setIsDecryptingPrompt] = useState(false);
  const navigate = useNavigate();
  const { login } = useLogin();
  
  // Check if wallet is connected
  const walletAddress = currentAccount?.address;
  const isWalletConnected = !!walletAddress;

  // TODO: Sui Blockchain Integration - Fetch prompt data from blockchain
  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;

      setLoading(true);

      try {
        // TODO: Sui Blockchain Integration - Uncomment when ready
        // const content = await contentService.getContent(id, walletAddress);
        // let authorName = content.owner_id;
        // try {
        //   const ownerProfile = await userService.getUser(content.owner_id);
        //   authorName = ownerProfile?.username || authorName;
        // } catch (error) {
        //   authorName = content.owner_id;
        // }
        //
        // const transformedPrompt = {
        //   id: content.id,
        //   title: content.title,
        //   description: content.description,
        //   longDescription: content.metadata?.long_description || content.description,
        //   price: content.price,
        //   rating: 4.5,
        //   reviews: 0,
        //   model: content.llm_model,
        //   supportedModels: [content.llm_model],
        //   modelSettings: content.llm_settings || {},
        //   category: content.metadata?.category || "General",
        //   tags: content.metadata?.tags || [],
        //   metadata: content.metadata || {},
        //   author: {
        //     id: content.owner_id,
        //     name: authorName,
        //     avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${content.owner_id}`,
        //     rating: 4.5,
        //     sales: 0,
        //     memberSince: new Date(content.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        //   },
        //   sampleInputs: content.metadata?.sample_inputs || [],
        //   sampleOutputImages: content.metadata?.sample_images || [],
        //   sampleOutputs: content.metadata?.sample_outputs || [],
        //   systemPrompt: content.prompt,
        //   encryptedMessage: content.encrypted_message,
        //   createdAt: content.created_at,
        //   updatedAt: content.updated_at,
        //   heroImage: content.preview_url || content.metadata?.sample_images?.[0] || "https://placehold.co/1200x400/252232/e2e8f0?text=Prompt",
        // };
        //
        // if (content.encrypted_message) {
        //   setEncryptedMessage(content.encrypted_message);
        // }
        //
        // if (content.has_purchased) {
        //   setPurchased(true);
        // }
        //
        // setPrompt(transformedPrompt);

        // Fallback to sample data for now
        const samplePrompt = {
          id: id,
          title: "Professional AI Art Prompt Generator",
          description:
            "Create stunning, professional-quality AI art with this comprehensive prompt template. Works perfectly with Midjourney, DALL-E 3, and Stable Diffusion.",
          longDescription:
            "This advanced prompt template is designed for artists, designers, and creative professionals who want to generate consistent, high-quality AI artwork. The prompt structure has been refined through thousands of iterations to produce the best possible results across all major AI image generation platforms. Whether you're creating concept art, marketing materials, or personal projects, this prompt will help you achieve professional results every time. Features include: customizable style parameters, mood and atmosphere controls, composition guidelines, and quality enhancement keywords.",
          price: 15.99,
          rating: 4.8,
          reviews: 234,
          model: "dall-e-3",
          supportedModels: ["Midjourney", "DALL-E 3", "Stable Diffusion XL"],
          modelSettings: {
            temperature: 0.7,
            maxTokens: 2000,
            topP: 0.9,
            frequencyPenalty: 0.5,
            presencePenalty: 0.5,
          },
          category: "Art",
          tags: ["art", "design", "image generation", "professional", "creative"],
          metadata: {
            bottle_id: "0x1234567890abcdef1234567890abcdef12345678",
            sample_inputs: [
              "Create a futuristic cyberpunk cityscape at night with neon lights",
              "Generate a serene watercolor landscape of mountains at sunset",
              "Design a minimalist logo for a tech startup",
            ],
            sample_outputs: [
              "A breathtaking cyberpunk cityscape emerges from the darkness, illuminated by vibrant neon signs in electric blue and hot pink...",
              "Soft watercolor washes blend seamlessly across the canvas, depicting majestic mountains bathed in the warm glow of a setting sun...",
              "A clean, modern logo design featuring geometric shapes that convey innovation and technology...",
            ],
            sample_images: [
              "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?q=80&w=2080&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1618331833071-ce81bd50d300?q=80&w=2080&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=2080&auto=format&fit=crop",
            ],
          },
          author: {
            id: "0xf48a46401b66bc6d5cf9171e5db9f8de2acec2a666c58c00300d6c06ff82bd60",
            name: "Creative AI Master",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative",
            rating: 4.9,
            sales: 456,
            memberSince: "Jan 2023",
          },
          sampleInputs: [
            "Create a futuristic cyberpunk cityscape at night with neon lights",
            "Generate a serene watercolor landscape of mountains at sunset",
            "Design a minimalist logo for a tech startup",
          ],
          sampleOutputImages: [
            "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?q=80&w=2080&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618331833071-ce81bd50d300?q=80&w=2080&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?q=80&w=2080&auto=format&fit=crop",
          ],
          sampleOutputs: [
            "/imagine prompt: futuristic cyberpunk cityscape, night scene, neon signs illuminating wet streets, flying cars, towering skyscrapers, highly detailed, cinematic lighting, 8k resolution, trending on artstation, by Syd Mead and Blade Runner concept art --ar 16:9 --v 5 --s 750 --q 2",
            "/imagine prompt: serene watercolor landscape, mountains at sunset, soft pastel colors, mist rising from valleys, delicate brushstrokes, impressionistic style, peaceful atmosphere, inspired by traditional Chinese painting --ar 16:9 --v 5",
            "/imagine prompt: minimalist tech startup logo, geometric shapes, modern design, clean lines, blue and white color scheme, professional, scalable vector, negative space, memorable --ar 1:1 --v 5",
          ],
          systemPrompt: "You are an expert AI art prompt engineer with deep knowledge of visual aesthetics, composition, lighting, and the technical parameters of image generation AI models. Your specialty is crafting detailed prompts that produce consistent, high-quality results across different AI image generators.",
          encryptedMessage: "U2FtcGxlIGVuY3J5cHRlZCBtZXNzYWdlIGZvciBkZW1vbnN0cmF0aW9uIHB1cnBvc2Vz",
          createdAt: "2023-10-12T11:27:39.822Z",
          updatedAt: "2024-03-20T09:15:21.437Z",
          heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
        };

        setPrompt(samplePrompt);
      } catch (error: any) {
        console.error("Error fetching prompt:", error);
        toast.error("Could not load prompt");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id, walletAddress]);

  // TODO: Sui Blockchain Integration - Test prompt functionality
  const handleTestPrompt = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter some text to test this prompt.");
      return;
    }

    if (!id) {
      toast.error("Prompt ID not found.");
      return;
    }

    if (remainingCredits <= 0) {
      toast.error("No credits remaining. Purchase more credits or buy this prompt.");
      return;
    }

    setTestLoading(true);
    setOutput("");
    setOutputImage("");

    try {
      // TODO: Sui Blockchain Integration - Uncomment when ready
      // const isImagePrompt = prompt?.model?.toLowerCase().includes("dall-e") ||
      //   prompt?.model?.toLowerCase().includes("midjourney") ||
      //   prompt?.model?.toLowerCase().includes("stable") ||
      //   prompt?.category?.toLowerCase() === "art";
      //
      // if (isImagePrompt) {
      //   const response = await testService.testImage({
      //     query: userInput,
      //     content_id: id,
      //     user_id: walletAddress,
      //   });
      //   if (Array.isArray(response.response)) {
      //     setOutputImage(response.response[0]?.url || "");
      //     setOutput("Image generated successfully!");
      //   } else if (typeof response.response === "string") {
      //     setOutputImage(response.response);
      //     setOutput("Image generated successfully!");
      //   }
      // } else {
      //   const response = await testService.testPrompt({
      //     query: userInput,
      //     content_id: id,
      //     user_id: walletAddress,
      //   });
      //   if (typeof response.response === "string") {
      //     setOutput(response.response);
      //   } else {
      //     setOutput(JSON.stringify(response.response, null, 2));
      //   }
      // }
      //
      // setRemainingCredits((prev) => prev - 1);
      // toast.success(`Prompt tested successfully. ${remainingCredits - 1} test credits remaining.`);

      // Temporary mock response
      toast.warning("Sui blockchain integration pending");
      setOutput("This is a mock response. Blockchain integration needed.");
    } catch (error: any) {
      console.error("Error testing prompt:", error);
      toast.error(error.message || "Failed to test prompt. Please try again.");
    } finally {
      setTestLoading(false);
    }
  };

  // TODO: Sui Blockchain Integration - Decrypt prompt functionality
  const handleDecryptPrompt = async () => {
    if (!privateKey.trim()) {
      toast.error("Please enter your private key to decrypt");
      return;
    }

    const bottleId = prompt?.metadata?.bottle_id;
    if (!bottleId) {
      toast.error("Bottle ID not found");
      return;
    }

    setIsDecryptingPrompt(true);
    try {
      // TODO: Sui Blockchain Integration - Uncomment when ready
      // toast.info("Creating session key and decrypting your prompt...");
      //
      // // Create keypair from private key
      // let keypair: Ed25519Keypair;
      // // ... keypair creation logic
      //
      // // Create session key
      // const sessionKey = await SessionKey.create({
      //   address: walletAddress!,
      //   packageId: PACKAGE_ID,
      //   ttlMin: 10,
      //   signer: keypair,
      //   suiClient,
      // });
      //
      // // Decrypt data
      // const decrypted = await decryptData(
      //   sessionKey,
      //   PACKAGE_ID,
      //   suiClient,
      //   sealClient,
      //   bottleId,
      //   dataToDecrypt
      // );
      //
      // if (decrypted) {
      //   const decryptedText = new TextDecoder().decode(decrypted);
      //   setSystemPrompt(decryptedText);
      //   setShowDecryptDialog(false);
      //   setPrivateKey("");
      //   toast.success("Prompt decrypted successfully");
      // }

      // Temporary mock
      toast.warning("Sui blockchain integration pending");
    } catch (error: unknown) {
      console.error("Decryption error:", error);
      toast.error(error.message || "Failed to decrypt prompt");
    } finally {
      setIsDecryptingPrompt(false);
    }
  };

  // TODO: Sui Blockchain Integration - Purchase functionality
  const handlePurchase = async () => {
    if (!isWalletConnected || !walletAddress) {
      toast.error("Please connect your SUI wallet first.");
      login();
      return;
    }

    const bottleId = prompt?.metadata?.bottle_id;
    
    if (!bottleId || bottleId === "") {
      // For non-encrypted prompts
      setPurchaseLoading(true);
      try {
        // TODO: Sui Blockchain Integration - Uncomment when ready
        // await purchaseService.createPurchase({
        //   user_id: walletAddress,
        //   content_id: prompt.id,
        // });
        
        setPurchased(true);
        setSystemPrompt(prompt.systemPrompt || "No system prompt available.");
        toast.success("Purchase Successful! This prompt is not encrypted. You now have full access.");
      } catch (error: unknown) {
        console.error("Error recording purchase:", error);
        toast.error("Purchase failed. Please try again.");
      } finally {
        setPurchaseLoading(false);
      }
      return;
    }

    setPurchaseLoading(true);
    setIsDecrypting(true);

    try {
      // TODO: Sui Blockchain Integration - Uncomment when ready
      // toast.info("Processing Purchase. Granting you access to the encrypted prompt...");
      //
      // const { BackendSealService } = await import("@/services/seal.service");
      // const backendService = new BackendSealService(getFullnodeUrl("testnet"));
      //
      // await backendService.addRecipientToBottle(bottleId, walletAddress);
      //
      // await purchaseService.createPurchase({
      //   user_id: walletAddress,
      //   content_id: prompt.id,
      // });
      //
      // setPurchased(true);
      // setDecryptedPrompt(bottleId);
      // toast.success("Purchase Complete! You now have access to this encrypted prompt.");

      // Temporary mock
      toast.warning("Sui blockchain integration pending");
    } catch (error: unknown) {
      console.error("Purchase error:", error);
      toast.error(error.message || "Failed to complete purchase. Please try again.");
    } finally {
      setPurchaseLoading(false);
      setIsDecrypting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i < rating
              ? "text-yellow-400 fill-yellow-400 opacity-50"
              : "text-gray-300"
          }`}
        />
      ));
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
            <Button
              className="button-primary px-6 py-3 rounded-xl"
              onClick={login}
            >
              Connect
            </Button>
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

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(prompt.price);

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
          <img
            src={prompt.heroImage}
            alt={prompt.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {prompt.title}
            </h1>
          </div>
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            {prompt.supportedModels.map((model: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-black/50 backdrop-blur-md text-white border-white/20"
              >
                {model}
              </Badge>
            ))}
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
              <p className="text-gray-400 text-sm">{prompt.longDescription}</p>
            </div>

            {/* Sample Outputs */}
            <div className="glow-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <ImageIcon className="h-6 w-6 text-orange-400 mr-2" />
                Sample Outputs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prompt.sampleOutputImages.map((image: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-video rounded-lg overflow-hidden border border-gray-700">
                      <img
                        src={image}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      Input: {prompt.sampleInputs[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Settings */}
            <div className="glow-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Code className="h-6 w-6 text-orange-400 mr-2" />
                Model Settings
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Temperature</p>
                  <p className="text-xl font-bold text-white">{prompt.modelSettings.temperature}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Max Tokens</p>
                  <p className="text-xl font-bold text-white">{prompt.modelSettings.maxTokens}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Top P</p>
                  <p className="text-xl font-bold text-white">{prompt.modelSettings.topP}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Model</p>
                  <p className="text-xl font-bold text-white">{prompt.model}</p>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="glow-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <User className="h-6 w-6 text-orange-400 mr-2" />
                About the Creator
              </h2>
              <div className="flex items-center gap-4">
                <img
                  src={prompt.author.avatar}
                  alt={prompt.author.name}
                  className="w-16 h-16 rounded-full border-2 border-orange-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{prompt.author.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {prompt.author.rating} rating
                    </span>
                    <span>{prompt.author.sales} sales</span>
                    <span>Member since {prompt.author.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="glow-card rounded-2xl p-6 sticky top-20">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-white mb-2">{formattedPrice}</p>
                <p className="text-sm text-gray-400">One-time purchase</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-300">
                    {prompt.rating} ({prompt.reviews} reviews)
                  </span>
                </div>
              </div>

              {prompt.metadata?.bottle_id && (
                <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-purple-400">
                    <Lock className="h-4 w-4" />
                    <span>Encrypted with SEAL</span>
                  </div>
                </div>
              )}

              <Button className="w-full button-primary py-6 text-lg mb-4">
                <Wallet className="h-5 w-5 mr-2" />
                Purchase Now
              </Button>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Lifetime access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Works with all major AI models</span>
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

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                  💡 This is demo data. Full functionality coming with Sui blockchain integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PromptDetail;
