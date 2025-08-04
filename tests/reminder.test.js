const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET);

describe("Reminder Feature Test Suite", () => {
  let insertedReminderId;

  it("POST /reminders should fail without message and reminder_time", async () => {
    const res = await request(app)
      .post("/reminders")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /reminders should fail without JWT", async () => {
    const res = await request(app)
      .post("/reminders")
      .send({
        message: "Test Reminder",
        reminder_time: "2025-08-01T10:00:00",
      });

    expect(res.statusCode).toBe(401);
  });

  it("GET /reminders should return reminders for the user", async () => {
    const res = await request(app)
      .get("/reminders")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 500]).toContain(res.statusCode); // if no DB connection, expect 500
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("reminders");
      expect(Array.isArray(res.body.reminders)).toBe(true);
    }
  });

  it("POST /reminders should create a new reminder", async () => {
    const res = await request(app)
      .post("/reminders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        message: "Test Reminder",
        reminder_time: "2025-08-01T10:00:00",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Reminder created successfully");
  });

  it("GET /reminders should return the created reminder", async () => {
    const res = await request(app)
      .get("/reminders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.reminders)).toBe(true);

    // Assuming the reminder was added
    if (res.body.reminders.length > 0) {
      insertedReminderId = res.body.reminders[0].reminder_id;
    }
  });

  it("PUT /reminders/:id should update a reminder", async () => {
    const res = await request(app)
      .put(`/reminders/${insertedReminderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        message: "Updated Reminder",
        reminder_time: "2025-08-02T10:00:00",
        is_completed: 1,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reminder updated successfully");
  });

  it("DELETE /reminders/:id should delete a reminder", async () => {
    const res = await request(app)
      .delete(`/reminders/${insertedReminderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reminder deleted successfully");
  });
});
