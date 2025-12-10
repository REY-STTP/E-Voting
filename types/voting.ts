// types/voting.ts
export interface Votes {
  candidate1: number;
  candidate2: number;
  candidate3: number;
}

export interface Candidate {
  id: keyof Votes;
  name: string;
  party: string;
  image: string;
}

export interface Voters {
  [address: string]: {
    candidateId: string;
    timestamp: string;
  };
}

export interface VotingState {
  account: string;
  isConnected: boolean;
  hasVoted: boolean;
  votes: Votes;
  totalVotes: number;
  selectedCandidate: string;
}