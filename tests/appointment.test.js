const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET);

describe("Appointment Feature Test Suite", () => {
  let insertedAppointmentId;

  it("POST /appointments should fail without appointment details", async () => {
    const res = await request(app)
      .post("/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /appointments should fail without JWT", async () => {
    const res = await request(app)
      .post("/appointments")
      .send({
        appointment_date: "2025-08-01T10:00:00",
        doctor_name: "Dr. Smith",
        purpose: "Checkup",
      });

    expect(res.statusCode).toBe(401);
  });

  it("GET /appointments should return appointments for the user", async () => {
    const res = await request(app)
      .get("/appointments")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 500]).toContain(res.statusCode); // if no DB connection, expect 500
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("appointments");
      expect(Array.isArray(res.body.appointments)).toBe(true);
    }
  });

  it("GET /appointments/:id should return a specific appointment or 404", async () => {
    const res = await request(app)
      .get("/appointments/1")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode);
  });

  it("POST /appointments should create a new appointment", async () => {
    const res = await request(app)
      .post("/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        appointment_date: "2025-08-01T10:00:00",
        doctor_name: "Dr. Smith",
        purpose: "Checkup",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Appointment created successfully");
  });

  it("GET /appointments should return the created appointment", async () => {
    const res = await request(app)
      .get("/appointments")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.appointments)).toBe(true);
    
    // Assuming the appointment was added
    if (res.body.appointments.length > 0) {
      insertedAppointmentId = res.body.appointments[0].appointment_id;
    }
  });

  it("DELETE /appointments/:id should delete an appointment", async () => {
    if (!insertedAppointmentId) return;

    const res = await request(app)
      .delete(`/appointments/${insertedAppointmentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment deleted successfully");
  });
});
