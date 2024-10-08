import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/Database.js";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/AuthRoutes.js";
import PostsRoute from "./routes/PostsRoutes.js";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use(AuthRoute);
app.use(PostsRoute);

const port = process.env.PORT;
app.listen(port, () => {
  try {
    console.log(`Server up and running port ${port}`);
  } catch (error) {
    console.log(error.message);
  }
});
