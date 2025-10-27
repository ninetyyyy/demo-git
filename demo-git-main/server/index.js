// server/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import "./googleAuth2/auth.js"; // Passport Google strategy

// --- 1. Initial Setup ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// --- 2. Middleware ---
app.use(
  cors({
    origin: "http://localhost:5000", // อนุญาตให้ frontend ที่พอร์ต 3000 เรียกได้
    credentials: true,
  })
);
app.use(express.json());

// --- 3. Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- 4. Session and Passport Setup ---
console.log("ค่า SECRET ที่เซิร์ฟเวอร์เห็นคือ:", process.env.SESSION_SECRET);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // localhost ใช้ http
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- 5. Routes ---
// ทดสอบว่า backend ทำงาน
app.get("/", (req, res) => {
  res.send(
    `<h2>🚀 Backend is running!</h2><a href="/auth/google">Login with Google</a>`
  );
});

// เริ่มกระบวนการล็อกอินกับ Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Callback หลังล็อกอินสำเร็จ → เปลี่ยนให้ไป Dashboard
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5000/demo-git/login",
  }),
  (req, res) => {
    // เดิม: /demo-git/profile
    res.redirect("http://localhost:5000/demo-git/dashboard");
  }
);

// เช็กสถานะการล็อกอิน (optional)
app.get("/auth/status", (req, res) => {
  if (req.user) {
    res.status(200).json({ loggedIn: true, user: req.user });
  } else {
    res.status(201).json({ loggedIn: false });
  }
});

// ส่งข้อมูลผู้ใช้ที่ล็อกอินอยู่
app.get("/api/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ user: null });
  }
});

// Logout แล้วพากลับหน้า login
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() =>
      res.redirect("http://localhost:5000/demo-git/login")
    );
  });
});

// --- 6. Start Server ---
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
