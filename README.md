# 🎬 Movies App API – Backend Node.js Project

---

# 🛠️ Backend Project – Node.js + Express + MongoDB + Vercel

## 📌 Description

This is a robust backend system built with Node.js, Express, and MongoDB.
Originally designed for a messaging app, it has been evolved into a **Movie App Backend** that supports integration with **The Movie Database (TMDB) API**, user authentication, and a personal favorites management system.

🌐 **API Base URL** : [Your Vercel URL Here](https://backend-movies-app.vercel.app)  
🔗 **Postman Docs** : [Postman Documentation](https://documenter.getpostman.com/view/24020034/2sB3BHmUSY)

---

## 🚀 Key Features

- **Authentication & Security**
  - **JWT Auth:** Secure Access & Refresh tokens.
  - **Encryption:** Password hashing via `bcryptjs` and sensitive data encryption via `crypto-js`.
  - **Validation:** Strict input schema validation using **Joi**.
  - **CORS:** Configured for secure frontend-backend communication.

- **🎬 Favorites System (New)**
  - **TMDB Integration:** Seamlessly handles movie and TV show data.
  - **Personalized Lists:** Users can add/remove movies and series to their favorites.
  - **Filtering:** Built-in logic to filter favorites by type (Movie/TV).

- **User Management**
  - Profile updates and secure account handling.
  - OTP verification for email confirmation using **nanoid** and **nodemailer**.

- **Deployment & Infrastructure**
  - **Platform:** Hosted on **Vercel** (Serverless Functions).
  - **Database:** **MongoDB Atlas** with global IP access (`0.0.0.0/0`).
  - **Environment Management:** Secure variable handling via Vercel Dashboard.

---

## 📦 Tech Stack

- **Core:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JSON Web Token (JWT)
- **Validation:** Joi
- **Deployment:** Vercel
- **Utilities:** Morgan (Logging), CORS, Dotenv, Axios (for TMDB requests)

---

## 🔑 Environment Variables

To run this project, you must set up the following variables in Vercel or your `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
TMDB_API_KEY=your_tmdb_api_key
NODE_ENV=production
```
