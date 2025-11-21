import { VITE_APP_ENOKI_PUBLIC_KEY } from "@/constants";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";
import { useEffect } from "react";

const RegisterEnokiWallets = () => {
  const { client, network } = useSuiClientContext();
  useEffect(() => {
    if (!isEnokiNetwork(network)) return;
    const { unregister } = registerEnokiWallets({
      apiKey: VITE_APP_ENOKI_PUBLIC_KEY,
      providers: {},
      client,
      network,
    });
    return unregister;
  }, [client, network]);

  return null;
};

export default RegisterEnokiWallets;
