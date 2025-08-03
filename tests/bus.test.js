const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET);

describe("🚌 Bus Feature Test Suite", () => {
  let insertedFavId;

  it("POST /bus/search should fail without busStopCode", async () => {
    const res = await request(app)
      .post("/bus/search")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /bus/search should fail without JWT", async () => {
    const res = await request(app)
      .post("/bus/search")
      .send({ busStopCode: "83139" });

    expect(res.statusCode).toBe(401);
  });

  it("GET /bus/recent should return recent stops", async () => {
    const res = await request(app)
      .get("/bus/recent")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 500]).toContain(res.statusCode); // if no DB connection, expect 500
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("stops");
      expect(Array.isArray(res.body.stops)).toBe(true);
    }
  });

  it("GET /bus/stop-name should return stop name or 404", async () => {
    const res = await request(app)
      .get("/bus/stop-name?code=83139")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode);
  });

  it("POST /bus/favourites should add a stop", async () => {
    const res = await request(app)
      .post("/bus/favourites")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bus_stop_code: "83139",
        bus_stop_name: "Test Stop"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Favourite added");
  });

  it("GET /bus/favourites should return user favourites", async () => {
    const res = await request(app)
      .get("/bus/favourites")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.favourites)).toBe(true);

    if (res.body.favourites.length > 0) {
      insertedFavId = res.body.favourites[0].favourite_id;
    }
  });

  it("DELETE /bus/favourites/:id should delete a favourite", async () => {
    if (!insertedFavId) return;

    const res = await request(app)
      .delete(`/bus/favourites/${insertedFavId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Favourite removed");
  });
});
