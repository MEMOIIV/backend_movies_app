# Saraha_App
---

# 🛠️ Backend Project – Node.js + Express + MongoDB

## 📌 Description

This is a backend project built with Node.js, Express, and MongoDB (Mongoose).
It provides authentication, authorization, file upload, and messaging features with secure token management.
The project also includes email confirmation, cloud storage (Cloudinary), and deployment on AWS.

🔗 Live Demo : [Live API on AWS](http://ec2-13-61-160-51.eu-north-1.compute.amazonaws.com/)  
🔗 Postman Docs : [Postman Documentation](https://documenter.getpostman.com/view/24020034/2sB3BHmUSY)  

---

## 🚀 Features

* **Authentication & Authorization**

  * Sign up / Login
  * Login with Google
  * Logout (with revoke token)
  * Access Token (expires in 1 hour)
  * Refresh Token (expires in 1 year)
  * Password hashing (bcryptjs)
  * Phone encryption (crypto-js)

* **Email Confirmation**

  * OTP verification using **nanoid**
  * Sent via **nodemailer**

* **User Management**

  * View / Update / Delete account
  * Upload profile picture (stored in **Cloudinary**)

* **Messages**

  * Send / Delete messages
  * Attach images to messages

* **Validation**

  * All input fields validated using **Joi**

* **Security & Performance**

  * Rate limiting (express-rate-limit)
  * Logging (morgan)

* **Deployment**

  * Hosted on **AWS**
  * Process manager: **PM2**
  * Secured with **ngrok (HTTPS tunneling)**

---

## 📦 Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT, Google Auth Library
* **Email:** Nodemailer
* **File Uploads:** Multer + Cloudinary
* **Validation:** Joi
* **Other Tools:** bcryptjs, crypto-js, nanoid, node-cron

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
DB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🏗️ Installation & Setup

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Add your `.env` file (see variables above).

4. Run the server in development mode

   ```bash
   npm run dev
   ```

5. Run in production mode (with PM2)

   ```bash
   pm2 start server.js
   ```

---

## 📮 API Endpoints (Examples)

### Auth

* `POST /auth/signup` → Register new user
* `POST /auth/login` → Login user
* `POST /auth/google` → Login with Google
* `POST /auth/logout` → Logout & revoke token

### User

* `GET /user/profile` → Get user profile
* `PUT /user/update` → Update profile
* `DELETE /user/delete` → Delete account

### Messages

* `GET /messages` → Get all user messages
* `POST /messages` → Create message (with image optional)
* `DELETE /messages/:id` → Delete message

---

## 📤 Deployment

* Deployed on **AWS**
* Process management with **PM2**
* HTTPS tunnel with **ngrok**

---

## 👨‍💻 Author

* **Amin Said Amin**

---
