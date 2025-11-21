import { useConnectWallet, useDisconnectWallet } from "@mysten/dapp-kit";
import React, { createContext, useContext, useState } from "react";

interface LoginContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (wal: any) => void;
  logOut: () => void;
}

const AuthContext = createContext<LoginContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: connect } = useConnectWallet({
    onSuccess: async () => {
      setIsLoading(false);
    },
    onError: async () => {
      setIsLoading(false);
    },
  });

  const login = (wallet: any) => {
    setIsLoading(true);
    connect({ wallet: wallet });
  };

  const logOut = () => {
    setIsLoading(true);
    try {
      disconnect();
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: LoginContextType = {
    isLoading,
    isLoggedIn,
    login,
    logOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useLogin must be used within UserProvider");
  }
  return context;
};
