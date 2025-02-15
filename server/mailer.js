const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email (set in .env)
    pass: process.env.EMAIL_PASS, // Your email password (set in .env)
  },
});

module.exports = transporter;
