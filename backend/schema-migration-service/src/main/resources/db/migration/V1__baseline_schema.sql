-- =====================================================================
-- V1__baseline_schema.sql
-- BikeRental — full schema (v3). Postgres / Neon.
--
-- Place at: src/main/resources/db/migration/V1__baseline_schema.sql
--
-- Tables are created in dependency order so every FK target exists.
-- CHECK constraints encode the rules DBML could only describe in notes.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. IDENTITY & RBAC
-- ---------------------------------------------------------------------

CREATE TABLE "user" (
    user_id        SERIAL PRIMARY KEY,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password       VARCHAR(255) NOT NULL,
    phone_number   VARCHAR(20)  NOT NULL UNIQUE,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    gender         VARCHAR(20),
    account_status VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    last_login_at  TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ,
    deleted_at     TIMESTAMPTZ,
    is_verified    BOOLEAN      NOT NULL DEFAULT false,
    CONSTRAINT user_account_status_valid
        CHECK (account_status IN ('ACTIVE','SUSPENDED','CLOSED'))
);
COMMENT ON TABLE "user" IS
    'One account per person. Roles live in user_role, so a customer can also be a partner. Name and gender are stored here once, never repeated per role.';

-- Person identity, held once per user and shared by every role that needs it.
CREATE TABLE user_kyc (
    user_id                 INTEGER      PRIMARY KEY,
    date_of_birth           DATE         NOT NULL,
    id_type                 VARCHAR(20)  NOT NULL DEFAULT 'AADHAAR',
    id_number               VARCHAR(50)  NOT NULL UNIQUE,
    id_upload_url           VARCHAR(500) NOT NULL,
    driving_license_number  VARCHAR(50),
    driving_licence_url     VARCHAR(500),
    license_valid_to        DATE,
    kyc_status              VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    verified_by             INTEGER,
    verified_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ,
    CONSTRAINT user_kyc_id_type_valid
        CHECK (id_type IN ('AADHAAR','PASSPORT','VOTER_ID','DRIVING_LICENSE')),
    CONSTRAINT user_kyc_status_valid
        CHECK (kyc_status IN ('PENDING','VERIFIED','REJECTED')),
    -- 18+ at the moment of insert; re-checked in the application on booking
    CONSTRAINT user_kyc_adult
        CHECK (date_of_birth <= (CURRENT_DATE - INTERVAL '18 years'))
);
COMMENT ON TABLE user_kyc IS
    'Person identity held once per user. A user who is both customer and individual partner has ONE date_of_birth and ONE government ID, so KYC can never disagree between roles. Encrypt id_number at rest.';

