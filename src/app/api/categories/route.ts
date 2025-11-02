import { NextResponse } from 'next/server';
import { categories } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from '../../../shared/lib/auth-utils';
import { db } from '@/db/drizzle';

// GET /api/categories
export async function GET() {
	try {
		const categoriesList = await db.select().from(categories);

		return NextResponse.json(categoriesList);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// POST /api/categories
export async function POST(req: Request) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		// Получаем данные из запроса
		const { name, icon } = await req.json();

		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return NextResponse.json(
				{ error: 'Category name is required' },
				{ status: 400 }
			);
		}

		// Проверяем, что категория с таким именем не существует
		const existingCategory = await db
			.select()
			.from(categories)
			.where(eq(categories.name, name.trim()))
			.limit(1);

		if (existingCategory.length > 0) {
			return NextResponse.json(
				{ error: 'Category with this name already exists' },
				{ status: 409 }
			);
		}

		// Создаем новую категорию
		const newCategory = await db
			.insert(categories)
			.values({
				name: name.trim(),
				icon: icon && typeof icon === 'string' ? icon.trim() : null,
			})
			.returning();

		return NextResponse.json(newCategory[0], { status: 201 });
	} catch (error) {
		console.error('Create category error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// PUT /api/categories
export async function PUT(req: Request) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		const body = await req.json();
		const { id, name, icon } = body;

		if (!id || !name) {
			return NextResponse.json(
				{ error: 'Category ID and name are required' },
				{ status: 400 }
			);
		}

		// Валидация ID
		const categoryId = Number(id);
		if (isNaN(categoryId) || categoryId <= 0 || !Number.isInteger(categoryId)) {
			return NextResponse.json(
				{ error: 'Category ID must be a positive integer' },
				{ status: 400 }
			);
		}

		if (typeof name !== 'string' || name.trim().length === 0) {
			return NextResponse.json(
				{ error: 'Category name must be a non-empty string' },
				{ status: 400 }
			);
		}

		// Проверяем существование категории
		const existingCategory = await db
			.select()
			.from(categories)
			.where(eq(categories.id, categoryId))
			.limit(1);

		if (existingCategory.length === 0) {
			return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		}

		// Проверяем, что категория с таким именем не существует (кроме текущей)
		const duplicateCategory = await db
			.select()
			.from(categories)
			.where(eq(categories.name, name.trim()))
			.limit(1);

		if (
			duplicateCategory.length > 0 &&
			duplicateCategory[0].id !== categoryId
		) {
			return NextResponse.json(
				{ error: 'Category with this name already exists' },
				{ status: 409 }
			);
		}

		const updatedCategory = await db
			.update(categories)
			.set({
				name: name.trim(),
				icon: icon !== undefined ? (icon && typeof icon === 'string' ? icon.trim() : null) : undefined,
			})
			.where(eq(categories.id, categoryId))
			.returning();

		return NextResponse.json(updatedCategory[0]);
	} catch (error) {
		console.error('Update category error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// DELETE /api/categories
export async function DELETE(req: Request) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get('id');

		if (!categoryId) {
			return NextResponse.json(
				{ error: 'Category ID is required' },
				{ status: 400 }
			);
		}

		// Проверяем существование категории
		const existingCategory = await db
			.select()
			.from(categories)
			.where(eq(categories.id, Number(categoryId)))
			.limit(1);

		if (existingCategory.length === 0) {
			return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		}

		// Удаляем категорию
		await db.delete(categories).where(eq(categories.id, Number(categoryId)));

		return NextResponse.json({ message: 'Category deleted successfully' });
	} catch (error) {
		console.error('Delete category error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
