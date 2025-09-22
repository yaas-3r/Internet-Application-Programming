# OTP Authentication System (Node.js + MySQL)
This project implements an *OTP-based authentication system* using *Node.js, Express, MySQL, and Nodemailer*.  
Users can *sign up, **log in, and receive a **One-Time Password (OTP)* in their email for secure verification.

## 🚀 Features
- User signup with email + password  
- Login with email + password  
- OTP sent to user’s email for verification  
- OTP verification before granting access  
- MySQL database for user storage  
- Nodemailer with Gmail App Password for sending OTPs  

## 📂 Project Structure
project-folder/  
│── backend/  
│   ├── server.js         # Express backend (API + OTP logic + MySQL)  
│   ├── package.json      # Backend dependencies  
│── frontend/  
│   ├── index.html        # Login/Signup/OTP forms  
│   ├── script.js         # Frontend logic  
│   ├── style.css         # Styling  
│── README.md  

## ⚡ Prerequisites
Before running the project, make sure you have:
- [Node.js (v14+ recommended)](https://nodejs.org/)  
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) installed and running  
- A [Gmail account](https://accounts.google.com/) (or another SMTP service) for sending OTPs  

## 🛠 Setup Instructions
### 1️⃣ Install Node.js
Download and install Node.js from: https://nodejs.org/  
Verify installation:  
node -v  
npm -v  

### 2️⃣ Install MySQL
Download and install MySQL from: https://dev.mysql.com/downloads/mysql/  
Verify installation by logging in:  
mysql -u root -p  

### 3️⃣ Clone the repository
git clone https://github.com/your-username/otp-auth-system.git  
cd otp-auth-system/backend  

### 4️⃣ Install backend dependencies
npm install express mysql2 bcrypt nodemailer cors dotenv  

### 5️⃣ Setup MySQL Database
CREATE DATABASE otp_auth;  
USE otp_auth;  
CREATE TABLE users (  
  id INT AUTO_INCREMENT PRIMARY KEY,  
  email VARCHAR(255) UNIQUE NOT NULL,  
  password VARCHAR(255) NOT NULL,  
  otp VARCHAR(10),  
  otp_expiry DATETIME  
);  

### 6️⃣ Configure Email (Gmail)
- Go to [Google Account Security](https://myaccount.google.com/security)  
- Enable *2-Step Verification*  
- Create an *App Password* for "Mail"  
- Copy the generated 16-character password  
Update inside server.js:  
auth: {  
  user: "your-email@gmail.com",  
  pass: "your-app-password"  
}  

### 7️⃣ Run the backend server
node server.js  
Backend runs at: http://localhost:5000  

### 8️⃣ Open the frontend
Open frontend/index.html in your browser.  

## ✅ Usage
- *Signup* → Register with email & password.  
- *Login* → Enter credentials; an OTP is sent to your email.  
- *Verify OTP* → Enter OTP; access the users list.  

## 📌 API Endpoints
POST /signup  
{ "email": "test@gmail.com", "password": "123456" }  

POST /login  
{ "email": "test@gmail.com", "password": "123456" }  
👉 Sends OTP to registered email.  

POST /verify-otp  
{ "email": "test@gmail.com", "otp": "123456" }  
👉 Valid OTP → Success.  

## ⚡ Notes
- OTP expires after 5 minutes (configurable in server.js).  
- Passwords are hashed with bcrypt.  
- Emails sent via Gmail SMTP (or any SMTP provider).  

## 🔗 Useful Links
- [Download Node.js](https://nodejs.org/)  
- [Download MySQL](https://dev.mysql.com/downloads/mysql/)  
- [Google Account Security (App Passwords)](https://myaccount.google.com/security)  
- [Nodemailer Docs](https://nodemailer.com/about/)  
- [Express.js Docs](https://expressjs.com/)
