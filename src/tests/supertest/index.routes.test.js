import request from "supertest";
import app from "../../app.js";
import { pool } from "../../db.js";
import { setupTest, loginAsUser } from "../utils/helpers.js";

setupTest(pool);

describe("GET /", () => {
  it('should respond with a json object containing "API is running"', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "API is running" });
  });
});
