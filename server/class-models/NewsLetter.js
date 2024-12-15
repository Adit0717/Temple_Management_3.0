const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
  emailId: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

const NewsLetter = mongoose.model("NewsLetter", newsletterSchema);

module.exports = NewsLetter;
