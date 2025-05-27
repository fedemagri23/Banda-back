-- SQL Script to Populate Database
-- Generated based on initialize.js and provided datasets.

-- Clear existing data (Optional - Use with caution!)
/*
TRUNCATE TABLE useraccount, company, supplier, product, purchase_order, purchase_proof, product_purchase_detail, client, sale_order, sale_proof, product_sale_detail, company_role, works_for RESTART IDENTITY CASCADE;
*/

-- Define Address Type (If not already defined)
/*
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'address') THEN
        CREATE TYPE address AS (
            town VARCHAR(255),
            street VARCHAR(255),
            number INT,
            floor INT,
            departament VARCHAR(50),
            zip_code VARCHAR(50),
            observations TEXT
        );
    END IF;
END$$;
*/

----------------------------------------
-- ## User Accounts
----------------------------------------
-- Passwords should be properly hashed in a real environment.
-- Using example hash for the first user and placeholder hashes for others.
INSERT INTO useraccount (id, username, phone, mail, passhash, joined_at, companies_amount, verification_code, verification_code_expires) VALUES
(1, 'greg_lavender', '5553107049', 'intelbanda@gmail.com', '$2b$10$InxPjPdBZzHE4Dc4mxCvd.spJEcnoz1rSBehytU985Kf16y3Tf8fC', '2025-05-22', 0, NULL, NULL),
(2, 'john_evans', '5551146640', 'johnevans@gmail.com', '$2b$10$InxPjPdBZzHE4Dc4mxCvd.spJEcnoz1rSBehytU985Kf16y3Tf8fC', '2025-05-22', 0, NULL, NULL),
(3, 'adam_taylor', '5551714900', 'adamtaylor@gmail.com', '$2b$10$InxPjPdBZzHE4Dc4mxCvd.spJEcnoz1rSBehytU985Kf16y3Tf8fC', '2025-05-22', 0, NULL, NULL);

----------------------------------------
-- ## Company
----------------------------------------
INSERT INTO company (id, name, country, industry, cuit, email, app_password, user_id) VALUES
(1, 'Intel', 'United States', 'Semiconductors, CPUs, GPUs, Servers, Computers', '20123456789', 'intelbanda@gmail.com', 'lfks znej beny msbz', 1);

----------------------------------------
-- ## Suppliers
----------------------------------------
--
INSERT INTO supplier (id, code, added_at, name, country, address, phone, mail, web, description, CUIT, CUIL, DNI, CDI, company_id) VALUES
(1, 'SNL001', DEFAULT, 'ASML', 'Netherlands', ROW('Veldhoven', 'De Run', 6501, NULL, NULL, '5504 DR', NULL)::address, '31402683000', 'contact@asml.com', 'https://www.asml.com', 'Extreme Ultraviolet Lithography (EUV) systems for semiconductor manufacturing.', NULL, NULL, NULL, '00577765401', 1),
(2, 'SCA001', DEFAULT, 'Applied Materials', 'United States', ROW('Santa Clara, California', 'Bowers Avenue', 3050, NULL, NULL, '95054', NULL)::address, '14087275555', 'info@appliedmaterials.com', 'https://www.appliedmaterials.com', 'ALD, CVD, PVD, and etch equipment for semiconductor fabrication.', '20123456789', NULL, NULL, NULL, 1),
(3, 'SJP001', DEFAULT, 'Tokyo Electron', 'Japan', ROW('Minato-ku, Tokyo', 'Akasaka', 3, 5, '1', '107 6325', NULL)::address, '81355617000', 'globalinfo@tel.com', 'https://www.tel.com', 'Etch, deposition, and cleaning equipment for semiconductor manufacturing.', '123456789', NULL, NULL, NULL, 1),
(4, 'SNL002', DEFAULT, 'KLA Corporation', 'United States', ROW('Milpitas, California', 'North McCarthy Blvd', 1, NULL, NULL, '95035', NULL)::address, '14088753000', 'klacorp@gmail.com', 'https://www.kla.com', 'Silicon wafer inspection and metrology equipment.', '20123456789', NULL, NULL, NULL, 1),
(5, 'SNL003', DEFAULT, 'Lam Research', 'United States', ROW('Fremont, California', 'Cushing Parkway', 4650, NULL, NULL, '94538', NULL)::address, '1 510 572 0200', 'lamresearch@lam.com', 'https://www.lamresearch.com', 'Semiconductor process equipment for wafer fabrication.', '20987654321', NULL, NULL, NULL, 1);

