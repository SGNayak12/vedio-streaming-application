import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import videoRoutes from "./routes/videoRoutes.js";
import { connectDB } from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:8000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Video Streaming API" });
});

app.use("/api/videos", videoRoutes);

// Connect to database (if MongoDB is configured)
if (process.env.MONGODB_URI) {
  connectDB();
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});

