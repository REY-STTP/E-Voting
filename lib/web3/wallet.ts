// lib/web3/wallet.ts
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import {
  SEPOLIA_CHAIN_ID_DEC,
  SEPOLIA_CHAIN_ID_HEX,
  SEPOLIA_PARAMS,
  SEPOLIA_RPC_URL,
  SEPOLIA_EXPLORER_URL
} from "./config";

let wcProviderInstance: WalletConnectProvider | null = null;

export class WalletService {
  static isMetaMaskInstalled(): boolean {
    return typeof window !== "undefined" && !!(window as any).ethereum && !!(window as any).ethereum.isMetaMask;
  }

  static async ensureSepoliaNetwork(provider?: any): Promise<boolean> {
    if (typeof window === "undefined") return false;
    
    const ethereum = provider || (window as any).ethereum;
    if (!ethereum) return false;

    try {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      
      if (chainId === SEPOLIA_CHAIN_ID_HEX) {
        console.log("Already on Sepolia network");
        return true;
      }

      console.log(`Current chain: ${chainId}, switching to Sepolia...`);
      
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
        console.log("Successfully switched to Sepolia");
        return true;
      } catch (switchError: any) {
        console.log("Switch error:", switchError);
        
        if (switchError.code === 4902 || switchError.code === -32603) {
          console.log("Adding Sepolia network to wallet...");
          
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [SEPOLIA_PARAMS],
            });
            
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
            });
            
            console.log("Successfully added and switched to Sepolia");
            return true;
          } catch (addError: any) {
            console.error("Failed to add Sepolia network:", addError);
            
            throw new Error(
              `Failed to add Sepolia network to your wallet. ` +
              `Please add it manually:\n` +
              `Network Name: Sepolia Test Network\n` +
              `RPC URL: ${SEPOLIA_RPC_URL}\n` +
              `Chain ID: ${SEPOLIA_CHAIN_ID_DEC} (0x${SEPOLIA_CHAIN_ID_DEC.toString(16)})\n` +
              `Currency Symbol: ETH\n` +
              `Block Explorer: ${SEPOLIA_EXPLORER_URL[0]}`
            );
          }
        } else {
          console.error("Failed to switch network:", switchError);
          throw new Error(
            `Failed to switch to Sepolia network. ` +
            `Please switch manually in your wallet. Error: ${switchError.message}`
          );
        }
      }
    } catch (err: any) {
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

  static async connectInjected(walletId: string): Promise<string> {
    if (typeof window === "undefined") {
      throw new Error("Window object tidak tersedia.");
    }

    let provider: any = null;

    switch (walletId) {
      case 'metamask':
        if ((window as any).ethereum && (window as any).ethereum.isMetaMask) {
          provider = (window as any).ethereum;
        }
        break;
      case 'phantom':
        if ((window as any).solana && (window as any).solana.isPhantom) {
          if ((window as any).phantom && (window as any).phantom.ethereum) {
            provider = (window as any).phantom.ethereum;
          } else if ((window as any).ethereum) {
            provider = (window as any).ethereum;
          }
        }
        break;
      case 'okx':
        if ((window as any).okxwallet) {
          provider = (window as any).okxwallet;
        }
        break;
      default:
        if ((window as any).ethereum) {
          provider = (window as any).ethereum;
        }
    }

    if (!provider) {
      throw new Error(`Wallet ${walletId} tidak terdeteksi. Pastikan wallet sudah terinstall.`);
    }

    try {
      await this.ensureSepoliaNetwork(provider);

      const accounts = await provider.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("Tidak ada akun yang ditemukan.");
      }

      return accounts[0].toLowerCase();
    } catch (err: any) {
      console.error(`Error connecting to ${walletId}:`, err);
      
      if (err.code === 4001) {
        throw new Error("Koneksi ditolak oleh pengguna.");
      }
      
      if (err.message.includes("Failed to add Sepolia network")) {
        throw err;
      }
      
      throw new Error(err.message || `Gagal menghubungkan ke ${walletId}.`);
    }
  }

  static async disconnectWalletConnect(): Promise<void> {
    try {
      if (!wcProviderInstance) return;

      try {
        await (wcProviderInstance as any).disconnect?.();
      } catch (e) {
        // Ignore
      }
      try {
        await (wcProviderInstance as any).close?.();
      } catch (e) {
        // Ignore
      }

      try {
        const connector = (wcProviderInstance as any).connector;
        if (connector && typeof connector.killSession === "function") {
          connector.killSession();
        }
      } catch (e) {
        // Ignore
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