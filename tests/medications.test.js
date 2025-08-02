const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET);

describe("Medication API", () => {
  it("GET /medications should return an array", async () => {
    const res = await request(app)
      .get("/medications")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /medications should create a new medication", async () => {
    const res = await request(app)
      .post("/medications")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "TestMed",
        dosage: "2 pills",
        time: "Evening",
        frequency: "Daily"
      });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Medication created");
  });
});
