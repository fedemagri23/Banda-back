import request from "supertest";
import app from "../../app.js";

export const loginAsUser = async (identifier, password) => {
  const res = await request(app)
    .post("/user/login")
    .send({ identifier, password });
  return res.body.token;
};

export const setupTest = async (pool) => {
  afterAll(async () => {
    await pool.end();
  });
};
