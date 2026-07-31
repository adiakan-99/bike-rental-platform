

-- 1. Add a CHECK constraint for bike_status to ensure only valid operational states are inserted
ALTER TABLE "bike"
    ADD CONSTRAINT "chk_bike_status"
        CHECK ("bike_status" IN ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE'));

-- 2. Add a CHECK constraint for approval_status to enforce the admin review workflow
ALTER TABLE "bike"
    ADD CONSTRAINT "chk_bike_approval_status"
        CHECK ("approval_status" IN ('PENDING', 'APPROVED', 'REJECTED'));