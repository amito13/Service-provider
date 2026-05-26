CREATE TYPE "public"."appointment_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."week_day" AS ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');--> statement-breakpoint
CREATE TABLE "appointments" (
	"appointment_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"prf_id" integer NOT NULL,
	"problem_description" text NOT NULL,
	"appointment_date" timestamp NOT NULL,
	"start_time" varchar(20) NOT NULL,
	"end_time" varchar(20) NOT NULL,
	"status" "appointment_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_category_name_unique" UNIQUE("category_name")
);
--> statement-breakpoint
CREATE TABLE "professional_availability" (
	"availability_id" serial PRIMARY KEY NOT NULL,
	"prf_id" integer NOT NULL,
	"day" "week_day" NOT NULL,
	"start_time" varchar(20) NOT NULL,
	"end_time" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"prf_id" serial PRIMARY KEY NOT NULL,
	"prf_name" varchar(255) NOT NULL,
	"prf_email" varchar(255) NOT NULL,
	"prf_number" varchar(20) NOT NULL,
	"hashed_password" text NOT NULL,
	"profile_image" text,
	"description" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"pincode" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"service_charge" real NOT NULL,
	"experience_years" integer,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "professionals_prf_email_unique" UNIQUE("prf_email"),
	CONSTRAINT "professionals_prf_number_unique" UNIQUE("prf_number")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"prf_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"user_number" varchar(20) NOT NULL,
	"hashed_password" text NOT NULL,
	"profile_image" text,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"pincode" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_email_unique" UNIQUE("user_email"),
	CONSTRAINT "users_user_number_unique" UNIQUE("user_number")
);
--> statement-breakpoint
CREATE TABLE "working_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"prf_id" integer NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_prf_id_professionals_prf_id_fk" FOREIGN KEY ("prf_id") REFERENCES "public"."professionals"("prf_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_availability" ADD CONSTRAINT "professional_availability_prf_id_professionals_prf_id_fk" FOREIGN KEY ("prf_id") REFERENCES "public"."professionals"("prf_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_prf_id_professionals_prf_id_fk" FOREIGN KEY ("prf_id") REFERENCES "public"."professionals"("prf_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_categories" ADD CONSTRAINT "working_categories_prf_id_professionals_prf_id_fk" FOREIGN KEY ("prf_id") REFERENCES "public"."professionals"("prf_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_categories" ADD CONSTRAINT "working_categories_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE no action;