import request from "supertest";
import app from "../../app.js";
import { pool } from "../../db.js";
import { setupTest, loginAsUser } from "../utils/helpers.js";

setupTest(pool);

describe("Company creation flow", () => {
  let token;
  let createdCompany;
  const companyData = {
    name: "Test Company AI",
    email: "testcompanyai@example.com",
    cuit: "30712345678",
    app_password: "companypass2025",
    country: "Argentina",
    industry: "Software"
  };

  beforeAll(async () => {
    token = await loginAsUser("greg_lavender", "intelbanda2025");
  });

  it("should create a company and verify it exists", async () => {
    // Create company
    const createRes = await request(app)
      .post("/company/post")
      .set("Authorization", `Bearer ${token}`)
      .send(companyData);
    expect(createRes.status).toBe(200);
    expect(createRes.body).toHaveProperty("id");
    expect(createRes.body.name).toBe(companyData.name);
    createdCompany = createRes.body;

    // Get all companies for user
    const getAllRes = await request(app)
      .get("/company/get-all")
      .set("Authorization", `Bearer ${token}`);
    expect(getAllRes.status).toBe(200);
    const found = getAllRes.body.find(c => c.id === createdCompany.id);
    expect(found).toBeDefined();
    expect(found.name).toBe(companyData.name);

    // Get company by ID
    const getByIdRes = await request(app)
      .get(`/company/get/${createdCompany.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getByIdRes.status).toBe(200);
    expect(getByIdRes.body).toHaveProperty("id", createdCompany.id);
    expect(getByIdRes.body.name).toBe(companyData.name);
  });

  it("should not allow creating a company with duplicate keys", async () => {
    // Try to create the same company again
    const duplicateRes = await request(app)
      .post("/company/post")
      .set("Authorization", `Bearer ${token}`)
      .send(companyData);
    expect(duplicateRes.status).toBe(400);
    expect(duplicateRes.body).toHaveProperty("error");
    expect(
      duplicateRes.body.error.toLowerCase()
    ).toMatch(/already exists|already in use/);
  });

  it("should create a second company and get both companies", async () => {
    const secondCompanyData = {
      name: `Test Company AI 2`,
      email: `testcompanyai2@example.com`,
      cuit: "30712345679",
      app_password: "companypass2025",
      country: "Argentina",
      industry: "Software"
    };
    // Create second company
    const createRes2 = await request(app)
      .post("/company/post")
      .set("Authorization", `Bearer ${token}`)
      .send(secondCompanyData);
    expect(createRes2.status).toBe(200);
    expect(createRes2.body).toHaveProperty("id");
    const createdCompany2 = createRes2.body;

    // Get all companies for user
    const getAllRes = await request(app)
      .get("/company/get-all")
      .set("Authorization", `Bearer ${token}`);
    expect(getAllRes.status).toBe(200);
    const found1 = getAllRes.body.find(c => c.id === createdCompany.id);
    const found2 = getAllRes.body.find(c => c.id === createdCompany2.id);
    expect(found1).toBeDefined();
    expect(found2).toBeDefined();
    expect(found1.name).toBe(companyData.name);
    expect(found2.name).toBe(secondCompanyData.name);

    // Cleanup second company
    await pool.query('DELETE FROM company WHERE id = $1', [createdCompany2.id]);
  });

  afterAll(async () => {
    console.log("Cleaning up test data...");
    if (createdCompany && createdCompany.id) {
      console.log(`Deleting company with ID: ${createdCompany.id}`);
      await pool.query('DELETE FROM company WHERE id = $1', [createdCompany.id]);
    }
  });
});
