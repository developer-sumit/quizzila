// THIRD-PARTY MODULES
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// ROUTES
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import { authenticateToken } from "./middleware/auth.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI || "";

if (!mongoURI) {
  console.error("Internal Server Error");
  process.exit(1); // Exit the process with failure
}

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/user", authenticateToken, userRoutes);

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
