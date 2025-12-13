// lib/web3/wallet.ts
import {
  SEPOLIA_CHAIN_ID_DEC,
  SEPOLIA_CHAIN_ID_HEX,
  SEPOLIA_PARAMS,
  SEPOLIA_RPC_URL,
  SEPOLIA_EXPLORER_URL,
} from "./config";

export class WalletService {
  static get ethereum(): any {
    if (typeof window === "undefined") return null;
    return (window as any).ethereum ?? null;
  }

  static isInjectedInstalled(): boolean {
    return !!this.ethereum;
  }

  static async ensureSepoliaNetwork(): Promise<void> {
    const ethereum = this.ethereum;
    if (!ethereum) throw new Error("Wallet tidak terdeteksi");

    const chainId = await ethereum.request({ method: "eth_chainId" });
    if (chainId === SEPOLIA_CHAIN_ID_HEX) return;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [SEPOLIA_PARAMS],
        });

        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
      } else if (err.code === 4001) {
        throw new Error("Pergantian jaringan ditolak oleh pengguna");
      } else {
        throw new Error(
          `Gagal berpindah ke Sepolia. Tambahkan manual:\n
Network: Sepolia Testnet
RPC: ${SEPOLIA_RPC_URL}
Chain ID: ${SEPOLIA_CHAIN_ID_DEC}
Explorer: ${SEPOLIA_EXPLORER_URL[0]}`
        );
      }
    }
  }

  static async connect(): Promise<string> {
    const ethereum = this.ethereum;
    if (!ethereum) {
      throw new Error("Wallet injected tidak ditemukan");
    }

    try {
      await this.ensureSepoliaNetwork();

      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("Akun wallet tidak ditemukan");
      }

      return accounts[0].toLowerCase();
    } catch (err: any) {
      if (err.code === 4001) {
        throw new Error("Koneksi wallet ditolak oleh pengguna");
      }
      throw new Error(err.message || "Gagal menghubungkan wallet");
    }
  }

  static async checkConnection(): Promise<string[]> {
    const ethereum = this.ethereum;
    if (!ethereum) return [];

    try {
      await this.ensureSepoliaNetwork();
      const accounts: string[] = await ethereum.request({
        method: "eth_accounts",
      });
      return accounts.map((a) => a.toLowerCase());
    } catch {
      return [];
    }
  }
}
