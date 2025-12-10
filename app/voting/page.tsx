// app/voting/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/voting/Header';
import { StatsCards } from '@/components/voting/StatsCards';
import { VotingSection } from '@/components/voting/VotingSection';
import { ResultsSection } from '@/components/voting/ResultsSection';
import { InfoSection } from '@/components/voting/InfoSection';
import { useWallet } from '@/hooks/useWallet';
import { useVoting } from '@/hooks/useVoting';
import { CANDIDATES } from '@/constants/candidates';
import { Votes } from '@/types/voting';
import { useConfirmDialog } from '@/components/ui/ConfirmDialogProvider';
import { useToast } from '@/components/ui/ToastProvider';


export default function VotingPage() {
  const router = useRouter();
  const { confirm } = useConfirmDialog();
  const { showToast } = useToast();
  const {
    account,
    isConnected,
    hasVoted,
    disconnectWallet,
    isInitializing,
    isMetaMaskInstalled,
    checkWalletConnection,
  } = useWallet();

  const {
    votes,
    totalVotes,
    selectedCandidate,
    isLoading,
    castVote,
  } = useVoting(account);

  useEffect(() => {
    if (isInitializing) return;

    if (!isMetaMaskInstalled) {
      showToast({
        type: 'warning',
        title: 'MetaMask tidak terdeteksi',
        message:
          'Untuk mengakses halaman voting, pastikan MetaMask sudah terpasang.',
      });
      router.replace('/');
    }
  }, [isInitializing, isMetaMaskInstalled, router, showToast]);

  const handleVote = async (candidateId: keyof Votes) => {
    if (!isConnected) {
      showToast({
        type: 'warning',
        title: 'Wallet belum terhubung',
        message: 'Silakan hubungkan wallet Anda terlebih dahulu.',
      });
      return;
    }

    if (hasVoted) {
      showToast({
        type: 'info',
        title: 'Sudah voting',
        message: 'Anda sudah melakukan voting dengan wallet ini.',
      });
      return;
    }

    const ok = await confirm({
      title: 'Konfirmasi Voting',
      message:
        'Apakah Anda yakin dengan pilihan kandidat ini? Suara tidak bisa diubah.',
      confirmText: 'Ya, Voting',
      cancelText: 'Batal',
    });

    if (!ok) return;

    try {
      await castVote(candidateId, account);
      await checkWalletConnection();

      showToast({
        type: 'success',
        title: 'Vote Berhasil',
        message: 'Suara Anda berhasil dicatat di Sepolia. 🎉',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Voting gagal',
        message:
          err?.message ??
          'Terjadi kesalahan saat voting di blockchain. Silakan coba lagi.',
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    showToast({
      type: 'info',
      title: 'Disconnected',
      message: 'Wallet berhasil diputus dari DApp.',
    });
    router.push('/');
  };

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300">
            Loading voting data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Header
        isConnected={isConnected}
        account={account}
        onDisconnect={handleDisconnect}
      />

      <main className="container mx-auto px-4 py-8">
        <StatsCards
          totalVotes={totalVotes}
          hasVoted={hasVoted}
          candidatesCount={CANDIDATES.length}
        />

        <VotingSection
          candidates={CANDIDATES}
          votes={votes}
          totalVotes={totalVotes}
          isConnected={isConnected}
          hasVoted={hasVoted}
          selectedCandidate={selectedCandidate}
          onVote={handleVote}
        />

        <ResultsSection
          candidates={CANDIDATES}
          votes={votes}
          totalVotes={totalVotes}
        />

        <InfoSection />
      </main>

      <footer className="bg-white dark:bg-slate-900 mt-12 py-6 border-t border-gray-200 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-slate-300">
          <p>🔒 Powered by Web3 Technology | Secure & Transparent Voting</p>
        </div>
      </footer>
    </div>
  );
}
