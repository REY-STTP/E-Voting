// app/api/auth/login/route.ts
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

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ 
        success: false, 
        error: 'Address required' 
      }, { status: 400 });
    }

    const normalized = cleanAndValidateAddress(address);
    
    if (!normalized) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid Ethereum address format' 
      }, { status: 400 });
    }

    const cookieStore = await cookies();

    cookieStore.set({
      name: 'wallet_session',
      value: normalized,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    const isAdmin = normalized === ADMIN_ADDRESS.toLowerCase();

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Login successful: ${normalized}, Admin: ${isAdmin}`);
    }

    return NextResponse.json({
      success: true,
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
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}