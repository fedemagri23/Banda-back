-- Database Seeding Script
-- Populates the database with initial sample data.
-- Run this after 'db.sql' and 'invoices.sql'.

-- 1. Insert Users
-- Passwords would typically be hashed, but are stored as plain text for this example.
INSERT INTO useraccount (username, phone, mail, passhash) VALUES
('greg_lavender', '5553107049', 'intelbanda@gmail.com', 'intelbanda2025'),
('john_evans', '5551146640', 'johnevans@gmail.com', 'johnevans1990'),
('adam_taylor', '5551714900', 'adamtaylor@gmail.com', 'adamtaylor1990');

-- 2. Insert Company
-- Linked to the first user (greg_lavender, id=1).
INSERT INTO company (name, cuit, email, app_password, country, industry, user_id) VALUES
('Intel', '20123456789', 'intelbanda@gmail.com', 'lfks znej beny msbz', 'United States', 'Semiconductors, CPUs, GPUs, Servers, Computers', 1);

-- 3. Insert Suppliers
-- All linked to the first company (Intel, id=1).
INSERT INTO supplier (code, name, country, address, phone, mail, web, CDI, CUIT, description, company_id) VALUES
('SNL001', 'ASML', 'Netherlands', ROW('Veldhoven', 'De Run', 6501, NULL, NULL, '5504 DR', NULL), '31402683000', 'contact@asml.com', 'https://www.asml.com', '00577765401', NULL, 'Extreme Ultraviolet Lithography (EUV) systems for semiconductor manufacturing.', 1),
('SCA001', 'Applied Materials', 'United States', ROW('Santa Clara, California', 'Bowers Avenue', 3050, NULL, NULL, '95054', NULL), '14087275555', 'info@appliedmaterials.com', 'https://www.appliedmaterials.com', NULL, '20123456789', 'ALD, CVD, PVD, and etch equipment for semiconductor fabrication.', 1),
('SJP001', 'Tokyo Electron', 'Japan', ROW('Minato-ku, Tokyo', 'Akasaka', 3, 5, '1', '107 6325', NULL), '81355617000', 'globalinfo@tel.com', 'https://www.tel.com', NULL, '123456789', 'Etch, deposition, and cleaning equipment for semiconductor manufacturing.', 1),
('SNL002', 'KLA Corporation', 'United States', ROW('Milpitas, California', 'North McCarthy Blvd', 1, NULL, NULL, '95035', NULL), '14088753000', 'klacorp@gmail.com', 'https://www.kla.com', NULL, '20123456789', 'Silicon wafer inspection and metrology equipment.', 1),
('SNL003', 'Lam Research', 'United States', ROW('Fremont, California', 'Cushing Parkway', 4650, NULL, NULL, '94538', NULL), '15105720200', 'lamresearch@lam.com', 'https://www.lamresearch.com', NULL, '20987654321', 'Semiconductor process equipment for wafer fabrication.', 1);

