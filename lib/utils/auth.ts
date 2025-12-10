// lib/utils/auth.ts
import { ADMIN_ADDRESS } from '@/lib/web3/config';

export function isAdminAddress(address?: string | null): boolean {
  if (!address) return false;
  return address.toLowerCase() === ADMIN_ADDRESS;
}
