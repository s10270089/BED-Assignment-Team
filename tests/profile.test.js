const request = require("supertest");
const app = require("../app");  // Assuming your Express app is here
const jwt = require("jsonwebtoken");

// Generate a token for testing
const token = jwt.sign({ user_id: 1 }, process.env.JWT_SECRET);

describe("Profile Update Test Suite", () => {
  
  it("PUT /userprofiles/user/:id should update profile successfully", async () => {
    const updatedData = {
      name: "Updated Name",
      birthday: "1990-01-01",
      password: "newPassword123",  // Only if you're updating the password
    };

    const res = await request(app)
      .put("/userprofiles/user/1")  // Assuming userId 1
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Profile updated successfully!");
  });

  it("PUT /userprofiles/user/:id should return 401 if no JWT is provided", async () => {
    const updatedData = {
      name: "Updated Name",
      birthday: "1990-01-01",
    };

    const res = await request(app)
      .put("/userprofiles/user/1")
      .send(updatedData);  // No JWT token in header

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("PUT /userprofiles/user/:id should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .put("/userprofiles/user/1")
      .set("Authorization", `Bearer ${token}`)
      .send({});  // Sending empty data

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Name and birthday are required.");
  });

  it("PUT /userprofiles/user/:id should handle database errors gracefully", async () => {
    const updatedData = {
      name: "Updated Name",
      birthday: "1990-01-01",
    };

    // Mock database failure (if applicable, depending on your setup)
    // Example: jest.spyOn(UserModel, 'findByIdAndUpdate').mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .put("/userprofiles/user/1")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.statusCode).toBe(500);  // Expect server error for database failure
    expect(res.body).toHaveProperty("error");
  });
});
