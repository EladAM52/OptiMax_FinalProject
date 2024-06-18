const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
    unique: true,
  },
  LastName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["עובד", "מנהל", "בעלים"],
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  familyStatus: {
    type: String,
    required: false,
    enum: ["רווק/ה", "נשוי/ה", "גרוש/ה", "אלמן/ה"],
  },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
  },
  verificationCode: { 
    type: String, 
    default: null 
  },
  verificationCodeTimestamp: { 
    type: Date, 
    default: null 
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
