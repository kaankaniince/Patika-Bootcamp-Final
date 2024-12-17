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
    <h1>Mail Details </h1>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email:  ${req.body.email}</li>
    </ul>
    <h1>Message</h1>
    <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "kkicontact19@gmail.com",
        pass: "ajgyqvbeyfhyjbul",
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
      logger: true,
    });

    let info = await transporter.sendMail({
      from: '"Book Store Contact Form" <kkicontact19@gmail.com>',
      to: "kaankaniince@gmail.com",
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
