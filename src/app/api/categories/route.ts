import { NextResponse } from 'next/server';
import { categories, phrases } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from '../../../shared/lib/auth-utils';
import { isValidLucideIcon } from '../../../shared/lib/icon-validator';
import { db } from '@/db/drizzle';

// GET /api/categories
export async function GET() {
	try {
		const categoriesList = await db
			.select({
				id: categories.id,
				name: categories.name,
				icon: categories.icon,
				createdAt: categories.createdAt,
				updatedAt: categories.updatedAt,
				phraseCount: sql<number>`COUNT(${phrases.id})`.as('phraseCount'),
			})
			.from(categories)
			.leftJoin(phrases, eq(categories.id, phrases.categoryId))
			.groupBy(categories.id)
			.orderBy(categories.id);

		// Преобразуем phraseCount в число
		const categoriesWithCount = categoriesList.map((category) => ({
			...category,
			phraseCount: Number(category.phraseCount),
		}));

		return NextResponse.json(categoriesWithCount);
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

		// Валидация иконки, если она указана
		const iconValue = icon && typeof icon === 'string' ? icon.trim() : null;
		if (iconValue && !isValidLucideIcon(iconValue)) {
			return NextResponse.json(
				{
					error: `Icon "${iconValue}" does not exist in lucide-react. Please use a valid icon name.`,
				},
				{ status: 400 }
			);
		}

		// Создаем новую категорию
		const newCategory = await db
			.insert(categories)
			.values({
				name: name.trim(),
				icon: iconValue,
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

		if (duplicateCategory.length > 0 && duplicateCategory[0].id !== categoryId) {
			return NextResponse.json(
				{ error: 'Category with this name already exists' },
				{ status: 409 }
			);
		}

		// Валидация иконки, если она указана
		let iconValue: string | null | undefined = undefined;
		if (icon !== undefined) {
			iconValue = icon && typeof icon === 'string' ? icon.trim() : null;
			if (iconValue && !isValidLucideIcon(iconValue)) {
				return NextResponse.json(
					{
						error: `Icon "${iconValue}" does not exist in lucide-react. Please use a valid icon name.`,
					},
					{ status: 400 }
				);
			}
		}

		const updatedCategory = await db
			.update(categories)
			.set({
				name: name.trim(),
				icon: iconValue,
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
