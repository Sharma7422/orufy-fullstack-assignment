# Orufy – Full Stack Developer Intern Assignment

This project is developed as part of the Full Stack Developer Intern assignment for  
**Orufy Technologies Pvt. Ltd.**

---

## Tech Stack

**Frontend**

- React.js
- Tailwind CSS
- Vite

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## Project Structure

orufy-fullstack-assignment/
├── client/
├── server/
└── README.md

---

## Features

- OTP-based Login & Signup
- Email or Phone Authentication
- JWT Authentication
- Product CRUD Operations
- Image Upload (Multer)
- Responsive UI (Tailwind CSS)

---

## Authentication Flow

1. User enters email or phone number
2. OTP is sent
3. OTP is verified
4. User is logged in

---

## Backend Setup

````bash
cd server
npm install
npm run dev



PORT=3456
MONGO_URI=mongodb+srv://rahul7422:nLpXBrLPlaRd42rD@cluster0.eawr1e5.mongodb.net/orufy_assignment?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=orufy_secret_key



cd client
npm install
npm run dev



VITE_API_URL=http://localhost:3456/api



API Endpoints
Auth

POST /api/auth/send-otp

POST /api/auth/verify-otp

POST /api/auth/resend-otp

Products

POST /api/products/create

GET /api/products

PUT /api/products/:id

DELETE /api/products/:id



Live Links

Frontend: https://orufy-fullstack-assignment-rcxvvarts.vercel.app/login

Backend: https://orufy-fullstack-assignment.onrender.com

GitHub Repo: https://github.com/Sharma7422/orufy-fullstack-assignment



---

## STEP 5️⃣ Push to GitHub
Run this in **project root**:

```bash
git add README.md
git commit -m "Add project README"
git push

````
