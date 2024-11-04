import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./DataBase/db.js";
import userRoutes from "./routes/user.js"; // import routes
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import Razorpay from "razorpay";
import cors from 'cors';

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors())

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is Working");
  // console.log("Server is working");
});

app.use("/uploads", express.static("uploads"));

// using Routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
