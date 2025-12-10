// app/api/auth/login/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_ADDRESS } from '@/lib/web3/config';

export async function POST(req: Request) {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 });
  }

  const normalized = String(address).toLowerCase();

  const cookieStore = await cookies();

  cookieStore.set({
    name: 'wallet_session',
    value: normalized,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  const isAdmin = normalized === ADMIN_ADDRESS;

  return NextResponse.json({
    success: true,
    address: normalized,
    isAdmin,
  });
}
