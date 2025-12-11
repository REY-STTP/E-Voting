// hooks/useWallet.ts
import { useEffect, useState } from "react";
import { VotingService } from "@/lib/web3/voting";

export const useWallet = () => {
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const mod = await import("@/lib/web3/wallet");
        if (mod?.WalletService && typeof mod.WalletService.isMetaMaskInstalled === "function") {
          try {
            const installed = mod.WalletService.isMetaMaskInstalled();
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

  const initSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
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
    const mod = await import("@/lib/web3/wallet");
    if (!mod?.WalletService) {
      throw new Error("WalletService tidak tersedia.");
    }

    let acc: string;

    if (walletId === 'walletconnect') {
      if (typeof mod.WalletService.connectWithWalletConnect !== "function") {
        throw new Error("WalletConnect tidak tersedia.");
      }
      acc = await mod.WalletService.connectWithWalletConnect();
    } else {
      // Injected wallet (MetaMask, Phantom, OKX, etc.)
      if (typeof mod.WalletService.connectInjected !== "function") {
        throw new Error("Injected wallet connection tidak tersedia.");
      }
      acc = await mod.WalletService.connectInjected(walletId);
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

  const disconnectWallet = async () => {
    // Clear local state first
    setAccount("");
    setIsConnected(false);
    setHasVoted(false);
    setIsAdmin(false);

    // Then logout from server
    await fetch("/api/auth/logout", { method: "POST" });

    try {
      const mod = await import("@/lib/web3/wallet");
      if (mod?.WalletService && typeof mod.WalletService.disconnectWalletConnect === "function") {
        await mod.WalletService.disconnectWalletConnect();
      }
    } catch (err) {
      console.error("Error disconnecting wallet provider (dynamic import):", err);
    }
  };

  return {
    account,
    isConnected,
    hasVoted,
    isAdmin,
    isInitializing,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    checkWalletConnection,
  };
};