-- 4. Insert Products
-- All linked to the first company (Intel, id=1).
INSERT INTO product (sku, upc, name, list_price, currency, stock_alert, company_id) VALUES
('FAB-EUV-ASML-NXE3600D', '088776543210', 'Twinscan NXE3600D 3nm', 160000000, 'USD', 2, 1),
('FAB-DUV-ASML-NXT1980DI', '088776543211', 'Twinscan NXT1980Di', 70000000, 'USD', 1, 1),
('INSPEC-OPTIC-ASML-YS385', '088776543212', 'YieldStar 385 Optical Metrology', 5000000, 'USD', 10, 1),
('DEPO-ALD-AMAT-CP1000', '054321123456', 'Centura Prismo ALD System', 8000000, 'USD', 0, 1),
('DEPO-PECVD-AMAT-PGT500', '054321123457', 'Producer GT PECVD', 6000000, 'USD', 5, 1),
('DEPO-PVD-AMAT-ENDURA', '054321123458', 'Endura PVD Platform', 10000000, 'USD', 3, 1),
('ETCH-PLASMA-TEL-TELINDYPLUS', '076543210987', 'TELINDY Plus Etch System', 7000000, 'USD', 2, 1),
('CLEAN-WAFER-TEL-ACT12', '076543210988', 'ACT 12 Wafer Cleaning', 4000000, 'USD', 1, 1),
('PHOTO-COAT-TEL-LITHIUSPROZ', '076543210989', 'Lithius Pro Z Coater Developer', 9000000, 'USD', 0, 1),
('ETCH-DRY-LAM-KIYO45', '034567654321', 'Kiyo45 Dry Etch System', 6000000, 'USD', 4, 1),
('INSPEC-PLASMA-LAM-SENSEI', '034567654322', 'Sensei Plasma Inspection Platform', 4500000, 'USD', 2, 1),
('ETCH-CONTACT-LAM-VERSYS2300', '034567654323', '2300 Versys Contact Etcher', 5000000, 'USD', 1, 1),
('INSPEC-ELECTRON-KLA-EBEAM5', '023456789012', 'eBeam 5 Electron Inspection', 6000000, 'USD', 0, 1),
('INSPEC-LAYER-KLA-2925', '023456789013', '2925 Series Layer Inspection', 3000000, 'USD', 2, 1),
('INSPEC-DEFECT-KLA-SP7XP', '023456789014', 'SP7XP Defect Review', 4000000, 'USD', 5, 1),
('WAFER-STD-SUMCO-300PRIME', '490123456789', 'Prime Silicon Wafer 300mm', 120, 'USD', 10, 1),
('WAFER-EPI-SUMCO-300EPI', '490123456790', 'EPI Silicon Wafer 300mm', 160, 'USD', 8, 1),
('WAFER-TEST-SUMCO-200TEST', '490123456791', 'Test Silicon Wafer 200mm', 60, 'USD', 6, 1),
('WAFER-UFLAT-SHIN-300UF', '490987654321', 'Ultra Flat Silicon Wafer 300mm', 150, 'USD', 2, 1),
('WAFER-SOI-SHIN-SOI', '490987654322', 'Silicon on Insulator Wafer', 220, 'USD', 1, 1),
('WAFER-LDD-SHIN-LDDW', '490987654323', 'Low Defect Density Wafer', 180, 'USD', 0, 1),
('WAFER-EPI-GWA-EPI300', '471234567890', 'Epitaxial Wafer 300mm', 180, 'USD', 3, 1),
('WAFER-POL-GWA-POL200', '471234567891', 'Polished Wafer 200mm', 80, 'USD', 2, 1),
('WAFER-SIC-GWA-SIC', '471234567892', 'Specialty SiC Wafer', 500, 'USD', 1, 1),
('CHEM-ACID-BASF-HFUP', '400123456789', 'Ultra High Purity HF Acid', 75, 'USD', 0, 1),
('CHEM-REMOVER-BASF-PRR600', '400123456790', 'Photoresist Remover AR 600-71', 300, 'USD', 2, 1),
('CHEM-DEVELOPER-BASF-AZ400K', '400123456791', 'Developer Solution AZ 400K', 250, 'USD', 1, 1),
('CHEM-RESIST-MERCK-AZ701MI', '402123456789', 'AZ 701Mi Photoresist', 2000, 'USD', 0, 1),
('CHEM-SLURRY-MERCK-PLANIX', '402123456790', 'Planarization Slurry Planix', 500, 'USD', 1, 1),
('CHEM-BARC-MERCK-EUVBARC', '402123456791', 'EUV Bottom Anti Reflective Coating', 1500, 'USD', 2, 1);

