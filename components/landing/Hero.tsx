// components/landing/Hero.tsx
import React from 'react';
import { Vote } from 'lucide-react';
import { WalletButton } from '@/components/shared/WalletButton';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

interface HeroProps {
  isConnected: boolean;
  account: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  isConnected,
  account,
  onConnect,
  onDisconnect,
}) => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto text-center">

        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl shadow-2xl">
            <Vote className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-slate-50 mb-6">
          Decentralized
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {' '}E-Voting{' '}
          </span>
          Platform
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Vote dengan aman, transparan, dan terdesentralisasi menggunakan teknologi blockchain. 
          Setiap suara Anda penting dan terjamin keamanannya.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <WalletButton
            isConnected={isConnected}
            account={account}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            variant="primary"
          />
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="
            rounded-xl p-6 shadow-lg 
            bg-white/90 
            border border-gray-100/80
            dark:bg-slate-900/80
            dark:border-slate-700
            dark:shadow-slate-950/40
          ">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600 dark:text-slate-300 text-sm">Transparent</div>
          </div>
          <div className="
            rounded-xl p-6 shadow-lg 
            bg-white/90 
            border border-gray-100/80
            dark:bg-slate-900/80
            dark:border-slate-700
            dark:shadow-slate-950/40
          ">
            <div className="text-3xl font-bold text-blue-600 mb-2">🔒</div>
            <div className="text-gray-600 dark:text-slate-300 text-sm">Secure</div>
          </div>
          <div className="
            rounded-xl p-6 shadow-lg 
            bg-white/90 
            border border-gray-100/80
            dark:bg-slate-900/80
            dark:border-slate-700
            dark:shadow-slate-950/40
          ">
            <div className="text-3xl font-bold text-green-600 mb-2">⚡</div>
            <div className="text-gray-600 dark:text-slate-300 text-sm">Fast</div>
          </div>
        </div>
      </div>
    </section>
  );
};
