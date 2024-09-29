import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./.env"
})
const app = express();


app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

// Importing

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);


// Connecting database
import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error : ", error);
    process.exit();
  }
}

export default connectDB;


connectDB()
  .then(() => {
    app.listen(process.env.PORT, (req, res) => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed :", err);
  });