-- 5. Insert Clients
-- All linked to the first company (Intel, id=1).
INSERT INTO client (code, name, country, address, phone, mail, web, description, doc_type, doc_number, preferred_cbte_type, preferred_vat_type, company_id) VALUES
('CLUSA001', 'Dell Technologies', 'United States', ROW('Round Rock', 'Dell Way', 1, 3, 'A', '78682', 'Headquarters'), '1 800 999 3355', 'purchasing@dell.com', 'https://www.dell.com', 'Major PC manufacturer and server integrator.', 80, '20987654321', 1, 5, 1),
('CLUSA002', 'HP Inc.', 'United States', ROW('Palo Alto', 'Page Mill Rd', 1501, 5, 'B', '94304', 'Corporate HQ'), '1 650 857 1501', 'suppliers@hp.com', 'https://www.hp.com', 'Personal computing and printing leader.', 80, '20876543212', 1, 5, 1),
('CLCHN001', 'Lenovo Group', 'China', ROW('Beijing', 'Xisanqi', 6, 8, 'C', '100085', 'Beijing HQ'), '86 10 5886 8888', 'procurement@lenovo.com', 'https://www.lenovo.com', 'Leading global PC and mobile device manufacturer.', 80, '20765432103', 1, 5, 1),
('CLUSA003', 'Amazon Web Services', 'United States', ROW('Seattle', 'Terry Avenue', 410, 14, 'D', '98109', 'AWS Headquarters'), '1 888 280 4331', 'awsprocurement@amazon.com', 'https://aws.amazon.com', 'Cloud computing services and datacenter solutions.', 80, '20455822301', 1, 5, 1),
('CLUSA004', 'Microsoft Corporation', 'United States', ROW('Redmond', 'One Microsoft Way', 1, 2, 'E', '98052', 'Main Campus'), '1 425 882 8080', 'supplier@microsoft.com', 'https://www.microsoft.com', 'Leading software, cloud, and hardware provider.', 80, '20543210985', 1, 5, 1);

