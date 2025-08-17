import path from "node:path";
import * as dotenv from "dotenv";
// dotenv.config({ path: path.resolve("./src/config/.env.dev") });
dotenv.config({});

import express from "express";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import messageController from "./modules/message/message.controller.js";
import connectDB from "./DB/connection.db.js";
import cors from "cors";
import "./config/cronJobs.js";
import { globalErrorHandler } from "./utils/response.js";
import {rateLimit} from "express-rate-limit";
import { sendEmail } from "./utils/email/send.email.js";
import morgan from "morgan";


// let whitelist = ["https://example.com", "https://example"]
// let corsOption = {
//   origin:function(origin , callback){
//     if(whitelist.indexOf(origin) !== -1){
//       callback(null , true)
//     }else{
//       callback(new Error("Not allowed by CORS"))
//     }
//   }
// }

// after create corsOptions put corsOption inside cors => cors(corsOption)
async function bootstrap() {
  const app = express();
  app.use(cors());

  // 🔴 morgan 🔴 \\ 
  app.use(morgan("dev"))

  // 🔴 rateLimit 🔴 \\ 
//   const limiter = rateLimit({
// 	windowMs: 60 * 1000, // 1 minute
// 	limit: 3, 
//   // message:async() => {
//   //  await sendEmail({
//   //     to:"ameensaid80@gmail.com",
//   //     html:`<h1>look out some body send many request from your account</h1>`
//   //   })
//   // },
//   // handler: (req, res, next, options) => res.status(options.statusCode).json(options.message), // overwrite on message
//   standardHeaders:"draft-8",
// })
//   const userLimiter = rateLimit({
// 	windowMs: 60 * 1000, // 1 minute
// 	limit: 5, 
// })
//   app.use("/auth",limiter)
//   app.use("/user",userLimiter)


  // Convert Json buffer data \
  app.use(express.json());
  //🔴 multer \
  app.use("/upload", express.static(path.resolve("./src/upload")));
  const port = process.env.PORT || 5000;
  // 🔴 DB \
  await connectDB();

  // 🔴 Access Cors Allow-Private-Network
  // let whitelist = ["https://example.com", "https://example"];
  // app.use(async (req, res, next) => {
  //   if (!whitelist.includes(req.header("origin"))) {
  //       console.log(origin);
  //     return next(new Error("Not Allowed By CORS", { status: 403 }));
  //   }
  //   for (const origin of whitelist) {
  //     if (req.header("origin") == origin) {
  //       await res.header("Access-Control-Allow-Origin", origin);
  //       break;
  //     }
  //   }
  //   await res.header("Access-Control-Allow-Headers", "*");
  //   await res.header("Access-Control-Allow-Private-Network", "true");
  //   await res.header("Access-Control-Allow-Methods", "*");
  //   console.log("Origin Work");
  //   next();
  // });

  // App-router \

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Blog app with express 💖" });
  });
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);
  app.all("{/*dummy}", (req, res) => {
    res.status(404).json({ message: "In-valid routing 😭💔" });
  });
  app.use(globalErrorHandler);
  return app.listen(port, () => {
    // console.log(`Server running on ${port} 🔥🚀`);
  });
}

export default bootstrap;
