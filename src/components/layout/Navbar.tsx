import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useCurrentAccount, useWallets } from "@mysten/dapp-kit";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useLogin } from "@/context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const account = useCurrentAccount();
  const wallets = useWallets();
  const { logOut, isLoggedIn, login } = useLogin();
  console.log(wallets);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  if (wallets.length === 0) {
    toast("Install Slush Wallet");
  }

  return (
    <nav className="glass-card sticky top-0 z-50 w-full border-b border-orange-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="shrink-0 flex items-center group">
              <div className="inline-flex items-center px-3 py-2 rounded-xl bg-linear-to-r from-orange-500/10 to-teal-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                <span className="text-2xl font-bold">
                  <span className="gradient-text">Prompt Marketplace</span>
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-xl border border-orange-500/30 hover:border-orange-500/60"
                  >
                    <User className="h-5 w-5 text-orange-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass-card border-orange-500/20"
                >
                  <DropdownMenuLabel className="text-white">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-orange-500/20" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-orange-500/10 focus:bg-orange-500/10">
                    <Link to="/dashboard" className="w-full flex items-center">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-orange-500/10 focus:bg-orange-500/10">
                    <Link to="/profile" className="w-full flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-orange-500/10 focus:bg-orange-500/10">
                    <Link to="/sell-prompt" className="w-full">
                      Sell a Prompt
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-orange-500/20" />
                  <DropdownMenuItem
                    onClick={logOut}
                    className="text-gray-300 hover:text-white focus:text-white hover:bg-orange-500/10 focus:bg-orange-500/10"
                  >
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Button
                  asChild
                  variant="outline"
                  className="px-6 py-5 text-base border-2 border-teal-500/50 text-teal-300 hover:bg-teal-500/10 hover:border-teal-500 transition-all duration-300 rounded-xl"
                >
                  <Link to="/marketplace">Explore</Link>
                </Button>
                {account?.address ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="button-primary px-6 py-5 text-base rounded-xl shadow-lg shadow-orange-500/20">
                        ${account.address.slice(0, 6)}...$
                        {account.address.slice(-4)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="glass-card border-orange-500/20"
                    >
                      <DropdownMenuLabel className="text-white">
                        Wallet Connected
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-orange-500/20" />
                      <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-orange-500/10 focus:bg-orange-500/10">
                        <Link
                          to="/dashboard"
                          className="w-full flex items-center"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-orange-500/10 focus:bg-orange-500/10">
                        <Link
                          to="/profile"
                          className="w-full flex items-center"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-orange-500/10 focus:bg-orange-500/10">
                        <Link
                          to="/sell-prompt"
                          className="w-full flex items-center"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Sell a Prompt
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white hover:bg-orange-500/10 focus:bg-orange-500/10">
                        <Link
                          to="/marketplace"
                          className="w-full flex items-center"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Marketplace
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-orange-500/20" />
                      <DropdownMenuItem
                        onClick={logOut}
                        className="text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    className="button-primary px-6 py-5 text-base rounded-xl shadow-lg shadow-orange-500/20 hover: cursor-pointer"
                    onClick={() => login(wallets[0])}
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-300 hover:text-white hover:bg-orange-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-card border-t border-orange-500/10">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-white flex items-center rounded-r-xl"
              onClick={toggleMenu}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/sell-prompt"
                  className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-white rounded-r-xl"
                  onClick={toggleMenu}
                >
                  Sell a Prompt
                </Link>
                <button
                  className="w-full text-left block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-white rounded-r-xl"
                  onClick={() => {
                    logOut();
                    toggleMenu();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 px-3 pt-2 pb-3">
                <Button
                  asChild
                  variant="outline"
                  className="text-white border-teal-500/50 hover:bg-teal-500/10 rounded-xl"
                  onClick={() => login(wallets[0])}
                >
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
