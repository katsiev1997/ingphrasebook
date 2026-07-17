import {
	pgTable,
	serial,
	varchar,
	text,
	timestamp,
	integer,
	pgEnum,
	primaryKey,
	unique,
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
	categoryId: integer('categoryId').references(() => categories.id, {
		onDelete: 'set null',
	}),
	order: integer('order').notNull().default(0),
	views: integer('views').notNull().default(0),
	favoritesCount: integer('favoritesCount').notNull().default(0),
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
	dialogueId: integer('dialogueId').references(() => dialogues.id, {
		onDelete: 'set null',
	}),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Таблица для связи many-to-many между пользователями и фразами (избранное)
export const favoritePhrases = pgTable(
	'favoritePhrases',
	{
		userId: integer('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		phraseId: integer('phraseId')
			.notNull()
			.references(() => phrases.id, { onDelete: 'cascade' }),
	},
	(table) => [primaryKey({ columns: [table.userId, table.phraseId] })]
);

// Модель статистики игры
export const gameStats = pgTable('gameStats', {
	id: serial('id').primaryKey(),
	userId: integer('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.unique(),
	totalQuestions: integer('totalQuestions').notNull().default(0),
	correctAnswers: integer('correctAnswers').notNull().default(0),
	totalGames: integer('totalGames').notNull().default(0),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const learningLevelEnum = pgEnum('learning_level', [
	'new',
	'learning',
	'review',
	'mastered',
]);

// Прогресс изучения фраз (SRS)
export const phraseLearningProgress = pgTable(
	'phraseLearningProgress',
	{
		userId: integer('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		phraseId: integer('phraseId')
			.notNull()
			.references(() => phrases.id, { onDelete: 'cascade' }),
		level: learningLevelEnum('level').notNull().default('new'),
		/** Ease factor × 100 (default 2.5 → 250) */
		easeFactor: integer('easeFactor').notNull().default(250),
		intervalDays: integer('intervalDays').notNull().default(0),
		repetitions: integer('repetitions').notNull().default(0),
		nextReviewAt: timestamp('nextReviewAt').notNull().defaultNow(),
		lastReviewedAt: timestamp('lastReviewedAt'),
		successCount: integer('successCount').notNull().default(0),
		failCount: integer('failCount').notNull().default(0),
		createdAt: timestamp('createdAt').notNull().defaultNow(),
		updatedAt: timestamp('updatedAt').notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.phraseId] })]
);

/** Daily activity log — one row per user per calendar day (YYYY-MM-DD) */
export const userActivity = pgTable(
	'userActivity',
	{
		userId: integer('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		date: varchar('date', { length: 10 }).notNull(),
		reviewsCount: integer('reviewsCount').notNull().default(0),
		quizCount: integer('quizCount').notNull().default(0),
	},
	(table) => [primaryKey({ columns: [table.userId, table.date] })]
);

/** One-shot product survey response per user */
export const productSurveyResponses = pgTable('productSurveyResponses', {
	id: serial('id').primaryKey(),
	userId: integer('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.unique(),
	surveyVersion: varchar('surveyVersion', { length: 20 }).notNull().default('v1'),
	answers: text('answers').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Определение связей
export const usersRelations = relations(users, ({ many }) => ({
	favoritePhrases: many(favoritePhrases),
	gameStats: many(gameStats),
	phraseLearningProgress: many(phraseLearningProgress),
	userActivity: many(userActivity),
	productSurveyResponses: many(productSurveyResponses),
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
	learningProgress: many(phraseLearningProgress),
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

export const gameStatsRelations = relations(gameStats, ({ one }) => ({
	user: one(users, {
		fields: [gameStats.userId],
		references: [users.id],
	}),
}));

export const phraseLearningProgressRelations = relations(
	phraseLearningProgress,
	({ one }) => ({
		user: one(users, {
			fields: [phraseLearningProgress.userId],
			references: [users.id],
		}),
		phrase: one(phrases, {
			fields: [phraseLearningProgress.phraseId],
			references: [phrases.id],
		}),
	})
);

export const userActivityRelations = relations(userActivity, ({ one }) => ({
	user: one(users, {
		fields: [userActivity.userId],
		references: [users.id],
	}),
}));

export const productSurveyResponsesRelations = relations(
	productSurveyResponses,
	({ one }) => ({
		user: one(users, {
			fields: [productSurveyResponses.userId],
			references: [users.id],
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
export type GameStats = typeof gameStats.$inferSelect;
export type NewGameStats = typeof gameStats.$inferInsert;
export type PhraseLearningProgress = typeof phraseLearningProgress.$inferSelect;
export type NewPhraseLearningProgress = typeof phraseLearningProgress.$inferInsert;
export type UserActivity = typeof userActivity.$inferSelect;
export type NewUserActivity = typeof userActivity.$inferInsert;
export type ProductSurveyResponse = typeof productSurveyResponses.$inferSelect;
export type NewProductSurveyResponse = typeof productSurveyResponses.$inferInsert;
export type LearningLevel = (typeof learningLevelEnum.enumValues)[number];
