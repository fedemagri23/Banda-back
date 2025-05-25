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
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS works_for CASCADE;
DROP TABLE IF EXISTS company_role CASCADE;

DROP TABLE IF EXISTS product_purchase_detail CASCADE;
DROP TABLE IF EXISTS purchase_proof CASCADE;
DROP TABLE IF EXISTS purchase_order CASCADE;

DROP TABLE IF EXISTS product_sale_detail CASCADE;
DROP TABLE IF EXISTS sale_proof CASCADE;
DROP TABLE IF EXISTS sale_order CASCADE;

DROP TABLE IF EXISTS session CASCADE;

DROP TABLE IF EXISTS user_arca_tokens CASCADE;
DROP TABLE IF EXISTS company_certificates CASCADE;
DROP TABLE IF EXISTS sale_invoice CASCADE;
DROP TABLE IF EXISTS sale_invoice_tax CASCADE;
DROP TABLE IF EXISTS sale_invoice_vat CASCADE;
DROP TABLE IF EXISTS sale_invoice_related CASCADE;
DROP TABLE IF EXISTS sale_invoice_optional CASCADE;
DROP TABLE IF EXISTS sale_invoice_buyer CASCADE;
DROP TABLE IF EXISTS sale_invoice_payment CASCADE;

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
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
    UNIQUE(company_id, mail)
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    sku VARCHAR,
    upc VARCHAR(12),
    EAN VARCHAR(13),
    name VARCHAR NOT NULL,
    list_price NUMERIC(16, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    stock_alert INT DEFAULT 0,
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
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
    product_id INT REFERENCES product(id) ON DELETE CASCADE,
    proof_id INT REFERENCES sale_proof(id) ON DELETE CASCADE,
    company_id INT REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE session (
    id VARCHAR PRIMARY KEY,
    user_id INT NOT NULL REFERENCES useraccount(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE user_arca_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES useraccount(id) ON DELETE CASCADE,
  cuit BIGINT NOT NULL,
  token TEXT NOT NULL,
  sign TEXT NOT NULL,
  expiration TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  UNIQUE (user_id, cuit)
);

CREATE TABLE company_certificates (
  id SERIAL PRIMARY KEY,
  
  company_id INTEGER NOT NULL REFERENCES company(id) ON DELETE CASCADE,

  certificate TEXT NOT NULL, -- Certificado público (en formato PEM)
  private_key TEXT NOT NULL, -- Llave privada ENCRIPTADA (no texto plano)
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  UNIQUE (company_id)
);

CREATE TABLE sale_invoice (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT now(),

    company_id INT REFERENCES company(id) ON DELETE CASCADE, -- quien emitió

    status SMALLINT DEFAULT 0,                  -- Estado de la factura (0: pendiente, 1: autorizada, 2: rechazada, 3: anulado)
    sale_id INT REFERENCES sale_order(id) ON DELETE CASCADE, -- ID de la venta asociada

    concepto SMALLINT NOT NULL,           -- Concepto (productos, servicios, etc.)
    doc_tipo SMALLINT NOT NULL,            -- Tipo de documento del receptor
    doc_nro BIGINT NOT NULL,               -- Número de documento del receptor

    cbte_tipo SMALLINT NOT NULL,           -- Tipo de comprobante (ej. Factura A, B, etc.)
    cbte_pto_vta SMALLINT NOT NULL,        -- Punto de venta
    cbte_nro_desde INT NOT NULL,           -- Número de comprobante desde
    cbte_nro_hasta INT NOT NULL,           -- Número de comprobante hasta
    cbte_fecha CHAR(8) NOT NULL,            -- Fecha del comprobante (YYYYMMDD)

    imp_total NUMERIC(15, 2) NOT NULL,     -- Importe total
    imp_tot_conc NUMERIC(15, 2) NOT NULL,  -- Importe no gravado
    imp_neto NUMERIC(15, 2) NOT NULL,      -- Importe neto gravado
    imp_op_ex NUMERIC(15, 2) NOT NULL,     -- Importe operaciones exentas
    imp_trib NUMERIC(15, 2) NOT NULL,      -- Importe de otros tributos
    imp_iva NUMERIC(15, 2) NOT NULL,       -- Importe de IVA

    fch_serv_desde CHAR(8),                -- Fecha inicio servicio
    fch_serv_hasta CHAR(8),                -- Fecha fin servicio
    fch_vto_pago CHAR(8),                  -- Fecha de vencimiento de pago

    moneda_id CHAR(3) DEFAULT 'PES',       -- Moneda (PES por pesos argentinos)
    moneda_cotiz NUMERIC(15, 6) DEFAULT 1, -- Cotización de moneda

    cae CHAR(14),                          -- Código de autorización electrónico
    cae_vencimiento CHAR(8)                 -- Fecha de vencimiento del CAE
);

CREATE TABLE sale_invoice_tax (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    tributo_id SMALLINT NOT NULL,            -- ID de AFIP
    description VARCHAR(255),                -- Descripción del tributo
    base_amount NUMERIC(15, 2) NOT NULL,      -- Base imponible
    aliquot NUMERIC(5, 2) NOT NULL,           -- Alicuota %
    amount NUMERIC(15, 2) NOT NULL            -- Importe del tributo
);

CREATE TABLE sale_invoice_vat (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    vat_id SMALLINT NOT NULL,                 -- ID de alícuota de IVA (5, 4, etc.)
    base_amount NUMERIC(15, 2) NOT NULL,       -- Base imponible
    amount NUMERIC(15, 2) NOT NULL             -- Importe de IVA
);

CREATE TABLE sale_invoice_related (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    related_cbte_tipo SMALLINT NOT NULL,       -- Tipo de comprobante asociado
    related_pto_vta SMALLINT NOT NULL,         -- Punto de venta del comprobante asociado
    related_nro INT NOT NULL,                  -- Número de comprobante asociado
    related_cuit BIGINT,                       -- CUIT de la empresa receptora (opcional)
    related_cbte_fch CHAR(8)                   -- Fecha del comprobante asociado (opcional)
);

CREATE TABLE sale_invoice_optional (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    optional_id VARCHAR(10) NOT NULL,           -- ID de campo opcional
    value VARCHAR(255) NOT NULL                 -- Valor
);

CREATE TABLE sale_invoice_buyer (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    doc_tipo SMALLINT NOT NULL,          -- Tipo de documento (CUIT, DNI, etc.)
    doc_nro BIGINT NOT NULL,              -- Número de documento
    porcentaje NUMERIC(5, 2) NOT NULL     -- Porcentaje de participación
);

CREATE TABLE sale_invoice_payment (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    payment_date TIMESTAMP NOT NULL
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
