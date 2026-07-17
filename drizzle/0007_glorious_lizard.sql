CREATE TABLE "productSurveyResponses" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"surveyVersion" varchar(20) DEFAULT 'v1' NOT NULL,
	"answers" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "productSurveyResponses_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "productSurveyResponses" ADD CONSTRAINT "productSurveyResponses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;