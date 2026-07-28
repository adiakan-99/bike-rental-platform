-- 1. ROLES & PERMISSIONS
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

COMMENT ON TABLE role IS 'CUSTOMER, PARTNER, ADMIN, SUPPORT, FINANCE';

CREATE TABLE permission (
    permission_id SERIAL PRIMARY KEY,
    key VARCHAR NOT NULL,
    description VARCHAR
);

COMMENT ON TABLE permission IS 'listing.create, dispute.resolve, partner.approve and so on';

CREATE TABLE role_permission (
    role_id INTEGER NOT NULL REFERENCES role(role_id) ON DELETE CASCADE ON UPDATE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permission(permission_id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

COMMENT ON TABLE role_permission IS 'Composite primary key (role_id, permission_id) prevents the same permission being granted twice.';

-- 2. USERS
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    account_status VARCHAR NOT NULL,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE "user" IS 'One account per person. Roles live in user_role so a customer can also be a partner.';

CREATE TABLE user_role (
    user_id INTEGER NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    role_id INTEGER NOT NULL REFERENCES role(role_id) ON DELETE CASCADE ON UPDATE NO ACTION,
    assigned_by INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL,
    assigned_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX user_role_role_idx ON user_role (role_id);
COMMENT ON TABLE user_role IS 'Composite primary key (user_id, role_id) stops a role being granted to the same user twice. The role_id index serves lookups like "all admins".';

-- 3. PROFILES (Customer, Admin, Partner)
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE NO ACTION,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    gender VARCHAR,
    phone_number CHAR(15) NOT NULL,
    driving_license_number VARCHAR NOT NULL,
    driving_licence_url VARCHAR NOT NULL,
    date_of_birth DATE NOT NULL,
    id_type VARCHAR NOT NULL,
    id_number VARCHAR NOT NULL,
    id_upload_url VARCHAR NOT NULL,
    address_line_1 VARCHAR,
    address_line_2 VARCHAR,
    city VARCHAR,
    state VARCHAR,
    pincode CHAR(10),
    emergency_contact VARCHAR,
    referral_code VARCHAR,
    kyc_status VARCHAR NOT NULL,
    joining_date TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    account_status VARCHAR NOT NULL
);

COMMENT ON TABLE customer IS 'date_of_birth drives the 18+ check. id_type allows AADHAAR, PASSPORT or VOTER_ID.';

CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE NO ACTION,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL
);

CREATE TABLE partner (
    partner_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE NO ACTION,
    seller_type VARCHAR NOT NULL,
    owner_name VARCHAR NOT NULL,
    pan_number CHAR(10) NOT NULL,
    contact_phone VARCHAR,
    alternate_email VARCHAR,
    alternate_phone_number VARCHAR,
    business_name VARCHAR,
    gst_number VARCHAR,
    business_type VARCHAR,
    year_of_establishment CHAR(4),
    udyam_number VARCHAR,
    license_number VARCHAR,
    issuing_authority VARCHAR,
    license_valid_from DATE,
    license_valid_to DATE,
    address_line_1 VARCHAR NOT NULL,
    address_line_2 VARCHAR,
    city VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    pincode CHAR(10) NOT NULL,
    approval_status VARCHAR NOT NULL,
    account_status VARCHAR NOT NULL,
    approved_by INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL,
    approved_at TIMESTAMP,
    rejection_reason VARCHAR,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX partner_approval_idx ON partner (approval_status);
CREATE INDEX partner_city_idx ON partner (city);
COMMENT ON TABLE partner IS 'seller_type is INDIVIDUAL or COMMERCIAL_DEALER. Business fields stay nullable for individuals - add a DB CHECK so COMMERCIAL_DEALER requires business_name and gst_number. approval_status gates listing, account_status gates login.';

CREATE TABLE partner_document (
    document_id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(partner_id) ON DELETE CASCADE ON UPDATE CASCADE,
    doc_type VARCHAR NOT NULL,
    file_url VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    expires_at DATE,
    verified_by INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL,
    verified_at TIMESTAMP,
    reject_note VARCHAR,
    uploaded_at TIMESTAMP NOT NULL
);

CREATE INDEX partner_document_type_idx ON partner_document (partner_id, doc_type);
COMMENT ON TABLE partner_document IS 'PAN, GST_CERT, INCORPORATION, RENTAL_LICENSE, ADDRESS_PROOF, GOVT_ID, CANCELLED_CHEQUE, UDYAM. One row per document so each carries its own verification state.';

CREATE TABLE partner_payout_account (
    payout_id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(partner_id) ON DELETE CASCADE ON UPDATE NO ACTION,
    account_holder VARCHAR NOT NULL,
    account_number VARCHAR NOT NULL,
    ifsc CHAR(11) NOT NULL,
    bank_name VARCHAR,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

COMMENT ON TABLE partner_payout_account IS 'Encrypt account_number at rest. Kept separate from profile data.';

-- 4. BIKES & SPECS
CREATE TABLE insurance (
    insurance_id SERIAL PRIMARY KEY,
    insurance_number VARCHAR NOT NULL,
    policy_provider VARCHAR NOT NULL,
    policy_holder_name VARCHAR NOT NULL,
    expiry_date DATE NOT NULL
);

CREATE TABLE spec_definition (
    spec_id SERIAL PRIMARY KEY,
    bike_category VARCHAR NOT NULL,
    spec_key VARCHAR NOT NULL,
    display_name VARCHAR NOT NULL,
    data_type VARCHAR NOT NULL,
    unit VARCHAR,
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT spec_definition_unique_0 UNIQUE (bike_category, spec_key)
);

CREATE TABLE bike (
    bike_id SERIAL PRIMARY KEY,
    partner_id INTEGER NOT NULL REFERENCES partner(partner_id) ON DELETE CASCADE ON UPDATE NO ACTION,
    registration_number VARCHAR NOT NULL,
    rc_upload_url VARCHAR NOT NULL,
    puc_upload_url VARCHAR NOT NULL,
    manufacturer VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2),
    insurance_id INTEGER NOT NULL REFERENCES insurance(insurance_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    bike_status VARCHAR NOT NULL,
    additional_services JSONB,
    approval_status VARCHAR NOT NULL,
    approved_by INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL,
    approved_at TIMESTAMP,
    rejection_reason VARCHAR,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX bike_partner_idx ON bike (partner_id);
CREATE INDEX bike_approval_idx ON bike (approval_status);
COMMENT ON TABLE bike IS 'bike_status: DRAFT, LIVE, SUSPENDED. approval_status: PENDING_APPROVAL, APPROVED, REJECTED.';

CREATE TABLE bike_details (
    bike_details_id SERIAL PRIMARY KEY,
    bike_id INTEGER NOT NULL UNIQUE REFERENCES bike(bike_id) ON DELETE CASCADE ON UPDATE CASCADE,
    bike_category VARCHAR NOT NULL,
    bike_type VARCHAR NOT NULL,
    engine_cc INTEGER,
    transmission VARCHAR NOT NULL,
    seating_capacity INTEGER NOT NULL,
    year_of_manufacture INTEGER NOT NULL,
    color VARCHAR,
    additional_specs JSONB
);

CREATE TABLE bike_image (
    bike_image_id SERIAL PRIMARY KEY,
    bike_id INTEGER NOT NULL REFERENCES bike(bike_id) ON DELETE CASCADE ON UPDATE CASCADE,
    image_url VARCHAR NOT NULL,
    display_order INTEGER NOT NULL,
    is_primary BOOLEAN NOT NULL,
    uploaded_at TIMESTAMP NOT NULL
);

-- 5. BOOKINGS & TRANSACTIONS
CREATE TABLE bike_booking_details (
    booking_id SERIAL PRIMARY KEY,
    booking_ref VARCHAR NOT NULL,
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    bike_id INTEGER NOT NULL REFERENCES bike(bike_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    partner_id INTEGER NOT NULL REFERENCES partner(partner_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    pickup_date_time TIMESTAMP NOT NULL,
    scheduled_return_date_time TIMESTAMP NOT NULL,
    booking_status VARCHAR NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    security_deposit_amount DECIMAL(10, 2),
    security_deposit_status VARCHAR,
    actual_return_time TIMESTAMP,
    payment_status VARCHAR NOT NULL,
    payment_ref VARCHAR,
    cancelled_at TIMESTAMP,
    cancel_reason VARCHAR,
    cancellation_penalty DECIMAL(10, 2),
    refund_amount DECIMAL(10, 2),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    settlement_due_at TIMESTAMP,
    settled_at TIMESTAMP
);

CREATE INDEX booking_customer_idx ON bike_booking_details (customer_id);
CREATE INDEX booking_partner_idx ON bike_booking_details (partner_id);
CREATE INDEX booking_deposit_status_idx ON bike_booking_details (security_deposit_status);
COMMENT ON TABLE bike_booking_details IS 'partner_id is denormalised so a partner portal can scope every query without joining through bike. security_deposit_status: HELD, PENDING_SETTLEMENT, RELEASED.';

CREATE TABLE booking_transactions (
    booking_transaction_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bike_booking_details(booking_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    transaction_status VARCHAR NOT NULL,
    transaction_type VARCHAR NOT NULL
);

CREATE TABLE customer_review (
    review_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL UNIQUE REFERENCES bike_booking_details(booking_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    bike_rating INTEGER NOT NULL,
    partner_rating INTEGER NOT NULL,
    title VARCHAR,
    comment VARCHAR,
    pros VARCHAR,
    cons VARCHAR,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    partner_reply VARCHAR,
    replied_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    performance INTEGER,
    bike_condition INTEGER,
    cleanliness INTEGER
);

CREATE TABLE deposit_deduction (
    deduction_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bike_booking_details(booking_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    description VARCHAR NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    document_url VARCHAR,
    recorded_by INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL,
    created_at TIMESTAMP NOT NULL,
    status VARCHAR NOT NULL,
    disputed_at TIMESTAMP,
    dispute_reason VARCHAR,
    resolved_at TIMESTAMP,
    resolution_note VARCHAR,
    resolved_by INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL
);

CREATE INDEX deduction_booking_idx ON deposit_deduction (booking_id);
CREATE INDEX deduction_status_idx ON deposit_deduction (status);
COMMENT ON TABLE deposit_deduction IS 'status: APPLIED, DISPUTED, REVERSED. Refund = security_deposit_amount minus SUM(amount WHERE status = APPLIED).';

-- 6. DISPUTES & AUDIT LOGS
CREATE TABLE report (
    report_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bike_booking_details(booking_id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    raised_by INTEGER NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL,
    report_type VARCHAR,
    reason VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    resolved_by INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE audit_log (
    audit_id SERIAL PRIMARY KEY,
    actor_user_id INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE ON UPDATE SET NULL,
    action VARCHAR NOT NULL,
    entity_type VARCHAR NOT NULL,
    entity_id INTEGER NOT NULL,
    before_json JSONB,
    after_json JSONB,
    ip_address VARCHAR,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX audit_entity_idx ON audit_log (entity_type, entity_id);
CREATE INDEX audit_actor_idx ON audit_log (actor_user_id);
COMMENT ON TABLE audit_log IS 'Mandatory for approvals, blocks, deductions and dispute rulings - these move money and reputation.';