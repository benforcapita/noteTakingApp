import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();
    
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 400 }
      );
    }

    // Set the cookie server-side
    cookies().set('api-key', apiKey, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true, // Make cookie only accessible server-side
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const apiKey = cookies().get('api-key')?.value;
  return NextResponse.json({ apiKey });
}
