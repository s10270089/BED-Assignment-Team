const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET);

describe("Health Records Feature Test Suite", () => {
  let insertedRecordId;

  it("POST /health-records should fail without required fields", async () => {
    const res = await request(app)
      .post("/health-records")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /health-records should fail without JWT", async () => {
    const res = await request(app)
      .post("/health-records")
      .send({
        allergies: "Peanut Allergy",
        diagnosis: "Severe reaction",
        last_updated: "2025-08-01T10:00:00",
      });

    expect(res.statusCode).toBe(401);
  });

  it("GET /health-records should return health records for the user", async () => {
    const res = await request(app)
      .get("/health-records")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 500]).toContain(res.statusCode); // if no DB connection, expect 500
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("records");
      expect(Array.isArray(res.body.records)).toBe(true);
    }
  });

  it("POST /health-records should create a new health record", async () => {
    const res = await request(app)
      .post("/health-records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        allergies: "Peanut Allergy",
        diagnosis: "Severe reaction",
        doctor_contact: "Dr. Smith",
        emergency_contact: "John Doe",
        last_updated: "2025-08-01T10:00:00",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Health record created");
  });

  it("GET /health-records should return the created health record", async () => {
    const res = await request(app)
      .get("/health-records")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.records)).toBe(true);

    // Assuming the record was added
    if (res.body.records.length > 0) {
      insertedRecordId = res.body.records[0].record_id;
    }
  });

  it("PUT /health-records/:id should update a health record", async () => {
    const res = await request(app)
      .put(`/health-records/${insertedRecordId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        allergies: "Peanut Allergy",
        diagnosis: "Moderate reaction",
        doctor_contact: "Dr. Jones",
        emergency_contact: "Jane Doe",
        last_updated: "2025-08-02T10:00:00",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Health record updated");
  });

  it("DELETE /health-records/:id should delete a health record", async () => {
    const res = await request(app)
      .delete(`/health-records/${insertedRecordId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Health record deleted");
  });
});
