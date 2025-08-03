const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

let testUserToken = null;

beforeAll(async () => {
  const pool = await sql.connect(dbConfig);

  const hashedPassword = await bcrypt.hash("Test1234!", 10);
  const uniqueEmail = `meduser${Date.now()}@example.com`;

  const result = await pool.request()
    .input("name", sql.NVarChar, "TestMedUser")
    .input("email", sql.NVarChar, uniqueEmail)
    .input("password_hash", sql.NVarChar, hashedPassword)
    .query(`
      INSERT INTO Users (name, email, password_hash)
      OUTPUT INSERTED.user_id
      VALUES (@name, @email, @password_hash)
    `);

  const userId = result.recordset[0].user_id;

  // Login to get JWT token
  const loginRes = await request(app)
    .post("/login")
    .send({
      email: uniqueEmail,
      password: "Test1234!"
    });

  testUserToken = loginRes.body.token;
});

describe("Medication API", () => {
  it("POST /medications should create a new medication", async () => {
    const res = await request(app)
      .post("/medications")
      .set("Authorization", `Bearer ${testUserToken}`)
      .send({
        name: "Test Med",
        dosage: "100 mg",
        frequency: "2",
        time: "08:00, 20:00"
      });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.text).toBe("Medication created");
  });
});
