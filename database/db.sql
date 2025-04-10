-- CREATE DATABASE company_system;
-- \l
-- \c company_system
-- \d

DROP DATABASE IF EXISTS company_system;
CREATE DATABASE company_system;

\c company_system

DROP TYPE IF EXISTS address CASCADE;
DROP TABLE IF EXISTS supplier CASCADE;
DROP TABLE IF EXISTS client CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS useraccount CASCADE;
DROP TABLE IF EXISTS product CASCADE;

DROP TABLE IF EXISTS product_purchase_detail CASCADE;
DROP TABLE IF EXISTS purchase_proof CASCADE;
DROP TABLE IF EXISTS purchase_order CASCADE;

DROP TABLE IF EXISTS product_sale_detail CASCADE;
DROP TABLE IF EXISTS sale_proof CASCADE;
DROP TABLE IF EXISTS sale_order CASCADE;

CREATE TYPE address AS (
    town VARCHAR,
    street VARCHAR,
    number INT,
    floor INT,
    departament VARCHAR,
    zip_code VARCHAR,
    observations VARCHAR
);

CREATE TABLE useraccount (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    phone VARCHAR UNIQUE,
    mail VARCHAR UNIQUE NOT NULL,
    passhash TEXT,
    joined_at DATE DEFAULT now(),
    last_payment_at DATE DEFAULT NULL,
    companies_amount INT DEFAULT 0,
    verification_code VARCHAR(6),
    verification_code_expires TIMESTAMP
);

CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE,
    user_id INT REFERENCES useraccount(id) ON DELETE CASCADE
);

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    code VARCHAR UNIQUE,
    added_at DATE DEFAULT now(),
    name VARCHAR,
    country VARCHAR,
    address ADDRESS,
    phone VARCHAR,
    mail VARCHAR,
    web VARCHAR,
    description VARCHAR,
    CUIT VARCHAR DEFAULT NULL,
    CUIL VARCHAR DEFAULT NULL,
    DNI VARCHAR DEFAULT NULL,
    CDI VARCHAR DEFAULT NULL,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE supplier (
    id SERIAL PRIMARY KEY,
    code VARCHAR UNIQUE,
    added_at DATE DEFAULT now(),
    name VARCHAR,
    country VARCHAR,
    address ADDRESS,
    phone VARCHAR,
    mail VARCHAR,
    web VARCHAR,
    description VARCHAR,
    CUIT VARCHAR DEFAULT NULL,
    CUIL VARCHAR DEFAULT NULL,
    DNI VARCHAR DEFAULT NULL,
    CDI VARCHAR DEFAULT NULL,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    sku VARCHAR UNIQUE,
    upc VARCHAR(12) UNIQUE,
    EAN VARCHAR(13) UNIQUE,
    name VARCHAR,
    list_price NUMERIC(10, 2),
    currency VARCHAR(3),
    company_id INT REFERENCES company(id) ON DELETE CASCADE
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
    code VARCHAR(8) UNIQUE, 
    type VARCHAR,
    supplier_id INT REFERENCES supplier(id) ON DELETE CASCADE,
    order_id INT REFERENCES purchase_order(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE product_purchase_detail (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT now(),
    batch_number VARCHAR,
    total NUMERIC(10, 2),
    canceled NUMERIC(10, 2) DEFAULT 0,
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
    code VARCHAR(8) UNIQUE, 
    type VARCHAR,
    client_id INT REFERENCES client(id) ON DELETE CASCADE,
    order_id INT REFERENCES sale_order(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE product_sale_detail (
    id SERIAL PRIMARY KEY,
    created_at DATE DEFAULT now(),
    batch_number VARCHAR,
    total NUMERIC(10, 2),
    canceled NUMERIC(10, 2) DEFAULT 0,
    product_id INT REFERENCES product(id) ON DELETE CASCADE,
    proof_id INT REFERENCES sale_proof(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
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