-- 6. Insert All Purchases, Proofs, and Details from purchases.js
DO $$
DECLARE
    purchase_data JSON[] := ARRAY[
        '{"condition": "P30", "supplier_id": 1, "proof_code": "F0001999", "proof_type": "FACTA", "created_at": "2024-05-25", "products_details": [{"batch_number": "BCH20240225A", "quantity": 11, "unit_price": 14000000.0, "currency": "USD", "product_id": 1}]}',
        '{"condition": "P30", "supplier_id": 1, "proof_code": "F0002001", "proof_type": "FACTA", "created_at": "2025-02-25", "products_details": [{"batch_number": "BCH20250225A", "quantity": 1, "unit_price": 14000000.0, "currency": "USD", "product_id": 1}]}',
        '{"condition": "P30", "supplier_id": 2, "proof_code": "F0002002", "proof_type": "FACTA", "created_at": "2025-02-27", "products_details": [{"batch_number": "BCH20250227A", "quantity": 2, "unit_price": 7200000.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P60", "supplier_id": 3, "proof_code": "F0002003", "proof_type": "FACTA", "created_at": "2025-02-28", "products_details": [{"batch_number": "BCH20250228A", "quantity": 1, "unit_price": 16000000.0, "currency": "USD", "product_id": 1}, {"batch_number": "BCH20250228B", "quantity": 1, "unit_price": 7000000.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "supplier_id": 1, "proof_code": "F0003001", "proof_type": "FACTA", "created_at": "2025-03-02", "products_details": [{"batch_number": "BCH20250302A", "quantity": 1, "unit_price": 28000000.0, "currency": "USD", "product_id": 1}]}',
        '{"condition": "P30", "supplier_id": 2, "proof_code": "F0003002", "proof_type": "FACTA", "created_at": "2025-03-05", "products_details": [{"batch_number": "BCH20250305A", "quantity": 2, "unit_price": 14400000.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P60", "supplier_id": 3, "proof_code": "F0003003", "proof_type": "FACTA", "created_at": "2025-03-10", "products_details": [{"batch_number": "BCH20250310A", "quantity": 1, "unit_price": 32000000.0, "currency": "USD", "product_id": 1}]}',
        '{"condition": "P30", "supplier_id": 1, "proof_code": "F0003004", "proof_type": "FACTA", "created_at": "2025-03-15", "products_details": [{"batch_number": "BCH20250315A", "quantity": 2, "unit_price": 14000000.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P60", "supplier_id": 2, "proof_code": "F0003005", "proof_type": "FACTA", "created_at": "2025-03-20", "products_details": [{"batch_number": "BCH20250320A", "quantity": 1, "unit_price": 1600000.0, "currency": "USD", "product_id": 4}]}',
        '{"condition": "P90", "supplier_id": 3, "proof_code": "F0003006", "proof_type": "FACTB", "created_at": "2025-03-25", "products_details": [{"batch_number": "BCH20250325A", "quantity": 2, "unit_price": 1400000.0, "currency": "USD", "product_id": 7}]}',
        '{"condition": "CTE", "supplier_id": 4, "proof_code": "F0003007", "proof_type": "FACTC", "created_at": "2025-03-28", "products_details": [{"batch_number": "BCH20250328A", "quantity": 5, "unit_price": 1200000.0, "currency": "USD", "product_id": 10}]}',
        '{"condition": "P30", "supplier_id": 1, "proof_code": "F0012345", "proof_type": "FACTA", "created_at": "2025-03-29", "products_details": [{"batch_number": "BCH20250401", "quantity": 1, "unit_price": 30000000.0, "currency": "USD", "product_id": 1}, {"batch_number": "BCH20250402", "quantity": 1, "unit_price": 25000000.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P60", "supplier_id": 2, "proof_code": "F0056789", "proof_type": "FACTA", "created_at": "2025-04-02", "products_details": [{"batch_number": "BCH20250403", "quantity": 3, "unit_price": 4000000.0, "currency": "USD", "product_id": 4}, {"batch_number": "BCH20250404", "quantity": 2, "unit_price": 3000000.0, "currency": "USD", "product_id": 5}, {"batch_number": "BCH20250405", "quantity": 1, "unit_price": 5000000.0, "currency": "USD", "product_id": 6}]}',
        '{"condition": "P90", "supplier_id": 3, "proof_code": "F0078901", "proof_type": "FACTB", "created_at": "2025-04-05", "products_details": [{"batch_number": "BCH20250406", "quantity": 2, "unit_price": 3500000.0, "currency": "USD", "product_id": 7}, {"batch_number": "BCH20250407", "quantity": 1, "unit_price": 2000000.0, "currency": "USD", "product_id": 8}]}',
        '{"condition": "CTE", "supplier_id": 4, "proof_code": "F0012346", "proof_type": "FACTC", "created_at": "2025-04-08", "products_details": [{"batch_number": "BCH20250408", "quantity": 5, "unit_price": 3000000.0, "currency": "USD", "product_id": 10}, {"batch_number": "BCH20250409", "quantity": 3, "unit_price": 2250000.0, "currency": "USD", "product_id": 11}]}',
        '{"condition": "CDF", "supplier_id": 5, "proof_code": "RC004567", "proof_type": "RECIB", "created_at": "2025-04-12", "products_details": [{"batch_number": "BCH20250410", "quantity": 1000, "unit_price": 60.0, "currency": "USD", "product_id": 13}, {"batch_number": "BCH20250411", "quantity": 500, "unit_price": 80.0, "currency": "USD", "product_id": 14}]}',
        '{"condition": "P30", "supplier_id": 1, "proof_code": "F0034568", "proof_type": "FACTA", "created_at": "2025-04-26", "products_details": [{"batch_number": "BCH20250421", "quantity": 1200, "unit_price": 75.0, "currency": "USD", "product_id": 16}, {"batch_number": "BCH20250422", "quantity": 800, "unit_price": 110.0, "currency": "USD", "product_id": 17}]}',
        '{"condition": "P60", "supplier_id": 2, "proof_code": "F0078913", "proof_type": "FACTM", "created_at": "2025-04-28", "products_details": [{"batch_number": "BCH20250423", "quantity": 600, "unit_price": 90.0, "currency": "USD", "product_id": 19}, {"batch_number": "BCH20250424", "quantity": 500, "unit_price": 40.0, "currency": "USD", "product_id": 20}]}',
        '{"condition": "DBA", "supplier_id": 3, "proof_code": "F0098766", "proof_type": "FACTE", "created_at": "2025-04-30", "products_details": [{"batch_number": "BCH20250425", "quantity": 150, "unit_price": 75.0, "currency": "USD", "product_id": 22}, {"batch_number": "BCH20250426", "quantity": 250, "unit_price": 300.0, "currency": "USD", "product_id": 23}]}'
    ];
    p_item JSON;
    p_detail JSON;
    order_id INT;
    proof_id INT;
