# 🔐 Full-Stack Authentication System

A full-stack web application that allows users to register, log in, and log out securely. This project demonstrates how to connect a frontend interface with a backend server and implement authentication using modern technologies.

---

## 🚀 Features

* ✅ User Registration
* ✅ User Login
* ✅ User Logout
* 🔐 Password Hashing (Secure Storage)
* 🔑 JWT-based Authentication
* 🔄 Client-side Routing (React Router)
* 🌐 Frontend & Backend Integration
* 📦 Clean Project Structure

---

## 🛠️ Tech Stack

### Frontend

* React
* React Router (for navigation)
* Axios (API calls)

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT (JSON Web Tokens)
* bcrypt (Password hashing)
* dotenv (Environment variables)
* CORS (Cross-Origin requests)

---

## 🔁 How It Works

1. User navigates between pages using React Router
2. User registers with email and password
3. Password is hashed using bcrypt
4. User logs in with credentials
5. Server verifies user and generates JWT token
6. Token is sent to frontend
7. Protected routes can be managed using authentication logic
8. Logout clears the session/token

---

## ⚙️ Installation & Setup

### 1. Clone the repository

git clone https://github.com/your-username/your-repo-name.git

### 2. Navigate to project

cd your-repo-name

---

### 3. Setup Backend

cd server
npm install

Create a `.env` file in the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run backend:
npm run dev

---

### 4. Setup Frontend

cd client
npm install
npm run dev

---

## 🌐 API Endpoints

### Auth Routes

* POST /api/auth/register → Register user
* POST /api/auth/login → Login user
* POST /api/auth/logout → Logout user

---

## 🔒 Security Practices

* Passwords are hashed using bcrypt
* JWT is used for secure authentication
* Sensitive data stored in `.env`
* CORS enabled for secure API access

---

## 🎯 What I Learned

* How to connect frontend with backend using APIs
* How routing works in React applications
* How authentication works in real-world apps
* Secure password storage using hashing
* Token-based authentication (JWT)

---

## 🚀 Future Improvements

* Refresh Token implementation
* Role-based authentication (Admin/User)
* Email verification (OTP)
* Protected Routes (Private Routes)
* Better UI/UX design

---

## 🤝 Contributing

Feel free to fork this project and improve it. Contributions are welcome!

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!