----------------------------------------
-- ## Products
----------------------------------------
--
INSERT INTO product (id, sku, upc, EAN, name, list_price, currency, company_id, stock_alert) VALUES
(1, 'FAB-EUV-ASML-NXE3600D', '088776543210', NULL, 'Twinscan NXE3600D 3nm', 160000000, 'USD', 1, 2),
(2, 'FAB-DUV-ASML-NXT1980DI', '088776543211', NULL, 'Twinscan NXT1980Di', 70000000, 'USD', 1, 1),
(3, 'INSPEC-OPTIC-ASML-YS385', '088776543212', NULL, 'YieldStar 385 Optical Metrology', 5000000, 'USD', 1, 10),
(4, 'DEPO-ALD-AMAT-CP1000', '054321123456', NULL, 'Centura Prismo ALD System', 8000000, 'USD', 1, 0),
(5, 'DEPO-PECVD-AMAT-PGT500', '054321123457', NULL, 'Producer GT PECVD', 6000000, 'USD', 1, 5),
(6, 'DEPO-PVD-AMAT-ENDURA', '054321123458', NULL, 'Endura PVD Platform', 10000000, 'USD', 1, 3),
(7, 'ETCH-PLASMA-TEL-TELINDYPLUS', '076543210987', NULL, 'TELINDY Plus Etch System', 7000000, 'USD', 1, 2),
(8, 'CLEAN-WAFER-TEL-ACT12', '076543210988', NULL, 'ACT 12 Wafer Cleaning', 4000000, 'USD', 1, 1),
(9, 'PHOTO-COAT-TEL-LITHIUSPROZ', '076543210989', NULL, 'Lithius Pro Z Coater Developer', 9000000, 'USD', 1, 0),
(10, 'ETCH-DRY-LAM-KIYO45', '034567654321', NULL, 'Kiyo45 Dry Etch System', 6000000, 'USD', 1, 4),
(11, 'INSPEC-PLASMA-LAM-SENSEI', '034567654322', NULL, 'Sensei Plasma Inspection Platform', 4500000, 'USD', 1, 2),
(12, 'ETCH-CONTACT-LAM-VERSYS2300', '034567654323', NULL, '2300 Versys Contact Etcher', 5000000, 'USD', 1, 1),
(13, 'INSPEC-ELECTRON-KLA-EBEAM5', '023456789012', NULL, 'eBeam 5 Electron Inspection', 6000000, 'USD', 1, 0),
(14, 'INSPEC-LAYER-KLA-2925', '023456789013', NULL, '2925 Series Layer Inspection', 3000000, 'USD', 1, 2),
(15, 'INSPEC-DEFECT-KLA-SP7XP', '023456789014', NULL, 'SP7XP Defect Review', 4000000, 'USD', 1, 5),
(16, 'WAFER-STD-SUMCO-300PRIME', '490123456789', NULL, 'Prime Silicon Wafer 300mm', 120, 'USD', 1, 10),
(17, 'WAFER-EPI-SUMCO-300EPI', '490123456790', NULL, 'EPI Silicon Wafer 300mm', 160, 'USD', 1, 8),
(18, 'WAFER-TEST-SUMCO-200TEST', '490123456791', NULL, 'Test Silicon Wafer 200mm', 60, 'USD', 1, 6),
(19, 'WAFER-UFLAT-SHIN-300UF', '490987654321', NULL, 'Ultra Flat Silicon Wafer 300mm', 150, 'USD', 1, 2),
(20, 'WAFER-SOI-SHIN-SOI', '490987654322', NULL, 'Silicon on Insulator Wafer', 220, 'USD', 1, 1),
(21, 'WAFER-LDD-SHIN-LDDW', '490987654323', NULL, 'Low Defect Density Wafer', 180, 'USD', 1, 0),
(22, 'WAFER-EPI-GWA-EPI300', '471234567890', NULL, 'Epitaxial Wafer 300mm', 180, 'USD', 1, 3),
(23, 'WAFER-POL-GWA-POL200', '471234567891', NULL, 'Polished Wafer 200mm', 80, 'USD', 1, 2),
(24, 'WAFER-SIC-GWA-SIC', '471234567892', NULL, 'Specialty SiC Wafer', 500, 'USD', 1, 1),
(25, 'CHEM-ACID-BASF-HFUP', '400123456789', NULL, 'Ultra High Purity HF Acid', 75, 'USD', 1, 0),
(26, 'CHEM-REMOVER-BASF-PRR600', '400123456790', NULL, 'Photoresist Remover AR 600-71', 300, 'USD', 1, 2),
(27, 'CHEM-DEVELOPER-BASF-AZ400K', '400123456791', NULL, 'Developer Solution AZ 400K', 250, 'USD', 1, 1),
(28, 'CHEM-RESIST-MERCK-AZ701MI', '402123456789', NULL, 'AZ 701Mi Photoresist', 2000, 'USD', 1, 0),
(29, 'CHEM-SLURRY-MERCK-PLANIX', '402123456790', NULL, 'Planarization Slurry Planix', 500, 'USD', 1, 1),
(30, 'CHEM-BARC-MERCK-EUVBARC', '402123456791', NULL, 'EUV Bottom Anti Reflective Coating', 1500, 'USD', 1, 2);

