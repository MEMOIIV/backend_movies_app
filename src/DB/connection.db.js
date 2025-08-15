import mongoose from "mongoose";
import {config} from "dotenv"
// checkDB \\
const connectDB = async () => {
  try {
    const uri = process.env.DB_URI
    const result = await mongoose.connect(uri , {
        // option if i want like
        // serverSelectionTimeoutMS : 30000 , 
    });
    // console.log(result.models);
    console.log(`DB connected successfully 🌐`);
  } catch (error) {
    console.log({
      message: "Fail t oconnect on DB 😭",
      error,
      info: error.message,
      stack: error.stack,
    });
  }
};

export default connectDB
