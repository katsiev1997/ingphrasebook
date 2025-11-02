ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");