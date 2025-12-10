// lib/web3/voting.ts
import { BrowserProvider, Contract } from 'ethers';
import {
  SEPOLIA_CHAIN_ID_DEC,
  VOTING_CONTRACT_ADDRESS,
  VOTING_CONTRACT_ABI,
} from './config';
import { Votes } from '@/types/voting';

const CANDIDATE_KEY_TO_INDEX: Record<keyof Votes, number> = {
  candidate1: 0,
  candidate2: 1,
  candidate3: 2,
};

export class VotingService {
  private static async getContract(withSigner: boolean) {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Wallet tidak tersedia di browser.');
    }

    const provider = new BrowserProvider(window.ethereum as any);
    const network = await provider.getNetwork();

    if (Number(network.chainId) !== SEPOLIA_CHAIN_ID_DEC) {
      throw new Error('Harap switch ke jaringan Sepolia terlebih dahulu.');
    }

    const code = await provider.getCode(VOTING_CONTRACT_ADDRESS);
    if (!code || code === '0x') {
      throw new Error(
        'Kontrak voting tidak ditemukan di alamat yang dikonfigurasi. ' +
          'Pastikan alamat & network sudah benar.'
      );
    }

    const signerOrProvider = withSigner ? await provider.getSigner() : provider;

    return new Contract(
      VOTING_CONTRACT_ADDRESS,
      VOTING_CONTRACT_ABI,
      signerOrProvider
    );
  }

  static async hasVoted(account: string): Promise<boolean> {
    if (!account) return false;
    const contract = await this.getContract(false);
    const [has] = (await contract.getVoteInfo(account)) as [boolean, number, bigint];
    return has;
  }

  static async getVotedCandidate(account: string): Promise<keyof Votes | null> {
    if (!account) return null;

    const contract = await this.getContract(false);
    const [has, candidateIndex] = (await contract.getVoteInfo(account)) as [
      boolean,
      number,
      bigint
    ];

    if (!has) return null;

    switch (Number(candidateIndex)) {
      case 0:
        return 'candidate1';
      case 1:
        return 'candidate2';
      case 2:
        return 'candidate3';
      default:
        return null;
    }
  }

  static async loadVotes(): Promise<{ votes: Votes; totalVotes: number }> {
    const contract = await this.getContract(false);

    const [rawVotes, rawTotal] = (await Promise.all([
      contract.getVotes(),
      contract.totalVotes(),
    ])) as [any[], bigint];

    const votes: Votes = {
      candidate1: Number(rawVotes?.[0] ?? 0),
      candidate2: Number(rawVotes?.[1] ?? 0),
      candidate3: Number(rawVotes?.[2] ?? 0),
    };

    return {
      votes,
      totalVotes: Number(rawTotal ?? 0),
    };
  }

  static async castVote(
    candidateId: keyof Votes,
    account: string
  ): Promise<{ votes: Votes; totalVotes: number }> {
    if (!account) throw new Error('Wallet belum terhubung.');

    const index = CANDIDATE_KEY_TO_INDEX[candidateId];
    if (index === undefined) throw new Error('ID kandidat tidak valid.');

    const contract = await this.getContract(true);

    const tx = await contract.vote(index);
    await tx.wait();

    return await this.loadVotes();
  }
}
