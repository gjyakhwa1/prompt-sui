import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import MainLayout from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
// import axios from "axios" // Removed - not needed without USD price fetching
import { useCurrentAccount } from "@mysten/dapp-kit"
import { uploadToWalrus } from "@/services/walrus.service"
import { useLogin } from "@/context/AuthContext"
import { MarketplaceService } from "@/services/marketplace.service"
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider" // Removed - using input instead of slider
import { Info, PlusCircle, Trash, Lock, Loader2, ArrowRight, ArrowLeft, CheckCircle2, FileText, Image as ImageIcon, Code, Upload } from "lucide-react"
// DollarSign, AlertCircle - Removed unused icons
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SellPrompt = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const currentAccount = useCurrentAccount()
  const { login } = useLogin()
  const suiClient = useSuiClient()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "prompt",
    subcategory: "",
    model: "dall-e-3",
    price: 10, // Price in SUI tokens
    systemPrompt: "",
    userPrompt: "",
    promptId: "", // Will be set after creating prompt on-chain
    sampleInputs: [
      "Test Sample Input",
    ],
    sampleOutputs: [""],
    sampleImages: [
      "https://zd-brightspot.s3.us-east-1.amazonaws.com/800x450/wp-content/uploads/2024/04/19183329/prompt-engineering-in-programming.jpg",
    ],
  })

  const [imageSizes, setImageSizes] = useState<Record<number, string>>({})
  const [uploadingImages, setUploadingImages] = useState<Record<number, boolean>>({})

  // Load existing prompt data when editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true)
      setIsLoadingPrompt(true)
      
      // TODO: Sui Blockchain Integration - Load content from blockchain
      // const loadPromptFromBlockchain = async () => {
      //   try {
      //     const content = await contentService.getContent(id)
      //     console.log("📥 Loaded content from blockchain:", content)
      //     
      //     setFormData({
      //       title: content.title || "",
      //       description: content.description || "",
      //       longDescription: content.metadata?.long_description || content.description || "",
      //       category: content.metadata?.category || "",
      //       subcategory: content.metadata?.subcategory || "",
      //       model: content.llm_model || "",
      //       price: content.price || 19.99,
      //       testPrice: content.metadata?.test_price || content.price * 0.1 || 1.99,
      //       systemPrompt: content.prompt || "",
      //       userPrompt: content.metadata?.user_prompt || "",
      //       bottleId: content.metadata?.bottle_id || "",
      //       encryptedData: null,
      //       sampleInputs: content.metadata?.sample_inputs || [""],
      //       sampleOutputs: content.metadata?.sample_outputs || [""],
      //       sampleImages: content.metadata?.sample_images || [""],
      //     })
      //     
      //     if (content.llm_settings) {
      //       setModelSettings({
      //         temperature: [content.llm_settings.temperature || 0.7],
      //         maxTokens: [content.llm_settings.max_tokens || 1500],
      //         topP: [content.llm_settings.top_p || 0.9],
      //         frequencyPenalty: [content.llm_settings.frequency_penalty || 0.5],
      //         presencePenalty: [content.llm_settings.presence_penalty || 0.5],
      //       })
      //     }
      //     
      //     toast({
      //       title: "Prompt loaded",
      //       description: "You can now edit your prompt.",
      //     })
      //   } catch (error) {
      //     console.error("Error loading prompt:", error)
      //     toast({
      //       title: "Error loading prompt",
      //       description: "Could not load prompt data. Please try again.",
      //       variant: "destructive",
      //     })
      //     navigate("/dashboard")
      //   } finally {
      //     setIsLoadingPrompt(false)
      //   }
      // }
      // loadPromptFromBlockchain()
      
      // Temporary: Just set loading to false
      setIsLoadingPrompt(false)
    }
  }, [id])

  // TODO: Old USD price fetching - Commented out for direct SUI pricing
  // useEffect(() => {
  //   const fetchCoinPriceHistory = async (
  //     coinId: string,
  //     timeDeltaInSeconds = 360,
  //     pricePrecision = 5
  //   ) => {
  //     const nowTimestamp = Math.floor(Date.now() / 1000)
  //     const fromTimestamp = nowTimestamp - timeDeltaInSeconds
  //
  //     const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range`
  //
  //     try {
  //       const { data } = await axios.get(url, {
  //         params: {
  //           vs_currency: "usd",
  //           from: fromTimestamp,
  //           to: nowTimestamp,
  //           precision: pricePrecision,
  //         },
  //         headers: {
  //           accept: "application/json",
  //           "x-cg-demo-api-key": "CG-JwZR5W5Wk65HhZTgD6cUejGt",
  //         },
  //       })
  //
  //       console.log("response", data)
  //       const latestprice = data.prices
  //       console.log("latestprice", latestprice[0][1])
  //
  //       setCurrentSuiPrice(latestprice[0][1])
  //       return data
  //     } catch (error) {
  //       console.error("Error fetching coin market data:", error)
  //       return { prices: [], market_caps: [], total_volumes: [] }
  //     }
  //   }
  //   fetchCoinPriceHistory("sui")
  // }, [])

  // TODO: Old test price management - Commented out for single SUI pricing
  // useEffect(() => {
  //   // Keep test price at 10% of main price or lower
  //   const maxTestPrice = Math.min(formData.price * 0.1, 9.99)
  //   if (formData.testPrice > maxTestPrice) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       testPrice: parseFloat(maxTestPrice.toFixed(2)),
  //     }))
  //   }
  // }, [formData.price, formData.testPrice])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const models = [
    {
      id: 1,
      name: "dall-e-3",
    },
    {
      id: 2,
      name: "dall-e-2",
    },
    {
      id: 3,
      name: "gpt-4o",
    },
    {
      id: 4,
      name: "gpt-4.1-mini",
    },
    {
      id: 5,
      name: "gpt-5.1-mini",
    },
  ]

  const handleSelectChange = (name: string, value: string) => {
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subcategory: "",
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSampleChange = (
    index: number,
    field: "sampleInputs" | "sampleOutputs",
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev[field]]
      updated[index] = value
      return {
        ...prev,
        [field]: updated,
      }
    })
  }

  const getImageSize = async (url: string, index: number) => {
    try {
      const response = await fetch(url, { method: "HEAD" })
      const contentLength = response.headers.get("Content-Length")
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10)
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)
        setImageSizes((prev) => ({
          ...prev,
          [index]: sizeInMB,
        }))
      }
    } catch (error) {
      console.error("Error getting image size:", error)
      setImageSizes((prev) => ({
        ...prev,
        [index]: "Unknown",
      }))
    }
  }

  const handleImageUpload = (index: number, imageUrl: string) => {
    setFormData((prev) => {
      const updatedImages = [...prev.sampleImages]
      updatedImages[index] = imageUrl

      if (imageUrl) {
        if (imageUrl.startsWith("http")) {
          getImageSize(imageUrl, index)
        }
      } else {
        setImageSizes((prev) => {
          const updated = { ...prev }
          delete updated[index]
          return updated
        })
      }

      return {
        ...prev,
        sampleImages: updatedImages,
      }
    })
  }

  const addSample = () => {
    setFormData((prev) => ({
      ...prev,
      sampleInputs: [...prev.sampleInputs, ""],
      sampleOutputs: [...prev.sampleOutputs, ""],
      sampleImages: [...prev.sampleImages, ""],
    }))
  }

  const removeSample = (index: number) => {
    setFormData((prev) => {
      const updatedInputs = [...prev.sampleInputs]
      const updatedOutputs = [...prev.sampleOutputs]
      const updatedImages = [...prev.sampleImages]

      updatedInputs.splice(index, 1)
      updatedOutputs.splice(index, 1)
      updatedImages.splice(index, 1)

      return {
        ...prev,
        sampleInputs: updatedInputs,
        sampleOutputs: updatedOutputs,
        sampleImages: updatedImages,
      }
    })
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const walletAddress = currentAccount?.address

    // Check if user is logged in
    if (!walletAddress) {
      toast.error("Please connect your wallet to submit a prompt")
      return
    }

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.systemPrompt
    ) {
      toast.error("Please fill in all required fields before submitting")
      return
    }

    // Model is only required for "prompt" category
    if (formData.category === "prompt" && !formData.model) {
      toast.error("Please select an AI model for your prompt")
      return
    }

    // Check sample inputs/outputs
    if (formData.category === "prompt") {
      const hasInput = formData.sampleInputs[0] && formData.sampleInputs[0].trim() !== "";
      
      const isImageModel = formData.model && (formData.model.includes("dall-e") || formData.model.includes("stable-diffusion"));
      const hasOutput = isImageModel 
        ? (formData.sampleImages[0] && formData.sampleImages[0].trim() !== "")
        : (formData.sampleOutputs[0] && formData.sampleOutputs[0].trim() !== "");

      if (!hasInput) {
        toast.error("Please provide at least one sample input")
        return
      }

      if (!hasOutput) {
        toast.error(
          isImageModel 
            ? "Please provide at least one sample image for image generation prompts"
            : "Please provide at least one sample output text"
        )
        return
      }
    }

    setIsSubmitting(true)

    try {
      toast.info("Starting listing process...")

      // Determine category: 0 for text, 1 for image
      const isImageModel = formData.model && (formData.model.includes("dall-e") || formData.model.includes("stable-diffusion"));
      const category = isImageModel ? 1 : 0;

      // Get the appropriate sample output
      const outputSample = isImageModel 
        ? formData.sampleImages[0] 
        : formData.sampleOutputs[0];

      // Create marketplace service
      const marketplaceService = new MarketplaceService(suiClient);

      // List the prompt (this handles all 3 steps internally)
      const result = await marketplaceService.listPrompt(
        {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          inputSample: formData.sampleInputs[0],
          outputSample: outputSample,
          category: category,
          promptContent: formData.systemPrompt,
        },
        (tx) => {
          return new Promise((resolve, reject) => {
            signAndExecuteTransaction(
              {
                transaction: tx,
              },
              {
                onSuccess: (result) => resolve(result),
                onError: (error) => reject(error),
              }
            );
          });
        }
      );

      console.log("✅ Prompt listed successfully:", result);

      toast.success(`Prompt "${formData.title}" listed successfully!`)
      
      setTimeout(() => {
        navigate("/")
      }, 1500)
    } catch (error) {
      console.error("Error submitting prompt:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to submit prompt. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if user is authenticated
  if (!currentAccount?.address) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center mesh-bg">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to create or edit prompts.
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
    )
  }

  // Show loading state when fetching prompt data
  if (isLoadingPrompt) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading prompt data...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  const steps = [
    { id: 1, name: "Basic Info", icon: <FileText className="h-5 w-5" /> },
    { id: 2, name: "Content", icon: <Code className="h-5 w-5" /> },
    { id: 3, name: "Preview", icon: <ImageIcon className="h-5 w-5" /> },
  ]

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <MainLayout>
      <div className="min-h-screen mesh-bg py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-teal-500/20 rounded-full border border-orange-500/30 mb-6">
              <Upload className="h-4 w-4 text-orange-400 mr-2" />
              <span className="text-sm text-orange-300">{isEditMode ? "Update your listing" : "Create new listing"}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">
                {isEditMode ? "Edit Your Content" : "Create Your Listing"}
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {isEditMode 
                ? "Update your content details and improve your listing."
                : "Share your expertise with the world and start earning."}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        currentStep >= step.id
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-500 text-white"
                          : "bg-card border-gray-600 text-gray-500"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${currentStep >= step.id ? "text-white" : "text-gray-500"}`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-all ${
                        currentStep > step.id ? "bg-gradient-to-r from-orange-500 to-amber-500" : "bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar - Step Navigation */}
              <div className="lg:col-span-1">
                <div className="glow-card rounded-2xl p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-white mb-4">Steps</h3>
                  <div className="space-y-2">
                    {steps.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setCurrentStep(step.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          currentStep === step.id
                            ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-2 border-orange-500/50 text-white"
                            : "bg-card/50 border border-gray-600/50 text-gray-400 hover:border-orange-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {step.icon}
                          <span className="font-medium">{step.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Form Content */}
              <div className="lg:col-span-2">

                {/* Step 1: Basic Details */}
                {currentStep === 1 && (
                  <div className="glow-card rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                        <FileText className="h-6 w-6 text-orange-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Basic Information</h2>
                        <p className="text-gray-400">Tell us about your content</p>
                      </div>
                    </div>
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-white font-semibold text-base">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="E.g., SEO Blog Post Generator"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="bg-card/50 border-orange-500/20 focus:border-orange-500 rounded-xl py-6 text-lg"
                    />
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Choose a clear, descriptive title that explains what your content does.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-white font-semibold text-base">Short Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Brief description of what your content does"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="resize-none bg-card/50 border-orange-500/20 focus:border-orange-500 rounded-xl"
                      rows={3}
                    />
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      This appears in search results and cards (100-150 characters recommended).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="category" className="text-white font-semibold text-base">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger id="category" className="bg-card/50 border-orange-500/20 focus:border-orange-500 rounded-xl py-6">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-orange-500/20">
                          <SelectItem value="prompt">Prompt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.category === "prompt" && (
                      <div className="space-y-3">
                        <Label htmlFor="model" className="text-white font-semibold text-base">AI Model</Label>
                        <Select
                          value={formData.model}
                          onValueChange={(value) =>
                            handleSelectChange("model", value)
                          }
                        >
                          <SelectTrigger id="model" className="bg-card/50 border-orange-500/20 focus:border-orange-500 rounded-xl py-6">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-orange-500/20">
                            {models.map((item) => {
                              return (
                                <SelectItem value={item.name} key={item.id}>
                                  {item.name}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Price Input - SUI */}
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-white font-semibold text-base">
                      Price (SUI)
                    </Label>
                    <div className="relative">
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0.1"
                        step="0.1"
                        placeholder="10"
                        value={formData.price}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0
                          setFormData((prev) => ({ ...prev, price: value }))
                        }}
                        required
                        className="bg-card/50 border-orange-500/20 focus:border-orange-500 rounded-xl py-6 text-lg pr-16"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-lg font-semibold text-teal-400">SUI</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Set a competitive price in SUI tokens based on the complexity and value of your content.
                    </p>
                  </div>

                  {/* TODO: Old USD pricing with sliders - Commented out for SUI blockchain
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="price" className="text-white font-semibold">Price (USD)</Label>
                      <span className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 px-4 py-2 rounded-xl">
                        <DollarSign className="h-5 w-5 text-orange-400" />
                        <span className="text-xl font-bold gradient-text">
                          ${formData.price.toFixed(2)}
                        </span>
                        {currentSuiPrice > 0 && (
                          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-orange-500/30">
                            <span className="text-xs font-medium text-gray-400">
                              ≈
                            </span>
                            <span className="text-xs font-medium text-teal-400">
                              {(formData.price / currentSuiPrice).toFixed(2)}{" "}
                              SUI
                            </span>
                          </div>
                        )}
                      </span>
                    </div>
                    <Slider
                      id="price"
                      min={1.99}
                      max={99.99}
                      step={1}
                      value={[formData.price]}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, price: value[0] }))
                      }
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>$1.99</span>
                      <span>$99.99</span>
                    </div>
                    <p className="text-xs text-gray-400 pt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Set a competitive price based on the complexity and value of your content.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="testPrice" className="text-white font-semibold">Test Price (USD)</Label>
                      <span className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 px-4 py-2 rounded-xl">
                        <DollarSign className="h-5 w-5 text-teal-400" />
                        <span className="text-xl font-bold text-teal-300">
                          ${formData.testPrice.toFixed(2)}
                        </span>
                        {currentSuiPrice > 0 && (
                          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-teal-500/30">
                            <span className="text-xs font-medium text-gray-400">
                              ≈
                            </span>
                            <span className="text-xs font-medium text-teal-400">
                              {(formData.testPrice / currentSuiPrice).toFixed(
                                2
                              )}{" "}
                              SUI
                            </span>
                          </div>
                        )}
                      </span>
                    </div>
                    <Slider
                      id="testPrice"
                      min={0.99}
                      max={Math.min(formData.price * 0.1, 9.99)}
                      step={0.5}
                      value={[formData.testPrice]}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          testPrice: value[0],
                        }))
                      }
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>$0.99</span>
                      <span>
                        ${Math.min(formData.price * 0.1, 9.99).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 pt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Test price must be 10% or less than the original price ($
                      {formData.price.toFixed(2)}).
                    </p>
                  </div>
                  */}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-orange-500/10">
                    <Button
                      variant="outline"
                      type="button"
                      className="px-6 py-3 border-2 border-gray-500/50 text-gray-300 hover:bg-gray-500/10 hover:text-white rounded-xl"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="button-primary px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
                      onClick={nextStep}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                )}

                {/* Step 2: Content */}
                {currentStep === 2 && (
                  <div className="glow-card rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20">
                        <Code className="h-6 w-6 text-teal-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Content & Prompts</h2>
                        <p className="text-gray-400">Add your prompt content</p>
                      </div>
                    </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="systemPrompt" className="text-white font-semibold text-base">System Prompt</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs glass-card border-orange-500/20">
                            <p className="text-white">
                              This is the prompt that buyers will receive after
                              purchase. Make it detailed and comprehensive for
                              best results and the prompt will be encrypted.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      id="systemPrompt"
                      name="systemPrompt"
                      placeholder="Enter your full system prompt here..."
                      value={formData.systemPrompt}
                      onChange={handleInputChange}
                      className="min-h-[250px] font-mono text-sm bg-card/50 border-orange-500/20 focus:border-orange-500 rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      This is the complete prompt that buyers will receive after purchase.
                    </p>
                  </div>

                  {/* Encryption Info */}
                  <div className="space-y-3 p-4 bg-purple-500/5 border border-purple-300/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      <Label className="text-sm font-medium text-purple-300">
                        Automatic Encryption
                      </Label>
                    </div>
                    <p className="text-xs text-gray-400">
                      Your system prompt will be automatically encrypted using SEAL when you submit. 
                      Only buyers who pay will be able to decrypt and access the full prompt content.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="userPrompt" className="text-white font-semibold text-base">User Prompt</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                            >
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs glass-card border-orange-500/20">
                            <p className="text-white">
                              This is the user prompt. This part won't be encrypted.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      id="userPrompt"
                      name="userPrompt"
                      placeholder="Enter your user prompt here..."
                      value={formData.userPrompt}
                      onChange={handleInputChange}
                      className="min-h-[250px] font-mono text-sm bg-card/50 border-orange-500/20 focus:border-orange-500 rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      This is the prompt users will see and can customize.
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-orange-500/10">
                    <Button
                      variant="outline"
                      type="button"
                      className="px-6 py-3 border-2 border-teal-500/50 text-teal-300 hover:bg-teal-500/10 hover:border-teal-500 rounded-xl flex items-center gap-2"
                      onClick={prevStep}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="button-primary px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
                      onClick={nextStep}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                )}

                {/* Step 3: Samples */}
                {currentStep === 3 && (
                  <div className="glow-card rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <ImageIcon className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Samples & Preview</h2>
                        <p className="text-gray-400">Showcase your content</p>
                      </div>
                    </div>
                  <div className="space-y-4">
                    {formData.sampleInputs.map((_input, index) => (
                      <div
                        key={index}
                        className="space-y-4 border rounded-lg p-4 relative"
                      >
                        <div className="absolute top-4 right-4">
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSample(index)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`sampleInput-${index}`}>
                            Sample Input {index + 1}
                          </Label>
                          <Textarea
                            id={`sampleInput-${index}`}
                            placeholder="Enter a sample input"
                            value={formData.sampleInputs[index]}
                            onChange={(e) =>
                              handleSampleChange(
                                index,
                                "sampleInputs",
                                e.target.value
                              )
                            }
                            className="resize-none"
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`sampleOutput-${index}`}>
                            Sample Output {index + 1}
                          </Label>
                          <div className="space-y-4">
                            {formData.category === "prompt" && formData.model && (formData.model.includes("dall-e") || formData.model.includes("stable-diffusion")) ? (
                              <div className="space-y-3">
                                {formData.sampleImages[index] ? (
                                  <div className="relative group">
                                    <img
                                      src={formData.sampleImages[index]}
                                      alt={`Sample ${index + 1}`}
                                      className="rounded-md max-h-64 w-auto mx-auto border border-purple-300/30"
                                      onLoad={(e) => {
                                        if (
                                          formData.sampleImages[
                                            index
                                          ].startsWith("blob:") &&
                                          !imageSizes[index]
                                        ) {
                                          const img =
                                            e.target as HTMLImageElement
                                          const estimatedSize = (
                                            (img.naturalWidth *
                                              img.naturalHeight *
                                              4) /
                                            (1024 * 1024)
                                          ).toFixed(2)
                                          setImageSizes((prev) => ({
                                            ...prev,
                                            [index]: estimatedSize,
                                          }))
                                        }
                                      }}
                                      onError={(e) => {
                                        e.currentTarget.src =
                                          "https://placehold.co/600x400/252232/e2e8f0?text=Sample+Image"
                                        setImageSizes((prev) => ({
                                          ...prev,
                                          [index]: "N/A",
                                        }))
                                      }}
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
                                      {uploadingImages[index] ? (
                                        <span className="flex items-center gap-1">
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                          Uploading to Walrus...
                                        </span>
                                      ) : imageSizes[index] ? (
                                        `${imageSizes[index]} MB`
                                      ) : (
                                        "Calculating size..."
                                      )}
                                    </div>
                                    {formData.sampleImages[index] && formData.sampleImages[index].includes('walrus') && (
                                      <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                                        Walrus
                                      </div>
                                    )}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          handleImageUpload(index, "")
                                        }
                                      >
                                        <Trash className="h-3 w-3 mr-1" />
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center border border-dashed border-purple-300/30 rounded-md p-8 bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
                                    <div className="text-center">
                                      <label
                                        htmlFor={`imageUpload-${index}`}
                                        className="cursor-pointer"
                                      >
                                        <div className="flex flex-col items-center">
                                          <PlusCircle className="h-8 w-8 text-purple-400 mb-2" />
                                          <span className="text-sm font-medium text-gray-300">
                                            {index === 0
                                              ? "Add required sample image"
                                              : "Add sample image"}
                                          </span>
                                          <span className="text-xs text-gray-500 mt-1">
                                            PNG, JPG or WEBP (max 5MB)
                                          </span>
                                        </div>
                                        <Input
                                          id={`imageUpload-${index}`}
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={async (e) => {
                                            if (
                                              e.target.files &&
                                              e.target.files[0]
                                            ) {
                                              const file = e.target.files[0]
                                              
                                              // Validate file size (max 10MB)
                                              const maxSize = 10 * 1024 * 1024 // 10MB
                                              if (file.size > maxSize) {
                                                toast.error("Image size must be less than 10MB")
                                                return
                                              }
                                              
                                              // Show preview with blob URL
                                              const previewUrl = URL.createObjectURL(file)

                                              const fileSizeMB = (
                                                file.size /
                                                (1024 * 1024)
                                              ).toFixed(2)
                                              setImageSizes((prev) => ({
                                                ...prev,
                                                [index]: fileSizeMB,
                                              }))

                                              handleImageUpload(index, previewUrl)
                                              
                                              // Upload to Walrus in background
                                              setUploadingImages((prev) => ({
                                                ...prev,
                                                [index]: true,
                                              }))
                                              
                                              try {
                                                toast.info(`Uploading image ${index + 1} to Walrus...`)
                                                const result = await uploadToWalrus(file)
                                                
                                                // Update with Walrus URL
                                                handleImageUpload(index, result.url)
                                                
                                                toast.success(`Image ${index + 1} uploaded successfully!`)
                                                console.log(`Image ${index} uploaded to Walrus:`, result)
                                              } catch (error) {
                                                console.error(`Failed to upload image ${index}:`, error)
                                                toast.error(`Failed to upload image ${index + 1}. Using local preview.`)
                                              } finally {
                                                setUploadingImages((prev) => ({
                                                  ...prev,
                                                  [index]: false,
                                                }))
                                              }
                                            }
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Textarea
                                id={`sampleOutput-${index}`}
                                placeholder="Provide the corresponding output"
                                value={formData.sampleOutputs[index]}
                                onChange={(e) =>
                                  handleSampleChange(
                                    index,
                                    "sampleOutputs",
                                    e.target.value
                                  )
                                }
                                className="resize-none"
                                rows={6}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {formData.sampleInputs.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={addSample}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Sample
                      </Button>
                    )}
                  </div>

                  <div>
                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-sky-900">
                      <h4 className="font-semibold mb-2">Guidelines for Examples</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                          Include at least one clear, high-quality sample to showcase the value of your prompt to potential buyers.
                        </li>
                        <li>
                          Our team will review your sample outputs to confirm their accuracy and reliability.
                        </li>
                        <li>
                          Submitting misleading or inaccurate examples can result in removal from the marketplace.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-orange-500/10">
                    <Button
                      variant="outline"
                      type="button"
                      className="px-6 py-3 border-2 border-teal-500/50 text-teal-300 hover:bg-teal-500/10 hover:border-teal-500 rounded-xl flex items-center gap-2"
                      onClick={prevStep}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="button-primary px-10 py-3 text-lg rounded-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {isEditMode ? "Updating..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          {isEditMode ? "Update Content" : "Publish Listing"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}

export default SellPrompt
