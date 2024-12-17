const express = require("express");
const routes = require("./routes/index");
const config = require("./config/db");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Rate limiting (Spam koruması)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Maksimum 100 istek
  message: "Çok fazla istek yaptınız. Lütfen daha sonra tekrar deneyin.",
});
app.use("/api/contact", limiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

config.ConnectDB();

app.use("/api", routes);
app.listen(PORT, () => {
  console.log(`We're on port ${PORT}`);
});