----------------------------------------
-- ## Purchases
----------------------------------------
--
-- Purchase 1
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (1, '2024-05-25', 'P30', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (1, '2024-05-25', 'F0001999', 'FACTA', 1, 1, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (1, '2024-05-25', 'BCH20240225A', 11, 14000000.0, 154000000.0, 1, 1, 1);

-- Purchase 2
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (2, '2025-02-25', 'P30', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (2, '2025-02-25', 'F0002001', 'FACTA', 1, 2, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (2, '2025-02-25', 'BCH20250225A', 1, 14000000.0, 14000000.0, 1, 2, 1);

-- Purchase 3
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (3, '2025-02-27', 'P30', 2, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (3, '2025-02-27', 'F0002002', 'FACTA', 2, 3, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (3, '2025-02-27', 'BCH20250227A', 2, 7200000.0, 14400000.0, 2, 3, 1);

-- Purchase 4
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (4, '2025-02-28', 'P60', 3, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (4, '2025-02-28', 'F0002003', 'FACTA', 3, 4, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(4, '2025-02-28', 'BCH20250228A', 1, 16000000.0, 16000000.0, 1, 4, 1),
(5, '2025-02-28', 'BCH20250228B', 1, 7000000.0, 7000000.0, 2, 4, 1);

-- Purchase 5
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (5, '2025-03-02', 'P30', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (5, '2025-03-02', 'F0003001', 'FACTA', 1, 5, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (6, '2025-03-02', 'BCH20250302A', 1, 28000000.0, 28000000.0, 1, 5, 1);

-- Purchase 6
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (6, '2025-03-05', 'P30', 2, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (6, '2025-03-05', 'F0003002', 'FACTA', 2, 6, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (7, '2025-03-05', 'BCH20250305A', 2, 14400000.0, 28800000.0, 2, 6, 1);

-- Purchase 7
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (7, '2025-03-10', 'P60', 3, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (7, '2025-03-10', 'F0003003', 'FACTA', 3, 7, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (8, '2025-03-10', 'BCH20250310A', 1, 32000000.0, 32000000.0, 1, 7, 1);

-- Purchase 8
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (8, '2025-03-15', 'P30', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (8, '2025-03-15', 'F0003004', 'FACTA', 1, 8, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (9, '2025-03-15', 'BCH20250315A', 2, 14000000.0, 28000000.0, 2, 8, 1);

-- Purchase 9
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (9, '2025-03-20', 'P60', 2, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (9, '2025-03-20', 'F0003005', 'FACTA', 2, 9, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (10, '2025-03-20', 'BCH20250320A', 1, 1600000.0, 1600000.0, 4, 9, 1);

-- Purchase 10
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (10, '2025-03-25', 'P90', 3, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (10, '2025-03-25', 'F0003006', 'FACTB', 3, 10, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (11, '2025-03-25', 'BCH20250325A', 2, 1400000.0, 2800000.0, 7, 10, 1);

-- Purchase 11
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (11, '2025-03-28', 'CTE', 4, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (11, '2025-03-28', 'F0003007', 'FACTC', 4, 11, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (12, '2025-03-28', 'BCH20250328A', 5, 1200000.0, 6000000.0, 10, 11, 1);

-- Purchase 12
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (12, '2025-03-29', 'P30', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (12, '2025-03-29', 'F0012345', 'FACTA', 1, 12, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(13, '2025-03-29', 'BCH20250401', 1, 30000000.0, 30000000.0, 1, 12, 1),
(14, '2025-03-29', 'BCH20250402', 1, 25000000.0, 25000000.0, 2, 12, 1);

-- Purchase 13
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (13, '2025-04-02', 'P60', 2, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (13, '2025-04-02', 'F0056789', 'FACTA', 2, 13, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(15, '2025-04-02', 'BCH20250403', 3, 4000000.0, 12000000.0, 4, 13, 1),
(16, '2025-04-02', 'BCH20250404', 2, 3000000.0, 6000000.0, 5, 13, 1),
(17, '2025-04-02', 'BCH20250405', 1, 5000000.0, 5000000.0, 6, 13, 1);

-- Purchase 14
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (14, '2025-04-05', 'P90', 3, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (14, '2025-04-05', 'F0078901', 'FACTB', 3, 14, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(18, '2025-04-05', 'BCH20250406', 2, 3500000.0, 7000000.0, 7, 14, 1),
(19, '2025-04-05', 'BCH20250407', 1, 2000000.0, 2000000.0, 8, 14, 1);

-- Purchase 15
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (15, '2025-04-08', 'CTE', 4, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (15, '2025-04-08', 'F0012346', 'FACTC', 4, 15, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(20, '2025-04-08', 'BCH20250408', 5, 3000000.0, 15000000.0, 10, 15, 1),
(21, '2025-04-08', 'BCH20250409', 3, 2250000.0, 6750000.0, 11, 15, 1);

-- Purchase 16
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (16, '2025-04-12', 'CDF', 5, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (16, '2025-04-12', 'RC004567', 'RECIB', 5, 16, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(22, '2025-04-12', 'BCH20250410', 1000, 60.0, 60000.0, 13, 16, 1),
(23, '2025-04-12', 'BCH20250411', 500, 80.0, 40000.0, 14, 16, 1);

-- Purchase 17
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (17, '2025-04-26', 'P30', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (17, '2025-04-26', 'F0034568', 'FACTA', 1, 17, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(24, '2025-04-26', 'BCH20250421', 1200, 75.0, 90000.0, 16, 17, 1),
(25, '2025-04-26', 'BCH20250422', 800, 110.0, 88000.0, 17, 17, 1);

-- Purchase 18 (Typo in JS file, assuming P60 for 2, FACTM, F0078913, 2025-04-28, using products 19 and 20)
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (18, '2025-04-28', 'P60', 2, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (18, '2025-04-28', 'F0078913', 'FACTM', 2, 18, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(26, '2025-04-28', 'BCH20250423', 600, 90.0, 54000.0, 19, 18, 1),
(27, '2025-04-28', 'BCH20250424', 500, 40.0, 20000.0, 20, 18, 1);

-- Purchase 19 (Typo in JS file, assuming DBA for 3, FACTE, F0098766, 2025-04-30, using products 22 and 23)
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (19, '2025-04-30', 'DBA', 3, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (19, '2025-04-30', 'F0098766', 'FACTE', 3, 19, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(28, '2025-04-30', 'BCH20250425', 150, 75.0, 11250.0, 22, 19, 1),
(29, '2025-04-30', 'BCH20250426', 250, 300.0, 75000.0, 23, 19, 1);


----------------------------------------
-- ## Clients
----------------------------------------
--
INSERT INTO client (id, code, added_at, name, country, address, phone, mail, web, description, doc_type, doc_number, preferred_cbte_type, preferred_vat_type, company_id) VALUES
(1, 'CLUSA001', DEFAULT, 'Dell Technologies', 'United States', ROW('Round Rock', 'Dell Way', 1, 3, 'A', '78682', 'Headquarters')::address, '1 800 999 3355', 'purchasing@dell.com', 'https://www.dell.com', 'Major PC manufacturer and server integrator.', 80, '20987654321', 1, 5, 1),
(2, 'CLUSA002', DEFAULT, 'HP Inc.', 'United States', ROW('Palo Alto', 'Page Mill Rd', 1501, 5, 'B', '94304', 'Corporate HQ')::address, '1 650 857 1501', 'suppliers@hp.com', 'https://www.hp.com', 'Personal computing and printing leader.', 80, '20876543212', 1, 5, 1),
(3, 'CLCHN001', DEFAULT, 'Lenovo Group', 'China', ROW('Beijing', 'Xisanqi', 6, 8, 'C', '100085', 'Beijing HQ')::address, '86 10 5886 8888', 'procurement@lenovo.com', 'https://www.lenovo.com', 'Leading global PC and mobile device manufacturer.', 80, '20765432103', 1, 5, 1),
(4, 'CLUSA003', DEFAULT, 'Amazon Web Services', 'United States', ROW('Seattle', 'Terry Avenue', 410, 14, 'D', '98109', 'AWS Headquarters')::address, '1 888 280 4331', 'awsprocurement@amazon.com', 'https://aws.amazon.com', 'Cloud computing services and datacenter solutions.', 80, '20455822301', 1, 5, 1),
(5, 'CLUSA004', DEFAULT, 'Microsoft Corporation', 'United States', ROW('Redmond', 'One Microsoft Way', 1, 2, 'E', '98052', 'Main Campus')::address, '1 425 882 8080', 'supplier@microsoft.com', 'https://www.microsoft.com', 'Leading software, cloud, and hardware provider.', 80, '20543210985', 1, 5, 1);

----------------------------------------
-- ## Sales
----------------------------------------
--
-- Sale 1
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (1, '2025-03-30', 'P30', 1, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (1, '2025-03-30', 'F1001234', 'FACTA', 1, 1, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(1, '2025-03-30', 'SAL20250401', 15000, 1500.0, 22500000.0, 13, 1, 1),
(2, '2025-03-30', 'SAL20250402', 9000, 1480.0, 13320000.0, 14, 1, 1);

-- Sale 2
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (2, '2025-04-03', 'P60', 2, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (2, '2025-04-03', 'F1005678', 'FACTA', 2, 2, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(3, '2025-04-03', 'SAL20250403', 6000, 1510.0, 9060000.0, 13, 2, 1),
(4, '2025-04-03', 'SAL20250404', 4500, 1495.0, 6727500.0, 16, 2, 1);

-- Sale 3
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (3, '2025-04-06', 'P90', 3, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (3, '2025-04-06', 'F1008912', 'FACTB', 3, 3, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(5, '2025-04-06', 'SAL20250405', 24000, 1450.0, 34800000.0, 13, 3, 1),
(6, '2025-04-06', 'SAL20250406', 19200, 1440.0, 27648000.0, 17, 3, 1);

-- Sale 4
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (4, '2025-04-10', 'CTE', 4, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (4, '2025-04-10', 'F1012345', 'FACTC', 4, 4, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(7, '2025-04-10', 'SAL20250407', 1200, 17000.0, 20400000.0, 1, 4, 1),
(8, '2025-04-10', 'SAL20250408', 480, 16800.0, 8064000.0, 2, 4, 1);

-- Sale 5
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (5, '2025-04-16', 'P30', 5, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (5, '2025-04-16', 'F1016789', 'FACTA', 5, 5, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(9, '2025-04-16', 'SAL20250409', 720, 17200.0, 12384000.0, 1, 5, 1),
(10, '2025-04-16', 'SAL20250410', 240, 16900.0, 4056000.0, 2, 5, 1);

-- Sale 6
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (6, '2025-04-20', 'P30', 1, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (6, '2025-04-20', 'F1012346', 'FACTA', 1, 6, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(11, '2025-04-20', 'SAL20250411', 9000, 1500.0, 13500000.0, 13, 6, 1),
(12, '2025-04-20', 'SAL20250412', 6000, 1480.0, 8880000.0, 14, 6, 1);

-- Sale 7
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (7, '2025-04-22', 'P60', 2, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (7, '2025-04-22', 'F1015678', 'FACTA', 2, 7, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(13, '2025-04-22', 'SAL20250413', 12000, 1510.0, 18120000.0, 13, 7, 1),
(14, '2025-04-22', 'SAL20250414', 9000, 1495.0, 13455000.0, 16, 7, 1);

-- Sale 8
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (8, '2025-04-25', 'P90', 3, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (8, '2025-04-25', 'F1018912', 'FACTB', 3, 8, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(15, '2025-04-25', 'SAL20250415', 18000, 1450.0, 26100000.0, 13, 8, 1),
(16, '2025-04-25', 'SAL20250416', 14400, 1440.0, 20736000.0, 17, 8, 1);

-- Sale 9
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (9, '2025-04-28', 'CTE', 4, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (9, '2025-04-28', 'F1022345', 'FACTC', 4, 9, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(17, '2025-04-28', 'SAL20250417', 900, 17000.0, 15300000.0, 1, 9, 1),
(18, '2025-04-28', 'SAL20250418', 360, 16800.0, 6048000.0, 2, 9, 1);

-- Sale 10
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (10, '2025-04-30', 'P30', 5, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (10, '2025-04-30', 'F1026789', 'FACTA', 5, 10, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(19, '2025-04-30', 'SAL20250419', 540, 17200.0, 9288000.0, 1, 10, 1),
(20, '2025-04-30', 'SAL20250420', 180, 16900.0, 3042000.0, 2, 10, 1);

-- Sale 11
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (11, '2025-05-02', 'P30', 1, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (11, '2025-05-02', 'F1023456', 'FACTA', 1, 11, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(21, '2025-05-02', 'SAL20250421', 12000, 1500.0, 18000000.0, 13, 11, 1),
(22, '2025-05-02', 'SAL20250422', 8000, 1480.0, 11840000.0, 14, 11, 1);

-- Sale 12
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (12, '2025-05-05', 'P60', 2, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (12, '2025-05-05', 'F1027890', 'FACTA', 2, 12, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(23, '2025-05-05', 'SAL20250423', 16000, 1510.0, 24160000.0, 13, 12, 1),
(24, '2025-05-05', 'SAL20250424', 12000, 1495.0, 17940000.0, 16, 12, 1);

-- Sale 13
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (13, '2025-05-08', 'P90', 3, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (13, '2025-05-08', 'F1031234', 'FACTB', 3, 13, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(25, '2025-05-08', 'SAL20250425', 24000, 1450.0, 34800000.0, 13, 13, 1),
(26, '2025-05-08', 'SAL20250426', 19200, 1440.0, 27648000.0, 17, 13, 1);

-- Sale 14
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (14, '2025-05-12', 'CTE', 4, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (14, '2025-05-12', 'F1035678', 'FACTC', 4, 14, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(27, '2025-05-12', 'SAL20250427', 1200, 17000.0, 20400000.0, 1, 14, 1),
(28, '2025-05-12', 'SAL20250428', 480, 16800.0, 8064000.0, 2, 14, 1);

-- Sale 15
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (15, '2025-05-15', 'P30', 5, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (15, '2025-05-15', 'F1039012', 'FACTA', 5, 15, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(29, '2025-05-15', 'SAL20250429', 720, 17200.0, 12384000.0, 1, 15, 1),
(30, '2025-05-15', 'SAL20250430', 240, 16900.0, 4056000.0, 2, 15, 1);

-- Sale 16
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (16, '2025-05-18', 'P30', 1, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (16, '2025-05-18', 'F1041234', 'FACTA', 1, 16, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(31, '2025-05-18', 'SAL20250431', 15000, 1500.0, 22500000.0, 13, 16, 1),
(32, '2025-05-18', 'SAL20250432', 9000, 1480.0, 13320000.0, 14, 16, 1);

-- Sale 17
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (17, '2025-05-20', 'P60', 2, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (17, '2025-05-20', 'F1045678', 'FACTA', 2, 17, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(33, '2025-05-20', 'SAL20250433', 8000, 1510.0, 12080000.0, 13, 17, 1),
(34, '2025-05-20', 'SAL20250434', 6000, 1495.0, 8970000.0, 16, 17, 1);

-- Sale 18
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (18, '2025-05-22', 'P90', 3, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (18, '2025-05-22', 'F1048912', 'FACTB', 3, 18, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(35, '2025-05-22', 'SAL20250435', 20000, 1450.0, 29000000.0, 13, 18, 1),
(36, '2025-05-22', 'SAL20250436', 16000, 1440.0, 23040000.0, 17, 18, 1);

-- Sale 19
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (19, '2025-05-25', 'CTE', 4, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (19, '2025-05-25', 'F1052345', 'FACTC', 4, 19, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(37, '2025-05-25', 'SAL20250437', 1000, 17000.0, 17000000.0, 1, 19, 1),
(38, '2025-05-25', 'SAL20250438', 400, 16800.0, 6720000.0, 2, 19, 1);

-- Sale 20
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (20, '2025-05-28', 'P30', 5, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (20, '2025-05-28', 'F1056789', 'FACTA', 5, 20, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(39, '2025-05-28', 'SAL20250439', 600, 17200.0, 10320000.0, 1, 20, 1),
(40, '2025-05-28', 'SAL20250440', 200, 16900.0, 3380000.0, 2, 20, 1);

-- Sale 21
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (21, '2025-05-30', 'P30', 1, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (21, '2025-05-30', 'F1059012', 'FACTA', 1, 21, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(41, '2025-05-30', 'SAL20250441', 10000, 1500.0, 15000000.0, 13, 21, 1),
(42, '2025-05-30', 'SAL20250442', 7000, 1480.0, 10360000.0, 14, 21, 1);

-- Sale 22
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (22, '2025-06-02', 'P60', 2, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (22, '2025-06-02', 'F1061234', 'FACTA', 2, 22, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(43, '2025-06-02', 'SAL20250443', 14000, 1510.0, 21140000.0, 13, 22, 1),
(44, '2025-06-02', 'SAL20250444', 10000, 1495.0, 14950000.0, 16, 22, 1);

-- Sale 23
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (23, '2025-06-05', 'P90', 3, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (23, '2025-06-05', 'F1065678', 'FACTB', 3, 23, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(45, '2025-06-05', 'SAL20250445', 22000, 1450.0, 31900000.0, 13, 23, 1),
(46, '2025-06-05', 'SAL20250446', 18000, 1440.0, 25920000.0, 17, 23, 1);

-- Sale 24
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (24, '2025-06-08', 'CTE', 4, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (24, '2025-06-08', 'F1069012', 'FACTC', 4, 24, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(47, '2025-06-08', 'SAL20250447', 1100, 17000.0, 18700000.0, 1, 24, 1),
(48, '2025-06-08', 'SAL20250448', 440, 16800.0, 7392000.0, 2, 24, 1);

-- Sale 25
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (25, '2025-06-12', 'P30', 5, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (25, '2025-06-12', 'F1071234', 'FACTA', 5, 25, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES
(49, '2025-06-12', 'SAL20250449', 660, 17200.0, 11352000.0, 1, 25, 1),
(50, '2025-06-12', 'SAL20250450', 220, 16900.0, 3718000.0, 2, 25, 1);

----------------------------------------
-- ## Ghost Purchases
----------------------------------------
-- These purchases are added to ensure stock levels cover sales made.
-- Calculated based on the logic in initialize.js

-- Ghost Purchase 1 (Product 13)
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (20, '2025-03-30', 'CTE', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (20, '2025-03-30', 'G0130330', 'FACTA', 1, 20, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (30, '2025-03-30', 'GHOST-13-20250330', 224000, 0.0, 0.0, 13, 20, 1);

-- Ghost Purchase 2 (Product 14)
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (21, '2025-03-30', 'CTE', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (21, '2025-03-30', 'G0140330', 'FACTA', 1, 21, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (31, '2025-03-30', 'GHOST-14-20250330', 38500, 0.0, 0.0, 14, 21, 1);

-- Ghost Purchase 3 (Product 16)
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (22, '2025-04-03', 'CTE', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (22, '2025-04-03', 'G0160403', 'FACTA', 1, 22, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (32, '2025-04-03', 'GHOST-16-20250403', 40300, 0.0, 0.0, 16, 22, 1);

-- Ghost Purchase 4 (Product 17)
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (23, '2025-04-06', 'CTE', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (23, '2025-04-06', 'G0170406', 'FACTA', 1, 23, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (33, '2025-04-06', 'GHOST-17-20250406', 86000, 0.0, 0.0, 17, 23, 1);

-- Ghost Purchase 5 (Product 1)
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (24, '2025-04-10', 'CTE', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (24, '2025-04-10', 'G0010410', 'FACTA', 1, 24, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (34, '2025-04-10', 'GHOST-1-20250410', 8624, 0.0, 0.0, 1, 24, 1);

-- Ghost Purchase 6 (Product 2)
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (25, '2025-04-10', 'CTE', 1, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (25, '2025-04-10', 'G0020410', 'FACTA', 1, 25, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES (35, '2025-04-10', 'GHOST-2-20250410', 3232, 0.0, 0.0, 2, 25, 1);


----------------------------------------
-- ## Roles
----------------------------------------
--
INSERT INTO company_role (id, name, movements_view, movements_edit, employees_view, employees_edit, contact_view, contact_edit, billing_view, billing_edit, inventory_view, company_id) VALUES
(1, 'Counter', TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, 1);

----------------------------------------
-- ## Invites (Works For)
----------------------------------------
--
INSERT INTO works_for (id, user_id, company_id, accepted, added_at, role) VALUES
(1, 3, 1, FALSE, DEFAULT, 1);

----------------------------------------
-- ## Sequence Updates (Optional)
----------------------------------------
-- Update sequences to avoid conflicts if new data is added manually or via application.
-- Run these only if you are using manual IDs and want to ensure sequences start correctly.
/*
SELECT setval('useraccount_id_seq', (SELECT MAX(id) FROM useraccount));
SELECT setval('company_id_seq', (SELECT MAX(id) FROM company));
SELECT setval('supplier_id_seq', (SELECT MAX(id) FROM supplier));
SELECT setval('product_id_seq', (SELECT MAX(id) FROM product));
SELECT setval('purchase_order_id_seq', (SELECT MAX(id) FROM purchase_order));
SELECT setval('purchase_proof_id_seq', (SELECT MAX(id) FROM purchase_proof));
SELECT setval('product_purchase_detail_id_seq', (SELECT MAX(id) FROM product_purchase_detail));
SELECT setval('client_id_seq', (SELECT MAX(id) FROM client));
SELECT setval('sale_order_id_seq', (SELECT MAX(id) FROM sale_order));
SELECT setval('sale_proof_id_seq', (SELECT MAX(id) FROM sale_proof));
SELECT setval('product_sale_detail_id_seq', (SELECT MAX(id) FROM product_sale_detail));
SELECT setval('company_role_id_seq', (SELECT MAX(id) FROM company_role));
SELECT setval('works_for_id_seq', (SELECT MAX(id) FROM works_for));
*/

-- End of Script
