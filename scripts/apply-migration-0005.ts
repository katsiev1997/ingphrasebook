import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);

async function applyMigration() {
	try {
		console.log('Applying migration 0005...');

		// Удаляем старые ограничения
		await sql`ALTER TABLE "favoritePhrases" DROP CONSTRAINT IF EXISTS "favoritePhrases_userId_users_id_fk"`;
		await sql`ALTER TABLE "favoritePhrases" DROP CONSTRAINT IF EXISTS "favoritePhrases_phraseId_phrases_id_fk"`;
		await sql`ALTER TABLE "gameStats" DROP CONSTRAINT IF EXISTS "gameStats_userId_users_id_fk"`;
		await sql`ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "messages_dialogueId_dialogues_id_fk"`;
		await sql`ALTER TABLE "phrases" DROP CONSTRAINT IF EXISTS "phrases_categoryId_categories_id_fk"`;

		// Изменяем колонки на nullable
		await sql`ALTER TABLE "messages" ALTER COLUMN "dialogueId" DROP NOT NULL`;
		await sql`ALTER TABLE "phrases" ALTER COLUMN "categoryId" DROP NOT NULL`;

		// Добавляем новые колонки (если их еще нет)
		await sql`
			DO $$ 
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'phrases' AND column_name = 'order') THEN
					ALTER TABLE "phrases" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;
				END IF;
			END $$;
		`;

		await sql`
			DO $$ 
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'phrases' AND column_name = 'views') THEN
					ALTER TABLE "phrases" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;
				END IF;
			END $$;
		`;

		await sql`
			DO $$ 
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'phrases' AND column_name = 'favoritesCount') THEN
					ALTER TABLE "phrases" ADD COLUMN "favoritesCount" integer DEFAULT 0 NOT NULL;
				END IF;
			END $$;
		`;

		// Добавляем новые ограничения с правильными onDelete
		await sql`ALTER TABLE "favoritePhrases" ADD CONSTRAINT "favoritePhrases_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action`;
		await sql`ALTER TABLE "favoritePhrases" ADD CONSTRAINT "favoritePhrases_phraseId_phrases_id_fk" FOREIGN KEY ("phraseId") REFERENCES "public"."phrases"("id") ON DELETE cascade ON UPDATE no action`;
		await sql`ALTER TABLE "gameStats" ADD CONSTRAINT "gameStats_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action`;
		await sql`ALTER TABLE "messages" ADD CONSTRAINT "messages_dialogueId_dialogues_id_fk" FOREIGN KEY ("dialogueId") REFERENCES "public"."dialogues"("id") ON DELETE set null ON UPDATE no action`;
		await sql`ALTER TABLE "phrases" ADD CONSTRAINT "phrases_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action`;

		// Добавляем уникальное ограничение для gameStats.userId
		await sql`
			DO $$ 
			BEGIN
				IF NOT EXISTS (
					SELECT 1 FROM pg_constraint WHERE conname = 'gameStats_userId_unique'
				) THEN
					ALTER TABLE "gameStats" ADD CONSTRAINT "gameStats_userId_unique" UNIQUE("userId");
				END IF;
			END $$;
		`;

		console.log('Migration 0005 applied successfully!');
	} catch (error) {
		console.error('Error applying migration:', error);
		process.exit(1);
	}
}

applyMigration();

