-- CREATE DATABASE company_system;
-- \l
-- \c company_system
-- \d

-- DROP DATABASE IF EXISTS company_system;
-- CREATE DATABASE company_system;

-- \c company_system

DROP TYPE IF EXISTS address CASCADE;
DROP TABLE IF EXISTS supplier CASCADE;
DROP TABLE IF EXISTS client CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS useraccount CASCADE;
DROP TABLE IF EXISTS works_for CASCADE;
DROP TABLE IF EXISTS company_role CASCADE;

DROP TABLE IF EXISTS product_purchase_detail CASCADE;
DROP TABLE IF EXISTS purchase_proof CASCADE;
DROP TABLE IF EXISTS purchase_order CASCADE;

DROP TABLE IF EXISTS product_sale_detail CASCADE;
DROP TABLE IF EXISTS sale_proof CASCADE;
DROP TABLE IF EXISTS sale_order CASCADE;

DROP TABLE IF EXISTS session CASCADE;

DROP TABLE IF EXISTS mercado_pago_payments CASCADE;
DROP TABLE IF EXISTS plan_limits CASCADE;


DROP TYPE IF EXISTS type_currency CASCADE;
DROP TYPE IF EXISTS plan_type CASCADE;

DROP TYPE IF EXISTS type_currency CASCADE;
CREATE TYPE type_currency AS ENUM ('ARS', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'BRL', 'CLP', 'UYU', 'PEN', 'COP', 'MXN', 'AUD', 'CAD', 'CHF', 'ZAR');

CREATE TYPE address AS (
    town VARCHAR,
    street VARCHAR,
    number INT,
    floor INT,
    departament VARCHAR,
    zip_code VARCHAR,
    observations VARCHAR
);

CREATE TYPE plan_type AS ENUM ('free_trial', 'standard', 'plus');

CREATE TABLE useraccount (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    phone VARCHAR UNIQUE,
    mail VARCHAR UNIQUE NOT NULL,
    passhash TEXT,
    joined_at DATE DEFAULT now(),
    companies_amount INT DEFAULT 0,
    verification_code VARCHAR(6),
    verification_code_expires TIMESTAMP,

    current_plan plan_type DEFAULT 'free_trial',
    plan_activated_at DATE DEFAULT NULL,
    plan_expires_at DATE DEFAULT NULL,
    trial_used BOOLEAN DEFAULT FALSE
);

CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    country VARCHAR,
    industry VARCHAR,
    cuit VARCHAR,
    email VARCHAR UNIQUE NOT NULL,
    app_password VARCHAR,
    user_id INT REFERENCES useraccount(id) ON DELETE CASCADE
);

