// components/voting/ResultsSection.tsx
import React from 'react';
import { Candidate, Votes } from '@/types/voting';
import { CalculationUtils } from '@/lib/utils/calculations';

interface ResultsSectionProps {
  candidates: Candidate[];
  votes: Votes;
  totalVotes: number;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  candidates,
  votes,
  totalVotes,
}) => {
  return (
    <div
      className="
        bg-white dark:bg-slate-900
        rounded-xl shadow-lg dark:shadow-slate-950/40
        border border-gray-100/80 dark:border-slate-700
        p-8
      "
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-50 mb-6">
        Live Results
      </h2>

      <div className="space-y-4">
        {candidates.map((candidate) => {
          const percentage = CalculationUtils.getPercentage(
            candidate.id,
            votes,
            totalVotes
          );

          return (
            <div
              key={candidate.id}
              className="
                flex items-center gap-4
                p-3 rounded-lg
                hover:bg-gray-50 dark:hover:bg-slate-800/60
                transition
              "
            >
              <div className="text-3xl">{candidate.image}</div>

              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700 dark:text-slate-200">
                    {candidate.name}
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-300">
                    {votes[candidate.id] || 0} votes ({percentage}%)
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-4">
                  <div
                    className="
                      bg-gradient-to-r from-purple-500 to-blue-500
                      h-4 rounded-full transition-all duration-500
                    "
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
