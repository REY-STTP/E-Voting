// hooks/useVoting.ts
import { useEffect, useState } from 'react';
import { Votes } from '@/types/voting';
import { VotingService } from '@/lib/web3/voting';

export const useVoting = (account?: string) => {
  const [votes, setVotes] = useState<Votes>({
    candidate1: 0,
    candidate2: 0,
    candidate3: 0,
  });
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { votes, totalVotes } = await VotingService.loadVotes();
        setVotes(votes);
        setTotalVotes(totalVotes);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadSelected = async () => {
      if (!account) {
        setSelectedCandidate('');
        return;
      }

      try {
        const candidateKey = await VotingService.getVotedCandidate(account);
        setSelectedCandidate(candidateKey ?? '');
      } catch (err) {
        console.error('Error loading voted candidate:', err);
        setSelectedCandidate('');
      }
    };

    loadSelected();
  }, [account]);

  const castVote = async (candidateId: keyof Votes, acc: string) => {
    const { votes: newVotes, totalVotes: newTotal } =
      await VotingService.castVote(candidateId, acc);
    setVotes(newVotes);
    setTotalVotes(newTotal);
    setSelectedCandidate(candidateId);
  };

  return {
    votes,
    totalVotes,
    selectedCandidate,
    isLoading,
    castVote,
  };
};
