// THIRD-PARTY MODULES
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// ROUTES
import authRoutes from "./routes/auth.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is required");
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
