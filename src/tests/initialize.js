import fetch from "node-fetch";
import dotenv from "dotenv";
import pkg from "pg";
const { Client } = pkg;
import fs from "fs/promises";
import { sales } from "./datasets/sales.js";
import { suppliers } from "./datasets/suppliers.js";
import { clients } from "./datasets/clients.js";
import { products } from "./datasets/products.js";
import { purchases } from "./datasets/purchases.js";

dotenv.config();

const internalApiPort = process.env.PORT || 3001;
const baseUrl = `http://localhost:${internalApiPort}`;

async function resetDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
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

export async function seedDatabase() {
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
      name: "Lam Research",
      country: "United States",
      address: {
        town: "Fremont, California",
        street: "Cushing Parkway",
        number: "4650",
        zip_code: "94538",
      },
      phone: "1 510 572 0200",
      mail: "lamresearch@lam.com",
      web: "https://www.lamresearch.com",
      CUIT: "20987654321",
      description: "Semiconductor process equipment for wafer fabrication.",
    },
  ];

  for (const supplier of suppliers) {
    await createSupplier(supplier, token, baseUrl);
  }

  //send products
  for (const product of products) {
    await createProduct(product, token, baseUrl);
  }

  // Seed purchases
  for (const purchase of purchases) {
    await createPurchase(purchase, token, baseUrl);
  }

  // Seed clients
  for (const client of clients) {
    await createClient(client, token, baseUrl);
  }

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
