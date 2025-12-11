// app/api/auth/session/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_ADDRESS } from '@/lib/web3/config';

function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function cleanAndValidateAddress(address: string): string | null {
  if (!address) return null;
  
  const trimmed = address.trim();
  
  if (!isValidEthereumAddress(trimmed)) {
    return null;
  }
  
  return trimmed.toLowerCase();
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const address = cookieStore.get('wallet_session')?.value ?? null;

    if (!address) {
      return NextResponse.json({
        address: null,
        isAdmin: false,
        timestamp: Date.now(),
      });
    }

    const normalized = cleanAndValidateAddress(address);
    
    if (!normalized) {
      cookieStore.set({
        name: 'wallet_session',
        value: '',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
      
      return NextResponse.json({
        address: null,
        isAdmin: false,
        timestamp: Date.now(),
      });
    }

    const isAdmin = normalized === ADMIN_ADDRESS.toLowerCase();

    return NextResponse.json({
      address: normalized,
      isAdmin,
      timestamp: Date.now(),
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({
      address: null,
      isAdmin: false,
      error: 'Session check failed',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}