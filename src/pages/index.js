import Login from "../../components/login";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();

  return (
    <main>
      <div className="login-page">
        <div className="Log">
          {!isWeb3Enabled ? (
            <div>
              <ConnectButton moralisAuth={false} />
              <h1>Please Connect Your Wallet</h1>
            </div>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </main>
  );
}
