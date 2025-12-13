// hooks/useWallet.ts
import { useEffect, useState } from "react";
import { VotingService } from "@/lib/web3/voting";
import { WalletService } from "@/lib/web3/wallet";

export const useWallet = () => {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [networkError, setNetworkError] = useState("");

  useEffect(() => {
    setIsWalletInstalled(WalletService.isInjectedInstalled());
    initSession();
  }, []);

  const initSession = async (retry = 0) => {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (data?.address) {
        const addr = data.address.toLowerCase();

        setAccount(addr);
        setIsConnected(true);
        setIsAdmin(Boolean(data.isAdmin));

        try {
          const voted = await VotingService.hasVoted(addr);
          setHasVoted(voted);
        } catch {
          setHasVoted(false);
        }
      } else {
        resetState();
      }
    } catch (err) {
      console.error("Init session error:", err);
      if (retry < 3) {
        setTimeout(() => initSession(retry + 1), 1000 * (retry + 1));
      } else {
        resetState();
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const connectWallet = async (): Promise<{
    address: string;
    isAdmin: boolean;
  }> => {
    setNetworkError("");

    if (!WalletService.isInjectedInstalled()) {
      throw new Error("Wallet tidak terdeteksi");
    }

    let address: string;

    try {
      address = await WalletService.connect();
    } catch (err: any) {
      if (err.message?.includes("Sepolia")) {
        setNetworkError(err.message);
      }
      throw err;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    const data = await res.json();

    const normalized = address.toLowerCase();
    const adminFlag = Boolean(data.isAdmin);

    setAccount(normalized);
    setIsConnected(true);
    setIsAdmin(adminFlag);

    try {
      const voted = await VotingService.hasVoted(normalized);
      setHasVoted(voted);
    } catch {
      setHasVoted(false);
    }

    return { address: normalized, isAdmin: adminFlag };
  };

  const disconnectWallet = async () => {
    resetState();
    setNetworkError("");

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    return;
  };

  const checkWalletConnection = async () => {
    if (!account) return;
    try {
      const voted = await VotingService.hasVoted(account);
      setHasVoted(voted);
    } catch (err) {
      console.error("Check voted error:", err);
    }
  };

  const forceRefreshSession = async () => {
    try {
      const res = await fetch("/api/auth/session", {
        cache: "no-store",
      });
      const data = await res.json();

      if (!data?.address) {
        resetState();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const resetState = () => {
    setAccount("");
    setIsConnected(false);
    setIsAdmin(false);
    setHasVoted(false);
  };

  return {
    account,
    isConnected,
    hasVoted,
    isAdmin,
    isInitializing,
    isWalletInstalled,
    networkError,

    connectWallet,
    disconnectWallet,
    checkWalletConnection,
    forceRefreshSession,

    clearNetworkError: () => setNetworkError(""),
  };
};
