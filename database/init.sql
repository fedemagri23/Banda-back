-- SQL Seeding Script

-- Seed for useraccount table
-- Note: Passwords are plain text and should be hashed in a real environment.
-- The trigger 'trigger_increase_company_count' will update companies_amount when a company is inserted.
INSERT INTO useraccount (id, username, phone, mail, passhash, joined_at, companies_amount, verification_code, verification_code_expires) VALUES
(1, 'greg_lavender', '5553107049', 'intelbanda@gmail.com', '$10$FNCe2osUhThpfF8SvHhlp.IUTgqsF.tdwANToIVt0DIYh3KtGhn86', '2025-05-22', 0, NULL, NULL),
(2, 'john_evans', '5551146640', 'johnevans@gmail.com', '$2b$10$nn6yrEISiHRLYJVD.EZpneSlmAyyCLCEsidrVVOtHG03pUoDht8r.', '2025-05-22', 0, NULL, NULL),
(3, 'adam_taylor', '5551714900', 'adamtaylor@gmail.com', '$10$DsBpjyexb9j1k4CYf1oWgexg1caUFTTGbxihvC5eyePaeqUlmndvy', '2025-05-22', 0, NULL, NULL);

-- Seed for company table
INSERT INTO company (id, name, country, industry, cuit, email, app_password, user_id) VALUES
(1, 'Intel', 'United States', 'Semiconductors, CPUs, GPUs, Servers, Computers', '20123456789', 'intelbanda@gmail.com', 'lfks znej beny msbz', 1);

-- Seed for supplier table
INSERT INTO supplier (id, code, added_at, name, country, address, phone, mail, web, description, CUIT, CUIL, DNI, CDI, company_id) VALUES
(1, 'SNL001', DEFAULT, 'ASML', 'Netherlands', ROW('Veldhoven', 'De Run', 6501, NULL, NULL, '5504 DR', NULL)::address, '31402683000', 'contact@asml.com', 'https://www.asml.com', 'Extreme Ultraviolet Lithography (EUV) systems for semiconductor manufacturing.', NULL, NULL, NULL, '00577765401', 1),
(2, 'SCA001', DEFAULT, 'Applied Materials', 'United States', ROW('Santa Clara, California', 'Bowers Avenue', 3050, NULL, NULL, '95054', NULL)::address, '14087275555', 'info@appliedmaterials.com', 'https://www.appliedmaterials.com', 'ALD, CVD, PVD, and etch equipment for semiconductor fabrication.', '20123456789', NULL, NULL, NULL, 1),
(3, 'SJP001', DEFAULT, 'Tokyo Electron', 'Japan', ROW('Minato-ku, Tokyo', 'Akasaka', 3, 5, '1', '107 6325', NULL)::address, '81355617000', 'globalinfo@tel.com', 'https://www.tel.com', 'Etch, deposition, and cleaning equipment for semiconductor manufacturing.', '123456789', NULL, NULL, NULL, 1),
(4, 'SNL002', DEFAULT, 'KLA Corporation', 'United States', ROW('Milpitas, California', 'North McCarthy Blvd', 1, NULL, NULL, '95035', NULL)::address, '14088753000', 'klacorp@gmail.com', 'https://www.kla.com', 'Silicon wafer inspection and metrology equipment.', '20123456789', NULL, NULL, NULL, 1),
(5, 'SNL003', DEFAULT, 'KLA Corporation', 'United States', ROW('Milpitas, California', 'North McCarthy Blvd', 1, NULL, NULL, '95035', NULL)::address, '1 408 875 3000', 'klacorp@gmail.com', 'https://www.kla.com', 'Silicon wafer inspection and metrology equipment.', '20123456789', NULL, NULL, NULL, 1);

