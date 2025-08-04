const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET);

describe("Dashboard Feature Test Suite", () => {
  let userId;

  it("GET /dashboard/data should fail without JWT", async () => {
    const res = await request(app).get("/dashboard/data");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("msg", "No token, authorization denied");
  });

  it("GET /dashboard/data should return user data with valid JWT", async () => {
    const res = await request(app)
      .get("/dashboard/data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("userInfo");
    expect(res.body).toHaveProperty("healthRecords");
    expect(res.body).toHaveProperty("medications");
    expect(res.body).toHaveProperty("friendsList");
    expect(res.body).toHaveProperty("upcomingEvents");
    expect(res.body).toHaveProperty("reminders");
    expect(res.body).toHaveProperty("appointments");
  });

  it("GET /dashboard/data should return user info (name, birthday, BMI)", async () => {
    const res = await request(app)
      .get("/dashboard/data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.userInfo).toHaveProperty("name");
    expect(res.body.userInfo).toHaveProperty("birthday");
    expect(res.body.userInfo).toHaveProperty("bmi");
    expect(res.body.userInfo).toHaveProperty("profile_photo_url");
  });

  it("GET /dashboard/data should return health records data", async () => {
    const res = await request(app)
      .get("/dashboard/data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    if (res.body.healthRecords.length > 0) {
      expect(Array.isArray(res.body.healthRecords)).toBe(true);
      expect(res.body.healthRecords[0]).toHaveProperty("allergies");
      expect(res.body.healthRecords[0]).toHaveProperty("diagnosis");
    }
  });

  it("GET /dashboard/data should return medications data", async () => {
    const res = await request(app)
      .get("/dashboard/data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    if (res.body.medications.length > 0) {
      expect(Array.isArray(res.body.medications)).toBe(true);
      expect(res.body.medications[0]).toHaveProperty("name");
      expect(res.body.medications[0]).toHaveProperty("frequency");
    }
  });

  it("GET /dashboard/data should return friends list data", async () => {
    const res = await request(app)
      .get("/dashboard/data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    if (res.body.friendsList.length > 0) {
      expect(Array.isArray(res.body.friendsList)).toBe(true);
      expect(res.body.friendsList[0]).toHaveProperty("name");
    }
  });

  it("GET /dashboard/data should return upcoming events", async () => {
    const res = await request(app)
      .get("/dashboard/data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    if (res.body.upcomingEvents.length > 0) {
      expect(Array.isArray(res.body.upcomingEvents)).toBe(true);
      expect(res.body.upcomingEvents[0]).toHaveProperty("title");
      expect(res.body.upcomingEvents[0]).toHaveProperty("event_start_time");
    }
  });

  it("GET /dashboard/data should return reminders data", async () => {
    const res = await request(app)
      .get("/dashboard/data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    if (res.body.reminders.length > 0) {
      expect(Array.isArray(res.body.reminders)).toBe(true);
      expect(res.body.reminders[0]).toHaveProperty("message");
      expect(res.body.reminders[0]).toHaveProperty("reminder_time");
    }
  });

  it("GET /dashboard/data should return appointments data", async () => {
    const res = await request(app)
      .get("/dashboard/data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    if (res.body.appointments.length > 0) {
      expect(Array.isArray(res.body.appointments)).toBe(true);
      expect(res.body.appointments[0]).toHaveProperty("doctor_name");
      expect(res.body.appointments[0]).toHaveProperty("appointment_date");
    }
  });
});
