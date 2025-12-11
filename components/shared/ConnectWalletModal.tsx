'use client';

import React, { useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';

type WalletOption = {
  id: string;
  name: string;
  subtitle?: string;
  badge?: 'QR CODE' | 'INSTALLED' | 'MULTICHAIN' | null;
  icon?: React.ReactNode;
};

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
  onConnectWalletConnect: () => Promise<void>;
  onConnectInjected: (walletId: string) => Promise<void>;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  open,
  onClose,
  onConnectWalletConnect,
  onConnectInjected,
}) => {
  const [query, setQuery] = useState('');
  const [installed, setInstalled] = useState<Record<string, boolean>>({
    metamask: false,
    phantom: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInstalled({
        metamask: !!(window as any).ethereum && !!(window as any).ethereum.isMetaMask,
        phantom: !!(window as any).solana && !!(window as any).solana.isPhantom,
      });
    }
  }, [open]);

  const wallets: WalletOption[] = [
    { id: 'walletconnect', name: 'WalletConnect', subtitle: 'QR / Deep link', badge: 'QR CODE' },
    { id: 'metamask', name: 'MetaMask', subtitle: 'EVM Wallet', badge: 'MULTICHAIN' },
    { id: 'phantom', name: 'Phantom', subtitle: 'Solana Wallet', badge: 'MULTICHAIN' },
    { id: 'okx', name: 'OKX Wallet', subtitle: 'EVM Wallet', badge: 'MULTICHAIN' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">Connect Wallet</h3>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5 text-gray-700 dark:text-slate-300" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="mb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Wallet"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            {wallets
              .filter((w) => w.name.toLowerCase().includes(query.toLowerCase()))
              .map((w) => {
                const isInstalled = (w.id === 'metamask' && installed.metamask) || (w.id === 'phantom' && installed.phantom) || (w.id === 'haha' && installed.haha);
                return (
                  <button
                    key={w.id}
                    onClick={async () => {
                      try {
                        if (w.id === 'walletconnect') {
                          await onConnectWalletConnect();
                        } else {
                          await onConnectInjected(w.id);
                        }
                        onClose();
                      } catch (err) {
                        console.error('connect failed', err);
                        onClose();
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-sm font-medium">{w.name[0]}</span>
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{w.name}</div>
                          {w.subtitle && <div className="text-xs text-gray-500 dark:text-slate-400">{w.subtitle}</div>}
                        </div>
                        <div className="ml-2 text-xs">
                          {w.badge === 'QR CODE' && <span className="px-2 py-1 border rounded-full text-xs bg-sky-50 text-sky-700">QR CODE</span>}
                          {w.badge === 'MULTICHAIN' && <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">MULTICHAIN</span>}
                          {(w.badge === 'INSTALLED' || isInstalled) && <span className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">INSTALLED</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
