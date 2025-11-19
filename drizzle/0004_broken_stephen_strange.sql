CREATE TABLE "gameStats" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"totalQuestions" integer DEFAULT 0 NOT NULL,
	"correctAnswers" integer DEFAULT 0 NOT NULL,
	"totalGames" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gameStats" ADD CONSTRAINT "gameStats_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;