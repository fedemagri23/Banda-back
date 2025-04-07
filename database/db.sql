-- CREATE DATABASE company_system;
-- \l
-- \c company_system
-- \d

CREATE DATABASE company_system;

\c company_system

CREATE TYPE address AS (
    town VARCHAR,
    street VARCHAR,
    number INT,
    floor INT,
    departament VARCHAR,
    zip_code VARCHAR,
    observations VARCHAR
);

CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR,
    phone VARCHAR,
    mail VARCHAR,
    passhash TEXT,
    joined_at DATE DEFAULT now(),
    last_payment_at DATE,
    companies_amount INT
);

CREATE TABLE Company (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    user_id INT REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE Client (
    id SERIAL PRIMARY KEY,
    code VARCHAR,
    added_at DATE DEFAULT now(),
    name VARCHAR,
    country VARCHAR,
    address ADDRESS,
    phone VARCHAR,
    mail VARCHAR,
    web VARCHAR,
    description VARCHAR,
    CUIT VARCHAR,
    CUIL VARCHAR,
    DNI VARCHAR,
    CDI VARCHAR,
    company_id INT REFERENCES Company(id) ON DELETE CASCADE
);

CREATE TABLE Supplier (
    id SERIAL PRIMARY KEY,
    code VARCHAR,
    added_at DATE DEFAULT now(),
    name VARCHAR,
    country VARCHAR,
    address ADDRESS,
    phone VARCHAR,
    mail VARCHAR,
    web VARCHAR,
    description VARCHAR,
    CUIT VARCHAR,
    CUIL VARCHAR,
    DNI VARCHAR,
    CDI VARCHAR,
    company_id INT REFERENCES Company(id) ON DELETE CASCADE
);

-- Triggers & functions
CREATE OR REPLACE FUNCTION increase_user_company_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "User"
    SET companies_amount = COALESCE(companies_amount, 0) + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increase_company_count
AFTER INSERT ON Company
FOR EACH ROW
EXECUTE FUNCTION increase_user_company_count();

/*
CREATE TABLE Product (
    id SERIAL PRIMARY KEY,
    sku VARCHAR,
    cpu VARCHAR,
    name VARCHAR,
    list_price INT,
    company_id INT REFERENCES Company(id) ON DELETE CASCADE
);
*/