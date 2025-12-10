// components/voting/CandidateCard.tsx
import React from 'react';
import { Candidate, Votes } from '@/types/voting';
import { CalculationUtils } from '@/lib/utils/calculations';

interface CandidateCardProps {
  candidate: Candidate;
  votes: Votes;
  totalVotes: number;
  isConnected: boolean;
  hasVoted: boolean;
  isSelected: boolean;
  onVote: (candidateId: keyof Votes) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  votes,
  totalVotes,
  isConnected,
  hasVoted,
  isSelected,
  onVote,
}) => {
  const percentage = CalculationUtils.getPercentage(
    candidate.id,
    votes,
    totalVotes
  );

  const isActiveSelected = hasVoted && isSelected;

  return (
    <div
      className={`
        rounded-xl p-6 transition-all
        bg-white/90 dark:bg-slate-900
        border-2
        shadow-sm dark:shadow-slate-950/40
        ${
          isActiveSelected
            ? 'border-green-500 bg-green-50 dark:border-emerald-400 dark:bg-emerald-900/30'
            : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg'
        }
      `}
    >
      <div className="text-center mb-4">
        <div className="text-6xl mb-3">{candidate.image}</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-slate-50">
          {candidate.name}
        </h3>
        <p className="text-gray-600 dark:text-slate-300">{candidate.party}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-slate-400">Votes</span>
          <span className="font-bold text-purple-600 dark:text-purple-300">
            {votes[candidate.id] || 0} ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-3">
          <div
            className="
              bg-gradient-to-r from-purple-500 to-blue-500
              h-3 rounded-full
              transition-all duration-500
            "
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onVote(candidate.id)}
        disabled={!isConnected || hasVoted}
        className={`
          w-full py-3 rounded-lg font-semibold transition-all
          ${
            isActiveSelected
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg dark:from-emerald-600 dark:to-emerald-500'
              : !isConnected || hasVoted
              ? 'bg-gray-300 text-gray-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
          }
        `}
      >
        {isActiveSelected ? 'Your Vote ✓' : 'Vote'}
      </button>
    </div>
  );
};
