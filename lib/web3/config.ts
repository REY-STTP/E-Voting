// lib/web3/config.ts

// Ambil dari env dengan fallback default
export const SEPOLIA_CHAIN_ID_DEC = Number(
  process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID_DEC ?? '11155111'
);

export const SEPOLIA_CHAIN_ID_HEX =
  process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID_HEX ?? '0xaa36a7';

export const SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? 'https://rpc.sepolia.org';

export const SEPOLIA_EXPLORER_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_EXPLORER_URL ?? 'https://sepolia.etherscan.io';

export const SEPOLIA_PARAMS = {
  chainId: SEPOLIA_CHAIN_ID_HEX,
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [SEPOLIA_RPC_URL],
  blockExplorerUrls: [SEPOLIA_EXPLORER_URL],
};

// CONTRACT ADDRESS dari env (fallback ke default)
export const VOTING_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS ??
  '0xee35Da4E3a9a734b0a5227c99E361c1fDF9B3E5B'
).toLowerCase();

// ABI tetap hardcoded (tidak perlu di-env)
export const VOTING_CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'uint8', name: 'candidateId', type: 'uint8' }],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVotes',
    outputs: [{ internalType: 'uint256[3]', name: '', type: 'uint256[3]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalVotes',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'hasVoted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'voter', type: 'address' }],
    name: 'getVoteInfo',
    outputs: [
      { internalType: 'bool', name: '_hasVoted', type: 'bool' },
      { internalType: 'uint8', name: '_candidateId', type: 'uint8' },
      { internalType: 'uint256', name: '_timestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'voter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'candidateId',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'VoteCast',
    type: 'event',
  },
];

// Admin address juga dari env (fallback ke default)
export const ADMIN_ADDRESS = (
  process.env.NEXT_PUBLIC_ADMIN_ADDRESS ??
  '0x1d1afc2d015963017bed1de13e4ed6c3d3ed1618'
).toLowerCase();
