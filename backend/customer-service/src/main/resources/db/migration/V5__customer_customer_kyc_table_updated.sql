-- ==========================================
-- Modify customer table
-- ==========================================

ALTER TABLE customer
DROP COLUMN kyc_status;


ALTER TABLE customer
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();



-- ==========================================
-- Modify customer_kyc table
-- ==========================================

ALTER TABLE customer_kyc
DROP CONSTRAINT customer_kyc_pkey;


ALTER TABLE customer_kyc
ADD COLUMN kyc_id BIGSERIAL PRIMARY KEY;


ALTER TABLE customer_kyc
RENAME COLUMN driving_licence_url 
TO driving_license_url;


ALTER TABLE customer_kyc
ADD COLUMN rejection_reason VARCHAR(255);


ALTER TABLE customer_kyc
ADD CONSTRAINT uk_customer_kyc_customer_id UNIQUE(customer_id);