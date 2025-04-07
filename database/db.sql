-- CREATE DATABASE company_system;
-- \l
-- \c company_system
-- \d

CREATE DATABASE company_system;

-- \c company_system

CREATE TYPE address AS (
    town VARCHAR,
    street VARCHAR,
    number INT,
    floor INT,
    departament VARCHAR,
    zip_code VARCHAR,
    observations VARCHAR
);

DROP TABLE IF EXISTS useraccount;
CREATE TABLE useraccount (
    id SERIAL PRIMARY KEY,
    username VARCHAR,
    phone VARCHAR,
    mail VARCHAR,
    passhash TEXT,
    joined_at DATE DEFAULT now(),
    last_payment_at DATE DEFAULT NULL,
    companies_amount INT DEFAULT 0
);

CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    user_id INT REFERENCES useraccount(id) ON DELETE CASCADE
);

CREATE TABLE client (
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
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE supplier (
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
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

-- Triggers & functions
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

/*
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    sku VARCHAR,
    cpu VARCHAR,
    name VARCHAR,
    list_price INT,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);
*/