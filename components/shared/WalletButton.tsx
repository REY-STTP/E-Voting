'use client';

import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { CalculationUtils } from '@/lib/utils/calculations';

interface WalletButtonProps {
  isConnected: boolean;
  account?: string;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  variant?: 'primary' | 'outline';
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  isConnected,
  account = '',
  onConnect,
  onDisconnect,
  variant = 'primary',
}) => {
  const label = isConnected
    ? CalculationUtils.formatAddress(account)
    : 'Connect Wallet';

  const handleClick = async () => {
    if (isConnected) {
      onDisconnect();
    } else {
      await onConnect();
    }
  };

  const baseClasses =
    'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all';

  const variantClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/50 hover:scale-105'
      : 'border-2 border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600 bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {isConnected ? (
        <LogOut className="w-4 h-4" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span>{label}</span>
    </button>
  );
};
