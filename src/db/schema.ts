import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";



/* =========================================================
   ENUMS
========================================================= */

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
]);
export const accountTypeEnum = pgEnum("account_type", [
  "USER",
  "PROFESSIONAL",
  "ADMIN"
]);

export const weekDayEnum = pgEnum("week_day", [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);



/* =========================================================
   USER TABLE
========================================================= */

export const users = pgTable("users", {
  user_id: serial("user_id").primaryKey(),

  user_name: varchar("user_name", { length: 255 }).notNull(),

  user_email: varchar("user_email", { length: 255 })
    .unique()
    .notNull(),

  user_number: varchar("user_number", { length: 20 })
    .unique()
    .notNull(),

  hashed_password: text("hashed_password").notNull(),

  account_type: accountTypeEnum("account_type")
    .default("USER")
    .notNull(),

  profile_image: text("profile_image"),

  city: varchar("city", { length: 100 }).notNull(),

  state: varchar("state", { length: 100 }).notNull(),

  pincode: varchar("pincode", { length: 20 }).notNull(),

  address: text("address").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});



/* =========================================================
   PROFESSIONAL TABLE
========================================================= */

export const professionals = pgTable("professionals", {
  prf_id: serial("prf_id").primaryKey(),

  user_id: integer("user_id")
    .references(() => users.user_id)
    .notNull()
    .unique(),

  description: text("description").notNull(),

  service_charge: real("service_charge").notNull(),

  experience_years: integer("experience_years"),

  isVerified: boolean("is_verified")
    .default(false)
    .notNull(),

  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});



/* =========================================================
   CATEGORY TABLE
========================================================= */

export const categories = pgTable("categories", {
  category_id: serial("category_id").primaryKey(),

  category_name: varchar("category_name", { length: 255 })
    .unique()
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});



/* =========================================================
   WORKING CATEGORY TABLE
========================================================= */

export const workingCategories = pgTable("working_categories", {
  id: serial("id").primaryKey(),

  prf_id: integer("prf_id")
    .references(() => professionals.prf_id, {
      onDelete: "cascade",
    })
    .notNull(),

  category_id: integer("category_id")
    .references(() => categories.category_id, {
      onDelete: "cascade",
    })
    .notNull(),
});



/* =========================================================
   APPOINTMENT TABLE
========================================================= */

export const appointments = pgTable("appointments", {
  appointment_id: serial("appointment_id").primaryKey(),

  user_id: integer("user_id")
    .references(() => users.user_id, {
      onDelete: "cascade",
    })
    .notNull(),

  prf_id: integer("prf_id")
    .references(() => professionals.prf_id, {
      onDelete: "cascade",
    })
    .notNull(),

  problem_description: text("problem_description").notNull(),

  appointment_date: timestamp("appointment_date").notNull(),

  start_time: varchar("start_time", { length: 20 }).notNull(),

  end_time: varchar("end_time", { length: 20 }).notNull(),

  status: appointmentStatusEnum("status")
    .default("PENDING")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});



/* =========================================================
   REVIEW TABLE
========================================================= */

export const reviews = pgTable("reviews", {
  review_id: serial("review_id").primaryKey(),

  user_id: integer("user_id")
    .references(() => users.user_id, {
      onDelete: "cascade",
    })
    .notNull(),

  prf_id: integer("prf_id")
    .references(() => professionals.prf_id, {
      onDelete: "cascade",
    })
    .notNull(),

  rating: integer("rating").notNull(),

  comment: text("comment").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});



/* =========================================================
   PROFESSIONAL AVAILABILITY TABLE
========================================================= */

export const professionalAvailability = pgTable(
  "professional_availability",
  {
    availability_id: serial("availability_id").primaryKey(),

    prf_id: integer("prf_id")
      .references(() => professionals.prf_id, {
        onDelete: "cascade",
      })
      .notNull(),

    day: weekDayEnum("day").notNull(),

    start_time: varchar("start_time", {
      length: 20,
    }).notNull(),

    end_time: varchar("end_time", {
      length: 20,
    }).notNull(),
  }
);