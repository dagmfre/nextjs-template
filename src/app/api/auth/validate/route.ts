import { NextRequest, NextResponse } from 'next/server';
import { validate, parse } from '@telegram-apps/init-data-node';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const [authType, authData = ''] = (authHeader || '').split(' ');

  if (authType !== 'tma') {
    return NextResponse.json(
      { valid: false, error: 'Invalid auth type' },
      { status: 401 }
    );
  }

  try {
    // Validate signature and expiration (1 hour)
    validate(authData, process.env.BOT_TOKEN!, { expiresIn: 3600 });
    
    // Parse validated data
    const initData = parse(authData);
    
    return NextResponse.json({
      valid: true,
      user: initData.user,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, error: (error as Error).message },
      { status: 401 }
    );
  }
}
