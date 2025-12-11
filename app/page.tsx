// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/components/ui/ToastProvider';
import { AlertTriangle } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { 
    account, 
    isConnected, 
    isAdmin, 
    networkError,
    connectWallet, 
    disconnectWallet,
    clearNetworkError,
    isInitializing
  } = useWallet();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isInitializing && !isConnected && account) {
      window.location.reload();
    }
  }, [isInitializing, isConnected, account]);

  const goToDashboardByRole = (isAdminFlag?: boolean) => {
    const admin = typeof isAdminFlag === 'boolean' ? isAdminFlag : isAdmin;
    if (admin) {
      router.push('/admin');
    } else {
      router.push('/voting');
    }
  };

  const handleConnect = async (walletId: string) => {
    try {
      clearNetworkError();
      const result = await connectWallet(walletId);
      
      const walletName = walletId === 'walletconnect' 
        ? 'WalletConnect' 
        : walletId.charAt(0).toUpperCase() + walletId.slice(1);
      
      showToast({
        type: 'success',
        title: 'Wallet terhubung',
        message: `Wallet berhasil terhubung melalui ${walletName}.`,
      });
      goToDashboardByRole(result.isAdmin);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      if (networkError) {
        showToast({
          type: 'error',
          title: 'Masalah Jaringan Sepolia',
          message: networkError,
          duration: 10000,
        });
      } else {
        showToast({
          type: 'warning',
          title: 'Gagal menghubungkan wallet',
          message:
            error?.message ??
            'Gagal menghubungkan wallet. Pastikan wallet Anda sudah terinstall atau coba gunakan WalletConnect.',
        });
      }
    }
  };

  const handleStartVoting = async () => {
    if (isConnected) {
      goToDashboardByRole();
      return;
    }
  };

  const handleDisconnect = () => {
    disconnectWallet(false);
    showToast({
      type: 'info',
      title: 'Disconnected',
      message: 'Wallet berhasil diputus dari DApp.',
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {networkError && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                Perhatian: Masalah Jaringan Sepolia
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 whitespace-pre-line">
                {networkError}
              </p>
            </div>
            <button 
              onClick={clearNetworkError}
              className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <Hero
        isConnected={isConnected}
        account={account}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      <Features />
      <HowItWorks
        isConnected={isConnected}
        isAdmin={isAdmin}
        onStartVoting={handleStartVoting}
        onConnect={handleConnect}
      />

      <footer className="bg-white dark:bg-slate-900 py-8 border-t border-gray-200 dark:border-slate-800 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-slate-300">
          <p className="mb-2">🔒 Powered by Web3 Technology</p>
          <p className="text-sm">
            Secure, Transparent &amp; Decentralized Voting System
          </p>
          <p className="text-xs mt-2 text-gray-500 dark:text-slate-500">
            Network: Sepolia Testnet - Chain ID: 11155111
          </p>
        </div>
      </footer>
    </div>
  );
}