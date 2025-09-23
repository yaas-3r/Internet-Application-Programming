const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     
  password: "Twitchtv3cripz",      
  database: "otp_demo"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yaasirmohammad397@gmail.com",     
    pass: "bwkf jqtp evas vsud"         
  }
});

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}



// Signup route
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  db.query("INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "User already exists" });
        }
        return res.status(500).json({ message: "Error registering user" });
      }
      res.json({ message: "✅ User registered successfully!" });
    }
  );
});

// Login (send OTP)
app.post("/auth", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const otp = generateOTP();
      db.query("INSERT INTO otps (email, otp) VALUES (?, ?)", [email, otp]);

      // Send email with styled template
      transporter.sendMail({
        from: '"Secure Login System" <your-email@gmail.com>',
        to: email,
        subject: "Your One-Time Password (OTP)",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #007BFF;">Hello,</h2>
            <p style="font-size: 16px; color: #333;">
              This is your <strong>One-Time Password (OTP)</strong> for login:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #000; padding: 10px 20px; background: #eee; border-radius: 6px; display: inline-block;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              ⚠️ Do not share this code with anyone.<br>
              ⏳ This OTP will expire in <strong>5 minutes</strong>.<br>
              If you did not request this, please ignore this email.
            </p>
            <p style="font-size: 14px; color: #333;">Thanks,<br>Secure Login System</p>
          </div>
        `
      });

      res.json({ message: "📧 OTP sent to your email!" });
    }
  );
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM otps WHERE email=? AND otp=? AND created_at >= NOW() - INTERVAL 5 MINUTE",
    [email, otp],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.length === 0) {
        return res.status(400).json({ message: "❌ Invalid or expired OTP" });
      }

      res.json({ message: "✅ OTP Verified! You are logged in." });
    }
  );
});
// Resend OTP route
app.post("/resend-otp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Check if user exists
  db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    db.query("INSERT INTO otps (email, otp) VALUES (?, ?)", [email, otp], (err) => {
      if (err) return res.status(500).json({ message: "Error saving OTP" });

      // Send OTP email again
      transporter.sendMail({
        from: '"Secure Login System" <your-email@gmail.com>',
        to: email,
        subject: "🔁 Your New OTP",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #FF5733;">New OTP Requested</h2>
            <p style="font-size: 16px; color: #333;">
              Here’s your new <strong>One-Time Password (OTP)</strong>:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #000; padding: 10px 20px; background: #eee; border-radius: 6px; display: inline-block;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              This OTP is valid for <strong>5 minutes</strong>.
            </p>
          </div>
        `
      }, (error) => {
        if (error) {
          return res.status(500).json({ message: "Error sending OTP email" });
        }
        res.json({ message: "📧 New OTP sent to your email!" });
      });
    });
  });
});


// Get all users (after login)
app.get("/users", (req, res) => {
  db.query("SELECT email FROM users", (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(result);
  });
});

// Start server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
git 