// hooks/useWallet.ts
import { useEffect, useState } from "react";
import { VotingService } from "@/lib/web3/voting";

export const useWallet = () => {
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    // init session on mount
    initSession();
    // Optional: subscribe to WalletConnect disconnect events if needed
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

  /**
   * connectWallet uses dynamic import for WalletService to avoid possible
   * module-resolution / Turbopack caching issues.
   */
  const connectWallet = async (): Promise<{ address: string; isAdmin: boolean }> => {
    // dynamic import the wallet module at call time
    const mod = await import("@/lib/web3/wallet");
    // debug: show what we imported at runtime
    // eslint-disable-next-line no-console
    console.log("wallet module runtime:", mod);

    if (!mod?.WalletService || typeof mod.WalletService.connectWithWalletConnect !== "function") {
      // helpful error message for debugging runtime mismatch
      throw new Error(
        "WalletService.connectWithWalletConnect tidak tersedia pada runtime. Pastikan lib/web3/wallet.ts mengekspor WalletService dengan static method connectWithWalletConnect."
      );
    }

    // call the method
    const acc = await mod.WalletService.connectWithWalletConnect();

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
    // call backend logout
    await fetch("/api/auth/logout", { method: "POST" });

    // dynamic import and attempt disconnect (if provider exists)
    try {
      const mod = await import("@/lib/web3/wallet");
      // eslint-disable-next-line no-console
      console.log("wallet module (disconnect) runtime:", mod);
      if (mod?.WalletService && typeof mod.WalletService.disconnectWalletConnect === "function") {
        await mod.WalletService.disconnectWalletConnect();
      }
    } catch (err) {
      console.error("Error disconnecting wallet provider (dynamic import):", err);
    }

    setAccount("");
    setIsConnected(false);
    setHasVoted(false);
    setIsAdmin(false);
  };

  return {
    account,
    isConnected,
    hasVoted,
    isAdmin,
    isInitializing,
    connectWallet,
    disconnectWallet,
    checkWalletConnection,
  };
};
