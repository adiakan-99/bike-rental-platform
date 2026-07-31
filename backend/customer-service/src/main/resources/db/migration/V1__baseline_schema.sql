CREATE TABLE customer (

    customer_id SERIAL PRIMARY KEY,

    -- Reference to Auth Service user table
    -- No foreign key because databases are separate
    user_id INTEGER NOT NULL UNIQUE,


    -- Address details
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),

    city VARCHAR(100),
    state VARCHAR(100),

    pincode VARCHAR(6),


    -- Customer additional details
    emergency_contact VARCHAR(20),

    referral_code VARCHAR(50),


    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITH TIME ZONE

);