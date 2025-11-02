CREATE TYPE "public"."role" AS ENUM('ADMIN', 'MODERATOR', 'USER');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "dialogues" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"audioUrl" varchar(1000),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favoritePhrases" (
	"userId" integer NOT NULL,
	"phraseId" integer NOT NULL,
	CONSTRAINT "favoritePhrases_userId_phraseId_pk" PRIMARY KEY("userId","phraseId")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"originalText" text NOT NULL,
	"translatedText" text NOT NULL,
	"dialogueId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phrases" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"translate" text NOT NULL,
	"transcription" text NOT NULL,
	"audioUrl" varchar(1000),
	"categoryId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" "role" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "favoritePhrases" ADD CONSTRAINT "favoritePhrases_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favoritePhrases" ADD CONSTRAINT "favoritePhrases_phraseId_phrases_id_fk" FOREIGN KEY ("phraseId") REFERENCES "public"."phrases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_dialogueId_dialogues_id_fk" FOREIGN KEY ("dialogueId") REFERENCES "public"."dialogues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phrases" ADD CONSTRAINT "phrases_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;