// components/voting/StatsCards.tsx
import React from 'react';
import { Users, Vote, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  totalVotes: number;
  hasVoted: boolean;
  candidatesCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalVotes,
  hasVoted,
  candidatesCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      {/* Total Voters */}
      <div
        className="
          bg-white dark:bg-slate-900
          rounded-xl shadow-lg dark:shadow-slate-950/40
          border border-gray-100/80 dark:border-slate-700
          p-6
        "
      >
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              Total Voters
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-slate-50">
              {totalVotes}
            </p>
          </div>
        </div>
      </div>

      {/* Your Status */}
      <div
        className="
          bg-white dark:bg-slate-900
          rounded-xl shadow-lg dark:shadow-slate-950/40
          border border-gray-100/80 dark:border-slate-700
          p-6
        "
      >
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-lg">
            <Vote className="w-6 h-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              Your Status
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-slate-50">
              {hasVoted ? 'Voted ✓' : 'Not Voted'}
            </p>
          </div>
        </div>
      </div>

      {/* Candidates */}
      <div
        className="
          bg-white dark:bg-slate-900
          rounded-xl shadow-lg dark:shadow-slate-950/40
          border border-gray-100/80 dark:border-slate-700
          p-6
        "
      >
        <div className="flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              Candidates
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-slate-50">
              {candidatesCount}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
