import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const TOKEN_EXPIRY = '30d'; // 30 дней

// POST /api/auth/login
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { username, password } = body;

		// Валидация входных данных
		if (!username || !password) {
			return NextResponse.json(
				{ error: 'Username and password are required' },
				{ status: 400 }
			);
		}

		// Проверка формата пароля (6 цифр)
		if (!/^\d{6}$/.test(password)) {
			return NextResponse.json(
				{ error: 'Password must be 6 digits' },
				{ status: 400 }
			);
		}

		// Поиск пользователя в базе данных
		const user = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		if (user.length === 0) {
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}

		const foundUser = user[0];

		// Проверка пароля (сравниваем как строку, так как пароль хранится как varchar)
		if (foundUser.password !== password) {
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}

		// Генерация токена
		const token = jwt.sign({ userId: foundUser.id.toString() }, JWT_SECRET, {
			expiresIn: TOKEN_EXPIRY,
		});

		// Сохранение токена в cookies
		const cookieStore = await cookies();

		cookieStore.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60, // 30 дней в секундах
			path: '/',
		});

		// Возвращаем информацию о пользователе (без пароля)
		return NextResponse.json({
			user: {
				id: foundUser.id,
				username: foundUser.username,
				role: foundUser.role,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
