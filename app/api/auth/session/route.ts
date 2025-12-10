// app/api/auth/session/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_ADDRESS } from '@/lib/web3/config';

export async function GET() {
  const cookieStore = await cookies();
  const address = cookieStore.get('wallet_session')?.value ?? null;

  if (!address) {
    return NextResponse.json({
      address: null,
      isAdmin: false,
    });
  }

  const normalized = address.toLowerCase();

  return NextResponse.json({
    address: normalized,
    isAdmin: normalized === ADMIN_ADDRESS,
  });
}
