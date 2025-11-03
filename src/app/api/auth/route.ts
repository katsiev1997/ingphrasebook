import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/shared/lib/auth-utils';

// GET /api/auth - проверка текущего статуса авторизации
export async function GET(req: NextRequest) {
	try {
		const authResult = await checkAuth();

		if (!authResult.success || !authResult.user) {
			return NextResponse.json({
				authenticated: false,
				user: null,
			});
		}

		return NextResponse.json({
			authenticated: true,
			user: {
				id: authResult.user.id,
				username: authResult.user.username,
				role: authResult.user.role,
			},
		});
	} catch (error) {
		console.error('Auth check error:', error);
		return NextResponse.json(
			{
				authenticated: false,
				user: null,
			},
			{ status: 500 }
		);
	}
}

