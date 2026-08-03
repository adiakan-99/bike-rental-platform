CREATE TABLE customer_kyc (

    customer_id INTEGER PRIMARY KEY,

    date_of_birth DATE NOT NULL,

    id_type VARCHAR(20) NOT NULL,

    id_number VARCHAR(50) UNIQUE NOT NULL,

    id_upload_url VARCHAR(500) NOT NULL,

    driving_license_number VARCHAR(50),

    driving_licence_url VARCHAR(500),

    license_valid_to DATE,

    kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    verified_by INTEGER,

    verified_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    updated_at TIMESTAMP WITH TIME ZONE,


    CONSTRAINT fk_customer_kyc_customer

    FOREIGN KEY(customer_id)

    REFERENCES customer(customer_id)

);