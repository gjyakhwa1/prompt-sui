import { useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import { useLogin } from "./context/AuthContext";

function App() {
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const { logOut, isLoading, login } = useLogin();
  console.log(currentAccount);
  return currentAccount ? (
    <div className="flex flex-col items-center justify-center">
      <div>Wallet Address: {currentAccount.address}</div>
      <button
        className="border border-black p-1 rounded-sm hover:cursor-pointer"
        onClick={() => logOut()}
      >
        Logout
      </button>
    </div>
  ) : isLoading ? (
    <>Loading..</>
  ) : (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="border border-black p-2 w-1/2 h-1/2 rounded-3xl flex flex-col gap-2 items-center justify-center">
        {wallets &&
          wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => login(wallet)}
              className="border border-black p-2 w-1/2 rounded-2xl hover:cursor-pointer hover:bg-amber-200"
            >
              {wallet.name === "Slush" ? "Connect Wallet" : wallet.name}
            </button>
          ))}
      </div>
    </div>
  );
}

export default App;
