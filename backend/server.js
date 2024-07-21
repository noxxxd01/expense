import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";

dotenv.config();

const app = express();

// Database
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/expense/v1/users", userRoutes);
app.use("/expense/v1/budgets", budgetRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Listen
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
