import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST /api/auth/logout
export async function POST(req: NextRequest) {
	try {
		const cookieStore = await cookies();

		// Удаляем токен из cookies
		cookieStore.delete('token');

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Logout error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

