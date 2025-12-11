// lib/web3/wallet.ts
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import {
  SEPOLIA_CHAIN_ID_DEC,
  SEPOLIA_CHAIN_ID_HEX,
  SEPOLIA_PARAMS,
  SEPOLIA_RPC_URL,
} from "./config";

let wcProviderInstance: WalletConnectProvider | null = null;

export class WalletService {
  static isMetaMaskInstalled(): boolean {
    return typeof window !== "undefined" && !!(window as any).ethereum && !!(window as any).ethereum.isMetaMask;
  }

  static async ensureSepoliaNetwork(): Promise<void> {
    if (typeof window === "undefined" || !(window as any).ethereum) return;

    try {
      const chainId = await (window as any).ethereum.request({ method: "eth_chainId" });
      if (chainId === SEPOLIA_CHAIN_ID_HEX) return;

      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
      } catch (error: any) {
        if (error?.code === 4902) {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SEPOLIA_PARAMS],
          });
        } else {
          console.error("Failed to switch network:", error);
          throw error;
        }
      }
    } catch (err) {
      console.error("Error ensuring Sepolia network:", err);
      throw err;
    }
  }
  
  static async connectWithWalletConnect(): Promise<string> {
    if (!wcProviderInstance) {
      wcProviderInstance = new WalletConnectProvider({
        rpc: {
          [SEPOLIA_CHAIN_ID_DEC]: SEPOLIA_RPC_URL,
        },
        chainId: SEPOLIA_CHAIN_ID_DEC,
        qrcode: true,
      });
    }

    try {
      await wcProviderInstance.enable();

      const web3Provider = new ethers.BrowserProvider(wcProviderInstance as any);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();

      return address.toLowerCase();
    } catch (err) {
      console.error("WalletConnect connection failed:", err);
      throw new Error("Gagal menghubungkan wallet lewat WalletConnect.");
    }
  }

  static async disconnectWalletConnect(): Promise<void> {
    try {
      if (!wcProviderInstance) return;

      try {
        await (wcProviderInstance as any).disconnect?.();
      } catch (e) {
      }
      try {
        await (wcProviderInstance as any).close?.();
      } catch (e) {
      }

      try {
        const connector = (wcProviderInstance as any).connector;
        if (connector && typeof connector.killSession === "function") {
          connector.killSession();
        }
      } catch (e) {
      }

      wcProviderInstance = null;
    } catch (err) {
      console.error("Error disconnecting WalletConnect:", err);
    }
  }

  static async checkConnectionInjected(): Promise<string[]> {
    if (typeof window === "undefined" || !(window as any).ethereum) return [];
    try {
      await this.ensureSepoliaNetwork();
      const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
      return accounts as string[];
    } catch (err) {
      console.error("Error checking injected wallet:", err);
      return [];
    }
  }
}
