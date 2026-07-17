CREATE TYPE "public"."learning_level" AS ENUM('new', 'learning', 'review', 'mastered');--> statement-breakpoint
CREATE TABLE "phraseLearningProgress" (
	"userId" integer NOT NULL,
	"phraseId" integer NOT NULL,
	"level" "learning_level" DEFAULT 'new' NOT NULL,
	"easeFactor" integer DEFAULT 250 NOT NULL,
	"intervalDays" integer DEFAULT 0 NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	"nextReviewAt" timestamp DEFAULT now() NOT NULL,
	"lastReviewedAt" timestamp,
	"successCount" integer DEFAULT 0 NOT NULL,
	"failCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "phraseLearningProgress_userId_phraseId_pk" PRIMARY KEY("userId","phraseId")
);
--> statement-breakpoint
CREATE TABLE "userActivity" (
	"userId" integer NOT NULL,
	"date" varchar(10) NOT NULL,
	"reviewsCount" integer DEFAULT 0 NOT NULL,
	"quizCount" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "userActivity_userId_date_pk" PRIMARY KEY("userId","date")
);
--> statement-breakpoint
ALTER TABLE "phraseLearningProgress" ADD CONSTRAINT "phraseLearningProgress_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phraseLearningProgress" ADD CONSTRAINT "phraseLearningProgress_phraseId_phrases_id_fk" FOREIGN KEY ("phraseId") REFERENCES "public"."phrases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userActivity" ADD CONSTRAINT "userActivity_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;