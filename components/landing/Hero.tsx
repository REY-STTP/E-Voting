import React from 'react';
import { Vote } from 'lucide-react';
import { WalletButton } from '@/components/shared/WalletButton';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

interface HeroProps {
  isConnected: boolean;
  account: string;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  isConnected,
  account,
  onConnect,
  onDisconnect,
}) => {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto text-center relative">

        <div className="absolute top-4 right-4 hidden sm:block">
          <ThemeToggle />
        </div>

        <div className="block sm:hidden mb-4 flex justify-end">
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 sm:p-4 rounded-2xl shadow-2xl">
            <Vote className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-slate-50 mb-4 sm:mb-6">
          Decentralized
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            {' '}E-Voting{' '}
          </span>
          Platform
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Vote dengan aman, transparan, dan terdesentralisasi menggunakan teknologi blockchain.
        </p>

        <div className="flex justify-center mb-12">
          <WalletButton
            isConnected={isConnected}
            account={account}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
};
