// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/components/ui/ToastProvider';

export default function LandingPage() {
  const router = useRouter();
  const { account, isConnected, isAdmin, connectWallet, disconnectWallet } =
    useWallet();
  const { showToast } = useToast();

  const goToDashboardByRole = (isAdminFlag?: boolean) => {
    const admin = typeof isAdminFlag === 'boolean' ? isAdminFlag : isAdmin;
    if (admin) {
      router.push('/admin');
    } else {
      router.push('/voting');
    }
  };

  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      showToast({
        type: 'success',
        title: 'Wallet terhubung',
        message: 'MetaMask berhasil terhubung ke DApp.',
      });
      goToDashboardByRole(result.isAdmin);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      showToast({
        type: 'warning',
        title: 'Gagal menghubungkan wallet',
        message:
          error?.message ??
          'Gagal menghubungkan wallet. Pastikan MetaMask sudah terinstall dan diizinkan.',
      });
    }
  };

  const handleStartVoting = async () => {
    if (isConnected) {
      goToDashboardByRole();
      return;
    }

    await handleConnect();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    showToast({
      type: 'info',
      title: 'Disconnected',
      message: 'Wallet berhasil diputus dari DApp.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
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
      />

      <footer className="bg-white dark:bg-slate-900 py-8 border-t border-gray-200 dark:border-slate-800 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-slate-300">
          <p className="mb-2">🔒 Powered by Web3 Technology</p>
          <p className="text-sm">
            Secure, Transparent &amp; Decentralized Voting System
          </p>
        </div>
      </footer>
    </div>
  );
}
