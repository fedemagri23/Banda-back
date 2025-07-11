-- Invoice-related table schema

-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS sale_invoice CASCADE;
DROP TABLE IF EXISTS sale_invoice_tax CASCADE;
DROP TABLE IF EXISTS sale_invoice_vat CASCADE;
DROP TABLE IF EXISTS sale_invoice_related CASCADE;
DROP TABLE IF EXISTS sale_invoice_optional CASCADE;
DROP TABLE IF EXISTS sale_invoice_buyer CASCADE;
DROP TABLE IF EXISTS sale_invoice_payment CASCADE;

-- Create invoice tables
CREATE TABLE sale_invoice (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT now(),
    company_id INT REFERENCES company(id) ON DELETE CASCADE,
    status SMALLINT DEFAULT 0,
    sale_id INT REFERENCES sale_order(id) ON DELETE CASCADE,
    concepto SMALLINT NOT NULL,
    doc_tipo SMALLINT NOT NULL,
    doc_nro BIGINT NOT NULL,
    cbte_tipo SMALLINT NOT NULL,
    cbte_pto_vta SMALLINT NOT NULL,
    cbte_nro_desde INT NOT NULL,
    cbte_nro_hasta INT NOT NULL,
    cbte_fecha CHAR(8) NOT NULL,
    imp_total NUMERIC(15, 2) NOT NULL,
    imp_tot_conc NUMERIC(15, 2) NOT NULL,
    imp_neto NUMERIC(15, 2) NOT NULL,
    imp_op_ex NUMERIC(15, 2) NOT NULL,
    imp_trib NUMERIC(15, 2) NOT NULL,
    imp_iva NUMERIC(15, 2) NOT NULL,
    fch_serv_desde CHAR(8),
    fch_serv_hasta CHAR(8),
    fch_vto_pago CHAR(8),
    moneda_id CHAR(3) DEFAULT 'PES',
    moneda_cotiz NUMERIC(15, 6) DEFAULT 1,
    cae CHAR(14),
    cae_vencimiento CHAR(8)
);

CREATE TABLE sale_invoice_tax (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    tributo_id SMALLINT NOT NULL,
    description VARCHAR(255),
    base_amount NUMERIC(15, 2) NOT NULL,
    aliquot NUMERIC(5, 2) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL
);

CREATE TABLE sale_invoice_vat (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    vat_id SMALLINT NOT NULL,
    base_amount NUMERIC(15, 2) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL
);

CREATE TABLE sale_invoice_related (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    related_cbte_tipo SMALLINT NOT NULL,
    related_pto_vta SMALLINT NOT NULL,
    related_nro INT NOT NULL,
    related_cuit BIGINT,
    related_cbte_fch CHAR(8)
);

CREATE TABLE sale_invoice_optional (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    optional_id VARCHAR(10) NOT NULL,
    value VARCHAR(255) NOT NULL
);

CREATE TABLE sale_invoice_buyer (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    doc_tipo SMALLINT NOT NULL,
    doc_nro BIGINT NOT NULL,
    porcentaje NUMERIC(5, 2) NOT NULL
);

CREATE TABLE sale_invoice_payment (
    id SERIAL PRIMARY KEY,
    sale_invoice_id INT REFERENCES sale_invoice(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    payment_date TIMESTAMP NOT NULL
);
