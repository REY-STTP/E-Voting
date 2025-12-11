// app/admin/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

import { Header } from '@/components/voting/Header';
import { useWallet } from '@/hooks/useWallet';
import { useVoting } from '@/hooks/useVoting';
import { isAdminAddress } from '@/lib/utils/auth';
import { CANDIDATES } from '@/constants/candidates';
import { CalculationUtils } from '@/lib/utils/calculations';
import type { Votes } from '@/types/voting';
import { useToast } from '@/components/ui/ToastProvider';

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    account,
    isConnected,
    hasVoted,
    isInitializing,
    isMetaMaskInstalled,
    disconnectWallet,
  } = useWallet();

  const { votes, totalVotes, isLoading } = useVoting(account);
  const isAdmin = !!account && isAdminAddress(account);

  const leader = useMemo(() => {
    if (totalVotes === 0) return null;

    let bestKey: keyof Votes | null = null;
    let bestVotes = -1;

    (Object.keys(votes) as (keyof Votes)[]).forEach((key) => {
      if (votes[key] > bestVotes) {
        bestVotes = votes[key];
        bestKey = key;
      }
    });

    if (!bestKey) return null;

    const candidateMeta = CANDIDATES.find((c) => c.id === bestKey);
    const percentage = CalculationUtils.getPercentage(
      bestKey,
      votes,
      totalVotes
    );

    return {
      key: bestKey,
      name: candidateMeta?.name ?? bestKey,
      party: candidateMeta?.party ?? '',
      votes: bestVotes,
      percentage,
      emoji: candidateMeta?.image ?? '🗳️',
    };
  }, [votes, totalVotes]);

  useEffect(() => {
    if (isInitializing) return;

    if (!isMetaMaskInstalled) {
      showToast({
        type: 'warning',
        title: 'MetaMask tidak terdeteksi',
        message:
          'Untuk mengakses Admin Dashboard, pastikan MetaMask sudah terpasang.',
      });
      router.replace('/');
      return;
    }

    if (!isAdmin) {
      router.replace('/');
      return;
    }

    showToast({
      type: 'success',
      title: 'Admin mode',
      message: 'Anda masuk sebagai admin.',
    });
  }, [
    isInitializing,
    isMetaMaskInstalled,
    isConnected,
    isAdmin,
    router,
    showToast,
  ]);

  const handleDisconnect = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await disconnectWallet(false);
      
      showToast({
        type: 'info',
        title: 'Disconnected',
        message: 'Wallet berhasil diputus dari DApp.',
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push('/');
      
    } catch (error) {
      console.error('Error during logout:', error);
      showToast({
        type: 'error',
        title: 'Logout gagal',
        message: 'Terjadi kesalahan saat logout.',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-slate-200">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Header
        isConnected={isConnected}
        account={account}
        onDisconnect={handleDisconnect}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-50">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Monitoring hasil voting on-chain (Sepolia Testnet).
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/40 border border-gray-100/70 dark:border-slate-800 p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Total Votes
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-slate-50">
                {totalVotes}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                Semua suara yang tercatat di kontrak.
              </p>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/40 border border-gray-100/70 dark:border-slate-800 p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-emerald-900/40">
              <span className="text-2xl">{leader?.emoji ?? '🗳️'}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Leading Candidate
              </p>
              {leader ? (
                <>
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                    {leader.name}
                  </p>
                  {leader.party && (
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {leader.party}
                    </p>
                  )}
                  <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-300">
                    {leader.votes} votes ({leader.percentage}%)
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400 dark:text-slate-500">
                  Belum ada suara.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/40 border border-gray-100/70 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Network
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                Sepolia Testnet
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                Smart contract voting ter-deploy di jaringan ini.
              </p>
            </div>
            <div className="mt-4 text-xs text-emerald-700 dark:text-emerald-300">
              <p className="font-semibold">Admin Status: ACTIVE</p>
            </div>
          </div>
        </section>

        <section className="bg-white/95 dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/40 border border-gray-100/70 dark:border-slate-800 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-50">
                Hasil Voting per Kandidat
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Data diambil langsung dari smart contract.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {CANDIDATES.map((candidate) => {
              const percentage = CalculationUtils.getPercentage(
                candidate.id,
                votes,
                totalVotes
              );

              return (
                <div
                  key={candidate.id}
                  className="bg-gray-50/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700 rounded-lg p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{candidate.image}</div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-slate-50">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {candidate.party}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-300">
                        {votes[candidate.id]} votes
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {percentage}% dari total
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white/95 dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/40 border border-gray-100/70 dark:border-slate-800 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-3">
            Admin Wallet
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
            Hanya wallet ini yang diakui sebagai admin di aplikasi ini.
          </p>
          <div className="font-mono text-sm bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-lg break-all text-emerald-700 dark:text-emerald-200">
            {account}
          </div>
        </section>
      </main>
    </div>
  );
}