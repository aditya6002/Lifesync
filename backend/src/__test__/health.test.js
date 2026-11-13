import request from "supertest";
import app from "../app.js";

describe("GET /api/health", () => {
  it("should return a 200 status and server health details", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "server is running",
        environment: expect.any(String),
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      }),
    );
  });
});


