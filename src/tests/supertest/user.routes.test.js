import request from "supertest";
import app from "../../app.js";
import { pool } from "../../db.js";
import { validUser } from "../utils/test_data.js";
import { setupTest, loginAsUser } from "../utils/helpers.js";

setupTest(pool);

describe("POST /user/login", () => {
  it("should login a user successfully and return a token", async () => {
    const token = await loginAsUser(validUser.identifier, validUser.password);
    expect(token).toBeDefined();
  });

  it("should fail to login with incorrect password", async () => {
    const response = await request(app).post("/user/login").send({
      identifier: "greg_lavender",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid credentials");
  });

  it("should fail to login if user does not exist", async () => {
    const response = await request(app).post("/user/login").send({
      identifier: "nonexistentuser",
      password: "anypassword",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
  });

  it("should fail to login if identifier is missing", async () => {
    const response = await request(app).post("/user/login").send({
      password: "intelbanda2025",
    });
    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty("error");
  });

  it("should fail to login if password is missing", async () => {
    const response = await request(app).post("/user/login").send({
      identifier: "greg_lavender",
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
