import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const TOKEN_EXPIRY = '30d'; // 30 дней

// POST /api/auth/register
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

		// Проверка уникальности username
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		if (existingUser.length > 0) {
			return NextResponse.json(
				{ error: 'Username already exists' },
				{ status: 409 }
			);
		}

		// Создание нового пользователя
		const newUser = await db
			.insert(users)
			.values({
				username,
				password, // Храним пароль как есть (6-значное число)
				role: 'USER',
			})
			.returning({
				id: users.id,
				username: users.username,
				role: users.role,
			});

		// Генерация токена
		const token = jwt.sign(
			{ userId: newUser[0].id.toString() },
			JWT_SECRET,
			{ expiresIn: TOKEN_EXPIRY }
		);

		// Сохранение токена в cookies
		const cookieStore = await cookies();

		cookieStore.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60, // 30 дней в секундах
			path: '/',
		});

		// Возвращаем информацию о новом пользователе
		return NextResponse.json(
			{
				user: newUser[0],
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Register error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

