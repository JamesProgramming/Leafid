import express from "express";
import compression from "compression";
import modelRouter from "./routes/modelRouter.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";

import dotenv from "dotenv";

// Load configuration file into process environment.
dotenv.config({ path: "./config.env" });

const app = express();

app.set("trust proxy", "loopback, linklocal, uniquelocal");

app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true, limit: "300kb" }));
app.use(cookieParser());

// Allow data compression.
app.use(compression());

app.use(
  cors({
    origin: [process.env.ORIGIN],
    credentials: true,
    methods: ["POST"],
  })
);

app.use(
  rateLimit({
    max: 550,
    windowMs: 60 * 60 * 1000,
    message: "To many request in an hour.",
  })
);

app.use(hpp());
// Route handlers.
app.use("/api/v1/user", userRouter);
app.use("/api/v1/model", modelRouter);

// If route is not found.
app.all("*", (req, res) => {
  res
    .status("404")
    .json({ status: "failure", data: { message: "Route not found." } });
});

export default app;
