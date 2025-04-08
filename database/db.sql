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
    username VARCHAR UNIQUE,
    phone VARCHAR,
    mail VARCHAR UNIQUE,
    passhash TEXT,
    joined_at DATE DEFAULT now(),
    last_payment_at DATE DEFAULT NULL,
    companies_amount INT DEFAULT 0
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