BEGIN
    FOREACH p_item IN ARRAY purchase_data
    LOOP
        INSERT INTO purchase_order (condition, supplier_id, company_id, created_at)
        VALUES (p_item->>'condition', (p_item->>'supplier_id')::INT, 1, (p_item->>'created_at')::DATE)
        RETURNING id INTO order_id;

        INSERT INTO purchase_proof (code, type, supplier_id, order_id, company_id, created_at)
        VALUES (p_item->>'proof_code', p_item->>'proof_type', (p_item->>'supplier_id')::INT, order_id, 1, (p_item->>'created_at')::DATE)
        RETURNING id INTO proof_id;

        FOR p_detail IN SELECT * FROM json_array_elements(p_item->'products_details')
        LOOP
            INSERT INTO product_purchase_detail (batch_number, quantity, unit_price, currency, product_id, proof_id, company_id, created_at)
            VALUES (p_detail->>'batch_number', (p_detail->>'quantity')::INT, (p_detail->>'unit_price')::NUMERIC, (p_detail->>'currency')::type_currency, (p_detail->>'product_id')::INT, proof_id, 1, (p_item->>'created_at')::DATE);
        END LOOP;
    END LOOP;
END $$;

-- 7. Insert All Sales, Proofs, and Details from sales.js
DO $$
DECLARE
    sale_data JSON[] := ARRAY[
        '{"condition": "P30", "client_id": 1, "proof_code": "F1001234", "proof_type": "FACTA", "created_at": "2025-03-30", "products_details": [{"batch_number": "SAL20250401", "quantity": 15000, "unit_price": 1500.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250402", "quantity": 9000, "unit_price": 1480.0, "currency": "USD", "product_id": 14}]}',
        '{"condition": "P60", "client_id": 2, "proof_code": "F1005678", "proof_type": "FACTA", "created_at": "2025-04-03", "products_details": [{"batch_number": "SAL20250403", "quantity": 6000, "unit_price": 1510.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250404", "quantity": 4500, "unit_price": 1495.0, "currency": "USD", "product_id": 16}]}',
        '{"condition": "P90", "client_id": 3, "proof_code": "F1008912", "proof_type": "FACTB", "created_at": "2025-04-06", "products_details": [{"batch_number": "SAL20250405", "quantity": 24000, "unit_price": 1450.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250406", "quantity": 19200, "unit_price": 1440.0, "currency": "USD", "product_id": 17}]}',
        '{"condition": "CTE", "client_id": 4, "proof_code": "F1012345", "proof_type": "FACTC", "created_at": "2025-04-10", "products_details": [{"batch_number": "SAL20250407", "quantity": 1200, "unit_price": 17000.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250408", "quantity": 480, "unit_price": 16800.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 5, "proof_code": "F1016789", "proof_type": "FACTA", "created_at": "2025-04-16", "products_details": [{"batch_number": "SAL20250409", "quantity": 720, "unit_price": 17200.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250410", "quantity": 240, "unit_price": 16900.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 1, "proof_code": "F1012346", "proof_type": "FACTA", "created_at": "2025-04-20", "products_details": [{"batch_number": "SAL20250411", "quantity": 9000, "unit_price": 1500.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250412", "quantity": 6000, "unit_price": 1480.0, "currency": "USD", "product_id": 14}]}',
        '{"condition": "P60", "client_id": 2, "proof_code": "F1015678", "proof_type": "FACTA", "created_at": "2025-04-22", "products_details": [{"batch_number": "SAL20250413", "quantity": 12000, "unit_price": 1510.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250414", "quantity": 9000, "unit_price": 1495.0, "currency": "USD", "product_id": 16}]}',
        '{"condition": "P90", "client_id": 3, "proof_code": "F1018912", "proof_type": "FACTB", "created_at": "2025-04-25", "products_details": [{"batch_number": "SAL20250415", "quantity": 18000, "unit_price": 1450.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250416", "quantity": 14400, "unit_price": 1440.0, "currency": "USD", "product_id": 17}]}',
        '{"condition": "CTE", "client_id": 4, "proof_code": "F1022345", "proof_type": "FACTC", "created_at": "2025-04-28", "products_details": [{"batch_number": "SAL20250417", "quantity": 900, "unit_price": 17000.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250418", "quantity": 360, "unit_price": 16800.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 5, "proof_code": "F1026789", "proof_type": "FACTA", "created_at": "2025-04-30", "products_details": [{"batch_number": "SAL20250419", "quantity": 540, "unit_price": 17200.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250420", "quantity": 180, "unit_price": 16900.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 1, "proof_code": "F1023456", "proof_type": "FACTA", "created_at": "2025-05-02", "products_details": [{"batch_number": "SAL20250421", "quantity": 12000, "unit_price": 1500.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250422", "quantity": 8000, "unit_price": 1480.0, "currency": "USD", "product_id": 14}]}',
        '{"condition": "P60", "client_id": 2, "proof_code": "F1027890", "proof_type": "FACTA", "created_at": "2025-05-05", "products_details": [{"batch_number": "SAL20250423", "quantity": 16000, "unit_price": 1510.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250424", "quantity": 12000, "unit_price": 1495.0, "currency": "USD", "product_id": 16}]}',
        '{"condition": "P90", "client_id": 3, "proof_code": "F1031234", "proof_type": "FACTB", "created_at": "2025-05-08", "products_details": [{"batch_number": "SAL20250425", "quantity": 24000, "unit_price": 1450.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250426", "quantity": 19200, "unit_price": 1440.0, "currency": "USD", "product_id": 17}]}',
        '{"condition": "CTE", "client_id": 4, "proof_code": "F1035678", "proof_type": "FACTC", "created_at": "2025-05-12", "products_details": [{"batch_number": "SAL20250427", "quantity": 1200, "unit_price": 17000.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250428", "quantity": 480, "unit_price": 16800.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 5, "proof_code": "F1039012", "proof_type": "FACTA", "created_at": "2025-05-15", "products_details": [{"batch_number": "SAL20250429", "quantity": 720, "unit_price": 17200.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250430", "quantity": 240, "unit_price": 16900.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 1, "proof_code": "F1041234", "proof_type": "FACTA", "created_at": "2025-05-18", "products_details": [{"batch_number": "SAL20250431", "quantity": 15000, "unit_price": 1500.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250432", "quantity": 9000, "unit_price": 1480.0, "currency": "USD", "product_id": 14}]}',
        '{"condition": "P60", "client_id": 2, "proof_code": "F1045678", "proof_type": "FACTA", "created_at": "2025-05-20", "products_details": [{"batch_number": "SAL20250433", "quantity": 8000, "unit_price": 1510.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250434", "quantity": 6000, "unit_price": 1495.0, "currency": "USD", "product_id": 16}]}',
        '{"condition": "P90", "client_id": 3, "proof_code": "F1048912", "proof_type": "FACTB", "created_at": "2025-05-22", "products_details": [{"batch_number": "SAL20250435", "quantity": 20000, "unit_price": 1450.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250436", "quantity": 16000, "unit_price": 1440.0, "currency": "USD", "product_id": 17}]}',
        '{"condition": "CTE", "client_id": 4, "proof_code": "F1052345", "proof_type": "FACTC", "created_at": "2025-05-25", "products_details": [{"batch_number": "SAL20250437", "quantity": 1000, "unit_price": 17000.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250438", "quantity": 400, "unit_price": 16800.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 5, "proof_code": "F1056789", "proof_type": "FACTA", "created_at": "2025-05-28", "products_details": [{"batch_number": "SAL20250439", "quantity": 600, "unit_price": 17200.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250440", "quantity": 200, "unit_price": 16900.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 1, "proof_code": "F1059012", "proof_type": "FACTA", "created_at": "2025-05-30", "products_details": [{"batch_number": "SAL20250441", "quantity": 10000, "unit_price": 1500.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250442", "quantity": 7000, "unit_price": 1480.0, "currency": "USD", "product_id": 14}]}',
        '{"condition": "P60", "client_id": 2, "proof_code": "F1061234", "proof_type": "FACTA", "created_at": "2025-06-02", "products_details": [{"batch_number": "SAL20250443", "quantity": 14000, "unit_price": 1510.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250444", "quantity": 10000, "unit_price": 1495.0, "currency": "USD", "product_id": 16}]}',
        '{"condition": "P90", "client_id": 3, "proof_code": "F1065678", "proof_type": "FACTB", "created_at": "2025-06-05", "products_details": [{"batch_number": "SAL20250445", "quantity": 22000, "unit_price": 1450.0, "currency": "USD", "product_id": 13}, {"batch_number": "SAL20250446", "quantity": 18000, "unit_price": 1440.0, "currency": "USD", "product_id": 17}]}',
        '{"condition": "CTE", "client_id": 4, "proof_code": "F1069012", "proof_type": "FACTC", "created_at": "2025-06-08", "products_details": [{"batch_number": "SAL20250447", "quantity": 1100, "unit_price": 17000.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250448", "quantity": 440, "unit_price": 16800.0, "currency": "USD", "product_id": 2}]}',
        '{"condition": "P30", "client_id": 5, "proof_code": "F1071234", "proof_type": "FACTA", "created_at": "2025-06-12", "products_details": [{"batch_number": "SAL20250449", "quantity": 660, "unit_price": 17200.0, "currency": "USD", "product_id": 1}, {"batch_number": "SAL20250450", "quantity": 220, "unit_price": 16900.0, "currency": "USD", "product_id": 2}]}'
    ];
    s_item JSON;
    s_detail JSON;
    order_id INT;
    proof_id INT;
