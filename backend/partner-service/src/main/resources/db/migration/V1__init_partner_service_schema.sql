-- =====================================================================
-- V1: Initial Schema Setup for Partner Service (Service-Specific DB)
-- =====================================================================

CREATE SCHEMA IF NOT EXISTS "public";

-- 1. Partner Core Table
CREATE TABLE "partner" (
                           "partner_id" serial PRIMARY KEY,
                           "user_id" integer NOT NULL CONSTRAINT "partner_user_id_key" UNIQUE,
                           "seller_type" varchar(30) DEFAULT 'INDIVIDUAL' NOT NULL,
                           "owner_name" varchar(150),
                           "pan_number" varchar(10) NOT NULL,
                           "contact_phone" varchar(20),
                           "alternate_email" varchar(255),
                           "alternate_phone_number" varchar(20),
                           "business_name" varchar(200),
                           "trade_name" varchar(200),
                           "gst_number" varchar(15),
                           "business_type" varchar(50),
                           "year_of_establishment" varchar(4),
                           "udyam_number" varchar(50),
                           "signatory_name" varchar(150),
                           "signatory_designation" varchar(100),
                           "license_number" varchar(100),
                           "issuing_authority" varchar(150),
                           "license_valid_from" date,
                           "license_valid_to" date,
                           "address_line_1" varchar(255) NOT NULL,
                           "address_line_2" varchar(255),
                           "city" varchar(100) NOT NULL,
                           "state" varchar(100) NOT NULL,
                           "pincode" varchar(6) NOT NULL,
                           "approval_status" varchar(30) DEFAULT 'PENDING' NOT NULL,
                           "account_status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
                           "approved_by" integer,
                           "approved_at" timestamp with time zone,
                           "rejection_reason" text,
                           "created_at" timestamp with time zone DEFAULT now() NOT NULL,
                           "updated_at" timestamp with time zone,
                           "deleted_at" timestamp with time zone,
                           CONSTRAINT "partner_account_status_valid" CHECK (((account_status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'SUSPENDED'::character varying, 'CLOSED'::character varying])::text[]))),
                           CONSTRAINT "partner_approval_status_valid" CHECK (((approval_status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'RESUBMIT_REQUIRED'::character varying])::text[]))),
                           CONSTRAINT "partner_commercial_requires_business" CHECK ((((seller_type)::text <> 'COMMERCIAL_DEALER'::text) OR ((business_name IS NOT NULL) AND (gst_number IS NOT NULL)))),
                           CONSTRAINT "partner_individual_no_gst" CHECK ((((seller_type)::text <> 'INDIVIDUAL'::text) OR (gst_number IS NULL))),
                           CONSTRAINT "partner_license_dates" CHECK (((license_valid_to IS NULL) OR (license_valid_from IS NULL) OR (license_valid_to >= license_valid_from))),
                           CONSTRAINT "partner_seller_type_valid" CHECK (((seller_type)::text = ANY ((ARRAY['INDIVIDUAL'::character varying, 'COMMERCIAL_DEALER'::character varying])::text[])))
);

-- 2. Partner Documents Table
CREATE TABLE "partner_document" (
                                    "document_id" serial PRIMARY KEY,
                                    "partner_id" integer NOT NULL,
                                    "doc_type" varchar(40) NOT NULL,
                                    "file_url" varchar(500) NOT NULL,
                                    "expires_at" date,
                                    "uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
                                    CONSTRAINT "partner_document_type_valid" CHECK (((doc_type)::text = ANY ((ARRAY['PAN'::character varying, 'GST_CERT'::character varying, 'INCORPORATION'::character varying, 'SHOP_ESTABLISHMENT'::character varying, 'RENTAL_LICENSE'::character varying, 'ADDRESS_PROOF'::character varying, 'GOVT_ID'::character varying, 'CANCELLED_CHEQUE'::character varying, 'UDYAM'::character varying])::text[])))
);

-- 3. Partner Payout Accounts Table
CREATE TABLE "partner_payout_account" (
                                          "payout_id" serial PRIMARY KEY,
                                          "partner_id" integer NOT NULL,
                                          "account_holder" varchar(150) NOT NULL,
                                          "account_number" varchar(30) NOT NULL,
                                          "ifsc" varchar(11) NOT NULL,
                                          "bank_name" varchar(150),
                                          "is_primary" boolean DEFAULT true NOT NULL,
                                          "verified_at" timestamp with time zone,
                                          "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 4. Indexes
CREATE INDEX "partner_approval_idx" ON "partner" ("approval_status");
CREATE INDEX "partner_city_idx" ON "partner" ("city");
CREATE UNIQUE INDEX "partner_gst_unique" ON "partner" ("gst_number");
CREATE INDEX "partner_document_type_idx" ON "partner_document" ("partner_id","doc_type");

-- 5. Foreign Key Constraints
ALTER TABLE "partner_document" ADD CONSTRAINT "fk_partner_document_partner" FOREIGN KEY ("partner_id") REFERENCES "partner"("partner_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "partner_payout_account" ADD CONSTRAINT "fk_partner_payout_partner" FOREIGN KEY ("partner_id") REFERENCES "partner"("partner_id") ON DELETE RESTRICT ON UPDATE CASCADE;