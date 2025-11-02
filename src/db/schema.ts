import {
	pgTable,
	serial,
	varchar,
	text,
	timestamp,
	integer,
	pgEnum,
	primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Тип для имен иконок из lucide-react
// Можно использовать любое имя иконки из lucide-react (например: "Home", "User", "Settings", "Book" и т.д.)
// Полный список доступных иконок: https://lucide.dev/icons/
export type LucideIconName = string;

// Определение ролей
export const roleEnum = pgEnum('role', ['ADMIN', 'MODERATOR', 'USER']);

// Модель пользователя
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 255 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull(),
	role: roleEnum('role').notNull().default('USER'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Модель категории
export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull().unique(),
	icon: varchar('icon', { length: 100 }),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Модель фраз
export const phrases = pgTable('phrases', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 500 }).notNull(),
	translate: text('translate').notNull(),
	transcription: text('transcription').notNull(),
	audioUrl: varchar('audioUrl', { length: 1000 }),
	categoryId: integer('categoryId')
		.notNull()
		.references(() => categories.id),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Модель диалога
export const dialogues = pgTable('dialogues', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 500 }).notNull(),
	audioUrl: varchar('audioUrl', { length: 1000 }),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Модель сообщения в диалоге
export const messages = pgTable('messages', {
	id: serial('id').primaryKey(),
	originalText: text('originalText').notNull(),
	translatedText: text('translatedText').notNull(),
	dialogueId: integer('dialogueId')
		.notNull()
		.references(() => dialogues.id),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Таблица для связи many-to-many между пользователями и фразами (избранное)
export const favoritePhrases = pgTable(
	'favoritePhrases',
	{
		userId: integer('userId')
			.notNull()
			.references(() => users.id),
		phraseId: integer('phraseId')
			.notNull()
			.references(() => phrases.id),
	},
	(table) => [primaryKey({ columns: [table.userId, table.phraseId] })]
);

// Определение связей
export const usersRelations = relations(users, ({ many }) => ({
	favoritePhrases: many(favoritePhrases),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	phrases: many(phrases),
}));

export const phrasesRelations = relations(phrases, ({ one, many }) => ({
	category: one(categories, {
		fields: [phrases.categoryId],
		references: [categories.id],
	}),
	favoritedBy: many(favoritePhrases),
}));

export const dialoguesRelations = relations(dialogues, ({ many }) => ({
	messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	dialogue: one(dialogues, {
		fields: [messages.dialogueId],
		references: [dialogues.id],
	}),
}));

export const favoritePhrasesRelations = relations(
	favoritePhrases,
	({ one }) => ({
		user: one(users, {
			fields: [favoritePhrases.userId],
			references: [users.id],
		}),
		phrase: one(phrases, {
			fields: [favoritePhrases.phraseId],
			references: [phrases.id],
		}),
	})
);

// Типы для TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Phrase = typeof phrases.$inferSelect;
export type NewPhrase = typeof phrases.$inferInsert;
export type Dialogue = typeof dialogues.$inferSelect;
export type NewDialogue = typeof dialogues.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type FavoritePhrase = typeof favoritePhrases.$inferSelect;
export type NewFavoritePhrase = typeof favoritePhrases.$inferInsert;