BEGIN
    FOREACH s_item IN ARRAY sale_data
    LOOP
        INSERT INTO sale_order (condition, client_id, company_id, created_at)
        VALUES (s_item->>'condition', (s_item->>'client_id')::INT, 1, (s_item->>'created_at')::DATE)
        RETURNING id INTO order_id;

        INSERT INTO sale_proof (code, type, client_id, order_id, company_id, created_at)
        VALUES (s_item->>'proof_code', s_item->>'proof_type', (s_item->>'client_id')::INT, order_id, 1, (s_item->>'created_at')::DATE)
        RETURNING id INTO proof_id;

        FOR s_detail IN SELECT * FROM json_array_elements(s_item->'products_details')
        LOOP
            INSERT INTO product_sale_detail (batch_number, quantity, unit_price, currency, product_id, proof_id, company_id, created_at)
            VALUES (s_detail->>'batch_number', (s_detail->>'quantity')::INT, (s_detail->>'unit_price')::NUMERIC, (s_detail->>'currency')::type_currency, (s_detail->>'product_id')::INT, proof_id, 1, (s_item->>'created_at')::DATE);
        END LOOP;
    END LOOP;
END $$;


-- 8. Insert Ghost Purchases
-- This section creates purchases for products that were sold but lacked sufficient purchase records.
DO $$
DECLARE
    order_id INT;
    proof_id INT;