CREATE TABLE role (
    role_id SERIAL      PRIMARY KEY,
    name    VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE permission (
    permission_id SERIAL       PRIMARY KEY,
    key           VARCHAR(100) NOT NULL UNIQUE,
    description   VARCHAR(255)
);

CREATE TABLE role_permission (
    role_id       INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_role (
    user_id     INTEGER     NOT NULL,
    role_id     INTEGER     NOT NULL,
    assigned_by INTEGER,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);
CREATE INDEX user_role_role_idx ON user_role (role_id);
COMMENT ON TABLE user_role IS
    'Composite PK stops the same role being granted twice. role_idx serves "all admins" style lookups.';

-- ---------------------------------------------------------------------
-- 2. ROLE PROFILES
-- ---------------------------------------------------------------------

CREATE TABLE customer (
    customer_id       SERIAL       PRIMARY KEY,
    user_id           INTEGER      NOT NULL UNIQUE,
    address_line_1    VARCHAR(255),
    address_line_2    VARCHAR(255),
    city              VARCHAR(100),
    state             VARCHAR(100),
    pincode           CHAR(6),
    emergency_contact VARCHAR(20),
    referral_code     VARCHAR(50),
    joining_date      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ,
    account_status    VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT customer_account_status_valid
        CHECK (account_status IN ('ACTIVE','SUSPENDED','CLOSED'))
);
COMMENT ON TABLE customer IS
    'Rider-specific data only. Name/gender come from "user"; DOB, government ID and licence come from user_kyc.';

CREATE TABLE admin (
    admin_id   SERIAL       PRIMARY KEY,
    user_id    INTEGER      NOT NULL UNIQUE,
    department VARCHAR(100),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE partner (
    partner_id             SERIAL       PRIMARY KEY,
    user_id                INTEGER      NOT NULL UNIQUE,
    seller_type            VARCHAR(30)  NOT NULL DEFAULT 'INDIVIDUAL',

    owner_name             VARCHAR(150),
    pan_number             CHAR(10)     NOT NULL,
    contact_phone          VARCHAR(20),
    alternate_email        VARCHAR(255),
    alternate_phone_number VARCHAR(20),

    -- commercial dealer only (enforced by CHECK below)
    business_name          VARCHAR(200),
    trade_name             VARCHAR(200),
    gst_number             VARCHAR(15),
    business_type          VARCHAR(50),
    year_of_establishment  CHAR(4),
    udyam_number           VARCHAR(50),
    signatory_name         VARCHAR(150),
    signatory_designation  VARCHAR(100),

    -- Rent a Motor Cycle Scheme licence (applies to both seller types)
    license_number         VARCHAR(100),
    issuing_authority      VARCHAR(150),
    license_valid_from     DATE,
    license_valid_to       DATE,

    address_line_1         VARCHAR(255) NOT NULL,
    address_line_2         VARCHAR(255),
    city                   VARCHAR(100) NOT NULL,
    state                  VARCHAR(100) NOT NULL,
    pincode                CHAR(6)      NOT NULL,

    approval_status        VARCHAR(30)  NOT NULL DEFAULT 'PENDING',
    account_status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    approved_by            INTEGER,
    approved_at            TIMESTAMPTZ,
    rejection_reason       TEXT,

    created_at             TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at             TIMESTAMPTZ,
    deleted_at             TIMESTAMPTZ,

    CONSTRAINT partner_seller_type_valid
        CHECK (seller_type IN ('INDIVIDUAL','COMMERCIAL_DEALER')),
    CONSTRAINT partner_approval_status_valid
        CHECK (approval_status IN ('PENDING','APPROVED','REJECTED','RESUBMIT_REQUIRED')),
    CONSTRAINT partner_account_status_valid
        CHECK (account_status IN ('ACTIVE','SUSPENDED','CLOSED')),
    -- a commercial dealer cannot exist without its business identity
    CONSTRAINT partner_commercial_requires_business
        CHECK (seller_type <> 'COMMERCIAL_DEALER'
               OR (business_name IS NOT NULL AND gst_number IS NOT NULL)),
    -- an individual has no GST registration
    CONSTRAINT partner_individual_no_gst
        CHECK (seller_type <> 'INDIVIDUAL' OR gst_number IS NULL),
    CONSTRAINT partner_license_dates
        CHECK (license_valid_to IS NULL
               OR license_valid_from IS NULL
               OR license_valid_to >= license_valid_from)
);
-- partial unique: many individuals may have NULL gst_number
CREATE UNIQUE INDEX partner_gst_unique
    ON partner (gst_number) WHERE gst_number IS NOT NULL;
CREATE INDEX partner_approval_idx ON partner (approval_status);
CREATE INDEX partner_city_idx     ON partner (city);
COMMENT ON TABLE partner IS
    'Entity data only. Person identity for an individual partner lives in user_kyc. approval_status gates listing; account_status gates login.';

CREATE TABLE partner_document (
    document_id SERIAL       PRIMARY KEY,
    partner_id  INTEGER      NOT NULL,
    doc_type    VARCHAR(40)  NOT NULL,
    file_url    VARCHAR(500) NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    expires_at  DATE,
    verified_by INTEGER,
    verified_at TIMESTAMPTZ,
    reject_note TEXT,
    uploaded_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT partner_document_type_valid
        CHECK (doc_type IN ('PAN','GST_CERT','INCORPORATION','SHOP_ESTABLISHMENT',
                            'RENTAL_LICENSE','ADDRESS_PROOF','GOVT_ID',
                            'CANCELLED_CHEQUE','UDYAM')),
    CONSTRAINT partner_document_status_valid
        CHECK (status IN ('PENDING','VERIFIED','REJECTED','EXPIRED'))
);
CREATE INDEX partner_document_type_idx ON partner_document (partner_id, doc_type);

CREATE TABLE partner_payout_account (
    payout_id      SERIAL       PRIMARY KEY,
    partner_id     INTEGER      NOT NULL,
    account_holder VARCHAR(150) NOT NULL,
    account_number VARCHAR(30)  NOT NULL,
    ifsc           CHAR(11)     NOT NULL,
    bank_name      VARCHAR(150),
    is_primary     BOOLEAN      NOT NULL DEFAULT true,
    verified_at    TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);
COMMENT ON TABLE partner_payout_account IS 'Encrypt account_number at rest.';

-- ---------------------------------------------------------------------
-- 3. FLEET
-- ---------------------------------------------------------------------

CREATE TABLE insurance (
    insurance_id       SERIAL       PRIMARY KEY,
    insurance_number   VARCHAR(100) NOT NULL,
    policy_provider    VARCHAR(150) NOT NULL,
    policy_holder_name VARCHAR(150) NOT NULL,
    expiry_date        DATE         NOT NULL
);

CREATE TABLE spec_definition (
    spec_id       SERIAL       PRIMARY KEY,
    bike_category VARCHAR(50)  NOT NULL,
    spec_key      VARCHAR(50)  NOT NULL,
    display_name  VARCHAR(100) NOT NULL,
    data_type     VARCHAR(20)  NOT NULL,
    unit          VARCHAR(20),
    is_required   BOOLEAN      NOT NULL DEFAULT false,
    CONSTRAINT spec_definition_unique_0 UNIQUE (bike_category, spec_key)
);

CREATE TABLE bike (
    bike_id             SERIAL        PRIMARY KEY,
    partner_id          INTEGER       NOT NULL,
    registration_number VARCHAR(20)   NOT NULL UNIQUE,
    rc_upload_url       VARCHAR(500)  NOT NULL,
    puc_upload_url      VARCHAR(500)  NOT NULL,
    manufacturer        VARCHAR(100)  NOT NULL,
    model               VARCHAR(100)  NOT NULL,
    hourly_rate         DECIMAL(10,2) NOT NULL,
    security_deposit    DECIMAL(10,2) DEFAULT 0,
    insurance_id        INTEGER       NOT NULL,
    bike_status         VARCHAR(20)   NOT NULL DEFAULT 'DRAFT',
    additional_services JSONB,
    approval_status     VARCHAR(30)   NOT NULL DEFAULT 'PENDING_APPROVAL',
    approved_by         INTEGER,
    approved_at         TIMESTAMPTZ,
    rejection_reason    TEXT,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT bike_status_valid
        CHECK (bike_status IN ('DRAFT','LIVE','SUSPENDED')),
    CONSTRAINT bike_approval_status_valid
        CHECK (approval_status IN ('PENDING_APPROVAL','APPROVED','REJECTED')),
    CONSTRAINT bike_rate_positive CHECK (hourly_rate > 0)
);
CREATE INDEX bike_partner_idx  ON bike (partner_id);
CREATE INDEX bike_approval_idx ON bike (approval_status);

CREATE TABLE bike_details (
    bike_details_id     SERIAL      PRIMARY KEY,
    bike_id             INTEGER     NOT NULL UNIQUE,
    bike_category       VARCHAR(50) NOT NULL,
    bike_type           VARCHAR(50) NOT NULL,
    engine_cc           INTEGER,
    transmission        VARCHAR(30) NOT NULL,
    seating_capacity    INTEGER     NOT NULL,
    year_of_manufacture INTEGER     NOT NULL,
    color               VARCHAR(50),
    additional_specs    JSONB
);

CREATE TABLE bike_image (
    bike_image_id SERIAL       PRIMARY KEY,
    bike_id       INTEGER      NOT NULL,
    image_url     VARCHAR(500) NOT NULL,
    display_order INTEGER      NOT NULL DEFAULT 0,
    is_primary    BOOLEAN      NOT NULL DEFAULT false,
    uploaded_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX bike_image_bike_idx ON bike_image (bike_id);

-- ---------------------------------------------------------------------
-- 4. BOOKINGS & DEPOSIT SETTLEMENT
-- ---------------------------------------------------------------------

CREATE TABLE bike_booking_details (
    booking_id                 SERIAL        PRIMARY KEY,
    booking_ref                VARCHAR(30)   NOT NULL UNIQUE,
    customer_id                INTEGER       NOT NULL,
    bike_id                    INTEGER       NOT NULL,
    partner_id                 INTEGER       NOT NULL,
    pickup_date_time           TIMESTAMPTZ   NOT NULL,
    scheduled_return_date_time TIMESTAMPTZ   NOT NULL,
    booking_status             VARCHAR(30)   NOT NULL DEFAULT 'PENDING_PAYMENT',
    total_amount               DECIMAL(10,2) NOT NULL,
    security_deposit_amount    DECIMAL(10,2) DEFAULT 0,
    security_deposit_status    VARCHAR(30)   DEFAULT 'HELD',
    actual_return_time         TIMESTAMPTZ,
    payment_status             VARCHAR(30)   NOT NULL DEFAULT 'PENDING',
    payment_ref                VARCHAR(100),
    cancelled_at               TIMESTAMPTZ,
    cancel_reason              VARCHAR(255),
    cancellation_penalty       DECIMAL(10,2),
    refund_amount              DECIMAL(10,2),
    created_at                 TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at                 TIMESTAMPTZ,
    settlement_due_at          TIMESTAMPTZ,
    settled_at                 TIMESTAMPTZ,
    CONSTRAINT booking_status_valid
        CHECK (booking_status IN ('PENDING_PAYMENT','CONFIRMED','ONGOING',
                                  'COMPLETED','CANCELLED','NO_SHOW')),
    CONSTRAINT booking_payment_status_valid
        CHECK (payment_status IN ('PENDING','PAID','REFUND_INITIATED','REFUNDED','FAILED')),
    CONSTRAINT booking_deposit_status_valid
        CHECK (security_deposit_status IS NULL
               OR security_deposit_status IN ('HELD','PENDING_SETTLEMENT','RELEASED')),
    CONSTRAINT booking_dates_ordered
        CHECK (scheduled_return_date_time > pickup_date_time)
);
CREATE INDEX booking_customer_idx       ON bike_booking_details (customer_id);
CREATE INDEX booking_partner_idx        ON bike_booking_details (partner_id);
CREATE INDEX booking_deposit_status_idx ON bike_booking_details (security_deposit_status);
COMMENT ON TABLE bike_booking_details IS
    'partner_id is denormalised so the partner portal can scope every query without joining through bike.';

CREATE TABLE booking_transactions (
    booking_transaction_id SERIAL        PRIMARY KEY,
    booking_id             INTEGER       NOT NULL,
    amount                 DECIMAL(10,2) NOT NULL,
    created_at             TIMESTAMPTZ   NOT NULL DEFAULT now(),
    transaction_status     VARCHAR(30)   NOT NULL,
    transaction_type       VARCHAR(30)   NOT NULL
);
CREATE INDEX booking_transactions_booking_idx ON booking_transactions (booking_id);

CREATE TABLE deposit_deduction (
    deduction_id    SERIAL        PRIMARY KEY,
    booking_id      INTEGER       NOT NULL,
    description     VARCHAR(255)  NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    document_url    VARCHAR(500),
    recorded_by     INTEGER,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    status          VARCHAR(20)   NOT NULL DEFAULT 'APPLIED',
    disputed_at     TIMESTAMPTZ,
    dispute_reason  TEXT,
    resolved_at     TIMESTAMPTZ,
    resolution_note TEXT,
    resolved_by     INTEGER,
    CONSTRAINT deduction_status_valid
        CHECK (status IN ('APPLIED','DISPUTED','REVERSED')),
    CONSTRAINT deduction_amount_positive CHECK (amount > 0)
);
CREATE INDEX deduction_booking_idx ON deposit_deduction (booking_id);
CREATE INDEX deduction_status_idx  ON deposit_deduction (status);
COMMENT ON TABLE deposit_deduction IS
    'Refund = security_deposit_amount minus SUM(amount WHERE status = APPLIED).';

-- ---------------------------------------------------------------------
-- 5. REVIEWS, REPORTS, AUDIT
-- ---------------------------------------------------------------------

CREATE TABLE customer_review (
    review_id       SERIAL      PRIMARY KEY,
    booking_id      INTEGER     NOT NULL UNIQUE,
    bike_rating     INTEGER     NOT NULL,
    partner_rating  INTEGER     NOT NULL,
    title           VARCHAR(150),
    comment         TEXT,
    pros            TEXT,
    cons            TEXT,
    helpful_count   INTEGER     NOT NULL DEFAULT 0,
    is_anonymous    BOOLEAN     NOT NULL DEFAULT false,
    partner_reply   TEXT,
    replied_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    performance     INTEGER,
    bike_condition  INTEGER,
    cleanliness     INTEGER,
    CONSTRAINT review_bike_rating_range    CHECK (bike_rating    BETWEEN 1 AND 5),
    CONSTRAINT review_partner_rating_range CHECK (partner_rating BETWEEN 1 AND 5)
);

CREATE TABLE report (
    report_id   SERIAL      PRIMARY KEY,
    booking_id  INTEGER     NOT NULL,
    raised_by   INTEGER     NOT NULL,
    report_type VARCHAR(50),
    reason      TEXT        NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    resolved_by INTEGER,
    resolved_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT report_status_valid CHECK (status IN ('OPEN','RESOLVED','DISMISSED'))
);
CREATE INDEX report_booking_idx ON report (booking_id);

CREATE TABLE audit_log (
    audit_id      SERIAL      PRIMARY KEY,
    actor_user_id INTEGER,
    action        VARCHAR(100) NOT NULL,
    entity_type   VARCHAR(50)  NOT NULL,
    entity_id     INTEGER      NOT NULL,
    before_json   JSONB,
    after_json    JSONB,
    ip_address    VARCHAR(45),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX audit_entity_idx ON audit_log (entity_type, entity_id);
CREATE INDEX audit_actor_idx  ON audit_log (actor_user_id);
CREATE INDEX audit_created_idx ON audit_log (created_at);
COMMENT ON TABLE audit_log IS
    'Mandatory for approvals, blocks, deductions and dispute rulings - these move money and reputation.';

-- ---------------------------------------------------------------------
-- 6. FOREIGN KEYS
--    RESTRICT on anything tied to money; CASCADE only where safe.
-- ---------------------------------------------------------------------

ALTER TABLE user_kyc
    ADD CONSTRAINT fk_user_kyc_user        FOREIGN KEY (user_id)     REFERENCES "user"(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_user_kyc_verified_by FOREIGN KEY (verified_by) REFERENCES "user"(user_id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE user_role
    ADD CONSTRAINT fk_user_role_user        FOREIGN KEY (user_id)     REFERENCES "user"(user_id) ON DELETE CASCADE  ON UPDATE CASCADE,
    ADD CONSTRAINT fk_user_role_role        FOREIGN KEY (role_id)     REFERENCES role(role_id)   ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_user_role_assigned_by FOREIGN KEY (assigned_by) REFERENCES "user"(user_id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE role_permission
    ADD CONSTRAINT fk_role_permission_role       FOREIGN KEY (role_id)       REFERENCES role(role_id)             ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) REFERENCES permission(permission_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE customer
    ADD CONSTRAINT fk_customer_user FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE admin
    ADD CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE partner
    ADD CONSTRAINT fk_partner_user        FOREIGN KEY (user_id)     REFERENCES "user"(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_partner_approved_by FOREIGN KEY (approved_by) REFERENCES "user"(user_id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE partner_document
    ADD CONSTRAINT fk_partner_document_partner     FOREIGN KEY (partner_id)  REFERENCES partner(partner_id) ON DELETE CASCADE  ON UPDATE CASCADE,
    ADD CONSTRAINT fk_partner_document_verified_by FOREIGN KEY (verified_by) REFERENCES "user"(user_id)     ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE partner_payout_account
    ADD CONSTRAINT fk_partner_payout_partner FOREIGN KEY (partner_id) REFERENCES partner(partner_id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE bike
    ADD CONSTRAINT fk_bike_partner     FOREIGN KEY (partner_id)   REFERENCES partner(partner_id)     ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_bike_insurance   FOREIGN KEY (insurance_id) REFERENCES insurance(insurance_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_bike_approved_by FOREIGN KEY (approved_by)  REFERENCES "user"(user_id)         ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE bike_details
    ADD CONSTRAINT fk_bike_details_bike FOREIGN KEY (bike_id) REFERENCES bike(bike_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE bike_image
    ADD CONSTRAINT fk_bike_image_bike FOREIGN KEY (bike_id) REFERENCES bike(bike_id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE bike_booking_details
    ADD CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_booking_bike     FOREIGN KEY (bike_id)     REFERENCES bike(bike_id)         ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_booking_partner  FOREIGN KEY (partner_id)  REFERENCES partner(partner_id)   ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE booking_transactions
    ADD CONSTRAINT fk_booking_transactions_booking FOREIGN KEY (booking_id) REFERENCES bike_booking_details(booking_id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE deposit_deduction
    ADD CONSTRAINT fk_deduction_booking     FOREIGN KEY (booking_id)  REFERENCES bike_booking_details(booking_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_deduction_recorded_by FOREIGN KEY (recorded_by) REFERENCES "user"(user_id)                  ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT fk_deduction_resolved_by FOREIGN KEY (resolved_by) REFERENCES "user"(user_id)                  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE customer_review
    ADD CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bike_booking_details(booking_id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE report
    ADD CONSTRAINT fk_report_booking     FOREIGN KEY (booking_id)  REFERENCES bike_booking_details(booking_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_report_raised_by   FOREIGN KEY (raised_by)   REFERENCES "user"(user_id)                  ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT fk_report_resolved_by FOREIGN KEY (resolved_by) REFERENCES "user"(user_id)                  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE audit_log
    ADD CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES "user"(user_id) ON DELETE SET NULL ON UPDATE CASCADE;
