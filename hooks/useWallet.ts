// hooks/useWallet.ts
import { useEffect, useState } from "react";
import { VotingService } from "@/lib/web3/voting";
import { WalletService } from "@/lib/web3/wallet";

export const useWallet = () => {
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        if (WalletService && typeof WalletService.isMetaMaskInstalled === "function") {
          try {
            const installed = WalletService.isMetaMaskInstalled();
            setIsMetaMaskInstalled(Boolean(installed));
          } catch {
            const installed = typeof window !== "undefined" && !!(window as any).ethereum && !!(window as any).ethereum.isMetaMask;
            setIsMetaMaskInstalled(Boolean(installed));
          }
        } else {
          const installed = typeof window !== "undefined" && !!(window as any).ethereum && !!(window as any).ethereum.isMetaMask;
          setIsMetaMaskInstalled(Boolean(installed));
        }
      } catch (e) {
        const installed = typeof window !== "undefined" && !!(window as any).ethereum && !!(window as any).ethereum.isMetaMask;
        setIsMetaMaskInstalled(Boolean(installed));
      }

      initSession();
    })();

  }, []);

  const initSession = async (retryCount = 0) => {
    try {
      const res = await fetch("/api/auth/session", {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await res.json();

      if (data?.address) {
        setAccount(data.address);
        setIsConnected(true);
        setIsAdmin(Boolean(data.isAdmin));
        try {
          const voted = await VotingService.hasVoted(data.address);
          setHasVoted(voted);
        } catch (err) {
          console.error("Error checking hasVoted from session:", err);
          setHasVoted(false);
        }
      } else {
        setAccount("");
        setIsConnected(false);
        setHasVoted(false);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error initializing session:", err);
      
      if (retryCount < 3) {
        setTimeout(() => initSession(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        setAccount("");
        setIsConnected(false);
        setHasVoted(false);
        setIsAdmin(false);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const checkWalletConnection = async () => {
    if (!account) return;
    try {
      const voted = await VotingService.hasVoted(account);
      setHasVoted(voted);
    } catch (err) {
      console.error("Error checking hasVoted:", err);
    }
  };

  const connectWallet = async (walletId: string): Promise<{ address: string; isAdmin: boolean }> => {
    setNetworkError("");
    
    const mod = await import("@/lib/web3/wallet");
    if (!WalletService) {
      throw new Error("WalletService tidak tersedia.");
    }

    let acc: string;

    try {
      if (walletId === 'walletconnect') {
        if (typeof WalletService.connectWithWalletConnect !== "function") {
          throw new Error("WalletConnect tidak tersedia.");
        }
        acc = await WalletService.connectWithWalletConnect();
      } else {
        if (typeof WalletService.connectInjected !== "function") {
          throw new Error("Injected wallet connection tidak tersedia.");
        }
        acc = await WalletService.connectInjected(walletId);
      }
    } catch (error: any) {
      if (error.message.includes("Sepolia network")) {
        setNetworkError(error.message);
      }
      throw error;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: acc }),
    });

    const data = await res.json();

    const normalized = acc.toLowerCase();
    const adminFlag = Boolean(data.isAdmin);

    setAccount(normalized);
    setIsConnected(true);
    setIsAdmin(adminFlag);

    try {
      const voted = await VotingService.hasVoted(acc);
      setHasVoted(voted);
    } catch (err) {
      console.error("Error checking hasVoted after connect:", err);
      setHasVoted(false);
    }

    return { address: normalized, isAdmin: adminFlag };
  };

  const disconnectWallet = async (shouldNavigate = false) => {
    setAccount("");
    setIsConnected(false);
    setHasVoted(false);
    setIsAdmin(false);
    setNetworkError("");

    try {
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include'
      });
    } catch (err) {
      console.error("Error during logout API call:", err);
    }

    try {
      if (WalletService && typeof WalletService.disconnectWalletConnect === "function") {
        await WalletService.disconnectWalletConnect();
      }
    } catch (err) {
      console.error("Error disconnecting wallet provider:", err);
    }

    if (shouldNavigate) {
      return;
    }
  };

  const forceRefreshSession = async () => {
    try {
      const res = await fetch("/api/auth/session", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      
      if (!data?.address) {
        setAccount("");
        setIsConnected(false);
        setIsAdmin(false);
        setHasVoted(false);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return false;
    }
  };

  return {
    account,
    isConnected,
    hasVoted,
    isAdmin,
    isInitializing,
    isMetaMaskInstalled,
    networkError,
    connectWallet,
    disconnectWallet,
    checkWalletConnection,
    clearNetworkError: () => setNetworkError(""),
    forceRefreshSession,
  };
};