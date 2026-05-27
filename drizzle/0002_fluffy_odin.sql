ALTER TABLE "professionals" DROP CONSTRAINT "professionals_prf_email_unique";--> statement-breakpoint
ALTER TABLE "professionals" DROP CONSTRAINT "professionals_prf_number_unique";--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "prf_name";--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "prf_email";--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "prf_number";--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "hashed_password";--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "profile_image";--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "pincode";--> statement-breakpoint
ALTER TABLE "professionals" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_unique" UNIQUE("user_id");