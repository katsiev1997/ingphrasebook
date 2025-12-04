ALTER TABLE "favoritePhrases" DROP CONSTRAINT "favoritePhrases_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "favoritePhrases" DROP CONSTRAINT "favoritePhrases_phraseId_phrases_id_fk";
--> statement-breakpoint
ALTER TABLE "gameStats" DROP CONSTRAINT "gameStats_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_dialogueId_dialogues_id_fk";
--> statement-breakpoint
ALTER TABLE "phrases" DROP CONSTRAINT "phrases_categoryId_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "dialogueId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "phrases" ALTER COLUMN "categoryId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "phrases" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "phrases" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "phrases" ADD COLUMN "favoritesCount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "favoritePhrases" ADD CONSTRAINT "favoritePhrases_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoritePhrases" ADD CONSTRAINT "favoritePhrases_phraseId_phrases_id_fk" FOREIGN KEY ("phraseId") REFERENCES "public"."phrases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameStats" ADD CONSTRAINT "gameStats_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_dialogueId_dialogues_id_fk" FOREIGN KEY ("dialogueId") REFERENCES "public"."dialogues"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phrases" ADD CONSTRAINT "phrases_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameStats" ADD CONSTRAINT "gameStats_userId_unique" UNIQUE("userId");