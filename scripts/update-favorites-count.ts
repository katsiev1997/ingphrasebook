import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);

async function updateFavoritesCount() {
	try {
		console.log('Updating favoritesCount for all phrases...');

		// Обновляем счетчик избранного для каждой фразы
		await sql`
			UPDATE "phrases"
			SET "favoritesCount" = (
				SELECT COUNT(*)
				FROM "favoritePhrases"
				WHERE "favoritePhrases"."phraseId" = "phrases"."id"
			);
		`;

		console.log('FavoritesCount updated successfully!');
	} catch (error) {
		console.error('Error updating favoritesCount:', error);
		process.exit(1);
	}
}

updateFavoritesCount();

