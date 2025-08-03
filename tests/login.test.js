const request = require("supertest");
const app = require("../app");

describe("Login API", () => {
  it("POST /login should succeed with correct credentials", async () => {
    const res = await request(app).post("/login").send({
      email: "braden@example.com",
      password: "Braden123"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("POST /login should fail with wrong password", async () => {
    const res = await request(app).post("/login").send({
      email: "braden@example.com",
      password: "wrongpassword"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /login should fail with missing fields", async () => {
    const res = await request(app).post("/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });
});
