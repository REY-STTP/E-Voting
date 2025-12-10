// hooks/useWallet.ts
import { useEffect, useState } from 'react';
import { WalletService } from '@/lib/web3/wallet';
import { VotingService } from '@/lib/web3/voting';

export const useWallet = () => {
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] =
    useState<boolean>(false);

  useEffect(() => {
    setIsMetaMaskInstalled(WalletService.isMetaMaskInstalled());
    initSession();
  }, []);

  const initSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();

      if (data?.address) {
        setAccount(data.address);
        setIsConnected(true);
        setIsAdmin(Boolean(data.isAdmin));

        try {
          const voted = await VotingService.hasVoted(data.address);
          setHasVoted(voted);
        } catch (err) {
          console.error('Error checking hasVoted from session:', err);
          setHasVoted(false);
        }
      } else {
        setAccount('');
        setIsConnected(false);
        setHasVoted(false);
        setIsAdmin(false);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const checkWalletConnection = async () => {
    if (!account) return;

    try {
      const voted = await VotingService.hasVoted(account);
      setHasVoted(voted);
    } catch (err) {
      console.error('Error checking hasVoted:', err);
    }
  };

  const connectWallet = async (): Promise<{ address: string; isAdmin: boolean }> => {
    const acc = await WalletService.connect();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: acc }),
    });

    const data = await res.json();

    const normalized = acc.toLowerCase();
    const isAdmin = Boolean(data.isAdmin);

    setAccount(normalized);
    setIsConnected(true);
    setIsAdmin(isAdmin);

    try {
      const voted = await VotingService.hasVoted(acc);
      setHasVoted(voted);
    } catch (err) {
      console.error('Error checking hasVoted after connect:', err);
      setHasVoted(false);
    }

    return { address: normalized, isAdmin };
  };

  const disconnectWallet = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });

    setAccount('');
    setIsConnected(false);
    setHasVoted(false);
    setIsAdmin(false);
  };

  return {
    account,
    isConnected,
    hasVoted,
    isAdmin,
    isInitializing,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    checkWalletConnection,
  };
};
