const request = require("supertest");
const app = require("../app");

describe("Signup API", () => {
  it("POST /signup should register a new user", async () => {
    const res = await request(app).post("/signup").send({
      name: "NewTestUser",
      email: `testuser${Date.now()}@example.com`, // unique email
      password: "mypassword",
      birthday: "1970-01-01"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Registration successful.");
  });

  it("POST /signup should fail for duplicate email", async () => {
    const res = await request(app).post("/signup").send({
      name: "Braden",
      email: "braden@example.com", // existing user
      password: "Braden123",
      birthday: "1970-01-01"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
