require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../app");
const sgMail = require("@sendgrid/mail");
const User = require("../models/User");

jest.mock("@sendgrid/mail");

describe("User Endpoints", () => {

  afterAll(async () => {
    server.close();
  });

  it("should log in a user and send a verification email", async () => {
    const mockUser = {
        email: "test@example.com",
        idNumber: "123456789",
        role: "user",
        _id: new mongoose.Types.ObjectId(),
        FirstName: "Test",
        LastName: "User",
        gender: "זכר",
        phoneNumber: "1234567890",
        dateOfBirth: new Date("1990-01-01"),
        familyStatus: "רווק/ה",
        address: {
          street: "123 Test St",
          city: "Test City",
        },
        verificationCode: null,
        verificationCodeTimestamp: null,
      };

    User.findOne = jest.fn().mockResolvedValue(mockUser);
    User.updateOne = jest.fn().mockResolvedValue({});

    sgMail.setApiKey.mockImplementation(() => {});
    sgMail.send.mockResolvedValue({});

    const res = await request(app)
      .post("/login")
      .send({
        email: mockUser.email,
        idNumber: mockUser.idNumber,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(sgMail.send).toHaveBeenCalledWith({
      to: mockUser.email,
      from: "optimax58@gmail.com",
      subject: "קוד אימות",
      text: expect.stringContaining("קוד האימות שלך לכניסה למערכת הוא:")
    });

    expect(User.updateOne).toHaveBeenCalledWith(
      { _id: mockUser._id },
      {
        $set: {
          verificationCode: expect.any(Number),
          verificationCodeTimestamp: expect.any(Date)
        }
      }
    );
  });

  it("should resend a verification code", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const mockUser = {
      email: "test2@example.com",
      idNumber: "987654321",
      role: "user",
      _id: mockUserId,
      FirstName: "Test2",
      LastName: "User2",
      gender: "זכר",
      phoneNumber: "0987654321",
      dateOfBirth: new Date("1985-05-05"),
      familyStatus: "נשוי/ה",
      address: {
        street: "456 Test St",
        city: "Test City 2",
      },
      verificationCode: null,
      verificationCodeTimestamp: null,
    };

    User.findById = jest.fn().mockResolvedValue(mockUser);
    User.updateOne = jest.fn().mockResolvedValue({});

    sgMail.setApiKey.mockImplementation(() => {});
    sgMail.send.mockResolvedValue({});

    const res = await request(app)
      .post("/resendCode")
      .send({ UserId: mockUser._id.toString() }); // Convert UserId to string

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Verification code resent successfully."
    );
    expect(sgMail.send).toHaveBeenCalledWith({
      to: mockUser.email,
      from: "optimax58@gmail.com",
      subject: "קוד אימות",
      text: expect.stringContaining("קוד האימות שלך לכניסה למערכת הוא:"),
    });

    console.log('Expected _id:', mockUser._id.toString());
    console.log('Received _id:', User.updateOne.mock.calls[0][0]._id);
    console.log('Received update:', User.updateOne.mock.calls[0][1]);

    expect(User.updateOne).toHaveBeenCalledWith(
      { _id: mockUser._id.toString() }, // Convert _id to string for comparison
      {
        $set: expect.objectContaining({
          verificationCode: expect.any(Number),
          verificationCodeTimestamp: expect.any(Date),
        }),
      }
    );
  });

  // Add more tests here
});
