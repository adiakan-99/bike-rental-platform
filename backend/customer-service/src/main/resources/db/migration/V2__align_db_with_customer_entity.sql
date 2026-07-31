-- 1. Drop the check constraint bound to account_status
ALTER TABLE public.customer 
    DROP CONSTRAINT IF EXISTS customer_account_status_valid;

-- 2. Drop columns that are missing in the Java Entity class
ALTER TABLE public.customer 
    DROP COLUMN IF EXISTS account_status,
    DROP COLUMN IF EXISTS kyc_status;