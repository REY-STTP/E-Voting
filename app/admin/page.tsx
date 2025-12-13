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
    isInitializing,
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

    const meta = CANDIDATES.find((c) => c.id === bestKey);
    const percentage = CalculationUtils.getPercentage(
      bestKey,
      votes,
      totalVotes
    );

    return {
      key: bestKey,
      name: meta?.name ?? bestKey,
      party: meta?.party ?? '',
      votes: bestVotes,
      percentage,
      emoji: meta?.image ?? '🗳️',
    };
  }, [votes, totalVotes]);

  useEffect(() => {
    if (isInitializing) return;

    if (!isConnected || !account) {
      router.replace('/');
      return;
    }

    if (!isAdmin) {
      showToast({
        type: 'warning',
        title: 'Akses ditolak',
        message: 'Halaman ini hanya dapat diakses oleh admin.',
      });
      router.replace('/');
      return;
    }

    showToast({
      type: 'success',
      title: 'Admin Mode',
      message: 'Anda masuk sebagai administrator.',
    });
  }, [isInitializing, isConnected, account, isAdmin, router, showToast]);

  const handleDisconnect = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await disconnectWallet();

      showToast({
        type: 'info',
        title: 'Disconnected',
        message: 'Wallet berhasil diputus.',
      });

      router.replace('/');
    } catch (err) {
      console.error('Logout error:', err);
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

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm
              border border-gray-200 dark:border-slate-700
              bg-white/80 dark:bg-slate-900/80
              text-gray-700 dark:text-slate-200
              hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </section>

        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white/90 dark:bg-slate-900 rounded-xl shadow-lg border p-6 flex gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40">
              📊
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Total Votes
              </p>
              <p className="text-3xl font-bold">{totalVotes}</p>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900 rounded-xl shadow-lg border p-6 flex gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              {leader?.emoji ?? '🗳️'}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Leading Candidate
              </p>
              {leader ? (
                <>
                  <p className="font-semibold">{leader.name}</p>
                  <p className="text-xs text-emerald-700">
                    {leader.votes} votes ({leader.percentage}%)
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">Belum ada suara</p>
              )}
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900 rounded-xl shadow-lg border p-6">
            <p className="text-sm text-gray-500 dark:text-slate-400">Network</p>
            <p className="font-semibold">Sepolia Testnet</p>
            <p className="text-xs text-emerald-600 mt-2">
              Admin Status: ACTIVE
            </p>
          </div>
        </section>

        <section className="bg-white/95 dark:bg-slate-900 rounded-xl shadow-lg border p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Hasil Voting</h2>

          <div className="space-y-4">
            {CANDIDATES.map((c) => {
              const percentage = CalculationUtils.getPercentage(
                c.id,
                votes,
                totalVotes
              );

              return (
                <div key={c.id} className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-3">
                      <div className="text-2xl">{c.image}</div>
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.party}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      {votes[c.id]} votes ({percentage}%)
                    </div>
                  </div>

                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white/95 dark:bg-slate-900 rounded-xl shadow-lg border p-6">
          <h3 className="font-semibold mb-2">Admin Wallet</h3>
          <p className="text-xs text-gray-500 mb-2">
            Wallet ini memiliki hak admin.
          </p>
          <div className="font-mono text-sm bg-gray-100 dark:bg-slate-800 p-3 rounded-lg break-all">
            {account}
          </div>
        </section>
      </main>
    </div>
  );
}