-- Seed for product table
INSERT INTO product (id, sku, upc, EAN, name, list_price, currency, company_id) VALUES
(1, 'FAB-EUV-ASML-NXE3600D', '088776543210', NULL, 'Twinscan NXE3600D 3nm', 160000000, 'USD', 1),
(2, 'FAB-DUV-ASML-NXT1980DI', '088776543211', NULL, 'Twinscan NXT1980Di', 70000000, 'USD', 1),
(3, 'INSPEC-OPTIC-ASML-YS385', '088776543212', NULL, 'YieldStar 385 Optical Metrology', 5000000, 'USD', 1),
(4, 'DEPO-ALD-AMAT-CP1000', '054321123456', NULL, 'Centura Prismo ALD System', 8000000, 'USD', 1),
(5, 'DEPO-PECVD-AMAT-PGT500', '054321123457', NULL, 'Producer GT PECVD', 6000000, 'USD', 1),
(6, 'DEPO-PVD-AMAT-ENDURA', '054321123458', NULL, 'Endura PVD Platform', 10000000, 'USD', 1),
(7, 'ETCH-PLASMA-TEL-TELINDYPLUS', '076543210987', NULL, 'TELINDY Plus Etch System', 7000000, 'USD', 1),
(8, 'CLEAN-WAFER-TEL-ACT12', '076543210988', NULL, 'ACT 12 Wafer Cleaning', 4000000, 'USD', 1),
(9, 'PHOTO-COAT-TEL-LITHIUSPROZ', '076543210989', NULL, 'Lithius Pro Z Coater Developer', 9000000, 'USD', 1),
(10, 'ETCH-DRY-LAM-KIYO45', '034567654321', NULL, 'Kiyo45 Dry Etch System', 6000000, 'USD', 1),
(11, 'INSPEC-PLASMA-LAM-SENSEI', '034567654322', NULL, 'Sensei Plasma Inspection Platform', 4500000, 'USD', 1),
(12, 'ETCH-CONTACT-LAM-VERSYS2300', '034567654323', NULL, '2300 Versys Contact Etcher', 5000000, 'USD', 1),
(13, 'INSPEC-ELECTRON-KLA-EBEAM5', '023456789012', NULL, 'eBeam 5 Electron Inspection', 6000000, 'USD', 1),
(14, 'INSPEC-LAYER-KLA-2925', '023456789013', NULL, '2925 Series Layer Inspection', 3000000, 'USD', 1),
(15, 'INSPEC-DEFECT-KLA-SP7XP', '023456789014', NULL, 'SP7XP Defect Review', 4000000, 'USD', 1),
(16, 'WAFER-STD-SUMCO-300PRIME', '490123456789', NULL, 'Prime Silicon Wafer 300mm', 120, 'USD', 1),
(17, 'WAFER-EPI-SUMCO-300EPI', '490123456790', NULL, 'EPI Silicon Wafer 300mm', 160, 'USD', 1),
(18, 'WAFER-TEST-SUMCO-200TEST', '490123456791', NULL, 'Test Silicon Wafer 200mm', 60, 'USD', 1),
(19, 'WAFER-UFLAT-SHIN-300UF', '490987654321', NULL, 'Ultra Flat Silicon Wafer 300mm', 150, 'USD', 1),
(20, 'WAFER-SOI-SHIN-SOI', '490987654322', NULL, 'Silicon on Insulator Wafer', 220, 'USD', 1),
(21, 'WAFER-LDD-SHIN-LDDW', '490987654323', NULL, 'Low Defect Density Wafer', 180, 'USD', 1),
(22, 'WAFER-EPI-GWA-EPI300', '471234567890', NULL, 'Epitaxial Wafer 300mm', 180, 'USD', 1),
(23, 'WAFER-POL-GWA-POL200', '471234567891', NULL, 'Polished Wafer 200mm', 80, 'USD', 1),
(24, 'WAFER-SIC-GWA-SIC', '471234567892', NULL, 'Specialty SiC Wafer', 500, 'USD', 1),
(25, 'CHEM-ACID-BASF-HFUP', '400123456789', NULL, 'Ultra High Purity HF Acid', 75, 'USD', 1),
(26, 'CHEM-REMOVER-BASF-PRR600', '400123456790', NULL, 'Photoresist Remover AR 600-71', 300, 'USD', 1),
(27, 'CHEM-DEVELOPER-BASF-AZ400K', '400123456791', NULL, 'Developer Solution AZ 400K', 250, 'USD', 1),
(28, 'CHEM-RESIST-MERCK-AZ701MI', '402123456789', NULL, 'AZ 701Mi Photoresist', 2000, 'USD', 1),
(29, 'CHEM-SLURRY-MERCK-PLANIX', '402123456790', NULL, 'Planarization Slurry Planix', 500, 'USD', 1),
(30, 'CHEM-BARC-MERCK-EUVBARC', '402123456791', NULL, 'EUV Bottom Anti Reflective Coating', 1500, 'USD', 1);

