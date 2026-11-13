import { jest } from "@jest/globals";

jest.unstable_mockModule("../models/auth/user.model.js", () => {
  const User = jest.fn(function (data = {}) {
    Object.assign(this, data);

    this._id = "mocked_user_id";
    this.profilePic = this.profilePic || "default.png";
    this.appLanguage = this.appLanguage || "en";
  });

  User.findOne = jest.fn();

  User.prototype.save = jest.fn();

  return {
    default: User,
  };
});

jest.unstable_mockModule("../services/email.services.js", () => ({
  default: {
    sendOTP: jest.fn(),
  },
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    genSalt: jest.fn().mockResolvedValue("salt"),
    hash: jest.fn().mockResolvedValue("hashed_value"),
  },
}));

jest.unstable_mockModule("../helper/getOTP.js", () => ({
  default: jest.fn().mockResolvedValue("123456"),
}));

const request = (await import("supertest")).default;

const app = (await import("../app.js")).default;

const User = (await import("../models/auth/user.model.js")).default;

const emailService = (await import("../services/email.services.js")).default;

const bcrypt = (await import("bcrypt")).default;

const validPayload = {
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  password: "SecurePassword@123",
  confirmPassword: "SecurePassword@123",
  gender: "male",
  profession: "developer",
};

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
  });

  it("should return a 201 status and a new user details upon successful registration", async () => {
    User.findOne.mockResolvedValue(null);

    User.prototype.save.mockResolvedValue({
      _id: "mocked_user_id",
      username: "johndoe",
      profilePic: "default.png",
      appLanguage: "en",
    });

    emailService.sendOTP.mockResolvedValue(true);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(validPayload);

    if (response.statusCode !== 201) {
      console.log("\n========== REGISTER ERROR ==========");

      console.log("Status:", response.statusCode);

      console.log("Body:", response.body);

      console.log("====================================\n");
    }

    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: "User registered successfully",

        user: expect.objectContaining({
          id: expect.any(String),
          profilePic: expect.any(String),
          username: expect.any(String),
          appLanguage: expect.any(String),
        }),

        token: expect.any(String),
      }),
    );

    expect(response.headers["set-cookie"]).toBeDefined();

    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("refreshToken"),
        expect.stringContaining("accessToken"),
      ]),
    );

    expect(User.findOne).toHaveBeenCalled();

    expect(User.prototype.save).toHaveBeenCalled();

    expect(emailService.sendOTP).toHaveBeenCalled();
  });

  it("should return a 400 status if the username already exists", async () => {
    User.findOne.mockResolvedValueOnce({
      username: "johndoe",
    });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(validPayload);

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe("Username already exists");

    expect(User.prototype.save).not.toHaveBeenCalled();
  });
});
