-- Insert two companies into the company table
INSERT INTO company (name, email, app_password, user_id)
VALUES 
    ('Tech Solutions', 'contact@techsolutions.com', 'securepassword123', 1), -- Replace 1 with a valid user_id
    ('Global Enterprises', 'info@globalenterprises.com', 'anothersecurepassword', 2); -- Replace 2 with a valid user_id

-- Insert two clients into the client table
INSERT INTO client (
    code, 
    added_at, 
    name, 
    country, 
    address, 
    phone, 
    mail, 
    web, 
    description, 
    CUIT, 
    CUIL, 
    DNI, 
    CDI, 
    company_id
) VALUES 
(
    'C001', 
    now(), 
    'Client One', 
    'Argentina', 
    ROW('Buenos Aires', 'Main Street', 123, 1, 'A', '1000', 'Near the park')::address, 
    '+54-11-1234-5678', 
    'client1@example.com', 
    'https://client1.com', 
    'First client description', 
    '20123456789', 
    NULL, 
    NULL, 
    NULL, 
    1 -- Replace with a valid company_id
),
(
    'C002', 
    now(), 
    'Client Two', 
    'Argentina', 
    ROW('Cordoba', 'Second Street', 456, 2, 'B', '5000', 'Next to the mall')::address, 
    '+54-351-9876-5432', 
    'client2@example.com', 
    'https://client2.com', 
    'Second client description', 
    NULL, 
    '20123456780', 
    NULL, 
    NULL, 
    1 -- Replace with a valid company_id
);