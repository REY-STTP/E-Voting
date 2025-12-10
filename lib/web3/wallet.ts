// lib/web3/wallet.ts
import { SEPOLIA_CHAIN_ID_HEX, SEPOLIA_PARAMS } from './config';

export class WalletService {
  static isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum;
  }

  static async ensureSepoliaNetwork(): Promise<void> {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (chainId === SEPOLIA_CHAIN_ID_HEX) return;

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
      } catch (error: any) {
        if (error?.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_PARAMS],
          });
        } else {
          console.error('Failed to switch network:', error);
          throw error;
        }
      }
    } catch (err) {
      console.error('Error ensuring Sepolia network:', err);
      throw err;
    }
  }

  static async checkConnection(): Promise<string[]> {
    if (typeof window === 'undefined' || !window.ethereum) {
      return [];
    }

    try {
      await this.ensureSepoliaNetwork();

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      return accounts as string[];
    } catch (error) {
      console.error('Error checking wallet:', error);
      return [];
    }
  }

  static async connect(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error(
        'MetaMask tidak terdeteksi. Silakan install MetaMask terlebih dahulu.'
      );
    }

    try {
      await this.ensureSepoliaNetwork();

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const acc = (accounts as string[])[0];

      if (!acc) {
        throw new Error('Tidak ada akun yang ditemukan di MetaMask.');
      }

      return acc;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error(
        'Gagal menghubungkan wallet. Pastikan MetaMask terinstall dan diizinkan.'
      );
    }
  }
}
