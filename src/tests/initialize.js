import fetch from "node-fetch";
import dotenv from "dotenv";
import pkg from "pg";
const { Client } = pkg;
import fs from "fs/promises";

dotenv.config();

const baseUrl = `http://${process.env.DB_HOST}:${process.env.PORT}`;

async function resetDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  await client.connect();

  console.log("DB reset in progress...");

  const sql = await fs.readFile("database/db.sql", "utf-8");

  await client.query(sql);
  await client.end();

  console.log("DB Reset completed");
}

async function handleResponse(response, successMessage, errorMessage) {
  if (!response.ok) {
    const errorData = await response.json();
    console.error(
      `\x1b[31m❌ ${errorMessage}: ${response.status} ${response.statusText}\x1b[0m`
    );
    console.error(`\x1b[31mError details: ${JSON.stringify(errorData)}\x1b[0m`);
    throw new Error(
      `${errorMessage}: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  console.log(`\x1b[32m✅ ${successMessage}\x1b[0m`);
  return data;
}

async function createUser(user, baseUrl) {
  const response = await fetch(`${baseUrl}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return handleResponse(
    response,
    `User ${user.username} created successfully`,
    `Failed to create user ${user.username}`
  );
}

async function loginUser(username, password, baseUrl) {
  const response = await fetch(`${baseUrl}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: username,
      password: password,
    }),
  });
  return handleResponse(
    response,
    `User ${username} logged in successfully`,
    "Login failed"
  );
}

async function createCompany(company, token, baseUrl) {
  const response = await fetch(`${baseUrl}/company/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(company),
  });
  return handleResponse(
    response,
    `Company ${company.name} created successfully`,
    `Failed to create company ${company.name}`
  );
}

async function createSupplier(supplier, token, baseUrl) {
  const response = await fetch(`${baseUrl}/supplier/post/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(supplier),
  });
  return handleResponse(
    response,
    `Supplier ${supplier.name} created successfully`,
    `Failed to create supplier ${supplier.name}`
  );
}

async function createProduct(product, token, baseUrl) {
  const response = await fetch(`${baseUrl}/product/post/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  return handleResponse(
    response,
    `Product ${product.name} created successfully`,
    `Failed to create product ${product.name}`
  );
}

async function createPurchase(purchase, token, baseUrl) {
  const response = await fetch(`${baseUrl}/purchase/post/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(purchase),
  });
  return handleResponse(
    response,
    `Purchase order created successfully`,
    "Failed to create purchase order"
  );
}

async function createClient(client, token, baseUrl) {
  const response = await fetch(`${baseUrl}/client/post/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(client),
  });
  return handleResponse(
    response,
    `Client ${client.name} created successfully`,
    `Failed to create client ${client.name}`
  );
}

async function createSale(sale, token, baseUrl) {
  const response = await fetch(`${baseUrl}/sale/post/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sale),
  });
  return handleResponse(
    response,
    `Sale order created successfully`,
    "Failed to create sale order"
  );
}

async function createRole(role, token, baseUrl) {
  const response = await fetch(`${baseUrl}/employee/role/post/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(role),
  });
  return handleResponse(
    response,
    `Role created successfully`,
    "Failed to create role"
  );
}

async function createInvite(invite, token, baseUrl) {
  const response = await fetch(`${baseUrl}/employee/post/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invite),
  });
  return handleResponse(
    response,
    `Employee invited successfully`,
    "Failed to invite employee"
  );
}

async function createGhostPurchase(
  productId,
  quantity,
  saleDate,
  token,
  baseUrl
) {
  // Generate a valid proof code: G + 3 digits for product ID + 4 digits for date
  const proofCode = `G${String(productId).padStart(3, "0")}${saleDate
    .replace(/-/g, "")
    .slice(4)}`;

  const ghostPurchase = {
    condition: "CTE",
    supplier_id: 1, // Using ASML as default supplier
    proof_code: proofCode,
    proof_type: "FACTA",
    created_at: saleDate,
    products_details: [
      {
        batch_number: `GHOST-${productId}-${saleDate.replace(/-/g, "")}`,
        quantity: quantity,
        unit_price: 0.0,
        product_id: productId,
      },
    ],
  };

  return createPurchase(ghostPurchase, token, baseUrl);
}

async function createGhostPurchasesForSales(sales, purchases, token, baseUrl) {
  // Create a map of product quantities purchased
  const purchasedQuantities = new Map();
  purchases.forEach((purchase) => {
    purchase.products_details.forEach((detail) => {
      const current = purchasedQuantities.get(detail.product_id) || 0;
      purchasedQuantities.set(detail.product_id, current + detail.quantity);
    });
  });

  // Create a map of product quantities sold
  const soldQuantities = new Map();
  sales.forEach((sale) => {
    sale.products_details.forEach((detail) => {
      const current = soldQuantities.get(detail.product_id) || 0;
      soldQuantities.set(detail.product_id, current + detail.quantity);
    });
  });

  // Find products that were sold but not purchased enough
  for (const [productId, soldQty] of soldQuantities) {
    const purchasedQty = purchasedQuantities.get(productId) || 0;
    if (soldQty > purchasedQty) {
      const missingQty = soldQty - purchasedQty;
      // Find the first sale date for this product
      const firstSale = sales.find((sale) =>
        sale.products_details.some((detail) => detail.product_id === productId)
      );
      if (firstSale) {
        await createGhostPurchase(
          productId,
          missingQty,
          firstSale.created_at,
          token,
          baseUrl
        );
        console.log(
          `Created ghost purchase for product ${productId} with quantity ${missingQty}`
        );
      }
    }
  }
}

async function seedDatabase() {
  await resetDatabase();
  console.log("Seeding database...");

  // Seed users
  const users = [
    {
      username: "greg_lavender",
      phone: "5553107049",
      mail: "intelbanda@gmail.com",
      password: "intelbanda2025",
    },
    {
      username: "john_evans",
      phone: "5551146640",
      mail: "johnevans@gmail.com",
      password: "johnevans1990",
    },
    {
      username: "adam_taylor",
      phone: "5551714900",
      mail: "adamtaylor@gmail.com",
      password: "adamtaylor1990",
    },
  ];

  for (const user of users) {
    await createUser(user, baseUrl);
  }

  // Login and get token
  const loginData = await loginUser(
    users[0].username,
    users[0].password,
    baseUrl
  );
  const token = loginData.token;

  // Seed company
  const companies = [
    {
      name: "Intel",
      cuit: "20123456789",
      email: "intelbanda@gmail.com",
      app_password: "lfks znej beny msbz",
      country: "United States",
      industry: "Semiconductors, CPUs, GPUs, Servers, Computers",
      userId: 1,
    },
  ];

  for (const company of companies) {
    await createCompany(company, token, baseUrl);
  }

  // Seed suppliers
  const suppliers = [
    {
      code: "SNL001",
      name: "ASML",
      country: "Netherlands",
      address: {
        town: "Veldhoven",
        street: "De Run",
        number: "6501",
        zip_code: "5504 DR",
      },
      phone: "31402683000",
      mail: "contact@asml.com",
      web: "https://www.asml.com",
      CDI: "00577765401",
      description:
        "Extreme Ultraviolet Lithography (EUV) systems for semiconductor manufacturing.",
    },
    {
      code: "SCA001",
      name: "Applied Materials",
      country: "United States",
      address: {
        town: "Santa Clara, California",
        street: "Bowers Avenue",
        number: "3050",
        zip_code: "95054",
      },
      phone: "14087275555",
      mail: "info@appliedmaterials.com",
      web: "https://www.appliedmaterials.com",
      CUIT: "20123456789",
      description:
        "ALD, CVD, PVD, and etch equipment for semiconductor fabrication.",
    },
    {
      code: "SJP001",
      name: "Tokyo Electron",
      country: "Japan",
      address: {
        town: "Minato-ku, Tokyo",
        street: "Akasaka",
        number: 3,
        floor: 5,
        departament: 1,
        zip_code: "107 6325",
      },
      phone: "81355617000",
      mail: "globalinfo@tel.com",
      web: "https://www.tel.com",
      CUIT: "123456789",
      description:
        "Etch, deposition, and cleaning equipment for semiconductor manufacturing.",
    },
    {
      code: "SNL002",
      name: "KLA Corporation",
      country: "United States",
      address: {
        town: "Milpitas, California",
        street: "North McCarthy Blvd",
        number: "1",
        zip_code: "95035",
      },
      phone: "14088753000",
      mail: "klacorp@gmail.com",
      web: "https://www.kla.com",
      CUIT: "20123456789",
      description: "Silicon wafer inspection and metrology equipment.",
    },
    {
      code: "SNL003",
      name: "KLA Corporation",
      country: "United States",
      address: {
        town: "Milpitas, California",
        street: "North McCarthy Blvd",
        number: "1",
        zip_code: "95035",
      },
      phone: "1 408 875 3000",
      mail: "klacorp@gmail.com",
      web: "https://www.kla.com",
      CUIT: "20123456789",
      description: "Silicon wafer inspection and metrology equipment.",
    },
  ];

  for (const supplier of suppliers) {
    await createSupplier(supplier, token, baseUrl);
  }

  //send products
  const products = [
    {
      sku: "FAB-EUV-ASML-NXE3600D",
      upc: "088776543210",
      name: "Twinscan NXE3600D 3nm",
      list_price: 160000000,
      currency: "USD",
      stock_alert: 2,
    },
    {
      sku: "FAB-DUV-ASML-NXT1980DI",
      upc: "088776543211",
      name: "Twinscan NXT1980Di",
      list_price: 70000000,
      currency: "USD",
      stock_alert: 1,
    },
    {
      sku: "INSPEC-OPTIC-ASML-YS385",
      upc: "088776543212",
      name: "YieldStar 385 Optical Metrology",
      list_price: 5000000,
      currency: "USD",
      stock_alert: 10,
    },
    {
      sku: "DEPO-ALD-AMAT-CP1000",
      upc: "054321123456",
      name: "Centura Prismo ALD System",
      list_price: 8000000,
      currency: "USD",
      stock_alert: 0,
    },
    {
      sku: "DEPO-PECVD-AMAT-PGT500",
      upc: "054321123457",
      name: "Producer GT PECVD",
      list_price: 6000000,
      currency: "USD",
      stock_alert: 5,
    },
    {
      sku: "DEPO-PVD-AMAT-ENDURA",
      upc: "054321123458",
      name: "Endura PVD Platform",
      list_price: 10000000,
      currency: "USD",
      stock_alert: 3,
    },
    {
      sku: "ETCH-PLASMA-TEL-TELINDYPLUS",
      upc: "076543210987",
      name: "TELINDY Plus Etch System",
      list_price: 7000000,
      currency: "USD",
      stock_alert: 2,
    },
    {
      sku: "CLEAN-WAFER-TEL-ACT12",
      upc: "076543210988",
      name: "ACT 12 Wafer Cleaning",
      list_price: 4000000,
      currency: "USD",
      stock_alert: 1,
    },
    {
      sku: "PHOTO-COAT-TEL-LITHIUSPROZ",
      upc: "076543210989",
      name: "Lithius Pro Z Coater Developer",
      list_price: 9000000,
      currency: "USD",
      stock_alert: 0,
    },
    {
      sku: "ETCH-DRY-LAM-KIYO45",
      upc: "034567654321",
      name: "Kiyo45 Dry Etch System",
      list_price: 6000000,
      currency: "USD",
      stock_alert: 4,
    },
    {
      sku: "INSPEC-PLASMA-LAM-SENSEI",
      upc: "034567654322",
      name: "Sensei Plasma Inspection Platform",
      list_price: 4500000,
      currency: "USD",
      stock_alert: 2,
    },
    {
      sku: "ETCH-CONTACT-LAM-VERSYS2300",
      upc: "034567654323",
      name: "2300 Versys Contact Etcher",
      list_price: 5000000,
      currency: "USD",
      stock_alert: 1,
    },
    {
      sku: "INSPEC-ELECTRON-KLA-EBEAM5",
      upc: "023456789012",
      name: "eBeam 5 Electron Inspection",
      list_price: 6000000,
      currency: "USD",
      stock_alert: 0,
    },
    {
      sku: "INSPEC-LAYER-KLA-2925",
      upc: "023456789013",
      name: "2925 Series Layer Inspection",
      list_price: 3000000,
      currency: "USD",
      stock_alert: 2,
    },
    {
      sku: "INSPEC-DEFECT-KLA-SP7XP",
      upc: "023456789014",
      name: "SP7XP Defect Review",
      list_price: 4000000,
      currency: "USD",
      stock_alert: 5,
    },
    {
      sku: "WAFER-STD-SUMCO-300PRIME",
      upc: "490123456789",
      name: "Prime Silicon Wafer 300mm",
      list_price: 120,
      currency: "USD",
      stock_alert: 10,
    },
    {
      sku: "WAFER-EPI-SUMCO-300EPI",
      upc: "490123456790",
      name: "EPI Silicon Wafer 300mm",
      list_price: 160,
      currency: "USD",
      stock_alert: 8,
    },
    {
      sku: "WAFER-TEST-SUMCO-200TEST",
      upc: "490123456791",
      name: "Test Silicon Wafer 200mm",
      list_price: 60,
      currency: "USD",
      stock_alert: 6,
    },
    {
      sku: "WAFER-UFLAT-SHIN-300UF",
      upc: "490987654321",
      name: "Ultra Flat Silicon Wafer 300mm",
      list_price: 150,
      currency: "USD",
      stock_alert: 2,
    },
    {
      sku: "WAFER-SOI-SHIN-SOI",
      upc: "490987654322",
      name: "Silicon on Insulator Wafer",
      list_price: 220,
      currency: "USD",
      stock_alert: 1,
    },
    {
      sku: "WAFER-LDD-SHIN-LDDW",
      upc: "490987654323",
      name: "Low Defect Density Wafer",
      list_price: 180,
      currency: "USD",
      stock_alert: 0,
    },
    {
      sku: "WAFER-EPI-GWA-EPI300",
      upc: "471234567890",
      name: "Epitaxial Wafer 300mm",
      list_price: 180,
      currency: "USD",
      stock_alert: 3,
    },
    {
      sku: "WAFER-POL-GWA-POL200",
      upc: "471234567891",
      name: "Polished Wafer 200mm",
      list_price: 80,
      currency: "USD",
      stock_alert: 2,
    },
    {
      sku: "WAFER-SIC-GWA-SIC",
      upc: "471234567892",
      name: "Specialty SiC Wafer",
      list_price: 500,
      currency: "USD",
      stock_alert: 1,
    },
    {
      sku: "CHEM-ACID-BASF-HFUP",
      upc: "400123456789",
      name: "Ultra High Purity HF Acid",
      list_price: 75,
      currency: "USD",
      stock_alert: 0,
    },
    {
      sku: "CHEM-REMOVER-BASF-PRR600",
      upc: "400123456790",
      name: "Photoresist Remover AR 600-71",
      list_price: 300,
      currency: "USD",
      stock_alert: 2,
    },
    {
      sku: "CHEM-DEVELOPER-BASF-AZ400K",
      upc: "400123456791",
      name: "Developer Solution AZ 400K",
      list_price: 250,
      currency: "USD",
      stock_alert: 1,
    },
    {
      sku: "CHEM-RESIST-MERCK-AZ701MI",
      upc: "402123456789",
      name: "AZ 701Mi Photoresist",
      list_price: 2000,
      currency: "USD",
      stock_alert: 0,
    },
    {
      sku: "CHEM-SLURRY-MERCK-PLANIX",
      upc: "402123456790",
      name: "Planarization Slurry Planix",
      list_price: 500,
      currency: "USD",
      stock_alert: 1,
    },
    {
      sku: "CHEM-BARC-MERCK-EUVBARC",
      upc: "402123456791",
      name: "EUV Bottom Anti Reflective Coating",
      list_price: 1500,
      currency: "USD",
      stock_alert: 2,
    },
  ];

  for (const product of products) {
    await createProduct(product, token, baseUrl);
  }

  // Seed purchases
  const purchases = [
    {
      condition: "P30",
      supplier_id: 1,
      proof_code: "F0012345",
      proof_type: "FACTA",
      created_at: "2025-03-29",
      products_details: [
        {
          batch_number: "BCH20250401",
          quantity: 1,
          unit_price: 80000000.0,
          product_id: 1,
        },
        {
          batch_number: "BCH20250402",
          quantity: 2,
          unit_price: 35000000.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P60",
      supplier_id: 2,
      proof_code: "F0056789",
      proof_type: "FACTA",
      created_at: "2025-04-02",
      products_details: [
        {
          batch_number: "BCH20250403",
          quantity: 3,
          unit_price: 4000000.0,
          product_id: 4,
        },
        {
          batch_number: "BCH20250404",
          quantity: 2,
          unit_price: 3000000.0,
          product_id: 5,
        },
        {
          batch_number: "BCH20250405",
          quantity: 1,
          unit_price: 5000000.0,
          product_id: 6,
        },
      ],
    },
    {
      condition: "P90",
      supplier_id: 3,
      proof_code: "F0078901",
      proof_type: "FACTB",
      created_at: "2025-04-05",
      products_details: [
        {
          batch_number: "BCH20250406",
          quantity: 2,
          unit_price: 3500000.0,
          product_id: 7,
        },
        {
          batch_number: "BCH20250407",
          quantity: 1,
          unit_price: 2000000.0,
          product_id: 8,
        },
      ],
    },
    {
      condition: "CTE",
      supplier_id: 4,
      proof_code: "F0012346",
      proof_type: "FACTC",
      created_at: "2025-04-08",
      products_details: [
        {
          batch_number: "BCH20250408",
          quantity: 5,
          unit_price: 3000000.0,
          product_id: 10,
        },
        {
          batch_number: "BCH20250409",
          quantity: 3,
          unit_price: 2250000.0,
          product_id: 11,
        },
      ],
    },
    {
      condition: "CDF",
      supplier_id: 5,
      proof_code: "RC004567",
      proof_type: "RECIB",
      created_at: "2025-04-12",
      products_details: [
        {
          batch_number: "BCH20250410",
          quantity: 1000,
          unit_price: 60.0,
          product_id: 13,
        },
        {
          batch_number: "BCH20250411",
          quantity: 500,
          unit_price: 80.0,
          product_id: 14,
        },
      ],
    },
    {
      condition: "P30",
      supplier_id: 1,
      proof_code: "F0034568",
      proof_type: "FACTA",
      created_at: "2025-04-26",
      products_details: [
        {
          batch_number: "BCH20250421",
          quantity: 1200,
          unit_price: 75.0,
          product_id: 16,
        },
        {
          batch_number: "BCH20250422",
          quantity: 800,
          unit_price: 110.0,
          product_id: 17,
        },
      ],
    },
    {
      condition: "P60",
      supplier_id: 2,
      proof_code: "F0078913",
      proof_type: "FACTM",
      created_at: "2025-04-28",
      products_details: [
        {
          batch_number: "BCH20250423",
          quantity: 600,
          unit_price: 90.0,
          product_id: 19,
        },
        {
          batch_number: "BCH20250424",
          quantity: 500,
          unit_price: 40.0,
          product_id: 20,
        },
      ],
    },
    {
      condition: "DBA",
      supplier_id: 3,
      proof_code: "F0098766",
      proof_type: "FACTE",
      created_at: "2025-04-30",
      products_details: [
        {
          batch_number: "BCH20250425",
          quantity: 150,
          unit_price: 75.0,
          product_id: 22,
        },
        {
          batch_number: "BCH20250426",
          quantity: 250,
          unit_price: 300.0,
          product_id: 23,
        },
      ],
    },
  ];

  // Create initial purchases
  for (const purchase of purchases) {
    await createPurchase(purchase, token, baseUrl);
  }

  // Seed clients
  const clients = [
    {
      code: "CLUSA001",
      name: "Dell Technologies",
      country: "United States",
      address: {
        town: "Round Rock",
        street: "Dell Way",
        number: 1,
        floor: 3,
        departament: "A",
        zip_code: "78682",
        observations: "Headquarters",
      },
      phone: "1 800 999 3355",
      mail: "purchasing@dell.com",
      web: "https://www.dell.com",
      description: "Major PC manufacturer and server integrator.",
      doc_type: 80,
      doc_number: "20987654321",
      preferred_cbte_type: 1,
      preferred_vat_type: 5,
      company_id: 1, // Replace with actual company_id
    },
    {
      code: "CLUSA002",
      name: "HP Inc.",
      country: "United States",
      address: {
        town: "Palo Alto",
        street: "Page Mill Rd",
        number: 1501,
        floor: 5,
        departament: "B",
        zip_code: "94304",
        observations: "Corporate HQ",
      },
      phone: "1 650 857 1501",
      mail: "suppliers@hp.com",
      web: "https://www.hp.com",
      description: "Personal computing and printing leader.",
      doc_type: 80,
      doc_number: "20876543212",
      preferred_cbte_type: 1,
      preferred_vat_type: 5,
      company_id: 1, // Replace with actual company_id
    },
    {
      code: "CLCHN001",
      name: "Lenovo Group",
      country: "China",
      address: {
        town: "Beijing",
        street: "Xisanqi",
        number: 6,
        floor: 8,
        departament: "C",
        zip_code: "100085",
        observations: "Beijing HQ",
      },
      phone: "86 10 5886 8888",
      mail: "procurement@lenovo.com",
      web: "https://www.lenovo.com",
      description: "Leading global PC and mobile device manufacturer.",
      doc_type: 80,
      doc_number: "20765432103",
      preferred_cbte_type: 1,
      preferred_vat_type: 5,
      company_id: 1, // Replace with actual company_id
    },
    {
      code: "CLUSA003",
      name: "Amazon Web Services",
      country: "United States",
      address: {
        town: "Seattle",
        street: "Terry Avenue",
        number: 410,
        floor: 14,
        departament: "D",
        zip_code: "98109",
        observations: "AWS Headquarters",
      },
      phone: "1 888 280 4331",
      mail: "awsprocurement@amazon.com",
      web: "https://aws.amazon.com",
      description: "Cloud computing services and datacenter solutions.",
      doc_type: 80,
      doc_number: "20455822301",
      preferred_cbte_type: 1,
      preferred_vat_type: 5,
      company_id: 1, // Replace with actual company_id
    },
    {
      code: "CLUSA004",
      name: "Microsoft Corporation",
      country: "United States",
      address: {
        town: "Redmond",
        street: "One Microsoft Way",
        number: 1,
        floor: 2,
        departament: "E",
        zip_code: "98052",
        observations: "Main Campus",
      },
      phone: "1 425 882 8080",
      mail: "supplier@microsoft.com",
      web: "https://www.microsoft.com",
      description: "Leading software, cloud, and hardware provider.",
      doc_type: 80,
      doc_number: "20543210985",
      preferred_cbte_type: 1,
      preferred_vat_type: 5,
      company_id: 1, // Replace with actual company_id
    },
  ];

  for (const client of clients) {
    await createClient(client, token, baseUrl);
  }

  // Seed sales
  const sales = [
    {
      condition: "P30",
      client_id: 1,
      proof_code: "F1001234",
      proof_type: "FACTA",
      created_at: "2025-03-30",
      products_details: [
        {
          batch_number: "SAL20250401",
          quantity: 15000,
          unit_price: 1500.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250402",
          quantity: 9000,
          unit_price: 1480.0,
          product_id: 14,
        },
      ],
    },
    {
      condition: "P60",
      client_id: 2,
      proof_code: "F1005678",
      proof_type: "FACTA",
      created_at: "2025-04-03",
      products_details: [
        {
          batch_number: "SAL20250403",
          quantity: 6000,
          unit_price: 1510.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250404",
          quantity: 4500,
          unit_price: 1495.0,
          product_id: 16,
        },
      ],
    },
    {
      condition: "P90",
      client_id: 3,
      proof_code: "F1008912",
      proof_type: "FACTB",
      created_at: "2025-04-06",
      products_details: [
        {
          batch_number: "SAL20250405",
          quantity: 24000,
          unit_price: 1450.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250406",
          quantity: 19200,
          unit_price: 1440.0,
          product_id: 17,
        },
      ],
    },
    {
      condition: "CTE",
      client_id: 4,
      proof_code: "F1012345",
      proof_type: "FACTC",
      created_at: "2025-04-10",
      products_details: [
        {
          batch_number: "SAL20250407",
          quantity: 1200,
          unit_price: 17000.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250408",
          quantity: 480,
          unit_price: 16800.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 5,
      proof_code: "F1016789",
      proof_type: "FACTA",
      created_at: "2025-04-16",
      products_details: [
        {
          batch_number: "SAL20250409",
          quantity: 720,
          unit_price: 17200.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250410",
          quantity: 240,
          unit_price: 16900.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 1,
      proof_code: "F1012346",
      proof_type: "FACTA",
      created_at: "2025-04-20",
      products_details: [
        {
          batch_number: "SAL20250411",
          quantity: 9000,
          unit_price: 1500.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250412",
          quantity: 6000,
          unit_price: 1480.0,
          product_id: 14,
        },
      ],
    },
    {
      condition: "P60",
      client_id: 2,
      proof_code: "F1015678",
      proof_type: "FACTA",
      created_at: "2025-04-22",
      products_details: [
        {
          batch_number: "SAL20250413",
          quantity: 12000,
          unit_price: 1510.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250414",
          quantity: 9000,
          unit_price: 1495.0,
          product_id: 16,
        },
      ],
    },
    {
      condition: "P90",
      client_id: 3,
      proof_code: "F1018912",
      proof_type: "FACTB",
      created_at: "2025-04-25",
      products_details: [
        {
          batch_number: "SAL20250415",
          quantity: 18000,
          unit_price: 1450.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250416",
          quantity: 14400,
          unit_price: 1440.0,
          product_id: 17,
        },
      ],
    },
    {
      condition: "CTE",
      client_id: 4,
      proof_code: "F1022345",
      proof_type: "FACTC",
      created_at: "2025-04-28",
      products_details: [
        {
          batch_number: "SAL20250417",
          quantity: 900,
          unit_price: 17000.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250418",
          quantity: 360,
          unit_price: 16800.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 5,
      proof_code: "F1026789",
      proof_type: "FACTA",
      created_at: "2025-04-30",
      products_details: [
        {
          batch_number: "SAL20250419",
          quantity: 540,
          unit_price: 17200.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250420",
          quantity: 180,
          unit_price: 16900.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 1,
      proof_code: "F1023456",
      proof_type: "FACTA",
      created_at: "2025-05-02",
      products_details: [
        {
          batch_number: "SAL20250421",
          quantity: 12000,
          unit_price: 1500.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250422",
          quantity: 8000,
          unit_price: 1480.0,
          product_id: 14,
        },
      ],
    },
    {
      condition: "P60",
      client_id: 2,
      proof_code: "F1027890",
      proof_type: "FACTA",
      created_at: "2025-05-05",
      products_details: [
        {
          batch_number: "SAL20250423",
          quantity: 16000,
          unit_price: 1510.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250424",
          quantity: 12000,
          unit_price: 1495.0,
          product_id: 16,
        },
      ],
    },
    {
      condition: "P90",
      client_id: 3,
      proof_code: "F1031234",
      proof_type: "FACTB",
      created_at: "2025-05-08",
      products_details: [
        {
          batch_number: "SAL20250425",
          quantity: 24000,
          unit_price: 1450.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250426",
          quantity: 19200,
          unit_price: 1440.0,
          product_id: 17,
        },
      ],
    },
    {
      condition: "CTE",
      client_id: 4,
      proof_code: "F1035678",
      proof_type: "FACTC",
      created_at: "2025-05-12",
      products_details: [
        {
          batch_number: "SAL20250427",
          quantity: 1200,
          unit_price: 17000.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250428",
          quantity: 480,
          unit_price: 16800.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 5,
      proof_code: "F1039012",
      proof_type: "FACTA",
      created_at: "2025-05-15",
      products_details: [
        {
          batch_number: "SAL20250429",
          quantity: 720,
          unit_price: 17200.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250430",
          quantity: 240,
          unit_price: 16900.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 1,
      proof_code: "F1041234",
      proof_type: "FACTA",
      created_at: "2025-05-18",
      products_details: [
        {
          batch_number: "SAL20250431",
          quantity: 15000,
          unit_price: 1500.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250432",
          quantity: 9000,
          unit_price: 1480.0,
          product_id: 14,
        },
      ],
    },
    {
      condition: "P60",
      client_id: 2,
      proof_code: "F1045678",
      proof_type: "FACTA",
      created_at: "2025-05-20",
      products_details: [
        {
          batch_number: "SAL20250433",
          quantity: 8000,
          unit_price: 1510.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250434",
          quantity: 6000,
          unit_price: 1495.0,
          product_id: 16,
        },
      ],
    },
    {
      condition: "P90",
      client_id: 3,
      proof_code: "F1048912",
      proof_type: "FACTB",
      created_at: "2025-05-22",
      products_details: [
        {
          batch_number: "SAL20250435",
          quantity: 20000,
          unit_price: 1450.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250436",
          quantity: 16000,
          unit_price: 1440.0,
          product_id: 17,
        },
      ],
    },
    {
      condition: "CTE",
      client_id: 4,
      proof_code: "F1052345",
      proof_type: "FACTC",
      created_at: "2025-05-25",
      products_details: [
        {
          batch_number: "SAL20250437",
          quantity: 1000,
          unit_price: 17000.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250438",
          quantity: 400,
          unit_price: 16800.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 5,
      proof_code: "F1056789",
      proof_type: "FACTA",
      created_at: "2025-05-28",
      products_details: [
        {
          batch_number: "SAL20250439",
          quantity: 600,
          unit_price: 17200.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250440",
          quantity: 200,
          unit_price: 16900.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 1,
      proof_code: "F1059012",
      proof_type: "FACTA",
      created_at: "2025-05-30",
      products_details: [
        {
          batch_number: "SAL20250441",
          quantity: 10000,
          unit_price: 1500.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250442",
          quantity: 7000,
          unit_price: 1480.0,
          product_id: 14,
        },
      ],
    },
    {
      condition: "P60",
      client_id: 2,
      proof_code: "F1061234",
      proof_type: "FACTA",
      created_at: "2025-06-02",
      products_details: [
        {
          batch_number: "SAL20250443",
          quantity: 14000,
          unit_price: 1510.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250444",
          quantity: 10000,
          unit_price: 1495.0,
          product_id: 16,
        },
      ],
    },
    {
      condition: "P90",
      client_id: 3,
      proof_code: "F1065678",
      proof_type: "FACTB",
      created_at: "2025-06-05",
      products_details: [
        {
          batch_number: "SAL20250445",
          quantity: 22000,
          unit_price: 1450.0,
          product_id: 13,
        },
        {
          batch_number: "SAL20250446",
          quantity: 18000,
          unit_price: 1440.0,
          product_id: 17,
        },
      ],
    },
    {
      condition: "CTE",
      client_id: 4,
      proof_code: "F1069012",
      proof_type: "FACTC",
      created_at: "2025-06-08",
      products_details: [
        {
          batch_number: "SAL20250447",
          quantity: 1100,
          unit_price: 17000.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250448",
          quantity: 440,
          unit_price: 16800.0,
          product_id: 2,
        },
      ],
    },
    {
      condition: "P30",
      client_id: 5,
      proof_code: "F1071234",
      proof_type: "FACTA",
      created_at: "2025-06-12",
      products_details: [
        {
          batch_number: "SAL20250449",
          quantity: 660,
          unit_price: 17200.0,
          product_id: 1,
        },
        {
          batch_number: "SAL20250450",
          quantity: 220,
          unit_price: 16900.0,
          product_id: 2,
        },
      ],
    },
  ];

  // Create sales
  for (const sale of sales) {
    await createSale(sale, token, baseUrl);
  }

  // Seed roles
  const roles = [
    {
      name: "Counter",
      movements_view: true,
      movements_edit: false,
      employees_view: false,
      employees_edit: false,
      contact_view: true,
      contact_edit: false,
      billing_view: true,
      Billing_edit: true,
      inventory_view: true,
    },
  ];

  // Create roles
  for (const role of roles) {
    await createRole(role, token, baseUrl);
  }

  // Seed invites
  const invites = [
    {
      username: "adam_taylor",
      employeeRole: 1,
    },
  ];

  // Create invites
  for (const invite of invites) {
    await createInvite(invite, token, baseUrl);
  }

  // Create ghost purchases for products that were sold but not purchased
  await createGhostPurchasesForSales(sales, purchases, token, baseUrl);
}

seedDatabase();
