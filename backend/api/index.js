const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { connectDB } = require("../config/db");

const authRouter = require("../auth/routes/auth.routes");
const applicationRouter = require("../applications/routes/application.routes");
const customerRouter = require("../customer/routes/customer.routes");
const adminRouter = require("../admin/routes/admin.routes");
const contactRouter = require("../contact/routes/contact.routes");
const paymentRouter = require("../payment/routes/payment.routes");

const app = express();

/* -------------------- DB CONNECTION (CACHED) -------------------- */
let isConnected = false;

async function initDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✅ MongoDB connected");
  }
}

app.use(async (req, res, next) => {
  await initDB();
  next();
});

/* -------------------- CORS -------------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "https://atithi-consultant-servcies-frontend.vercel.app",
  "https://www.athithconsultant.com",
  "https://athithconsultant.com",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith("/api/payments/webhook")) {
      req.rawBody = buf.toString();
    }
  },
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------- ROUTES -------------------- */
app.use("/auth", authRouter);
app.use("/applications", applicationRouter);
app.use("/customer", customerRouter);
app.use("/admin", adminRouter);
app.use("/contact", contactRouter);
app.use("/payments", paymentRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

/* -------------------- EXPORT (NO listen) -------------------- */
module.exports = app;
