// components/voting/VotingSection.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Candidate, Votes } from '@/types/voting';
import { CandidateCard } from './CandidateCard';

interface VotingSectionProps {
  candidates: Candidate[];
  votes: Votes;
  totalVotes: number;
  isConnected: boolean;
  hasVoted: boolean;
  selectedCandidate: string;
  onVote: (candidateId: keyof Votes) => void;
}

export const VotingSection: React.FC<VotingSectionProps> = ({
  candidates,
  votes,
  totalVotes,
  isConnected,
  hasVoted,
  selectedCandidate,
  onVote,
}) => {
  return (
    <div
      className="
        bg-white dark:bg-slate-900
        rounded-xl shadow-lg dark:shadow-slate-950/40
        border border-gray-100/80 dark:border-slate-700
        p-8 mb-8
      "
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-50 mb-6">
        Pilih Kandidat Anda
      </h2>

      {!isConnected && (
        <div
          className="
            bg-yellow-50 dark:bg-yellow-900/30
            border border-yellow-200 dark:border-yellow-700
            rounded-lg p-4 mb-6
          "
        >
          <p className="text-yellow-800 dark:text-yellow-200">
            ⚠️ Hubungkan wallet Anda untuk melakukan voting
          </p>
        </div>
      )}

      {hasVoted && (
        <div
          className="
            bg-green-50 dark:bg-emerald-900/30
            border border-green-200 dark:border-emerald-700
            rounded-lg p-4 mb-6 flex items-center gap-3
          "
        >
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-emerald-300" />
          <p className="text-green-800 dark:text-emerald-200 font-semibold">
            Terima kasih! Suara Anda telah tercatat di blockchain.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            votes={votes}
            totalVotes={totalVotes}
            isConnected={isConnected}
            hasVoted={hasVoted}
            isSelected={selectedCandidate === candidate.id}
            onVote={onVote}
          />
        ))}
      </div>
    </div>
  );
};