CREATE TABLE company_role (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    movements_view BOOLEAN DEFAULT FALSE,
    movements_edit BOOLEAN DEFAULT FALSE,
    employees_view BOOLEAN DEFAULT FALSE,
    employees_edit BOOLEAN DEFAULT FALSE,
    contact_view BOOLEAN DEFAULT FALSE,
    contact_edit BOOLEAN DEFAULT FALSE,
    billing_view BOOLEAN DEFAULT FALSE,
    Billing_edit BOOLEAN DEFAULT FALSE,
    inventory_view BOOLEAN DEFAULT FALSE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE works_for (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES useraccount(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
    accepted BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role INT REFERENCES company_role(id)
);

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    code VARCHAR,
    added_at DATE DEFAULT now(),
    name VARCHAR NOT NULL,
    country VARCHAR,
    address ADDRESS,
    phone VARCHAR,
    mail VARCHAR NOT NULL,
    web VARCHAR,
    description VARCHAR,
    doc_type INT DEFAULT 0, 
    doc_number VARCHAR DEFAULT NULL,
    preferred_cbte_type INT DEFAULT 0,
    preferred_vat_type INT DEFAULT 0,
    company_id INT NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    UNIQUE(company_id, mail)
);

CREATE TABLE supplier (
    id SERIAL PRIMARY KEY,
    code VARCHAR,
    added_at DATE DEFAULT now(),
    name VARCHAR NOT NULL,
    country VARCHAR,
    address ADDRESS,
    phone VARCHAR,
    mail VARCHAR NOT NULL,
    web VARCHAR,
    description VARCHAR,
    CUIT VARCHAR DEFAULT NULL,
    CUIL VARCHAR DEFAULT NULL,
    DNI VARCHAR DEFAULT NULL,
    CDI VARCHAR DEFAULT NULL,
    company_id INT NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    UNIQUE(company_id, mail)
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    sku VARCHAR,
    upc VARCHAR(12),
    EAN VARCHAR(13),
    name VARCHAR NOT NULL,
    list_price NUMERIC(16, 2) NOT NULL,
    currency type_currency NOT NULL,
    stock_alert INT DEFAULT 0,
    company_id INT NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    UNIQUE(company_id, name)
);

CREATE TABLE purchase_order (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT now(),
    condition VARCHAR(3),
    supplier_id INT REFERENCES supplier(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE purchase_proof (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT now(),
    code VARCHAR(8), 
    type VARCHAR,
    supplier_id INT REFERENCES supplier(id) ON DELETE CASCADE,
    order_id INT REFERENCES purchase_order(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE product_purchase_detail (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT now(),
    batch_number VARCHAR,
    total NUMERIC(16, 2),
    canceled NUMERIC(16, 2) DEFAULT 0,
    quantity INT,
    unit_price NUMERIC(16, 2),
    currency type_currency NOT NULL,
    product_id INT REFERENCES product(id) ON DELETE CASCADE,
    proof_id INT REFERENCES purchase_proof(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE sale_order (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT now(),
    condition VARCHAR(3),
    client_id INT REFERENCES client(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE sale_proof (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT now(),
    code VARCHAR(8), 
    type VARCHAR,
    client_id INT REFERENCES client(id) ON DELETE CASCADE,
    order_id INT REFERENCES sale_order(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE product_sale_detail (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT now(),
    batch_number VARCHAR,
    total NUMERIC(16, 2),
    canceled NUMERIC(16, 2) DEFAULT 0,
    quantity INT,
    unit_price NUMERIC(16, 2),
    currency type_currency NOT NULL,
    product_id INT REFERENCES product(id) ON DELETE CASCADE,
    proof_id INT REFERENCES sale_proof(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE session (
    id VARCHAR PRIMARY KEY,
    user_id INT NOT NULL REFERENCES useraccount(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE mercado_pago_payments (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    payer_email VARCHAR(255),
    user_id INTEGER REFERENCES useraccount(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_payment_id ON mercado_pago_payments(payment_id);
CREATE INDEX idx_payments_status ON mercado_pago_payments(status);

CREATE TABLE plan_limits (
    id SERIAL PRIMARY KEY,
    plan_name plan_type UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    max_companies INTEGER NOT NULL,
    max_users_per_company INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO plan_limits (plan_name, display_name, description, price, max_companies, max_users_per_company, duration_days, features) VALUES
('free_trial', 'Prueba Gratuita', 'Prueba gratuita por 30 días', 0.00, 1, 2, 30, 
  '{"movements_view": true, "billing_view": true, "employees_view": false, "inventory_view": true, "advanced_reports": false}'
),
('standard', 'Banda Standard', 'Plan básico', 40.00, 3, 5, 30, 
  '{"movements_view": true, "billing_view": true, "employees_view": true, "inventory_view": true, "advanced_reports": false, "api_access": false}'
),
('plus', 'Banda Plus', 'Plan premium', 60.00, 10, 20, 30, 
  '{"movements_view": true, "billing_view": true, "employees_view": true, "inventory_view": true, "advanced_reports": true, "api_access": true, "priority_support": true}'
);



DROP TRIGGER IF EXISTS trigger_increase_company_count ON company;
DROP FUNCTION IF EXISTS increase_user_company_count();

CREATE OR REPLACE FUNCTION increase_user_company_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE useraccount
    SET companies_amount = COALESCE(companies_amount, 0) + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increase_company_count
AFTER INSERT ON company
FOR EACH ROW
EXECUTE FUNCTION increase_user_company_count();

