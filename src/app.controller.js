import path from "node:path";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

// استيراد الروترات الخاصة بك
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import messageController from "./modules/message/message.controller.js";
import favoriteController from "./modules/favorite/favorite.controller.js";
import connectDB from "./DB/connection.db.js";
import { globalErrorHandler } from "./utils/response.js";
import "./config/cronJobs.js";

// إعداد البيئة (تحقق من البيئة قبل المسار المخصص)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve("./src/config/.env.dev") });
} else {
  dotenv.config();
}

const app = express();

async function bootstrap() {
  // Middlewares
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // Static Files
  app.use("/upload", express.static(path.resolve("./src/upload")));

  // Database Connection
  await connectDB();

  // Routes
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Movie App API 💖" });
  });

  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);
  app.use("/favorite", favoriteController);

  // 404 Handler - تم تعديلها لتناسب Vercel
  app.all("{/*dummy}", (req, res) => {
    res.status(404).json({ message: "In-valid routing 😭💔" });
  });
  // Global Error Handler
  app.use(globalErrorHandler);

  const port = process.env.PORT || 5000;

  // لا تشغل app.listen إذا كنا في Vercel (Production)
  if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
      console.log(`Server running on ${port} 🔥🚀`);
    });
  }
}

export { app };
export default bootstrap;
