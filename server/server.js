import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import cors from "cors";
import {
  errorResponseHandler,
  invalidPthHandler,
} from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
//routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

//static assets
const uploadsDirectory = path.join(__dirname, "/uploads");
// console.log("Uploads directory:", uploadsDirectory);
app.use("/uploads", express.static(uploadsDirectory));

app.use(invalidPthHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on Port http://localhost:${PORT}`)
);
