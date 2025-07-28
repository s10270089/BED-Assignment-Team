const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET);

describe("Bus API", () => {
  it("POST /bus/search should return results for valid bus stop", async () => {
    const res = await request(app)
      .post("/bus/search")
      .set("Authorization", `Bearer ${token}`)
      .send({ busStopCode: "83139" }); // use a real SG bus stop code

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("results");
  });

  it("POST /bus/search should fail with missing bus stop", async () => {
    const res = await request(app)
      .post("/bus/search")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
