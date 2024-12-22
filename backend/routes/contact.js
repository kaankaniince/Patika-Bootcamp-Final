const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "İsim en az 2 karakter uzunluğunda olmalıdır." });
  }
  if (
    !email ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    return res.status(400).json({ error: "Geçersiz e-posta adresi." });
  }
  if (!subject || subject.trim().length === 0) {
    return res.status(400).json({ error: "Konu alanı gereklidir." });
  }
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: "Mesaj alanı boş olamaz." });
  }

  try {
    const outputMessage = `
    <h1>Mail Details</h1>
    <ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
    </ul>
    <h1>Message</h1>
    <p>${message}</p>
    `;

    // Configure the transporter with environment variables
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true", // Convert to boolean
      auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password or app-specific password
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === "false", // Convert to boolean
      },
      debug: process.env.SMTP_DEBUG === "true", // Enable debug if set
      logger: process.env.SMTP_LOGGER === "true", // Enable logging if set
    });

    let info = await transporter.sendMail({
      from: `"Book Store Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL, // Use recipient email from environment
      subject: `Book Store Contact Form New Message: ${subject}`,
      html: outputMessage,
    });

    res.status(200).json({ message: "Mesaj başarıyla gönderildi!" });
  } catch (error) {
    console.error("E-posta gönderim hatası:", error);
    res.status(500).json({
      error: "Mesaj gönderilemedi, lütfen daha sonra tekrar deneyin.",
    });
  }
});

module.exports = router;
