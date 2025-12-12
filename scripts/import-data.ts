import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { phrases, categories } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ============================================
// НАСТРОЙКИ ИМПОРТА
// ============================================
// Просто измените эти значения для нового импорта:
const JSON_FILE_NAME = 'translates/city.json'; // Название JSON файла (должен быть в корне проекта)
const CATEGORY_ID = 28; // ID категории, в которую будут импортированы фразы
// ============================================

// Загружаем переменные окружения
config({ path: '.env.local' });
config({ path: '.env' });

if (!process.env.DATABASE_URL) {
	console.error('Ошибка: DATABASE_URL не установлен в переменных окружения!');
	process.exit(1);
}

// Подключаемся к базе данных
const db = drizzle(process.env.DATABASE_URL);

interface Phrase {
	id: number;
	title: string;
	translate: string;
	transcription: string;
	audioUrl: string | null;
	categoryId: number;
	createdAt: string;
	updatedAt: string;
}

// Функция для парсинга аргументов командной строки
function parseArgs() {
	const args = process.argv.slice(2);
	let fileName = JSON_FILE_NAME;
	let categoryId = CATEGORY_ID;

	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--file' || args[i] === '-f') {
			fileName = args[i + 1];
			i++;
		} else if (args[i] === '--category' || args[i] === '-c') {
			categoryId = parseInt(args[i + 1], 10);
			i++;
		}
	}

	return { fileName, categoryId };
}

async function importPhrases() {
	try {
		// Получаем параметры (либо из констант, либо из аргументов командной строки)
		const { fileName, categoryId } = parseArgs();

		console.log('Начинаем импорт фраз...');
		console.log(`📁 Файл: ${fileName}`);
		console.log(`📂 Категория ID: ${categoryId}`);

		// Проверяем существование категории
		const category = await db
			.select()
			.from(categories)
			.where(eq(categories.id, categoryId))
			.limit(1);

		if (category.length === 0) {
			console.error(`Категория с id=${categoryId} не найдена в базе данных!`);
			process.exit(1);
		}

		console.log(`Категория найдена: ${category[0].name}`);

		// Читаем JSON файл
		// Определяем путь к файлу независимо от того, как запущен скрипт
		const currentDir = path.dirname(fileURLToPath(import.meta.url));
		const filePath = path.resolve(currentDir, '..', fileName);

		if (!fs.existsSync(filePath)) {
			console.error(`Файл не найден: ${filePath}`);
			console.error(`Убедитесь, что файл ${fileName} находится в корне проекта!`);
			process.exit(1);
		}

		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const questions: Phrase[] = JSON.parse(fileContent);

		console.log(`Найдено ${questions.length} фраз для импорта`);

		let imported = 0;
		let skipped = 0;
		let errors = 0;

		// Получаем все существующие фразы категории один раз для проверки дубликатов
		console.log('Проверяем существующие фразы в категории...');
		const existingPhrases = await db
			.select()
			.from(phrases)
			.where(eq(phrases.categoryId, categoryId));

		// Создаем Set для быстрой проверки дубликатов
		const existingSet = new Set(
			existingPhrases.map(
				(p) => `${p.title.trim().toLowerCase()}|${p.translate.trim().toLowerCase()}`
			)
		);

		console.log(
			`Найдено ${existingPhrases.length} существующих фраз в категории`
		);

		// Импортируем каждую фразу
		for (const question of questions) {
			try {
				// Проверяем, существует ли уже фраза с таким же title и translate в категории
				const key = `${question.title.trim().toLowerCase()}|${question.translate
					.trim()
					.toLowerCase()}`;
				if (existingSet.has(key)) {
					console.log(`⏭️  Пропущено (дубликат): "${question.title}"`);
					skipped++;
					continue;
				}

				// Создаем новую фразу с указанным categoryId
				await db.insert(phrases).values({
					title: question.title.trim(),
					translate: question.translate.trim(),
					transcription: question.transcription.trim(),
					audioUrl: question.audioUrl || null,
					categoryId: categoryId,
				});

				// Добавляем в Set, чтобы не импортировать повторно при повторном запуске
				existingSet.add(key);
				imported++;
				console.log(`✅ Импортировано: "${question.title}"`);

				// Небольшая задержка, чтобы не перегружать БД
				await new Promise((resolve) => setTimeout(resolve, 10));
			} catch (error) {
				errors++;
				console.error(`❌ Ошибка при импорте "${question.title}":`, error);
			}
		}

		// Обновляем updatedAt категории
		await db
			.update(categories)
			.set({ updatedAt: new Date() })
			.where(eq(categories.id, categoryId));

		console.log('\n=== Результаты импорта ===');
		console.log(`✅ Успешно импортировано: ${imported}`);
		console.log(`⏭️  Пропущено (дубликаты): ${skipped}`);
		console.log(`❌ Ошибок: ${errors}`);
		console.log(`📊 Всего обработано: ${questions.length}`);

		process.exit(0);
	} catch (error) {
		console.error('Критическая ошибка:', error);
		process.exit(1);
	}
}

// Запускаем импорт
importPhrases();
