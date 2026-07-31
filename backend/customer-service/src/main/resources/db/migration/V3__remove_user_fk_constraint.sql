ALTER TABLE public.customer 
DROP CONSTRAINT IF EXISTS fk_customer_user;

ALTER TABLE public.customer 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.customer 
DROP CONSTRAINT IF EXISTS customer_user_id_key;

ALTER TABLE public.customer 
ADD CONSTRAINT customer_user_id_key UNIQUE (user_id);

ALTER TABLE public.user_kyc 
DROP CONSTRAINT IF EXISTS fk_user_kyc_user;

ALTER TABLE public.user_kyc 
DROP CONSTRAINT IF EXISTS fk_user_kyc_verified_by;