-- Seed for purchases (from datasets.js)
-- Assuming company_id = 1 for all purchases
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
-- Purchase 18
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (18, '2025-04-28', 'P60', 2, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (18, '2025-04-28', 'F0078913', 'FACTM', 2, 18, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES 
(26, '2025-04-28', 'BCH20250423', 600, 90.0, 54000.0, 19, 18, 1),
(27, '2025-04-28', 'BCH20250424', 500, 40.0, 20000.0, 20, 18, 1);
-- Purchase 19
INSERT INTO purchase_order (id, created_at, condition, supplier_id, company_id) VALUES (19, '2025-04-30', 'DBA', 3, 1);
INSERT INTO purchase_proof (id, created_at, code, type, supplier_id, order_id, company_id) VALUES (19, '2025-04-30', 'F0098766', 'FACTE', 3, 19, 1);
INSERT INTO product_purchase_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES 
(28, '2025-04-30', 'BCH20250425', 150, 75.0, 11250.0, 22, 19, 1),
(29, '2025-04-30', 'BCH20250426', 250, 300.0, 75000.0, 23, 19, 1);

-- Seed for client table
INSERT INTO client (id, code, added_at, name, country, address, phone, mail, web, description, doc_type, doc_number, preferred_cbte_type, preferred_vat_type, company_id) VALUES
(1, 'CLUSA001', DEFAULT, 'Dell Technologies', 'United States', ROW('Round Rock', 'Dell Way', 1, 3, 'A', '78682', 'Headquarters')::address, '1 800 999 3355', 'purchasing@dell.com', 'https://www.dell.com', 'Major PC manufacturer and server integrator.', 80, '20987654321', 1, 5, 1),
(2, 'CLUSA002', DEFAULT, 'HP Inc.', 'United States', ROW('Palo Alto', 'Page Mill Rd', 1501, 5, 'B', '94304', 'Corporate HQ')::address, '1 650 857 1501', 'suppliers@hp.com', 'https://www.hp.com', 'Personal computing and printing leader.', 80, '20876543212', 1, 5, 1),
(3, 'CLCHN001', DEFAULT, 'Lenovo Group', 'China', ROW('Beijing', 'Xisanqi', 6, 8, 'C', '100085', 'Beijing HQ')::address, '86 10 5886 8888', 'procurement@lenovo.com', 'https://www.lenovo.com', 'Leading global PC and mobile device manufacturer.', 80, '20765432103', 1, 5, 1),
(4, 'CLUSA003', DEFAULT, 'Amazon Web Services', 'United States', ROW('Seattle', 'Terry Avenue', 410, 14, 'D', '98109', 'AWS Headquarters')::address, '1 888 280 4331', 'awsprocurement@amazon.com', 'https://aws.amazon.com', 'Cloud computing services and datacenter solutions.', 80, '20455822301', 1, 5, 1),
(5, 'CLUSA004', DEFAULT, 'Microsoft Corporation', 'United States', ROW('Redmond', 'One Microsoft Way', 1, 2, 'E', '98052', 'Main Campus')::address, '1 425 882 8080', 'supplier@microsoft.com', 'https://www.microsoft.com', 'Leading software, cloud, and hardware provider.', 80, '20543210985', 1, 5, 1);

-- Seed for sales (from initialize.js)
-- Assuming company_id = 1 for all sales
-- First 5 sales are listed. Continue pattern for the remaining 20 sales if needed.
-- Sale 1 (Order ID: 1, Proof ID: 1, Detail IDs: 1, 2)
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (1, '2025-03-30', 'P30', 1, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (1, '2025-03-30', 'F1001234', 'FACTA', 1, 1, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES 
(1, '2025-03-30', 'SAL20250401', 15000, 1500.0, 22500000.0, 13, 1, 1),
(2, '2025-03-30', 'SAL20250402', 9000, 1480.0, 13320000.0, 14, 1, 1);
-- Sale 2 (Order ID: 2, Proof ID: 2, Detail IDs: 3, 4)
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (2, '2025-04-03', 'P60', 2, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (2, '2025-04-03', 'F1005678', 'FACTA', 2, 2, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES 
(3, '2025-04-03', 'SAL20250403', 6000, 1510.0, 9060000.0, 13, 2, 1),
(4, '2025-04-03', 'SAL20250404', 4500, 1495.0, 6727500.0, 16, 2, 1);
-- Sale 3 (Order ID: 3, Proof ID: 3, Detail IDs: 5, 6)
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (3, '2025-04-06', 'P90', 3, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (3, '2025-04-06', 'F1008912', 'FACTB', 3, 3, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES 
(5, '2025-04-06', 'SAL20250405', 24000, 1450.0, 34800000.0, 13, 3, 1),
(6, '2025-04-06', 'SAL20250406', 19200, 1440.0, 27648000.0, 17, 3, 1);
-- Sale 4 (Order ID: 4, Proof ID: 4, Detail IDs: 7, 8)
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (4, '2025-04-10', 'CTE', 4, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (4, '2025-04-10', 'F1012345', 'FACTC', 4, 4, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES 
(7, '2025-04-10', 'SAL20250407', 1200, 17000.0, 20400000.0, 1, 4, 1),
(8, '2025-04-10', 'SAL20250408', 480, 16800.0, 8064000.0, 2, 4, 1);
-- Sale 5 (Order ID: 5, Proof ID: 5, Detail IDs: 9, 10)
INSERT INTO sale_order (id, created_at, condition, client_id, company_id) VALUES (5, '2025-04-16', 'P30', 5, 1);
INSERT INTO sale_proof (id, created_at, code, type, client_id, order_id, company_id) VALUES (5, '2025-04-16', 'F1016789', 'FACTA', 5, 5, 1);
INSERT INTO product_sale_detail (id, created_at, batch_number, quantity, unit_price, total, product_id, proof_id, company_id) VALUES 
(9, '2025-04-16', 'SAL20250409', 720, 17200.0, 12384000.0, 1, 5, 1),
(10, '2025-04-16', 'SAL20250410', 240, 16900.0, 4056000.0, 2, 5, 1);
-- TODO: Add remaining 20 sales (Sale Order IDs 6-25, Sale Proof IDs 6-25, and corresponding Product Sale Detail IDs)

-- Seed for company_role table
INSERT INTO company_role (id, name, movements_view, movements_edit, employees_view, employees_edit, contact_view, contact_edit, billing_view, billing_edit, inventory_view, company_id) VALUES
(1, 'Counter', TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, 1);

-- Seed for works_for table (invites)
-- Adam Taylor (user_id 3) invited to Intel (company_id 1) as Counter (role_id 1)
INSERT INTO works_for (id, user_id, company_id, accepted, added_at, role) VALUES
(1, 3, 1, FALSE, DEFAULT, 1);

-- Update sequence values for SERIAL columns to prevent conflicts
-- Note: If you add all 25 sales, adjust sale_order_id_seq, sale_proof_id_seq, and product_sale_detail_id_seq accordingly.
SELECT setval('useraccount_id_seq', COALESCE((SELECT MAX(id) FROM useraccount), 1));
SELECT setval('company_id_seq', COALESCE((SELECT MAX(id) FROM company), 1));
SELECT setval('supplier_id_seq', COALESCE((SELECT MAX(id) FROM supplier), 1));
SELECT setval('product_id_seq', COALESCE((SELECT MAX(id) FROM product), 1));
SELECT setval('purchase_order_id_seq', COALESCE((SELECT MAX(id) FROM purchase_order), 1));
SELECT setval('purchase_proof_id_seq', COALESCE((SELECT MAX(id) FROM purchase_proof), 1));
SELECT setval('product_purchase_detail_id_seq', COALESCE((SELECT MAX(id) FROM product_purchase_detail), 1));
SELECT setval('client_id_seq', COALESCE((SELECT MAX(id) FROM client), 1));
SELECT setval('sale_order_id_seq', COALESCE((SELECT MAX(id) FROM sale_order), 1)); -- Should be 25 if all sales are added
SELECT setval('sale_proof_id_seq', COALESCE((SELECT MAX(id) FROM sale_proof), 1)); -- Should be 25 if all sales are added
SELECT setval('product_sale_detail_id_seq', COALESCE((SELECT MAX(id) FROM product_sale_detail), 1)); -- Update to max id after all sales details
SELECT setval('company_role_id_seq', COALESCE((SELECT MAX(id) FROM company_role), 1));
SELECT setval('works_for_id_seq', COALESCE((SELECT MAX(id) FROM works_for), 1));
