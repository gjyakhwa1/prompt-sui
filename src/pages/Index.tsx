import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Sparkles, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Star, 
  Rocket, 
  Brain, 
  Lock, 
  Globe, 
  ArrowRight,
  PlayCircle,
  Code2,
  Palette,
  Workflow,
  FileText
} from "lucide-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Try Before You Buy",
      description: "Test any prompt with live AI models before making a purchase. Experience the quality firsthand and make informed decisions.",
      icon: <PlayCircle className="h-7 w-7 text-orange-400" />,
      gradient: "from-orange-500/10 to-amber-500/10"
    },
    {
      title: "Blockchain Verified",
      description: "Every prompt is secured on the Sui blockchain, ensuring authenticity, ownership rights, and transparent transactions.",
      icon: <Shield className="h-7 w-7 text-teal-400" />,
      gradient: "from-teal-500/10 to-cyan-500/10"
    },
    {
      title: "Instant Monetization",
      description: "Turn your expertise into income. List your prompts and start earning from day one with automated payouts.",
      icon: <Zap className="h-7 w-7 text-purple-400" />,
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      title: "Quality Guaranteed",
      description: "Our AI verification system ensures every prompt meets quality standards before it reaches the marketplace.",
      icon: <Star className="h-7 w-7 text-amber-400" />,
      gradient: "from-amber-500/10 to-yellow-500/10"
    },
  ];

  const useCases = [
    {
      title: "Content Creators",
      description: "Generate engaging content that resonates with your audience using proven prompts.",
      icon: <FileText className="h-8 w-8" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "Developers",
      description: "Accelerate your coding projects with specialized prompts for code generation and debugging.",
      icon: <Code2 className="h-8 w-8" />,
      color: "text-teal-400",
      bgColor: "bg-teal-500/10"
    },
    {
      title: "Designers",
      description: "Create stunning visuals and design concepts with optimized image generation prompts.",
      icon: <Palette className="h-8 w-8" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Marketers",
      description: "Craft compelling copy and marketing campaigns that convert with expert-tested prompts.",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10"
    },
    {
      title: "Researchers",
      description: "Conduct thorough research and analysis with specialized prompts for data extraction.",
      icon: <Brain className="h-8 w-8" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      title: "Business Owners",
      description: "Streamline operations and boost productivity with workflow automation prompts.",
      icon: <Workflow className="h-8 w-8" />,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: <Users className="h-5 w-5" /> },
    { value: "100K+", label: "Prompts Listed", icon: <Sparkles className="h-5 w-5" /> },
    { value: "$2M+", label: "Creator Earnings", icon: <TrendingUp className="h-5 w-5" /> },
    { value: "4.9/5", label: "Avg Rating", icon: <Star className="h-5 w-5" /> },
  ];

  const whyChooseUs = [
    "Verified creators with proven track records",
    "Secure payments through blockchain technology",
    "30-day money-back guarantee on all purchases",
    "24/7 community support and assistance",
    "Regular quality audits and updates",
    "Access to exclusive creator masterclasses"
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Discover",
      description: "Browse thousands of verified prompts across multiple categories and AI models.",
      icon: <Globe className="h-6 w-6" />
    },
    {
      step: "02",
      title: "Test",
      description: "Try prompts live with real AI models to ensure they meet your needs.",
      icon: <PlayCircle className="h-6 w-6" />
    },
    {
      step: "03",
      title: "Purchase",
      description: "Complete secure transactions with cryptocurrency or traditional payment methods.",
      icon: <Lock className="h-6 w-6" />
    },
    {
      step: "04",
      title: "Create",
      description: "Use your prompts immediately and start generating amazing content.",
      icon: <Rocket className="h-6 w-6" />
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center mesh-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} transition-all duration-1000`}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/20 to-teal-500/20 rounded-full border border-orange-500/30 mb-6">
              <Sparkles className="h-4 w-4 text-orange-400 mr-2" />
              <span className="text-sm text-orange-300">Trusted by 50,000+ creators worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Transform Ideas</span>
              <br />
              <span className="text-white">Into Reality with AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover premium AI prompts, test them live, and unlock limitless creative potential. Join the world's largest marketplace for verified AI prompts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                className="button-primary px-8 py-7 text-lg rounded-xl shadow-2xl shadow-orange-500/30 group"
              >
                <Link to="/marketplace" className="flex items-center">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="px-8 py-7 text-lg border-2 border-teal-500/50 text-teal-300 hover:bg-teal-500/10 hover:border-teal-500 rounded-xl"
              >
                <Link to="/sell-prompt">Start Selling</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="glow-card p-6">
                  <div className="flex items-center justify-center mb-2 text-orange-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Why Choose Us</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of AI prompt trading with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glow-card p-8 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative bg-gradient-to-b from-transparent to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in minutes with our simple four-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="glow-card p-6 text-center h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 text-white font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <div className="mb-4 text-orange-400">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-orange-500/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Perfect For Everyone</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Whether you're a creator, developer, or business owner, we have prompts for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="glow-card p-6 card-hover"
              >
                <div className={`inline-flex p-3 rounded-xl ${useCase.bgColor} ${useCase.color} mb-4`}>
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                <p className="text-gray-400">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us List */}
      <section className="py-20 relative bg-gradient-to-b from-transparent to-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glow-card p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text">The Marketplace Advantage</span>
              </h2>
              <p className="text-xl text-gray-400">
                Built for creators, by creators
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyChooseUs.map((reason, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-teal-400 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-300">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="glow-card p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Ready to Get Started?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of creators and businesses who are already leveraging AI to its full potential. Your journey starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="outline"
                className="px-10 py-7 text-lg border-2 border-teal-500/50 text-teal-300 hover:bg-teal-500/10 hover:border-teal-500 rounded-xl"
              >
                <Link to="/marketplace">Browse Prompts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
