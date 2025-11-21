import { createRoot } from "react-dom/client";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider } from "@tanstack/react-query";

import "@/index.css";
import App from "@/App.tsx";
import { queryClient } from "@/lib/reactQuery";
import networkConfig from "@/lib/networkConfig";
import RegisterEnokiWallets from "@/providers/RegisterEnokiWallets";
import { VITE_APP_NETWORK } from "@/constants";
import { AuthProvider } from "./context/AuthContext";

const envNetwork =
  VITE_APP_NETWORK || ("testnet" as keyof typeof networkConfig);

if (!envNetwork) {
  throw new Error(`Invalid VITE_APP_NETWORK: ${envNetwork}`);
}

console.log(envNetwork);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networkConfig} defaultNetwork={envNetwork}>
      <RegisterEnokiWallets />
      <WalletProvider autoConnect>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);