BEGIN
    -- Deficit for product_id 1: 8405 units. First sale: 2025-04-10
    INSERT INTO purchase_order (condition, supplier_id, company_id, created_at) VALUES ('CTE', 1, 1, '2025-04-10') RETURNING id INTO order_id;
    INSERT INTO purchase_proof (code, type, supplier_id, order_id, company_id, created_at) VALUES ('G0010410', 'FACTA', 1, order_id, 1, '2025-04-10') RETURNING id INTO proof_id;
    INSERT INTO product_purchase_detail (batch_number, quantity, unit_price, currency, product_id, proof_id, company_id, created_at) VALUES ('GHOST-1-20250410', 8405, 0.0, 'USD', 1, proof_id, 1, '2025-04-10');

    -- Deficit for product_id 2: 2635 units. First sale: 2025-04-10
    INSERT INTO purchase_order (condition, supplier_id, company_id, created_at) VALUES ('CTE', 1, 1, '2025-04-10') RETURNING id INTO order_id;
    INSERT INTO purchase_proof (code, type, supplier_id, order_id, company_id, created_at) VALUES ('G0020410', 'FACTA', 1, order_id, 1, '2025-04-10') RETURNING id INTO proof_id;
    INSERT INTO product_purchase_detail (batch_number, quantity, unit_price, currency, product_id, proof_id, company_id, created_at) VALUES ('GHOST-2-20250410', 2635, 0.0, 'USD', 2, proof_id, 1, '2025-04-10');

    -- Deficit for product_id 13: 224000 units. First sale: 2025-03-30
    INSERT INTO purchase_order (condition, supplier_id, company_id, created_at) VALUES ('CTE', 1, 1, '2025-03-30') RETURNING id INTO order_id;
    INSERT INTO purchase_proof (code, type, supplier_id, order_id, company_id, created_at) VALUES ('G0130330', 'FACTA', 1, order_id, 1, '2025-03-30') RETURNING id INTO proof_id;
    INSERT INTO product_purchase_detail (batch_number, quantity, unit_price, currency, product_id, proof_id, company_id, created_at) VALUES ('GHOST-13-20250330', 224000, 0.0, 'USD', 13, proof_id, 1, '2025-03-30');

    -- Deficit for product_id 14: 29500 units. First sale: 2025-03-30
    INSERT INTO purchase_order (condition, supplier_id, company_id, created_at) VALUES ('CTE', 1, 1, '2025-03-30') RETURNING id INTO order_id;
    INSERT INTO purchase_proof (code, type, supplier_id, order_id, company_id, created_at) VALUES ('G0140330', 'FACTA', 1, order_id, 1, '2025-03-30') RETURNING id INTO proof_id;
    INSERT INTO product_purchase_detail (batch_number, quantity, unit_price, currency, product_id, proof_id, company_id, created_at) VALUES ('GHOST-14-20250330', 29500, 0.0, 'USD', 14, proof_id, 1, '2025-03-30');

    -- Deficit for product_id 16: 40300 units. First sale: 2025-04-03
    INSERT INTO purchase_order (condition, supplier_id, company_id, created_at) VALUES ('CTE', 1, 1, '2025-04-03') RETURNING id INTO order_id;
    INSERT INTO purchase_proof (code, type, supplier_id, order_id, company_id, created_at) VALUES ('G0160403', 'FACTA', 1, order_id, 1, '2025-04-03') RETURNING id INTO proof_id;
    INSERT INTO product_purchase_detail (batch_number, quantity, unit_price, currency, product_id, proof_id, company_id, created_at) VALUES ('GHOST-16-20250403', 40300, 0.0, 'USD', 16, proof_id, 1, '2025-04-03');

    -- Deficit for product_id 17: 86000 units. First sale: 2025-04-06
    INSERT INTO purchase_order (condition, supplier_id, company_id, created_at) VALUES ('CTE', 1, 1, '2025-04-06') RETURNING id INTO order_id;
    INSERT INTO purchase_proof (code, type, supplier_id, order_id, company_id, created_at) VALUES ('G0170406', 'FACTA', 1, order_id, 1, '2025-04-06') RETURNING id INTO proof_id;
    INSERT INTO product_purchase_detail (batch_number, quantity, unit_price, currency, product_id, proof_id, company_id, created_at) VALUES ('GHOST-17-20250406', 86000, 0.0, 'USD', 17, proof_id, 1, '2025-04-06');
END $$;


-- 9. Insert Roles and Employee Links
INSERT INTO company_role (name, movements_view, movements_edit, employees_view, employees_edit, contact_view, contact_edit, billing_view, billing_edit, inventory_view, company_id) VALUES
('Counter', true, false, false, false, true, false, true, true, true, 1);

-- Link company owner (greg_lavender, user_id=1) and invited employee (adam_taylor, user_id=3)
-- Assuming the owner gets a default admin-like role or no specific role initially.
INSERT INTO works_for (user_id, company_id, accepted) VALUES
(1, 1, true);

-- The invited employee gets the 'Counter' role (id=1)
INSERT INTO works_for (user_id, company_id, accepted, role) VALUES
(3, 1, false, 1); -- 'accepted' is false as it's an invite.
