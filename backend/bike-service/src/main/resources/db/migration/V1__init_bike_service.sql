-- =========================================================
-- Fleet Service Initial Migration (V1)
-- =========================================================

-- 1. Insurance Table
CREATE TABLE "insurance" (
                             "insurance_id" serial PRIMARY KEY,
                             "insurance_number" varchar NOT NULL,
                             "policy_provider" varchar NOT NULL,
                             "policy_holder_name" varchar NOT NULL,
                             "expiry_date" date NOT NULL
);

-- 2. Spec Definition Table
CREATE TABLE "spec_definition" (
                                   "spec_id" serial PRIMARY KEY,
                                   "bike_category" varchar NOT NULL,
                                   "spec_key" varchar NOT NULL,
                                   "display_name" varchar NOT NULL,
                                   "data_type" varchar NOT NULL,
                                   "unit" varchar,
                                   "is_required" boolean DEFAULT false NOT NULL,
                                   CONSTRAINT "spec_definition_unique_0" UNIQUE("bike_category","spec_key")
);

-- 3. Bike Table
CREATE TABLE "bike" (
                        "bike_id" serial PRIMARY KEY,
                        "partner_id" integer NOT NULL,
                        "registration_number" varchar NOT NULL,
                        "rc_upload_url" varchar NOT NULL,
                        "puc_upload_url" varchar NOT NULL,
                        "manufacturer" varchar NOT NULL,
                        "model" varchar NOT NULL,
                        "hourly_rate" numeric(10, 2) NOT NULL,
                        "security_deposit" numeric(10, 2),
                        "insurance_id" integer NOT NULL,
                        "bike_status" varchar NOT NULL,
                        "additional_services" jsonb,
                        "approval_status" varchar NOT NULL,
                        "approved_by" integer,
                        "approved_at" timestamp,
                        "rejection_reason" varchar,
                        "created_at" timestamp NOT NULL,
                        "updated_at" timestamp,
                        "deleted_at" timestamp,
                        "registration_expiry" date NOT NULL,
                        "puc_expiry" date NOT NULL
);
CREATE INDEX "bike_partner_idx" ON "bike" ("partner_id");
CREATE INDEX "bike_approval_idx" ON "bike" ("approval_status");

-- 4. Bike Details Table
CREATE TABLE "bike_details" (
                                "bike_details_id" serial PRIMARY KEY,
                                "bike_id" integer NOT NULL CONSTRAINT "bike_details_bike_id_key" UNIQUE,
                                "bike_category" varchar NOT NULL,
                                "bike_type" varchar NOT NULL,
                                "engine_cc" integer,
                                "transmission" varchar NOT NULL,
                                "seating_capacity" integer NOT NULL,
                                "year_of_manufacture" integer NOT NULL,
                                "color" varchar,
                                "additional_specs" jsonb
);

-- 5. Bike Image Table
CREATE TABLE "bike_image" (
                              "bike_image_id" serial PRIMARY KEY,
                              "bike_id" integer NOT NULL,
                              "image_url" varchar NOT NULL,
                              "display_order" integer NOT NULL,
                              "is_primary" boolean NOT NULL,
                              "uploaded_at" timestamp NOT NULL
);

-- =========================================================
-- Foreign Key Constraints
-- =========================================================
ALTER TABLE "bike" ADD CONSTRAINT "bike_insurance_id_fkey" FOREIGN KEY ("insurance_id") REFERENCES "insurance"("insurance_id");
ALTER TABLE "bike_details" ADD CONSTRAINT "bike_details_bike_id_fkey" FOREIGN KEY ("bike_id") REFERENCES "bike"("bike_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bike_image" ADD CONSTRAINT "bike_image_bike_id_fkey" FOREIGN KEY ("bike_id") REFERENCES "bike"("bike_id") ON DELETE CASCADE ON UPDATE CASCADE;