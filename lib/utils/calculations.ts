// lib/utils/calculations.ts
import { Votes } from '@/types/voting';

export class CalculationUtils {
  static getPercentage(
    candidateId: keyof Votes,
    votes: Votes,
    totalVotes: number
  ): string {
    if (totalVotes === 0) return '0.0';
    return ((votes[candidateId] / totalVotes) * 100).toFixed(1);
  }

  static formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}