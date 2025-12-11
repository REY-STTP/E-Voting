// components/voting/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Vote, LogOut } from 'lucide-react';
import { CalculationUtils } from '@/lib/utils/calculations';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useConfirmDialog } from '@/components/ui/ConfirmDialogProvider';

interface HeaderProps {
  isConnected: boolean;
  account: string;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  account,
  onDisconnect,
}) => {
  const { confirm } = useConfirmDialog();

  const handleClickDisconnect = async () => {
    const ok = await confirm({
      title: 'Disconnect Wallet',
      message: 'Anda yakin ingin memutus koneksi wallet dari DApp ini?',
      confirmText: 'Disconnect',
      cancelText: 'Batal',
    });
    if (!ok) return;
    onDisconnect();
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg shrink-0">
              <Vote className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>

            <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-slate-100 truncate">
              <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                E-Voting DApp
              </Link>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <ThemeToggle />

            {isConnected && (
              <>
                <div
                  className="
                    bg-gradient-to-r from-green-100 to-emerald-100
                    dark:from-emerald-900/40 dark:to-emerald-800/40
                    text-green-800 dark:text-emerald-200
                    px-3 py-1.5
                    rounded-lg
                    font-mono text-xs md:text-sm
                    border border-green-200 dark:border-emerald-700
                    hidden sm:flex items-center
                  "
                >
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  {CalculationUtils.formatAddress(account)}
                </div>

                <button
                  onClick={handleClickDisconnect}
                  className="
                    flex items-center justify-center
                    md:gap-2
                    text-gray-600 dark:text-slate-300
                    hover:text-red-600 dark:hover:text-red-400
                    p-2 md:px-4 md:py-2
                    rounded-lg
                    hover:bg-red-50 dark:hover:bg-red-950/40
                    transition-all
                  "
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Disconnect</span>
                </button>
              </>
            )}
          </div>
        </div>

        {isConnected && (
          <div className="sm:hidden mt-2">
            <div
              className="
                bg-gradient-to-r from-green-100 to-emerald-100
                dark:from-emerald-900/40 dark:to-emerald-800/40
                text-green-800 dark:text-emerald-200
                px-3 py-2
                rounded-lg
                font-mono text-xs
                border border-green-200 dark:border-emerald-700
                w-full
                text-center
              "
            >
              {CalculationUtils.formatAddress(account)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};