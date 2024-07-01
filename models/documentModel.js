const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  originalfileName: { type: String, required: true },
  optionalFileName: { type: String },
  uploadedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    idNumber: { type: String },
  },
  dateOfUpload: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
