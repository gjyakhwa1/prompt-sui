import { Link } from "react-router-dom";
import { Twitter, Github, MessageSquare, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="glass-card border-t border-orange-500/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="gradient-text text-2xl font-bold mb-4">Prompt Marketplace</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted platform for discovering, testing, and trading premium AI prompts. Powered by blockchain technology for authenticity and security.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-orange-400 transition-colors">Browse Prompts</Link></li>
              <li><Link to="/sell-prompt" className="text-gray-400 hover:text-orange-400 transition-colors">Sell Prompts</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-orange-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-orange-500/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2025 Prompt Marketplace. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            Built with <Heart className="h-4 w-4 mx-1 text-red-500" /> on Sui Blockchain
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
