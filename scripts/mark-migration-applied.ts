import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);

async function markMigrationApplied() {
	try {
		console.log('Marking migration 0005 as applied...');

		// Создаем таблицу миграций, если её нет
		await sql`
			CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at bigint
			);
		`;

		// Проверяем, не применена ли уже миграция
		const existing = await sql`
			SELECT * FROM "__drizzle_migrations" WHERE hash = '0005_slippery_ultimates';
		`;

		if (existing.length === 0) {
			// Добавляем запись о применении миграции
			await sql`
				INSERT INTO "__drizzle_migrations" (hash, created_at)
				VALUES ('0005_slippery_ultimates', ${Date.now()});
			`;
			console.log('Migration 0005 marked as applied!');
		} else {
			console.log('Migration 0005 already marked as applied.');
		}
	} catch (error) {
		console.error('Error marking migration:', error);
		process.exit(1);
	}
}

markMigrationApplied();

