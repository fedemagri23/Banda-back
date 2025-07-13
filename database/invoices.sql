-- Invoice-related table schema

-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS sale_invoice CASCADE;
DROP TABLE IF EXISTS sale_invoice_tax CASCADE;
DROP TABLE IF EXISTS sale_invoice_vat CASCADE;
DROP TABLE IF EXISTS sale_invoice_related CASCADE;
DROP TABLE IF EXISTS sale_invoice_optional CASCADE;
DROP TABLE IF EXISTS sale_invoice_buyer CASCADE;
DROP TABLE IF EXISTS sale_invoice_payment CASCADE;

DROP TABLE IF EXISTS user_arca_tokens CASCADE;
DROP TABLE IF EXISTS company_certificates CASCADE;

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


-- Insert test certificate and private key for company_id=1
INSERT INTO company_certificates (company_id, certificate, private_key) VALUES (
  1,
  '-----BEGIN CERTIFICATE-----
MIIDRTCCAi2gAwIBAgIIUCLEsfxmjZ0wDQYJKoZIhvcNAQENBQAwODEaMBgGA1UEAwwRQ29tcHV0
YWRvcmVzIFRlc3QxDTALBgNVBAoMBEFGSVAxCzAJBgNVBAYTAkFSMB4XDTI1MDQyNzE1MzgzNloX
DTI3MDQyNzE1MzgzNlowKzEOMAwGA1UEAwwFdGVzdDIxGTAXBgNVBAUTEENVSVQgMjA0NTU4MjIz
MDEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/fjEIlT5KrxSsqoO49Mjaklns4jnm
m5iSrobxXZrl1XdS057VWze7JG+8I65BnKauEupaPwOllse8SOkNO2bYF5Vi9ksyOmOhwNDFi90S
iyP2jgPNSG8z2d9oD0KFXR8+BqRIeYV8NHLhxDYC2VMweeMYfTDTVHgb7B9Z9nh70Xg/nEeF68sM
VFCIAHVr+bNLygw/eEo39RmXLD72FJI+ljoTE3a54V0M8+2lIPkGJ0UYLuFqGijgIlmqinh1Y4ME
3JVIg9kstR16O5FF5+unpo7T9/40j5ACwWStLYhFXITcByWwaJJjsEeKR1g6VkHJ9YA/+pWGsTnU
2WJ26XXfAgMBAAGjYDBeMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUs7LT//3put7eja8RIZzW
IH3yT28wHQYDVR0OBBYEFMmGfU4goR1isuCantoUPyoAwapcMA4GA1UdDwEB/wQEAwIF4DANBgkq
hkiG9w0BAQ0FAAOCAQEAi7KQbjw3n4T4Fhp5bsyjsFTVswsUzyDWzReRUc0xXUQawNmMvoXwqnzT
s+uSNOgECEJP2XJYySkkfN74Enu+0hP47xZM8IkSJF+rb2xGqKAN3W524eV8KwOF+7RLoRQRW4gr
v33HnvyUnDkjg3YKctfEqM7DeDqVKXbbpUqOpEVXqh1wH2xca+Z9/ycvaB0AQR4Ne2KsifnkVML4
3e8n9NhynQaKV6+w3ObQa0eTQQ93jo3K9y0Cre58EuOhZ2rJHnanAi4CYoaJWkEEFef0qHBEjlvs
YDEGlfpC3VZX0RMLoUo5uLgfMZhXuF0PX32VuaHd7vkOKMDKgcl3+ZYlNg==
-----END CERTIFICATE-----',
  '-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAv34xCJU+Sq8UrKqDuPTI2pJZ7OI55puYkq6G8V2a5dV3UtOe
1Vs3uyRvvCOuQZymrhLqWj8DpZbHvEjpDTtm2BeVYvZLMjpjocDQxYvdEosj9o4D
zUhvM9nfaA9ChV0fPgakSHmFfDRy4cQ2AtlTMHnjGH0w01R4G+wfWfZ4e9F4P5xH
hevLDFRQiAB1a/mzS8oMP3hKN/UZlyw+9hSSPpY6ExN2ueFdDPPtpSD5BidFGC7h
ahoo4CJZqop4dWODBNyVSIPZLLUdejuRRefrp6aO0/f+NI+QAsFkrS2IRVyE3Acl
sGiSY7BHikdYOlZByfWAP/qVhrE51Nlidul13wIDAQABAoIBAC+6VaFUhWKa8bW5
iDw8sqUbrhMnLZRHOsdwfYzCLl3TjzqTKTb3VdQsmDbV09RhpX+kkkmtBA0tIBpT
N9cG87Kvahnw1jwuJnAF/WMHYbICARQuQE9VmvXa+15V01gnJibRA/hWZYlYDzwr
KeUa4qul7Y7IgTdjCc630vaawlvlosJpdy6uEWrZTwCKMxYBqFxHc6gXbEleTONO
OmBKPeFWKVBeWk1GDQcy1u2Sdi1Q/ZUwhU+V6GN2wGi6zVerIY/bAKRLl0KehKi+
7WodWBVRm/3PJZrUKCKtRkMFZ4ZYDgcjldN+xEkI2/jS6Wo6SXUlUusWpGPT+cH0
s5uwJDECgYEA4tfHq4s6sL5ivaYXT0Mp7YMmZX3Ls9pa1uYNXRHpvbHxEEN0dAw8
0mOrx/JAgjFdve/R30xM8lTRvWA0AoM+Yb6wAHX6zJunOM20pmB1djxXbpMtODdz
Idc7BMgsaALUjzZ9fc+puuU5tZm0aPu6V89MYnAh0rfqgU7N7oJCYZECgYEA2Bs6
dmEHQIvajax9BgciwH7NSzi0VNfCZLUBbGE1EcmyN03wCqtRVRja+MB3apY0dEMH
N8LeAaLoTB5novEQZlGhLwSa2Buj96IiiJ1DmGGy7DLbcTmmNN/gOaI60LH/2uQR
kSLVlfaS49ErG/yoGKkI25r9o2qdyoY9xJ16qG8CgYEAvb3D1CdXZjM5oGxnHvON
BJAo88evNbc1OH+hOfIb04Ido37oz5DU5x5bt5lYgA4O3SrWH7NQwXpVHdR0bI2f
Bl9cFGaa675et1LJAkm4trduYp1Uu6sV8H55bVyKWE3VwhzQBwZGcIAAL3hrwUyd
54kL2WL1x63yx0pFUnU+VSECgYEAg+ii181EAvca0W1e5wYGBV+g6fBTypHkW1pM
4x22qgPmX3GYOrr1qy6/wiSg/5NtsyWSy0uL/Y21o3jPo5rner0K2MtDxPOiMy5p
S+BKeUHxV9F3NvaMaCvbDvLiWa680JxzyJZtrtrSMHLlkHC5HkxXVsyVU2FprUwh
edjyHMsCgYA256dbYzjg2LWT2GCyIfL7cVYJw1mB+eInNNHA4W2dzNO0oNlddopX
ugpCFF83aXnoXvbYC1NMHhxMoQOOnr8fdAuElksD9WAJ/sOMawgdgk8qjv5OQo/4
pioXwJ1gWPAVjjXPQvXOQkFUoddj3xixgjTAvz1boO/+2kMiCo3J6A==
-----END RSA PRIVATE KEY-----'
);
