const request = require("supertest");
const app = require("../app");

describe("Signup API", () => {
  const baseUser = {
    name: "NewTestUser",
    password: "StrongPass123",
    confirmPassword: "StrongPass123",
    heightValue: 170,
    heightUnit: "cm",
    weightValue: 60,
    weightUnit: "kg",
    birthday: "1990-01-01",
    gender: "male",
    profile_photo_url: "http://example.com/photo.jpg"
  };

  const makeUniqueUser = () => ({
    ...baseUser,
    email: `testuser${Date.now()}@example.com`,
  });

  it("POST /signup should create a new user", async () => {
    const res = await request(app)
      .post("/signup")
      .send(makeUniqueUser());

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("message", "Registration successful.");
    expect(res.body).toHaveProperty("user_id");
  });

  it("POST /signup should fail with missing required fields", async () => {
    const res = await request(app).post("/signup").send({});

    expect([400, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("error", "Registration failed.");
    expect(res.body).toHaveProperty("details");
  });

  it("POST /signup should fail for duplicate email", async () => {
    const user = makeUniqueUser();

    await request(app).post("/signup").send(user);
    const res = await request(app).post("/signup").send(user);

    expect([400, 409]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("error", "Email already registered.");
  });
});
